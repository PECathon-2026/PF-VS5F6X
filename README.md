# SmallWebReader — Full-Stack Application

SmallWebReader is a distraction-free reader and discovery engine for the independent web.

- **Backend:** Express + TypeScript + PostgreSQL (Supabase with strict TLS) on port `3001`
- **Frontend:** React 18 + Vite + TypeScript + Framer Motion on port `3000`

---

## Quick Start

### 1. Start Backend (Terminal 1)
```powershell
cd backend
npm run dev
```
Listens on `http://localhost:3001`.

### 2. Start Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Testing & Quality Assurance

### Run All Backend Tests
```powershell
cd backend
npm run build
npm test
npm run test:smoke
```

### Run All Frontend Tests & Build
```powershell
cd frontend
npm run typecheck
npm run build
npm test
```

---

## Documentation
- `docs/API_CONTRACT.md` — Complete HTTP API contract specifications
- `docs/PROJECT_SPEC.md` — Product and architectural requirements
- `docs/HANDOFF.md` — Integration status and system verification notes
