/**
 * Tests for POST /api/read
 *
 * DNS and upstream HTTP are fully mocked — no real network requests are made.
 */

import { EventEmitter } from 'events';

// ── Mock dns.promises.lookup ──────────────────────────────────────────────────
jest.mock('dns', () => {
  const real = jest.requireActual<typeof import('dns')>('dns');
  return {
    ...real,
    promises: { ...real.promises, lookup: jest.fn() },
  };
});

// ── Mock http.request ─────────────────────────────────────────────────────────
// We capture a reference so individual tests can override the implementation.
const mockHttpRequestImpl = jest.fn();

jest.mock('http', () => {
  const real = jest.requireActual<typeof import('http')>('http');
  return { ...real, request: (...args: unknown[]) => mockHttpRequestImpl(...args) };
});

// Imports after mocks are wired up
import request from 'supertest';
import * as dnsModule from 'dns';
import app from '../app';

const mockDnsLookup = dnsModule.promises.lookup as jest.Mock;

// ─────────────────────────────────────────────────────────────────────────────
// Types and helpers
// ─────────────────────────────────────────────────────────────────────────────

type FakeResponse = EventEmitter & {
  statusCode: number;
  headers: Record<string, string>;
  resume: jest.Mock;
};

function makeFakeResponse(opts: {
  statusCode: number;
  headers?: Record<string, string>;
}): FakeResponse {
  const res = new EventEmitter() as FakeResponse;
  res.statusCode = opts.statusCode;
  res.headers = opts.headers ?? { 'content-type': 'text/html; charset=utf-8' };
  res.resume = jest.fn();
  return res;
}

type FakeRequest = EventEmitter & { end: jest.Mock; destroy: jest.Mock };

function makeFakeRequest(): FakeRequest {
  const req = new EventEmitter() as FakeRequest;
  req.end = jest.fn();
  req.destroy = jest.fn();
  return req;
}

/** Stub a single http.request call that responds with `fakeRes` on `req.end()`. */
function stubHttpSuccess(fakeRes: FakeResponse): FakeRequest {
  const fakeReq = makeFakeRequest();
  mockHttpRequestImpl.mockImplementationOnce(
    (_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('data', Buffer.from(''));
        fakeRes.emit('end');
      });
      return fakeReq;
    },
  );
  return fakeReq;
}

// ─────────────────────────────────────────────────────────────────────────────
// DNS helpers
// ─────────────────────────────────────────────────────────────────────────────

function allowPublicDns(ip = '93.184.216.34') {
  mockDnsLookup.mockResolvedValue([{ address: ip, family: 4 }]);
}

function blockDns(ip: string) {
  mockDnsLookup.mockResolvedValue([{ address: ip, family: 4 }]);
}

