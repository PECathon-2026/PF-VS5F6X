# SmallWebReader — Test Plan

> Provisional test plan. Adjust it to the final approved specification and API contract.

## 1. Contract checks
- [ ] `GET /health` returns the agreed response, if this endpoint is included.
- [ ] Valid `POST /api/read` request returns exactly the approved fields.
- [ ] Missing `url` is rejected with the agreed validation response.
- [ ] Non-string and malformed URLs are rejected.
- [ ] Unsupported schemes such as `file://` are rejected.
- [ ] Error responses match the approved JSON schema.

## 2. URL-fetch security
- [ ] Loopback targets are blocked.
- [ ] Private/internal IPv4 and IPv6 targets are blocked.
- [ ] Link-local and reserved addresses are blocked.
- [ ] Hostnames resolving to blocked IPs are rejected.
- [ ] Redirects to blocked addresses are rejected.
- [ ] DNS resolution is validated safely to reduce DNS-rebinding risk.
- [ ] Fetch timeout is enforced.
- [ ] Maximum response size is enforced.
- [ ] Unsupported content types are rejected.
- [ ] Remote 4xx/5xx and connection failures produce predictable errors.
- [ ] Internal IPs, stack traces, credentials, and secrets are not returned to clients.

## 3. Content extraction
- [ ] A known public HTML page returns title/content as specified.
- [ ] Page with no title is handled safely.
- [ ] Page with little/no main text is handled predictably.
- [ ] Non-HTML response is rejected or handled according to the contract.
- [ ] Malformed HTML does not crash the service.

## 4. Frontend checks
- [ ] Submit button and Enter key work as intended.
- [ ] Loading state is visible while the request is pending.
- [ ] Valid response is displayed.
- [ ] Validation and server errors are understandable.
- [ ] Empty content is handled.
- [ ] Failed API requests do not silently show mock data.
- [ ] Layout works at agreed mobile and desktop sizes.

## 5. End-to-end smoke test
1. Start backend using documented instructions.
2. Start frontend using documented instructions.
3. Submit a known public test URL.
4. Verify the request reaches the backend.
5. Verify response fields match `API_CONTRACT.md`.
6. Verify the frontend displays the returned content.
7. Submit an invalid URL and confirm a safe, visible error.
8. Record commands, actual outcomes, and any unresolved failures.

## 6. Reporting
For each test run, record:
- Date/time
- Command or manual steps
- Expected result
- Actual result
- PASS / FAIL / NOT RUN
- Error details and next action
