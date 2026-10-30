/**
 * Client-side URL validation utility.
 *
 * NOTE: Frontend validation is purely for user UX guidance.
 * It is NOT a replacement for backend SSRF protection.
 */

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  errorMessage?: string;
}

export function validateArticleUrl(rawInput: string): UrlValidationResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Please enter a web address to read.',
    };
  }

  // Prepend https:// if user simply entered a domain without protocol (e.g. example.com/article)
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    // If it starts with an unsupported scheme, reject immediately
    if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
      return {
        isValid: false,
        errorMessage: 'Only HTTP and HTTPS links are supported (e.g., https://example.com/article).',
      };
    }
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        errorMessage: 'Unsupported protocol. Only http:// or https:// links can be read.',
      };
    }

    if (!parsed.hostname || parsed.hostname.length < 3) {
      return {
        isValid: false,
        errorMessage: 'Please provide a valid domain name.',
      };
    }

    // Client-side hint against loopback/internal hosts
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.startsWith('192.168.') ||
      host.startsWith('10.')
    ) {
      return {
        isValid: false,
        errorMessage: 'Internal and local network addresses cannot be fetched for reading.',
      };
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
    };
  } catch {
    return {
      isValid: false,
      errorMessage: 'Invalid URL format. Please check and try again.',
    };
  }
}
