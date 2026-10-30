/**
 * Tests for Discovery API Endpoints:
 * - POST /api/discovery/query
 * - POST /api/discovery/submit
 * - GET  /api/discovery/popular
 */

import request from 'supertest';
import app from '../app';
import * as poolModule from '../db/pool';

// Mock getDatabasePool
jest.mock('../db/pool', () => {
  const original = jest.requireActual('../db/pool');
  return {
    ...original,
    getDatabasePool: jest.fn(),
  };
});

describe('Discovery API Layer', () => {
  let mockClient: any;
  let mockPool: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };

    mockPool = {
      query: jest.fn(),
      connect: jest.fn().mockResolvedValue(mockClient),
    };

    (poolModule.getDatabasePool as jest.Mock).mockReturnValue(mockPool);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. POST /api/discovery/submit
  // ─────────────────────────────────────────────────────────────────────────────
  describe('POST /api/discovery/submit', () => {
    it('rejects submission when consent is missing or false', async () => {
      const res = await request(app)
        .post('/api/discovery/submit')
        .send({ feeds: ['https://example.com/feed'] });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('CONSENT_REQUIRED');
    });

    it('rejects submission when feeds array is missing or empty', async () => {
      const res = await request(app)
        .post('/api/discovery/submit')
        .send({ consent: true, feeds: [] });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects submission when batch exceeds 50 feeds', async () => {
      const manyFeeds = Array.from({ length: 51 }, (_, i) => `https://example.com/feed${i}`);
      const res = await request(app)
        .post('/api/discovery/submit')
        .send({ consent: true, feeds: manyFeeds });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('handles rate limiting (429)', async () => {
      // Mock rate limit count returning > 10
      mockPool.query.mockResolvedValueOnce({ rows: [{ count: 11 }] });

      const res = await request(app)
        .post('/api/discovery/submit')
        .send({ consent: true, feeds: ['https://example.com/feed1', 'https://example.com/feed2'] });

      expect(res.status).toBe(429);
      expect(res.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('successfully processes consented contribution and updates pairs', async () => {
      // 1. Rate limit query
      mockPool.query.mockResolvedValueOnce({ rows: [{ count: 1 }] });

      // 2. Transaction queries on client
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: '1', canonical_url: 'https://blog1.com/feed' }] }) // insert feed 1
        .mockResolvedValueOnce({ rows: [{ id: '2', canonical_url: 'https://blog2.com/feed' }] }) // insert feed 2
        .mockResolvedValueOnce({}) // popularity feed 1
        .mockResolvedValueOnce({}) // popularity feed 2
        .mockResolvedValueOnce({}) // pair (1, 2)
        .mockResolvedValueOnce({}); // COMMIT

      const res = await request(app)
        .post('/api/discovery/submit')
        .send({
          consent: true,
          feeds: ['https://blog1.com/feed', 'https://blog2.com/feed'],
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('accepted');
      expect(res.body.feedsProcessed).toBe(2);
      expect(res.body.pairsUpdated).toBe(1);
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    });

    it('rolls back transaction on database error', async () => {
      // Rate limit query
      mockPool.query.mockResolvedValueOnce({ rows: [{ count: 1 }] });

      // BEGIN succeeds, next query fails
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .post('/api/discovery/submit')
        .send({
          consent: true,
          feeds: ['https://blog1.com/feed', 'https://blog2.com/feed'],
        });

      expect(res.status).toBe(500);
      expect(res.body.error.code).toBe('INTERNAL_ERROR');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. POST /api/discovery/query
  // ─────────────────────────────────────────────────────────────────────────────
  describe('POST /api/discovery/query', () => {
    it('rejects when feeds field is not an array', async () => {
      const res = await request(app)
        .post('/api/discovery/query')
        .send({ feeds: 'not-an-array' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns popular seeds when no input feeds match database', async () => {
      // 1. Rate limit check
      mockPool.query.mockResolvedValueOnce({ rows: [{ count: 1 }] });

      // 2. Feed lookup returns empty
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      // 3. Fallback popular seeds query
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            canonical_url: 'https://seedblog.com/feed',
            host: 'seedblog.com',
            title: 'Seed Blog',
            agg_count: '15',
          },
        ],
      });

      const res = await request(app)
        .post('/api/discovery/query')
        .send({ feeds: ['https://unknownblog.com/feed'] });

      expect(res.status).toBe(200);
      expect(res.body.recommendations).toHaveLength(1);
      expect(res.body.recommendations[0].canonicalUrl).toBe('https://seedblog.com/feed');
      expect(res.body.recommendations[0].reason).toContain('seed directory');
    });

    it('enforces k=3 threshold for specific pair-evidence recommendations', async () => {
      // 1. Rate limit check
      mockPool.query.mockResolvedValueOnce({ rows: [{ count: 1 }] });

      // 2. Feed lookup finds feed 10
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: '10', canonical_url: 'https://inputblog.com/feed' }],
      });

      // 3. Co-occurrence query returns 2 candidates (one with support=5, one with support=2)
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            canonical_url: 'https://highsupport.com/feed',
            host: 'highsupport.com',
            title: 'High Support',
            total_support: '5',
            max_single_support: '5',
          },
          {
            canonical_url: 'https://lowsupport.com/feed',
            host: 'lowsupport.com',
            title: 'Low Support',
            total_support: '2',
            max_single_support: '2',
          },
        ],
      });

      const res = await request(app)
        .post('/api/discovery/query')
        .send({ feeds: ['https://inputblog.com/feed'], limit: 2 });

      expect(res.status).toBe(200);
      expect(res.body.recommendations).toHaveLength(2);

      // Support >= 3 has specific pair-evidence reason
      expect(res.body.recommendations[0].reason).toBe('Frequently followed together with blogs in your feed list');
      // Support < 3 has generic/emerging reason
      expect(res.body.recommendations[1].reason).toBe('Emerging blog recommendation');
    });

    it('excludes feeds already in query list', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [{ count: 1 }] });
      mockPool.query.mockResolvedValueOnce({ rows: [] }); // feed lookup
      mockPool.query.mockResolvedValueOnce({ rows: [] }); // popular

      const res = await request(app)
        .post('/api/discovery/query')
        .send({ feeds: ['https://myblog.com/feed'] });

      expect(res.status).toBe(200);
      const returnedUrls = res.body.recommendations.map((r: any) => r.canonicalUrl);
      expect(returnedUrls).not.toContain('https://myblog.com/feed');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. GET /api/discovery/popular
  // ─────────────────────────────────────────────────────────────────────────────
  describe('GET /api/discovery/popular', () => {
    it('returns paginated popular feeds without requiring contribution', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ total: '2' }] }) // COUNT query
        .mockResolvedValueOnce({
          rows: [
            {
              canonical_url: 'https://popularblog1.com/rss',
              host: 'popularblog1.com',
              title: 'Popular One',
              is_seed: true,
              agg_count: '42',
            },
            {
              canonical_url: 'https://popularblog2.com/atom',
              host: 'popularblog2.com',
              title: 'Popular Two',
              is_seed: false,
              agg_count: '18',
            },
          ],
        });

      const res = await request(app).get('/api/discovery/popular?limit=10&offset=0');
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(2);
      expect(res.body.limit).toBe(10);
      expect(res.body.offset).toBe(0);
      expect(res.body.feeds).toHaveLength(2);
      expect(res.body.feeds[0].canonicalUrl).toBe('https://popularblog1.com/rss');
      expect(res.body.feeds[0].aggregateCount).toBe(42);
      expect(res.body.feeds[0].isSeed).toBe(true);
    });

    it('returns safe error when database query fails without leaking details', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Connection refused'));

      const res = await request(app).get('/api/discovery/popular');
      expect(res.status).toBe(500);
      expect(res.body.error.code).toBe('INTERNAL_ERROR');
      expect(res.body).not.toHaveProperty('stack');
    });
  });
});
