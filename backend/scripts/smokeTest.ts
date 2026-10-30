/**
 * SmallWebReader — Backend API Smoke Test Script
 *
 * Runs smoke checks against the Express application:
 * 1. GET /health -> 200 { status: 'ok' }
 * 2. POST /api/read (missing URL) -> 422 VALIDATION_ERROR
 * 3. POST /api/read (invalid URL) -> 400 INVALID_URL
 * 4. POST /api/read (blocked loopback IP) -> 403 URL_NOT_ALLOWED
 * 5. POST /api/read (optional live URL) -> 200 { url, title, content }
 *    (Only executed when SMOKE_TEST_URL is provided in environment)
 */

import request from 'supertest';
import app from '../src/app';

async function runSmokeTests(): Promise<void> {
  console.log('--- Starting SmallWebReader Smoke Tests ---');
  let failed = false;

  // Helper for reporting checks
  const check = (description: string, passed: boolean, details?: string) => {
    if (passed) {
      console.log(`[PASS] ${description}`);
    } else {
      console.error(`[FAIL] ${description}${details ? ` - ${details}` : ''}`);
      failed = true;
    }
  };

  try {
    // 1. Health check
    const healthRes = await request(app).get('/health');
    check(
      'GET /health returns 200 with { status: "ok" }',
      healthRes.status === 200 && healthRes.body?.status === 'ok',
      `Got status ${healthRes.status}, body: ${JSON.stringify(healthRes.body)}`,
    );

    // 2. Missing URL validation
    const missingUrlRes = await request(app).post('/api/read').send({});
    check(
      'POST /api/read (missing body) returns 422 VALIDATION_ERROR',
      missingUrlRes.status === 422 && missingUrlRes.body?.error?.code === 'VALIDATION_ERROR',
      `Got status ${missingUrlRes.status}, code: ${missingUrlRes.body?.error?.code}`,
    );

    // 3. Malformed URL
    const malformedUrlRes = await request(app).post('/api/read').send({ url: 'not-a-valid-url' });
    check(
      'POST /api/read (malformed URL) returns 400 INVALID_URL',
      malformedUrlRes.status === 400 && malformedUrlRes.body?.error?.code === 'INVALID_URL',
      `Got status ${malformedUrlRes.status}, code: ${malformedUrlRes.body?.error?.code}`,
    );

    // 4. Blocked loopback address (SSRF guard check)
    const loopbackRes = await request(app).post('/api/read').send({ url: 'http://127.0.0.1/' });
    check(
      'POST /api/read (127.0.0.1) returns 403 URL_NOT_ALLOWED',
      loopbackRes.status === 403 && loopbackRes.body?.error?.code === 'URL_NOT_ALLOWED',
      `Got status ${loopbackRes.status}, code: ${loopbackRes.body?.error?.code}`,
    );

    // 5. Optional live public URL test
    const liveUrl = process.env.SMOKE_TEST_URL;
    if (liveUrl) {
      console.log(`[INFO] Running optional live public URL test against: ${liveUrl}`);
      const liveRes = await request(app).post('/api/read').send({ url: liveUrl });
      check(
        `POST /api/read (live URL: ${liveUrl}) returns 200 with extracted content`,
        liveRes.status === 200 &&
          typeof liveRes.body?.url === 'string' &&
          typeof liveRes.body?.content === 'string' &&
          (typeof liveRes.body?.title === 'string' || liveRes.body?.title === null),
        `Got status ${liveRes.status}, body keys: ${Object.keys(liveRes.body || {}).join(', ')}`,
      );
    } else {
      console.log('[SKIP] Optional live public URL test skipped (set SMOKE_TEST_URL to enable).');
    }
  } catch (err) {
    console.error('[ERROR] Unexpected failure running smoke tests:', err instanceof Error ? err.message : err);
    failed = true;
  }

  if (failed) {
    console.error('--- Smoke Tests FAILED ---');
    process.exit(1);
  }

  console.log('--- Smoke Tests PASSED ---');
  process.exit(0);
}

runSmokeTests();
