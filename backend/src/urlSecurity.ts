import { isIP } from 'net';
import { promises as dns } from 'dns';

// ---------------------------------------------------------------------------
// Blocked IP ranges (SSRF protection)
// ---------------------------------------------------------------------------

/**
 * Returns true if the dotted-decimal IPv4 address is in a blocked range.
 * Blocked: loopback, private (RFC1918), link-local, shared, documentation,
 *          carrier-grade NAT, IETF protocol, broadcast, multicast, reserved.
 */
function isBlockedIPv4(addr: string): boolean {
  const parts = addr.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // malformed — treat as blocked
  }
  const [a, b, c] = parts;

  return (
    a === 0 ||                            // 0.0.0.0/8
    a === 10 ||                           // 10.0.0.0/8  (RFC1918)
    a === 127 ||                          // 127.0.0.0/8 (loopback)
    a === 169 && b === 254 ||             // 169.254.0.0/16 (link-local)
    a === 172 && b >= 16 && b <= 31 ||   // 172.16.0.0/12 (RFC1918)
    a === 192 && b === 0 && c === 0 ||   // 192.0.0.0/24 (IETF protocol)
    a === 192 && b === 0 && c === 2 ||   // 192.0.2.0/24 (TEST-NET-1)
    a === 192 && b === 88 && c === 99 || // 192.88.99.0/24 (6to4 relay)
    a === 192 && b === 168 ||             // 192.168.0.0/16 (RFC1918)
    a === 198 && b >= 18 && b <= 19 ||  // 198.18.0.0/15 (benchmarking)
    a === 198 && b === 51 && c === 100 ||// 198.51.100.0/24 (TEST-NET-2)
    a === 203 && b === 0 && c === 113 || // 203.0.113.0/24 (TEST-NET-3)
    a >= 224 ||                           // 224.0.0.0/4 multicast & 240.0.0.0/4 reserved
    a === 255                             // broadcast
  );
}

/**
 * Returns true if the IPv6 address string (full or abbreviated) is blocked.
 * Blocked: loopback (::1), unspecified (::), link-local (fe80::/10),
 *          unique-local (fc00::/7), multicast (ff00::/8), IPv4-mapped.
 */
function isBlockedIPv6(addr: string): boolean {
  const lower = addr.toLowerCase().replace(/^\[|\]$/g, '');

  if (lower === '::1' || lower === '::') return true;

  // Link-local fe80::/10 (fe8, fe9, fea, feb)
  if (/^fe[89ab]/i.test(lower)) return true;

  // Unique-local fc00::/7 (fc and fd)
  if (/^f[cd]/i.test(lower)) return true;

  // Multicast ff00::/8 (ff)
  if (/^ff/i.test(lower)) return true;

  // IPv4-mapped  ::ffff:x.x.x.x or hex normalized ::ffff:xxxx:xxxx
  const v4mappedDotted = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (v4mappedDotted) return isBlockedIPv4(v4mappedDotted[1]);

  const v4mappedHex = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (v4mappedHex) {
    const p1 = parseInt(v4mappedHex[1], 16);
    const p2 = parseInt(v4mappedHex[2], 16);
    const dotted = `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
    return isBlockedIPv4(dotted);
  }

  return false;
}

export function isBlockedAddress(addr: string): boolean {
  const version = isIP(addr);
  if (version === 4) return isBlockedIPv4(addr);
  if (version === 6) return isBlockedIPv6(addr);
  return false; // not a bare IP string — caller must resolve first
}

// ---------------------------------------------------------------------------
// URL validation
// ---------------------------------------------------------------------------

export type UrlValidationResult =
  | { valid: true; url: URL }
  | { valid: false; code: 'INVALID_URL' | 'VALIDATION_ERROR' | 'URL_NOT_ALLOWED'; message: string };

export function validateUrlInput(raw: unknown): UrlValidationResult {
  if (raw === undefined || raw === null) {
    return { valid: false, code: 'VALIDATION_ERROR', message: 'url is required.' };
  }
  if (typeof raw !== 'string') {
    return { valid: false, code: 'VALIDATION_ERROR', message: 'url must be a string.' };
  }
  if (raw.trim() === '') {
    return { valid: false, code: 'VALIDATION_ERROR', message: 'url must not be empty.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { valid: false, code: 'INVALID_URL', message: 'Enter a valid public webpage URL.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, code: 'INVALID_URL', message: 'Only http and https URLs are supported.' };
  }

  // Block bare IP hostnames that are in blocked ranges
  const host = parsed.hostname;
  // URL.hostname wraps IPv6 in brackets — strip them before checking
  const bareHost = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;

  // Block well-known loopback / internal names unconditionally
  if (bareHost === 'localhost' || bareHost.endsWith('.localhost')) {
    return { valid: false, code: 'URL_NOT_ALLOWED', message: 'That URL targets a private or reserved address.' };
  }

  if (isIP(bareHost) && isBlockedAddress(bareHost)) {
    return { valid: false, code: 'URL_NOT_ALLOWED', message: 'That URL targets a private or reserved address.' };
  }

  return { valid: true, url: parsed };
}

// ---------------------------------------------------------------------------
// DNS resolution with SSRF guard
// ---------------------------------------------------------------------------

/**
 * Resolves hostname to addresses and returns the first non-blocked one,
 * or throws if all addresses are blocked or DNS fails.
 */
export async function safeResolveHostname(hostname: string): Promise<string> {
  // Strip IPv6 brackets if present (URL.hostname includes them)
  const bare = hostname.startsWith('[') && hostname.endsWith(']')
    ? hostname.slice(1, -1)
    : hostname;

  // If it's already a bare IP, validate directly
  if (isIP(bare)) {
    if (isBlockedAddress(bare)) {
      throw Object.assign(new Error('URL_NOT_ALLOWED'), { ssrf: true });
    }
    return bare;
  }

  let addresses: string[];
  try {
    const results = await dns.lookup(hostname, { all: true });
    addresses = results.map((r) => r.address);
  } catch {
    throw Object.assign(new Error('PAGE_FETCH_FAILED'), { fetchFailed: true });
  }

  if (addresses.length === 0) {
    throw Object.assign(new Error('PAGE_FETCH_FAILED'), { fetchFailed: true });
  }

  for (const addr of addresses) {
    if (isBlockedAddress(addr)) {
      throw Object.assign(new Error('URL_NOT_ALLOWED'), { ssrf: true });
    }
  }

  return addresses[0];
}
