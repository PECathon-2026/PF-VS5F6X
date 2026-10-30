# SmallWebReader — Test Plan

> Test suite coverage plan for implemented and planned endpoints.

## 1. Verified & Automated Test Suites (Current Status)

### A. Health Check (`GET /health`)
- [x] Returns HTTP 200 with `{ "status": "ok" }`.

### B. Safe Read (`POST /api/read`)
- [x] Input validation:
  - [x] Missing `url` rejected with 422 `VALIDATION_ERROR`.
  - [x] Non-string `url` rejected with 422 `VALIDATION_ERROR`.
  - [x] Empty string or whitespace `url` rejected with 422 `VALIDATION_ERROR`.
  - [x] Malformed URLs rejected with 400 `INVALID_URL`.
  - [x] Non-HTTP/HTTPS protocols (`ftp://`, `file://`, `javascript:`, `data:`) rejected with 400 `INVALID_URL`.
- [x] SSRF & Network Security:
  - [x] IPv4 loopback (`127.0.0.1`, `0.0.0.0`) blocked with 403 `URL_NOT_ALLOWED`.
  - [x] Private IPv4 ranges (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) blocked.
  - [x] Link-local / cloud metadata (`169.254.169.254`) blocked.
  - [x] IPv6 loopback (`::1`), link-local (`fe80::/10`), unique-local (`fc00::/7`, `fd00::/8`), and multicast (`ff00::/8`) blocked.
  - [x] IPv4-mapped IPv6 addresses (both dotted and normalized hex) blocked.
  - [x] Domain names resolving to blocked IPs blocked prior to connection.
  - [x] Redirects to private/internal IPs or unsupported schemes blocked.
  - [x] Redirect loop / hop limit (max 5) enforced with 502 `PAGE_FETCH_FAILED`.
- [x] Resource & Content Bounding:
  - [x] Request timeout (10s) enforced with 504 `FETCH_TIMEOUT`.
  - [x] Response size limit (5MB) enforced with 502 `PAGE_FETCH_FAILED`.
  - [x] Non-HTML content types (e.g. `image/png`, `application/json`) rejected with 502 `PAGE_FETCH_FAILED`.
  - [x] Stream errors and remote 5xx handled cleanly with 502.
  - [x] Malformed/unclosed HTML tags stripped without crashing or leaking script contents.

### C. Smoke Testing
- [x] In-process local smoke test script (`npm run test:smoke`) verifies core behaviors without internet access.
- [x] Optional live URL testing via `SMOKE_TEST_URL` environment variable.

---

## 2. Planned Test Suites (To Be Implemented With Future Endpoints)

### A. Safe Fetch (`GET /api/fetch?url=...`)
- [ ] Validates URL query parameter.
- [ ] Enforces identical SSRF and redirect rules as `/api/read`.
- [ ] Permits RSS/Atom XML content types (`application/rss+xml`, `application/atom+xml`, `text/xml`).
- [ ] Enforces 5MB response-size and 10s timeout limits.

### B. Popular Feeds (`GET /api/discovery/popular`)
- [ ] Returns curated seed feeds without user contribution.
- [ ] Respects limit query parameter.
- [ ] Handles database connection failures safely with standard error format.

### C. Discovery Contribution (`POST /api/discovery/submit`)
- [ ] Rejects submissions without explicit consent payload/flag.
- [ ] Rejects malformed or excessive feed list batches.
- [ ] Verifies database atomic increment of `feed_pairs` and `feed_popularity`.
- [ ] Verifies raw submission batches and client IPs are never logged or persisted.
- [ ] Enforces HMAC rate limiting and handles 429 responses.

### D. Discovery Recommendations (`POST /api/discovery/query`)
- [ ] Excludes query feeds from the returned recommendations.
- [ ] Verifies support threshold `k = 3`: feeds with < 3 co-occurrences return generic reasons.
- [ ] Verifies query feed lists are never persisted to disk or database.
