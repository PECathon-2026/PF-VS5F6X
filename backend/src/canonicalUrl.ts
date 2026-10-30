import { URL } from 'url';
import { validateUrlInput } from './urlSecurity';

export type CanonicalUrlResult =
  | {
      valid: true;
      canonicalUrl: string;
      host: string;
    }
  | {
      valid: false;
      code: 'INVALID_URL' | 'VALIDATION_ERROR' | 'URL_NOT_ALLOWED';
      message: string;
    };

/**
 * Normalizes a feed or webpage URL conservatively:
 * - Requires http: or https: scheme
 * - Rejects user credentials embedded in URLs (user:pass@host)
 * - Lowercases scheme and hostname
 * - Strips default ports (:80 for HTTP, :443 for HTTPS)
 * - Strips URL fragments (#...)
 * - Preserves exact path casing, trailing slashes, and query parameters
 * - Passes through the existing SSRF / IP security validator
 */
export function canonicalizeUrl(raw: unknown): CanonicalUrlResult {
  if (raw === undefined || raw === null) {
    return { valid: false, code: 'VALIDATION_ERROR', message: 'url is required.' };
  }
  if (typeof raw !== 'string') {
    return { valid: false, code: 'VALIDATION_ERROR', message: 'url must be a string.' };
  }
  const trimmed = raw.trim();
  if (trimmed === '') {
    return { valid: false, code: 'VALIDATION_ERROR', message: 'url must not be empty.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, code: 'INVALID_URL', message: 'Enter a valid public webpage URL.' };
  }

  // Reject embedded credentials
  if (parsed.username || parsed.password) {
    return { valid: false, code: 'INVALID_URL', message: 'User credentials in URLs are not permitted.' };
  }

  // Scheme check
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, code: 'INVALID_URL', message: 'Only http and https URLs are supported.' };
  }

  // Run through SSRF and host validator
  const securityCheck = validateUrlInput(parsed.href);
  if (!securityCheck.valid) {
    return {
      valid: false,
      code: securityCheck.code,
      message: securityCheck.message,
    };
  }

  // Strip fragment
  parsed.hash = '';

  // Explicitly remove default ports if present
  if ((parsed.protocol === 'http:' && parsed.port === '80') || (parsed.protocol === 'https:' && parsed.port === '443')) {
    parsed.port = '';
  }

  // Extract host (hostname + non-default port)
  const host = parsed.host.toLowerCase();

  return {
    valid: true,
    canonicalUrl: parsed.toString(),
    host,
  };
}
