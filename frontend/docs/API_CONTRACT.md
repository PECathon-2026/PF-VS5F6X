# API Contract — SmallWebReader

> [!IMPORTANT]
> **CONTRACT STATUS: UNCONFIRMED / BLOCKED**  
> No endpoint paths, HTTP methods, request payloads, response schemas, error codes, or authentication mechanisms have been confirmed.  
> **This document is NOT authorization to invent or change the backend contract.** Any implementation must strictly wait for explicit mutual agreement between the frontend developer (Laptop 1) and backend developer (Laptop 2).

---

## 1. Unresolved Endpoint Conflict

A naming conflict currently exists across draft documents:

| Source Document | Proposed Path | Method | Notes |
| :--- | :--- | :--- | :--- |
| `docs/TEST_PLAN.md` | `/api/read` | `POST` | Proposed in test contract assertions |
| `docs/HANDOFF.md` | `/api/extract` | `POST` | Illustrated in sample curl checklist |

> [!CAUTION]
> **Neither endpoint is confirmed.** Developers must not code against either `/api/read` or `/api/extract` until this conflict is resolved and recorded in `docs/DECISIONS.md`.

---

## 2. Shared Protocol Baseline Requirements

The following requirements must be settled before this contract can transition to `CONFIRMED`:

### 2.1 Backend Connectivity
- **Host & Port**: Exact IP/hostname and port where backend will listen (e.g., `http://<LAPTOP_2_IP>:<PORT>`).
- **CORS Configuration**: Explicit allowed origins covering Laptop 1's local dev server (e.g., `http://localhost:5173` or `http://localhost:3000`).
- **Health Check Endpoint**: Agreement on whether `GET /health` or similar ping endpoint is implemented.

### 2.2 Article Extraction Endpoint (Pending Confirmation)
- **Path & Method**: `POST <CONFIRMED_PATH>` (resolving `/api/read` vs `/api/extract`).
- **Request Headers**:
  - `Content-Type: application/json`
  - Any required custom headers or auth tokens.
- **Request Payload**:
  ```json
  {
    "url": "https://example.com/article"
  }
  ```
  *(Schema fields subject to backend confirmation).*
- **Success Response (200 OK)**:
  Backend developer to specify the exact schema. Proposed candidate fields:
  ```json
  {
    "url": "https://example.com/article",
    "title": "Article Title",
    "byline": "Author Name (or null)",
    "publishedDate": "2026-10-30T00:00:00Z (or null)",
    "content": "<p>Sanitized article HTML or markdown blocks</p>",
    "excerpt": "Short excerpt / summary",
    "readingTimeMinutes": 5,
    "leadImageUrl": "https://example.com/image.jpg (or null)"
  }
  ```
- **Error Responses**:
  Backend developer to specify standard error schema and codes:
  - `400 Bad Request`: Missing or malformed URL, invalid scheme (e.g. `file://`, `ftp://`).
  - `403 Forbidden` / `422 Unprocessable Entity`: Blocked private/internal IP (SSRF protection).
  - `408 Request Timeout` / `504 Gateway Timeout`: Remote target timeout.
  - `502 Bad Gateway`: Remote target unreachable or non-200.
  - Proposed error body:
    ```json
    {
      "error": {
        "code": "INVALID_URL | BLOCKED_TARGET | FETCH_FAILED | PARSE_ERROR",
        "message": "Human-readable explanation (without leaking internal infrastructure)"
      }
    }
    ```

### 2.3 Bookmarks & History Endpoints
- **Status**: `BLOCKED / PENDING DECISION`.
- If client-side persistence (IndexedDB/localStorage) is chosen, no backend contract is needed.
- If backend persistence is required, endpoints, schemas, and pagination must be documented here.

---

## 3. Pending Endpoint Registry

| Endpoint | Method | Purpose | Request Body | Response Schema | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *TBD (`/api/read` vs `/api/extract`)* | `POST` | Article extraction | *Pending Confirmation* | *Pending Confirmation* | `UNCONFIRMED / BLOCKED` |
| `/health` | `GET` | Connectivity / Health check | *None* | `{"status": "ok"}` (Pending) | `UNCONFIRMED / PROVISIONAL` |
| *TBD (Bookmarks)* | *TBD* | Save/fetch bookmarks | *Pending Decision* | *Pending Decision* | `BLOCKED / NOT APPROVED` |
| *TBD (History)* | *TBD* | Save/fetch history | *Pending Decision* | *Pending Decision* | `BLOCKED / NOT APPROVED` |

---

## 4. Contract Finalization Workflow

1. Backend developer (Laptop 2) and Frontend developer (Laptop 1) agree upon exact route names, payloads, and error schemas.
2. Record the final agreement in `docs/DECISIONS.md`.
3. Update this file (`docs/API_CONTRACT.md`) to change status from `UNCONFIRMED / BLOCKED` to `CONFIRMED`.
4. Only then may client code and backend routes be implemented.