function failDns() {
  mockDnsLookup.mockRejectedValue(new Error('ENOTFOUND'));
}

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/read — input validation', () => {
  it('returns 422 when url field is missing', async () => {
    const res = await request(app).post('/api/read').send({});
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 when url is not a string', async () => {
    const res = await request(app).post('/api/read').send({ url: 123 });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for a malformed URL', async () => {
    const res = await request(app).post('/api/read').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 400 for a ftp:// URL', async () => {
    const res = await request(app).post('/api/read').send({ url: 'ftp://example.com/file' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 400 for a file:// URL', async () => {
    const res = await request(app).post('/api/read').send({ url: 'file:///etc/passwd' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 400 for a javascript: URL', async () => {
    const res = await request(app)
      .post('/api/read')
      .send({ url: 'javascript:alert(1)' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 400 for data: URL protocol', async () => {
    const res = await request(app)
      .post('/api/read')
      .send({ url: 'data:text/html,Hello' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 422 for empty string url', async () => {
    const res = await request(app)
      .post('/api/read')
      .send({ url: '   ' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('handles malformed JSON body via fallback error handler without leaking stack trace', async () => {
    const res = await request(app)
      .post('/api/read')
      .set('Content-Type', 'application/json')
      .send('{"url": "invalid json');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected server-side failure.',
      },
    });
    expect(res.body).not.toHaveProperty('stack');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SSRF — blocked address in the URL itself
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/read — SSRF: blocked host in URL', () => {
  const blocked = [
    'http://localhost/',
    'http://127.0.0.1/',
    'http://0.0.0.0/',
    'http://10.0.0.1/',
    'http://172.16.0.1/',
    'http://192.168.1.1/',
    'http://169.254.169.254/', // AWS/GCP/Azure IMDS
    'http://[::1]/',
  ];

  it.each(blocked)('blocks %s', async (url) => {
    const res = await request(app).post('/api/read').send({ url });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
    expect(res.body.error).toHaveProperty('message');
  });

  it('blocks IPv6 link-local addresses', async () => {
    const res = await request(app).post('/api/read').send({ url: 'http://[fe80::1]/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks IPv6 unique-local addresses', async () => {
    const res = await request(app).post('/api/read').send({ url: 'http://[fd12:3456:789a:1::1]/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks IPv6 multicast addresses', async () => {
    const res = await request(app).post('/api/read').send({ url: 'http://[ff02::1]/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks IPv4-mapped IPv6 loopback addresses', async () => {
    const res = await request(app).post('/api/read').send({ url: 'http://[::ffff:127.0.0.1]/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks subdomain of localhost', async () => {
    const res = await request(app).post('/api/read').send({ url: 'http://foo.localhost/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SSRF — hostname resolves to a blocked IP (DNS check)
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/read — SSRF: DNS resolves to blocked IP', () => {
  it('blocks a hostname that resolves to 10.0.0.1', async () => {
    blockDns('10.0.0.1');
    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://internal.corp/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks a hostname that resolves to 127.0.0.1', async () => {
    blockDns('127.0.0.1');
    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://loopalias.example/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks a hostname that resolves to 169.254.169.254', async () => {
    blockDns('169.254.169.254');
    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://metadata.example/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Upstream failure scenarios
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/read — upstream failures', () => {
  it('returns 502 when DNS resolution fails (host not found)', async () => {
    failDns();
    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://doesnotexist.example/' });
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });

  it('returns 504 on upstream timeout', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, _cb: unknown) => {
        fakeReq.end.mockImplementationOnce(() => {
          // Emit timeout asynchronously
          setImmediate(() => fakeReq.emit('timeout'));
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://slow.example/' });
    expect(res.status).toBe(504);
    expect(res.body.error.code).toBe('FETCH_TIMEOUT');
  });

  it('returns 502 when upstream returns HTTP 500', async () => {
    allowPublicDns();
    const fakeRes = makeFakeResponse({ statusCode: 500 });
    stubHttpSuccess(fakeRes);

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/' });
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });

  it('returns 502 for unsupported content type (image/png)', async () => {
    allowPublicDns();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'image/png' },
    });
    stubHttpSuccess(fakeRes);

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/logo.png' });
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });

  it('returns 502 for application/json content type', async () => {
    allowPublicDns();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
    });
    stubHttpSuccess(fakeRes);

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/api/data' });
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });

  it('returns 502 when response exceeds maximum size', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          // Emit a chunk larger than MAX_RESPONSE_BYTES (5 MB)
          const bigChunk = Buffer.alloc(6 * 1024 * 1024, 'a');
          fakeRes.emit('data', bigChunk);
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/' });
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Redirect validation
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/read — redirect to blocked destination', () => {
  it('blocks a redirect that points to a private IP', async () => {
    // First DNS call (initial host) → public IP; second → private IP
    mockDnsLookup
      .mockResolvedValueOnce([{ address: '93.184.216.34', family: 4 }])
      .mockResolvedValueOnce([{ address: '192.168.0.1', family: 4 }]);

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 301,
      headers: { location: 'http://internal.redirect/', 'content-type': '' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks redirect to unsupported scheme', async () => {
    mockDnsLookup.mockResolvedValueOnce([{ address: '93.184.216.34', family: 4 }]);

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 302,
      headers: { location: 'file:///etc/passwd', 'content-type': '' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('handles redirect loops / too many redirects safely', async () => {
    mockDnsLookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);

    // Setup 6 redirect responses to exhaust MAX_REDIRECTS (5)
    for (let i = 0; i < 6; i++) {
      const fakeReq = makeFakeRequest();
      const fakeRes = makeFakeResponse({
        statusCode: 302,
        headers: { location: `http://example.com/step${i}`, 'content-type': '' },
      });
      mockHttpRequestImpl.mockImplementationOnce(
        (_opts: unknown, cb: (r: FakeResponse) => void) => {
          fakeReq.end.mockImplementationOnce(() => {
            cb(fakeRes);
            fakeRes.emit('end');
          });
          return fakeReq;
        },
      );
    }

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/' });
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Success path
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/read — success', () => {
  it('returns 200 with url, title and content for a valid HTML page', async () => {
    allowPublicDns();
    const html = `<!DOCTYPE html>
<html>
<head><title>Test Article</title></head>
<body><article><p>Hello world.</p></article></body>
</html>`;

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('data', Buffer.from(html));
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/article' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('title', 'Test Article');
    expect(res.body).toHaveProperty('content');
    expect(res.body.content).toContain('Hello world.');
    // Exact contract fields — no extras
    expect(Object.keys(res.body).sort()).toEqual(['content', 'title', 'url']);
  });

  it('returns null title when <title> is absent', async () => {
    allowPublicDns();
    const html = '<html><body><p>No title here.</p></body></html>';

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('data', Buffer.from(html));
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBeNull();
  });

  it('handles empty HTML response body safely', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('data', Buffer.from(''));
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/empty' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBeNull();
    expect(res.body.content).toBe('');
  });

  it('handles malformed HTML without crashing', async () => {
    allowPublicDns();
    const malformed = '<html><head><title>Unclosed</head><body><p>Unclosed paragraph<script>alert(1)';

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('data', Buffer.from(malformed));
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/malformed' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('content');
    expect(res.body.content).not.toContain('alert(1)');
  });

  it('handles response stream error cleanly with 502', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('error', new Error('stream breakdown'));
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/stream-error' });

    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
    expect(res.body.error).not.toHaveProperty('stack');
  });

  it('extracts content when HTML contains <header> tags without swallowing page body (Gutenberg regression)', async () => {
    allowPublicDns();
    const htmlWithHeader = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pride and Prejudice by Jane Austen | Project Gutenberg</title>
          <style>body { color: black; }</style>
        </head>
        <body>
          <header class="noprint">
            <nav><a href="/">Home</a></nav>
          </header>
          <main class="content">
            <h1>Pride and Prejudice</h1>
            <p>"Pride and Prejudice" by Jane Austen is a novel published in 1813. It follows Elizabeth Bennet.</p>
          </main>
          <footer>Footer info</footer>
        </body>
      </html>
    `;

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('data', Buffer.from(htmlWithHeader));
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/ebooks/1342' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Pride and Prejudice by Jane Austen | Project Gutenberg');
    expect(res.body.content).toContain('by Jane Austen is a novel published in 1813');
    expect(res.body.content).toContain('It follows Elizabeth Bennet');
  });

  it('decodes numeric and hex HTML entities in extracted text', async () => {
    allowPublicDns();
    const htmlWithEntities = `
      <html>
        <head><title>Quotes &#38; Dashes</title></head>
        <body>
          <p>&#8220;Hello World&#8221; &#8212; test &#x27;hex&#x27;</p>
        </body>
      </html>
    `;

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

    mockHttpRequestImpl.mockImplementationOnce(
      (_opts: unknown, cb: (r: FakeResponse) => void) => {
        fakeReq.end.mockImplementationOnce(() => {
          cb(fakeRes);
          fakeRes.emit('data', Buffer.from(htmlWithEntities));
          fakeRes.emit('end');
        });
        return fakeReq;
      },
    );

    const res = await request(app)
      .post('/api/read')
      .send({ url: 'http://example.com/entities' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Quotes & Dashes');
    expect(res.body.content).toContain('“Hello World” — test \'hex\'');
  });
});
