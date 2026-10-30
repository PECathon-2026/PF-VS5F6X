/**
 * Tests for GET /api/fetch?url=...
 *
 * Mocks DNS resolution and upstream HTTP requests to ensure
 * deterministic, isolated, and safe test execution.
 */

import { EventEmitter } from 'events';

// Mock dns
jest.mock('dns', () => {
  const real = jest.requireActual<typeof import('dns')>('dns');
  return {
    ...real,
    promises: { ...real.promises, lookup: jest.fn() },
  };
});

// Mock http
const mockHttpRequestImpl = jest.fn();

jest.mock('http', () => {
  const real = jest.requireActual<typeof import('http')>('http');
  return { ...real, request: (...args: unknown[]) => mockHttpRequestImpl(...args) };
});

import request from 'supertest';
import * as dnsModule from 'dns';
import app from '../app';

const mockDnsLookup = dnsModule.promises.lookup as jest.Mock;

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
  res.headers = opts.headers ?? { 'content-type': 'application/rss+xml; charset=utf-8' };
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

function allowPublicDns(ip = '93.184.216.34') {
  mockDnsLookup.mockResolvedValue([{ address: ip, family: 4 }]);
}

function blockDns(ip: string) {
  mockDnsLookup.mockResolvedValue([{ address: ip, family: 4 }]);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/fetch — input validation & canonicalization', () => {
  it('returns 422 when url parameter is missing', async () => {
    const res = await request(app).get('/api/fetch');
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 when url is empty or whitespace', async () => {
    const res = await request(app).get('/api/fetch?url=%20%20');
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for a malformed url', async () => {
    const res = await request(app).get('/api/fetch?url=invalid-url');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 400 for unsupported schemes', async () => {
    const resFtp = await request(app).get('/api/fetch?url=ftp://example.com/feed.xml');
    expect(resFtp.status).toBe(400);
    expect(resFtp.body.error.code).toBe('INVALID_URL');

    const resFile = await request(app).get('/api/fetch?url=file:///etc/passwd');
    expect(resFile.status).toBe(400);
    expect(resFile.body.error.code).toBe('INVALID_URL');
  });

  it('returns 400 when user credentials are embedded in URL', async () => {
    const res = await request(app).get('/api/fetch?url=https://user:pass@example.com/feed.xml');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });
});

describe('GET /api/fetch — SSRF protection', () => {
  it('blocks loopback IP in URL', async () => {
    const res = await request(app).get('/api/fetch?url=http://127.0.0.1/feed.xml');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks localhost hostname in URL', async () => {
    const res = await request(app).get('/api/fetch?url=http://localhost/rss');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks private IP resolution via DNS', async () => {
    blockDns('10.0.0.5');
    const res = await request(app).get('/api/fetch?url=http://internal.blog/feed');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });

  it('blocks redirects to private IP addresses', async () => {
    mockDnsLookup
      .mockResolvedValueOnce([{ address: '93.184.216.34', family: 4 }])
      .mockResolvedValueOnce([{ address: '192.168.1.50', family: 4 }]);

    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 301,
      headers: { location: 'http://redirected.internal/feed.xml' },
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('end');
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/feed');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('URL_NOT_ALLOWED');
  });
});

describe('GET /api/fetch — content types & success cases', () => {
  it('successfully fetches RSS XML', async () => {
    allowPublicDns();
    const rssBody = '<?xml version="1.0"?><rss><channel><title>RSS Feed</title></channel></rss>';
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('data', Buffer.from(rssBody));
        fakeRes.emit('end');
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/feed.xml');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      url: 'http://example.com/feed.xml',
      contentType: 'application/rss+xml; charset=utf-8',
      content: rssBody,
    });
    // Check security headers
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  it('successfully fetches Atom feed XML', async () => {
    allowPublicDns();
    const atomBody = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Atom Feed</title></feed>';
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'application/atom+xml' },
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('data', Buffer.from(atomBody));
        fakeRes.emit('end');
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/atom.xml');
    expect(res.status).toBe(200);
    expect(res.body.contentType).toBe('application/atom+xml');
    expect(res.body.content).toBe(atomBody);
  });

  it('successfully fetches HTML for feed autodiscovery', async () => {
    allowPublicDns();
    const htmlBody = '<!DOCTYPE html><html><head><link rel="alternate" type="application/rss+xml" href="/rss.xml"></head></html>';
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('data', Buffer.from(htmlBody));
        fakeRes.emit('end');
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/');
    expect(res.status).toBe(200);
    expect(res.body.contentType).toContain('text/html');
    expect(res.body.content).toBe(htmlBody);
  });

  it('rejects unsupported content types (e.g. image or application/json)', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'image/jpeg' },
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('data', Buffer.from(''));
        fakeRes.emit('end');
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/photo.jpg');
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });
});

describe('GET /api/fetch — timeouts, size limits & upstream failures', () => {
  it('enforces 10s timeout with 504 FETCH_TIMEOUT', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, _cb: unknown) => {
      fakeReq.end.mockImplementationOnce(() => {
        setImmediate(() => fakeReq.emit('timeout'));
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/slow');
    expect(res.status).toBe(504);
    expect(res.body.error.code).toBe('FETCH_TIMEOUT');
  });

  it('enforces 5MB response size limit with 502 PAGE_FETCH_FAILED', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 200,
      headers: { 'content-type': 'application/rss+xml' },
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        const bigChunk = Buffer.alloc(6 * 1024 * 1024, 'x');
        fakeRes.emit('data', bigChunk);
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/bigfeed');
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });

  it('handles remote HTTP 500 error cleanly', async () => {
    allowPublicDns();
    const fakeReq = makeFakeRequest();
    const fakeRes = makeFakeResponse({
      statusCode: 500,
    });

    mockHttpRequestImpl.mockImplementationOnce((_opts: unknown, cb: (r: FakeResponse) => void) => {
      fakeReq.end.mockImplementationOnce(() => {
        cb(fakeRes);
        fakeRes.emit('end');
      });
      return fakeReq;
    });

    const res = await request(app).get('/api/fetch?url=http://example.com/error');
    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('PAGE_FETCH_FAILED');
  });
});
