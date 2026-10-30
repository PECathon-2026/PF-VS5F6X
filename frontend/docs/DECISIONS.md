# Decision & Conflict Log — SmallWebReader

This document serves as the canonical record of confirmed architectural decisions, provisional proposals, unresolved questions, and documented conflicts across the SmallWebReader project.

---

## 1. Confirmed Decisions

| Decision ID | Area | Decision | Rationale | Date |
| :--- | :--- | :--- | :--- | :--- |
| `DEC-01` | **Environment** | Independent two-laptop development without GitHub or remote VCS. | Team constraints and hackathon setup. | 2026-10-30 |
| `DEC-02` | **Workflow** | Documentation-first approach; no application code before foundation and requirements gates are cleared. | Prevents wasted effort, prevents inventing APIs, and ensures cross-team alignment. | 2026-10-30 |
| `DEC-03` | **Security** | Strict SSRF defense on URL fetching (blocking loopback, private IPv4/IPv6, metadata endpoints, and validating redirects). | Essential defense against internal network reconnaissance. | 2026-10-30 |
| `DEC-04` | **Security** | Defense-in-depth HTML sanitization against XSS (backend stripping + frontend safe rendering). | Ensures user safety when rendering third-party web content. | 2026-10-30 |
| `DEC-05` | **Accessibility** | Mandatory adherence to WCAG 2.1 AA and `@media (prefers-reduced-motion: reduce)`. | Ensures the reader is inclusive, accessible, and comfortable for all users. | 2026-10-30 |
| `DEC-06` | **API Integration** | No silent fallback to mock data when real API calls fail; explicit error and loading states. | Prevents deceptive UI states and ensures robust error handling. | 2026-10-30 |
| `DEC-07` | **Tooling** | Vite + React 18 + TypeScript selected as the minimal, high-performance frontend framework. | Zero scaffolding bloat, instant HMR, direct LAN hosting capability, and lightweight build output. | 2026-10-30 |
| `DEC-08` | **API Boundary** | Development fixture isolation via `VITE_USE_DEV_FIXTURES`. Live API client ready for backend route confirmation. | Allows thorough UI/UX validation without faking live production calls or blocking on backend readiness. | 2026-10-30 |
| `DEC-09` | **Onboarding & Auth Boundary** | First-time visitor gate (`WelcomeHeroScreen`) + 6-step customization wizard (`OnboardingWizard`) with local guest persistence. Explicit disclaimer that accounts remain local guest profiles until backend auth integration. | Welcoming user experience without faking backend servers or inventing authentication databases. | 2026-10-30 |
| `DEC-10` | **Theme, Motion & Audio Engine** | Centralized theme architecture (`src/theme/themeConfig.ts`) across all 8 canonical environments with distinct animation personalities, GPU-accelerated background particles, theme preview mode, and honest non-autoplay soundtrack controller. | Transforms themes into distinct visual and auditory environments while guaranteeing strict performance and accessibility standards. | 2026-10-30 |
| `DEC-11` | **Dashboard & Reading Ecosystem** | Responsive 9-item sidebar, ergonomic mobile bottom navigation, honest local telemetry, dedicated analytics/goals manager, curated Small Web directory, and dedicated settings/profile views. Zero fabricated metrics or fake AI recommendations. | Provides a cohesive reading sanctuary honoring guest privacy, WCAG AA accessibility, and zero-telemetry rules. | 2026-10-30 |

---

## 2. Documented Conflicts & Divergences

| Conflict ID | Summary | Conflicting Documents | Proposed Resolution | Status |
| :--- | :--- | :--- | :--- | :--- |
| `CONF-01` | **Article Extraction Endpoint Name** | `docs/TEST_PLAN.md` specifies `POST /api/read`<br>`docs/HANDOFF.md` illustrates `POST /api/extract`<br>`docs/API_CONTRACT.md` lists `*TBD*` | Frontend and backend leads must mutually agree on one canonical route (e.g., `POST /api/read` or `POST /api/extract`). Until agreed, endpoint is `UNCONFIRMED / BLOCKED`. | `OPEN` |
| `CONF-02` | **Feature Scope vs. Hackathon Requirements** | Draft specification proposed bookmarks, reading history, and offline export, but official organizer requirements have not been reviewed. | Treat all advanced features as `PROVISIONAL` until official problem statement and judging rubric are supplied. | `OPEN` |

---

## 3. Provisional Proposals (Under Consideration)

| Proposal ID | Area | Proposal Details | Current Status |
| :--- | :--- | :--- | :--- |
| `PROP-01` | **Design / Theme** | **Editorial Zen** as the default aesthetic (warm off-white background, deep charcoal typography). | `PROPOSED` |
| `PROP-02` | **Design / Theme** | Seven theme families (Japanese, Anime, Minimalist, Academia, Nature, Cyberpunk, Experimental). | `PROPOSED` |
| `PROP-03` | **UI Controls** | Reader controls dock for adjusting font family, font size, line spacing, and canvas width. | `PROPOSED` |
| `PROP-04` | **Frontend Stack** | Option A: React + Vite SPA vs. Option B: Next.js App Router. | `PROPOSED` |
| `PROP-05` | **Data Storage** | Client-side storage (IndexedDB/localStorage) for user settings, bookmarks, and history. | `PROPOSED` |

---

## 4. Unresolved Questions Requiring Human Approval

1. **Hackathon Prompt & Constraints**: What are the official problem statement, prompt, and judging criteria?
2. **Endpoint Path Agreement**: Is the extraction endpoint `POST /api/read` or `POST /api/extract`?
3. **Backend Network Specs**: What are Laptop 2's backend port and CORS origin settings?
4. **Sanitization Responsibility**: Does the backend guarantee 100% sanitized HTML, or does the frontend perform secondary DOMPurify sanitization?
5. **Persistence Requirements**: Are bookmarks, reading history, and offline storage mandatory for the hackathon rubric, or are they stretch goals?
