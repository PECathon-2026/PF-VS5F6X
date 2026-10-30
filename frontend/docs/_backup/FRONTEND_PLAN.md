# Frontend Implementation Plan & Readiness Assessment

> [!NOTE]
> **Implementation Status**: Not yet begun.  
> This document records the inspection baseline, missing requirements, provisional page/component breakdown, and architectural decisions requiring approval before coding starts.

---

## 1. Inspection Baseline

- **Date of Inspection**: 2026-10-30
- **Workspace State**: Verified completely empty at initial check. No pre-existing source files, package manifests, or configurations were present.
- **Backend Coupling**: Backend is being developed independently on another laptop. No GitHub repository or shared remote VCS is currently connected.
- **Contract Baseline**: No API contract, endpoint schema, or backend technology has been confirmed yet.

---

## 2. Missing Requirements & Blockers

Before writing production frontend code, the following items must be supplied:

1. **Official Problem Statement & Constraints**: Exact requirements from the hackathon organizers or project prompt.
2. **Judging Rubric**: Scoring weights (e.g., UI design, code quality, accessibility, feature completeness, backend depth).
3. **Confirmed Backend API Contract**:
   - Extraction endpoint specifications (path, method, payload, response structure).
   - Error schemas and HTTP status codes.
   - CORS requirements and authentication requirements.
4. **Tooling & Framework Selection**: Approval of preferred framework (e.g., Next.js vs. Vite + React).
5. **Persistence Requirements**: Confirmation whether bookmarks and history reside in browser storage or are synced via backend database.

---

## 3. Provisional Page & Component Hierarchy

*Planned component structure once implementation is unlocked:*

```text
src/
├── app/ (or pages/)
│   ├── layout.tsx              # Root shell, theme provider, font loading
│   └── page.tsx                # Main Reader application view
├── components/
│   ├── reader/
│   │   ├── ReaderCanvas.tsx    # Article display (title, byline, content)
│   │   ├── ReaderToolbar.tsx   # Floating or docked reading settings
│   │   ├── ReadingProgress.tsx # Scroll progress indicator
│   │   └── ArticleMetadata.tsx # Read time, author, source link, published date
│   ├── controls/
│   │   ├── FontSelector.tsx    # Serif, Sans, Mono selection
│   │   ├── SizeSlider.tsx      # Font size & line height adjustments
│   │   ├── WidthSlider.tsx     # Reading canvas max-width control
│   │   └── ThemeSwitcher.tsx   # Theme selector dropdown or carousel
│   ├── panels/
│   │   ├── UrlSubmitModal.tsx  # URL input modal / header bar
│   │   ├── HistoryDrawer.tsx   # List of previously read URLs
│   │   └── BookmarksDrawer.tsx # Saved articles list
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Drawer.tsx
│       └── Slider.tsx
├── services/
│   ├── api.ts                  # API client interface
│   ├── mockClient.ts           # Mock data client for offline work
│   └── liveClient.ts           # Axios / fetch client to backend laptop
├── store/
│   ├── useReaderSettings.ts    # Font, theme, and layout preferences
│   └── useArticleStore.ts      # Active article state and parsing lifecycle
└── styles/
    └── themes.css              # CSS variable token definitions for all themes
```

---

## 4. Key Decisions Requiring Approval

1. **Framework Choice**: Vite + React SPA (simpler local dev, fast static build) vs. Next.js App Router (richer server rendering, built-in API proxy).
2. **Extraction Responsibilities**: Is content HTML pre-sanitized by the backend, or must the frontend include an HTML sanitizer (e.g., DOMPurify)?
3. **Theme Visual Depth**: Should themes alter only color palettes and font families, or also incorporate decorative stylistic elements (e.g., paper textures, borders, Japanese vertical kanji accents, cyberpunk glow)?
4. **Local Network Port & URL Configuration**: Agreement on local IP and port assignments for cross-laptop testing.
