# SmallWebReader — Test Plan

> [!NOTE]
> **Provisional Test Plan**  
> This test plan establishes the verification criteria for contract conformance, URL-fetch security, content extraction, frontend accessibility, and end-to-end integration across the two development laptops.

---

## 1. Contract & API Conformance Checks

> *Note: Route paths below use `/api/read` provisionally; update to the confirmed endpoint once resolved with the backend team.*

- [ ] `GET /health` returns HTTP 200 with `{"status": "ok"}` (if implemented).
- [ ] Valid `POST <CONFIRMED_ENDPOINT>` (e.g., `/api/read` or `/api/extract`) returns HTTP 200 with all mandatory schema fields.
- [ ] Missing `url` parameter in request body returns HTTP 400 with a structured validation error.
- [ ] Non-string, blank, or malformed URLs return HTTP 400.
- [ ] Unsupported schemes (`file://`, `ftp://`, `gopher://`, `data:`) return HTTP 400.
- [ ] Error response body conforms strictly to the agreed error schema (e.g., `{"error": {"code": "...", "message": "..."}}`).

---

## 2. URL-Fetch Security & SSRF Protection Checks

- [ ] **Loopback Blocking**: Requests to `http://127.0.0.1`, `http://localhost`, and `http://[::1]` return HTTP 403 or 422 with a safe error message.
- [ ] **Private IPv4 Blocking**: Requests to RFC 1918 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) return HTTP 403 or 422.
- [ ] **Cloud Metadata & Link-Local Blocking**: Requests to `http://169.254.169.254` and `fe80::/10` return HTTP 403 or 422.
- [ ] **DNS Resolution Verification**: Hostnames resolving to private/loopback IP addresses are blocked prior to connection.
- [ ] **Redirect Safety**: HTTP 301/302/307 redirects targeting private/internal network addresses are denied.
- [ ] **DNS Rebinding Defense**: Resolved IP is re-verified or connection is pinned to the validated address.
- [ ] **Connection Timeout**: Requests to slow/hanging servers are aborted after the configured timeout threshold (e.g., 5 seconds).
- [ ] **Response Size Limit**: Fetching oversized responses (e.g., > 2MB) is terminated before excessive memory consumption occurs.
- [ ] **Content-Type Filter**: Non-HTML payloads (e.g., large binaries, `.iso`, `.zip`, `.exe`) are rejected before full download.
- [ ] **Error Masking**: Server error responses never expose backend file system paths, stack traces, credentials, or internal network IPs.

---

## 3. Content Extraction Checks

- [ ] **Standard Article**: Known public article returns accurate title, byline, publish date, and content blocks.
- [ ] **Missing Title**: Web page lacking `<title>` or OpenGraph title is safely handled with a fallback or domain title.
- [ ] **Minimal/Empty Text**: Pages with no substantive text body return a predictable empty or minimal content payload.
- [ ] **Malformed Markup**: Severely malformed HTML does not crash the parser.
- [ ] **Active Code Stripping**: Extracted content is completely stripped of `<script>`, `<object>`, `<embed>`, inline event handlers (`onload`, `onerror`), and `javascript:` links.

---

## 4. Frontend & Accessibility Checks

- [ ] **Input & Trigger**: Submitting a URL via the Submit button and pressing the `Enter` key both initiate the request.
- [ ] **Loading Feedback**: Clear, accessible loading spinner or skeleton state appears while the request is pending.
- [ ] **Content Display**: Successfully extracted article renders with legible typography and proper heading hierarchy.
- [ ] **Error Handling**: Network failures and validation errors display user-friendly error banners.
- [ ] **No Silent Fallback**: Failed API requests never silently switch to mock data.
- [ ] **Keyboard Accessibility**: Complete navigation flow is operable using `Tab`, `Shift+Tab`, `Enter`, and `Escape`.
- [ ] **Reduced Motion**: All animations and transitions are disabled or minimized when `prefers-reduced-motion` is active.
- [ ] **Viewport Responsiveness**: Reader layout renders legibly on mobile (375px), tablet (768px), and desktop (1280px).

---

## 5. End-to-End Cross-Laptop Smoke Test

1. Start the backend service on Laptop 2 and obtain its local IP.
2. Configure Laptop 1 frontend `.env.local` with the backend IP and port.
3. Start the frontend development server on Laptop 1.
4. From Laptop 1, ping Laptop 2 to confirm network connectivity.
5. In the frontend browser UI, submit a known public article URL.
6. Verify that the request reaches the backend and completes with HTTP 200.
7. Verify that the extracted article renders cleanly in the Reader Canvas across all active themes.
8. Submit an internal IP URL (e.g., `http://127.0.0.1:8080`) and confirm a safe error banner is displayed.
9. Record commands, actual test outputs, and status in the test log below.

---

## 6. Test Execution Log Template

| Date/Time | Test ID | Description | Command / Steps | Expected Outcome | Actual Outcome | Status (PASS/FAIL/SKIP) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *YYYY-MM-DD* | `TC-01` | *Health check* | `curl -i http://...` | `HTTP 200 OK` | *Pending execution* | `NOT RUN` |
