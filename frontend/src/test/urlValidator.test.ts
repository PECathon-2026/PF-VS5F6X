import { describe, it, expect } from 'vitest';
import { validateArticleUrl } from '../utils/urlValidator';

describe('validateArticleUrl', () => {
  it('accepts valid https URLs', () => {
    const result = validateArticleUrl('https://example.com/article/123');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedUrl).toBe('https://example.com/article/123');
  });

  it('accepts valid http URLs', () => {
    const result = validateArticleUrl('http://tech.example.org/post');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedUrl).toBe('http://tech.example.org/post');
  });

  it('automatically prepends https to plain domains', () => {
    const result = validateArticleUrl('example.com/story');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedUrl).toBe('https://example.com/story');
  });

  it('rejects unsupported schemes like file:// and ftp://', () => {
    const fileResult = validateArticleUrl('file:///etc/passwd');
    expect(fileResult.isValid).toBe(false);
    expect(fileResult.errorMessage).toContain('Only HTTP and HTTPS');

    const ftpResult = validateArticleUrl('ftp://example.com/file');
    expect(ftpResult.isValid).toBe(false);
  });

  it('rejects empty or whitespace-only inputs', () => {
    const emptyResult = validateArticleUrl('   ');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errorMessage).toContain('Please enter a web address');
  });

  it('rejects localhost and loopback targets early for user guidance', () => {
    const localhostResult = validateArticleUrl('http://localhost:3000');
    expect(localhostResult.isValid).toBe(false);
    expect(localhostResult.errorMessage).toContain('Internal and local network');

    const loopbackResult = validateArticleUrl('http://127.0.0.1:8080');
    expect(loopbackResult.isValid).toBe(false);

    const privateRangeResult = validateArticleUrl('http://192.168.1.1/router');
    expect(privateRangeResult.isValid).toBe(false);
  });
});
