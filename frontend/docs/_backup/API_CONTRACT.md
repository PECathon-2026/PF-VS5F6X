# API Contract — SmallWebReader

> [!IMPORTANT]
> **STATUS: PENDING CONFIRMATION FROM BACKEND DEVELOPER**  
> No endpoint paths, HTTP methods, request payloads, response schemas, error codes, or authentication mechanisms have been confirmed.  
> **This document is NOT authorization to invent or change the backend contract.** Any implementation must strictly wait for or coordinate directly with the backend developer on Laptop 2.

---

## 1. Contract Exchange Status

- **Status**: `UNCONFIRMED / BLOCKED`
- **Backend Host / Port**: Unknown (pending backend developer confirmation)
- **CORS Configuration**: Pending confirmation for local development across laptops
- **Auth Strategy**: Pending confirmation (None, Bearer token, Session, API key, etc.)

---

## 2. Information Required from Backend Developer

To unblock the frontend integration layer, the backend developer must confirm the following specifications:

### 2.1 Extraction Endpoint
- Expected HTTP Method (`POST`, `GET`, etc.)
- Exact path (e.g., `/api/...`)
- Request headers (Content-Type, custom headers)
- Request body schema (e.g., URL payload, parsing options)
- Success response schema:
  - Title
  - Author / Byline
  - Publication Date
  - Content HTML or Markdown or Structured Blocks
  - Excerpt / Summary
  - Estimated Reading Time / Word Count
  - Lead Image URL
- Error response schema (Status codes, error message format, validation error structures)

### 2.2 Bookmarks / History Endpoints (If Handled by Backend)
- Is persistence client-side (Local Storage / IndexedDB) or server-side?
- If server-side: List endpoints, methods, schemas, and pagination format.

### 2.3 Health Check & Diagnostics
- Health check endpoint for verifying connectivity between both laptops.

---

## 3. Pending Endpoint Registry (To be populated once confirmed)

| Endpoint | Method | Purpose | Request Body | Response Schema | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *TBD* | *TBD* | *Article Extraction* | *Pending* | *Pending* | `AWAITING BACKEND SPEC` |
| *TBD* | *TBD* | *Health Check* | *None* | *Pending* | `AWAITING BACKEND SPEC` |
| *TBD* | *TBD* | *Bookmarks (Optional)* | *Pending* | *Pending* | `AWAITING BACKEND SPEC` |
| *TBD* | *TBD* | *History (Optional)* | *Pending* | *Pending* | `AWAITING BACKEND SPEC` |

---

## 4. Contract Change Protocol

1. Changes to API shapes must be agreed upon by both developers.
2. The backend developer provides the canonical schema.
3. The frontend developer updates this document to match the confirmed specification before updating API client code or mocks.
