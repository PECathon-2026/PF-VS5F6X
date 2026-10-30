# System Architecture — SmallWebReader

> [!WARNING]
> **PROVISIONAL ARCHITECTURE**  
> This architectural specification is a proposal. It remains provisional until official hackathon requirements, the judging rubric, and the shared API contract are approved.

---

## 1. System Topology & Physical Deployment

SmallWebReader is deployed across two local machines without an intermediary remote version control system or cloud hosting:

```
+-------------------------------------------------------------+
|                      LAPTOP 1: FRONTEND                     |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                   UI & Layout Layer                   |  |
|  |  (Reader Canvas, Controls Toolbar, Theme Engine)      |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|  +-------------------------------------------------------+  |
|  |                   State Management                    |  |
|  |  (Reader Preferences, Active Article, Offline Cache)  |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|  +-------------------------------------------------------+  |
|  |               API Client / Network Layer              |  |
|  |   - Mock Client (for isolated local development)      |  |
|  |   - Live HTTP Client (configured via local env IP)    |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
                             |
         Local Wi-Fi / Hotspot HTTP REST (Direct LAN)
                             |
+-------------------------------------------------------------+
|                      LAPTOP 2: BACKEND                      |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                Security & Validation Layer            |  |
|  |  (SSRF Guard, IP Filter, DNS Resolver, Size/Timeouts) |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|  +-------------------------------------------------------+  |
|  |                 Web Fetcher & Parser                  |  |
|  |  (HTML Fetching, Article Parsing, XSS Sanitization)   |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|  +-------------------------------------------------------+  |
|  |             Persistence Layer (Provisional)           |  |
|  |          (Local SQLite / DB if required by rubric)    |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

---

## 2. Responsibilities by System Component

### 2.1 Frontend (Laptop 1)
- **Input & Navigation**: Accepts user-submitted URLs, performs basic format validation, and handles loading and error states.
- **Reader Canvas**: Renders sanitized title, author metadata, publication dates, and structured content blocks.
- **Reading Controls**: Manages user-configured font size, typography scale, reading width, and line height.
- **Theme Engine**: Applies CSS variable theme definitions without triggering layout shifts.
- **Defensive Rendering**: Applies client-side sanitization on any rendered HTML to ensure defense-in-depth against malicious payloads.

### 2.2 Backend (Laptop 2)
- **SSRF Defense**: Validates external targets, resolving DNS and denying loopback, private RFC 1918/4193 addresses, and link-local ranges before issuing HTTP requests.
- **Resource Protection**: Enforces request timeouts (e.g., 5s) and response-size limits (e.g., 2MB) to prevent buffer overflows or denial-of-service.
- **Content Parsing**: Extracts article body, headings, and images from raw web pages (using tools such as Readability or equivalent libraries).
- **Sanitization & Scrubbing**: Strips executable JavaScript, tracking pixels, iframes, and dangerous attributes.
- **Error Hygiene**: Returns sanitized, structured JSON error codes without revealing internal paths or network topology.

---

## 3. Data Flow

```
[User] -> [Enters URL] -> [Frontend URL Input]
                              |
                     (Format Validation)
                              |
               [HTTP POST /api/read or /api/extract]
                              |
                              v
                  [Backend SSRF Validation]
                    /                   \
           (Blocked Target)        (Valid Public IP)
                  |                        |
         [403 / 422 Error]       [HTTP GET to Web Page]
                                           |
                                  (Timeout/Size Check)
                                           |
                                  [HTML Parser & Extractor]
                                           |
                                  [HTML Content Sanitizer]
                                           |
                                 [200 OK JSON Response]
                                           |
                                           v
                                  [Frontend Reader Canvas]
```

---

## 4. Security Boundaries & Threat Modeling

1. **Server-Side Request Forgery (SSRF)**:
   - *Threat*: Malicious URL pointing to `http://localhost:8080`, `http://192.168.1.1` (router admin), or `http://169.254.169.254` (cloud metadata).
   - *Mitigation*: Backend must resolve hostnames to IP addresses before connecting, verify that the IP is a routable public address, and re-validate any HTTP redirects.
2. **Cross-Site Scripting (XSS)**:
   - *Threat*: Article content contains malicious `<script>` or inline handlers (`onerror=...`).
   - *Mitigation*: Dual-layer sanitization. The backend strips active code during extraction, and the frontend applies safe rendering (e.g., DOMPurify or semantic markdown rendering).
3. **Denial of Service (DoS)**:
   - *Threat*: Slow-loris target or infinite streaming response exhaustion.
   - *Mitigation*: Hard limits on socket connection timeout, total read timeout, and stream byte count.
4. **Information Disclosure**:
   - *Threat*: Stack traces leaking local file paths or environment variables to client.
   - *Mitigation*: Global exception handlers returning standardized error JSON payloads.
