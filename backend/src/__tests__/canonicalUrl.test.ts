import { canonicalizeUrl } from '../canonicalUrl';

describe('Canonical URL Normalization', () => {
  describe('Input validation', () => {
    it('rejects missing or non-string input', () => {
      expect(canonicalizeUrl(undefined)).toEqual({
        valid: false,
        code: 'VALIDATION_ERROR',
        message: 'url is required.',
      });
      expect(canonicalizeUrl(12345)).toEqual({
        valid: false,
        code: 'VALIDATION_ERROR',
        message: 'url must be a string.',
      });
      expect(canonicalizeUrl('   ')).toEqual({
        valid: false,
        code: 'VALIDATION_ERROR',
        message: 'url must not be empty.',
      });
    });

    it('rejects malformed URLs', () => {
      expect(canonicalizeUrl('not a url')).toEqual({
        valid: false,
        code: 'INVALID_URL',
        message: 'Enter a valid public webpage URL.',
      });
    });

    it('rejects unsupported protocols', () => {
      expect(canonicalizeUrl('ftp://example.com/feed.xml')).toEqual({
        valid: false,
        code: 'INVALID_URL',
        message: 'Only http and https URLs are supported.',
      });
      expect(canonicalizeUrl('file:///etc/passwd')).toEqual({
        valid: false,
        code: 'INVALID_URL',
        message: 'Only http and https URLs are supported.',
      });
      expect(canonicalizeUrl('javascript:alert(1)')).toEqual({
        valid: false,
        code: 'INVALID_URL',
        message: 'Only http and https URLs are supported.',
      });
    });

    it('rejects user credentials embedded in URLs', () => {
      const res = canonicalizeUrl('https://user:pass@example.com/feed');
      expect(res).toEqual({
        valid: false,
        code: 'INVALID_URL',
        message: 'User credentials in URLs are not permitted.',
      });
    });
  });

  describe('SSRF and IP validation integration', () => {
    it('rejects localhost and private IPs', () => {
      expect(canonicalizeUrl('http://localhost/feed.xml')).toEqual({
        valid: false,
        code: 'URL_NOT_ALLOWED',
        message: 'That URL targets a private or reserved address.',
      });
      expect(canonicalizeUrl('http://127.0.0.1:8080/rss')).toEqual({
        valid: false,
        code: 'URL_NOT_ALLOWED',
        message: 'That URL targets a private or reserved address.',
      });
      expect(canonicalizeUrl('http://192.168.1.1/atom.xml')).toEqual({
        valid: false,
        code: 'URL_NOT_ALLOWED',
        message: 'That URL targets a private or reserved address.',
      });
      expect(canonicalizeUrl('http://[::1]/feed')).toEqual({
        valid: false,
        code: 'URL_NOT_ALLOWED',
        message: 'That URL targets a private or reserved address.',
      });
    });
  });

  describe('Conservative normalization rules', () => {
    it('lowercases hostname and scheme', () => {
      const res = canonicalizeUrl('HTTPS://EXAMPLE.COM/Blog/Feed.xml');
      expect(res).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com/Blog/Feed.xml',
        host: 'example.com',
      });
    });

    it('strips default HTTP and HTTPS ports', () => {
      const resHttp = canonicalizeUrl('http://example.com:80/feed');
      expect(resHttp).toEqual({
        valid: true,
        canonicalUrl: 'http://example.com/feed',
        host: 'example.com',
      });

      const resHttps = canonicalizeUrl('https://example.com:443/rss.xml');
      expect(resHttps).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com/rss.xml',
        host: 'example.com',
      });
    });

    it('preserves non-default ports', () => {
      const res = canonicalizeUrl('https://example.com:8443/feed.xml');
      expect(res).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com:8443/feed.xml',
        host: 'example.com:8443',
      });
    });

    it('strips URL fragments', () => {
      const res = canonicalizeUrl('https://example.com/feed.xml#section1');
      expect(res).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com/feed.xml',
        host: 'example.com',
      });
    });

    it('preserves exact query parameters', () => {
      const res = canonicalizeUrl('https://example.com/feed?format=xml&category=tech');
      expect(res).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com/feed?format=xml&category=tech',
        host: 'example.com',
      });
    });

    it('preserves trailing slashes and distinguishes different paths', () => {
      const withSlash = canonicalizeUrl('https://example.com/feed/');
      const withoutSlash = canonicalizeUrl('https://example.com/feed');

      expect(withSlash).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com/feed/',
        host: 'example.com',
      });
      expect(withoutSlash).toEqual({
        valid: true,
        canonicalUrl: 'https://example.com/feed',
        host: 'example.com',
      });
      expect(withSlash.valid && withoutSlash.valid && withSlash.canonicalUrl !== withoutSlash.canonicalUrl).toBe(true);
    });

    it('treats different feed paths on the same domain as distinct', () => {
      const feedA = canonicalizeUrl('https://example.com/rss.xml');
      const feedB = canonicalizeUrl('https://example.com/atom.xml');

      expect(feedA.valid && feedB.valid && feedA.canonicalUrl !== feedB.canonicalUrl).toBe(true);
    });
  });
});
