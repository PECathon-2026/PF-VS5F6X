# HANDOFF — SmallWebReader

## Current Status: Full-Stack Integrated & Verified

Both the frontend and backend have been fully integrated, wired, typechecked, and verified in `C:\Users\Vaibhav\Desktop\SmallWebReader`.

---

## Architecture & Configuration Summary

### 1. Backend (`backend/`)
- **Runtime & Framework:** Node.js, Express, TypeScript
- **Database:** Supabase PostgreSQL with strict TLS verification (`rejectUnauthorized: true`, custom trusted CA cert in `certs/prod-ca-2021.crt`)
- **Port:** `3001` (configured via `backend/.env`)
- **CORS:** Configured for `http://localhost:3000`, `http://127.0.0.1:3000`, and `process.env.CORS_ORIGIN`
- **Endpoints Verified:**
  - `GET /health` — liveness check
  - `POST /api/read` — readable article extraction (SSRF protected)
  - `GET /api/fetch` — safe proxy fetch for client-side RSS/Atom parsing & autodiscovery
  - `POST /api/discovery/query` — co-occurrence feed recommendations (minimum support $k=3$)
  - `POST /api/discovery/submit` — consented anonymous feed contribution
  - `GET /api/discovery/popular` — aggregate feed popularity directory

### 2. Frontend (`frontend/`)
- **Runtime & Framework:** React 18, Vite, TypeScript, Framer Motion, DOMPurify
- **Port:** `3000` (configured in `vite.config.ts`)
- **Environment:** `frontend/.env.local` configured with:
  - `VITE_API_BASE_URL=http://localhost:3001`
  - `VITE_USE_DEV_FIXTURES=false`
- **Features Integrated:**
  - Full typography, theme engine (9 curated themes), and ambient soundtracks
  - Distraction-free article reader canvas with DOMPurify sanitization
  - Live discovery feed directory (`GET /api/discovery/popular`)
  - Live feed recommendations query (`POST /api/discovery/query`)
  - Explicit opt-in anonymous feed contribution form (`POST /api/discovery/submit`)
  - Safe proxy fetch helper (`GET /api/fetch`)
  - Local-first guest bookmarks, history, and reading goal metrics (stored in browser `localStorage`)

---

## Test & Verification Results

### Backend
- **Type-Check & Build:** `npm run build` -> Clean exit (code 0)
- **Unit & Contract Tests:** `npm test` -> 7 suites passed, 91 passed tests (4 live integration tests skipped safely in local unit test mode)
- **Smoke Tests:** `npm run test:smoke` -> All passed
- **Live Server & CORS Check:**
  - `GET http://localhost:3001/health` with `Origin: http://localhost:3000` -> `200 OK`, `Access-Control-Allow-Origin: http://localhost:3000`
  - `OPTIONS http://localhost:3001/api/read` -> `204 No Content`, `Access-Control-Allow-Origin: http://localhost:3000`
  - `GET http://localhost:3001/api/discovery/popular?limit=5` -> `200 OK`, `Access-Control-Allow-Origin: http://localhost:3000`

### Frontend
- **Type-Check:** `npm run typecheck` (`tsc --noEmit`) -> Clean exit (code 0)
- **Production Build:** `npm run build` (`tsc && vite build`) -> Built cleanly in `dist/` (code 0)
- **Unit & Component Tests:** `npm test` -> 10 test suites passed, 53 tests passed (code 0)

---

## How to Run the Application Locally

Open two terminal windows:

### Terminal 1: Backend
```powershell
cd C:\Users\Vaibhav\Desktop\SmallWebReader\backend
npm run dev
```
Backend will start on `http://localhost:3001`.

### Terminal 2: Frontend
```powershell
cd C:\Users\Vaibhav\Desktop\SmallWebReader\frontend
npm run dev
```
Frontend will start on `http://localhost:3000`. Open `http://localhost:3000` in your web browser.
