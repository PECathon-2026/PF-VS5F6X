# SmallWebReader — Project Task Board

> [!NOTE]
> All tasks are arranged in sequential stages with explicit dependencies. Unconfirmed or blocked tasks must not be started until their preceding gates are satisfied.

---

## Stage 1: Documentation Foundation & Consolidation

- [x] Inspect workspace to establish baseline (empty workspace verified).
- [x] Create initial documentation suite.
- [x] Discover and back up duplicate files into `docs/_backup/`.
- [x] Consolidate canonical documents (`README.md`, `AGENTS.md`, `docs/*`).
- [x] Create centralized decision and conflict log (`docs/DECISIONS.md`).
- [x] Verify canonical document consistency across all files.

---

## Stage 2: Scope & Requirements Approval (Gatekeeper Stage)

- [ ] `BLOCKED`: Obtain and verify official hackathon problem statement and technical boundaries.
- [ ] `BLOCKED`: Obtain and review judging rubric to prioritize scoring weights.
- [x] Build core local-first reader platform with decoupled backend-dependent features clearly labeled as pending.

---

## Stage 3: API Contract & Protocol Agreement

- [ ] `BLOCKED`: Resolve endpoint naming conflict (`/api/read` in test plan vs. `/api/extract` in handoff).
- [ ] `BLOCKED`: Finalize HTTP method, request payload, and success response schema with Laptop 2.
- [ ] `BLOCKED`: Finalize standard error codes (`400`, `403/422`, `408`, `502`) and error response schema.
- [ ] `BLOCKED`: Agree on local network connection parameters (backend port, CORS whitelist).
- [ ] `BLOCKED`: Update `docs/API_CONTRACT.md` status to `CONFIRMED`.

---

## Stage 4: Framework & Tooling Selection (Phase 1)

- [x] Decide frontend framework (Vite + React 18 + TypeScript + Framer Motion).
- [x] Set up CSS variable design token scaffolding with Editorial Zen default and motion system.
- [x] Configure TypeScript strict mode and clean compiler settings.
- [x] Configure test framework (Vitest + React Testing Library + JSDOM).
- [x] Create `.env.example` and `.env.local` defining API base URL configuration.

---

## Stage 5: Core Reading Experience & Shared Components (Phases 1, 4, 5)

- [x] Build accessible UI primitives (Button, Input, LoadingIndicator, ErrorBanner, Modal, ToastContainer).
- [x] Build navigation drawer (`NavigationSidebar`) and responsive app shell.
- [x] Build URL input component with inline validation, clear states, sample fixture pills, and Enter key submission.
- [x] Build core Reader Canvas layout with typography hierarchy, ArticleHeader, and DOMPurify sanitization.
- [x] Implement reading progress bar at top of screen (`ReadingProgressBar`).
- [x] Implement reading controls toolbar (font size, font family, line spacing, margins, focus mode, fullscreen).
- [x] Enforce `prefers-reduced-motion` across all UI transitions.

---

## Stage 6: Theme System Engine (Phase 6)

- [x] Build dynamic CSS variable theming engine with local preference persistence.
- [x] Implement **Editorial Zen** theme as default reading palette.
- [x] Implement all 8 canonical theme presets with distinct visual environments:
  - [x] Editorial Zen (Soft paper fades, warm ambient orbs, solo piano)
  - [x] Japanese Minimal (Drifting sakura petals, wabi-sabi bamboo, koto & flute)
  - [x] Academia (Warm parchment glide, sunbeam dust particles, classical strings)
  - [x] Dark Mono (Nocturnal focus, subdued luminance, white noise tape bed)
  - [x] Nature (Falling foliage, organic gradients, forest breeze & rain)
  - [x] Minimalist (Swiss high-contrast grid, precision micro-cuts, absolute silence)
  - [x] Anime (Floating starlight particles, glowing card borders, cinematic ambient)
  - [x] Cyberpunk (Electric cyan scanlines, neon pulse, analog synth horizon)
  - [x] Experimental (Terracotta brutalism, offset shadows, tape loop harmonics)
- [x] Build Theme Preview Mode allowing users to preview themes before applying.
- [x] Build Non-Autoplay Soundtrack Engine with honest missing asset handling and Web Audio procedural synthesis.
- [x] Build Animation Controls (Intensity: Low/Med/High, Background Effects Toggle, Reduced-Motion compliance).
- [x] Verify reading canvas geometry stability during theme switching.

---

## Stage 7: Personal Library, History & Dashboard (Phases 7, 8)

- [x] Build Local Storage guest persistence (`src/utils/storage.ts`) for bookmarks, history, and stats.
- [x] Build Personal Library view (`LibraryView`) with search, filter, and sorting.
- [x] Build Reading History view (`HistoryView`) with timestamped visits and clear history.
- [x] Build Reading Dashboard (`DashboardView`) with total articles, time read, words read, streak counter, today's goal progress, and 7-day weekly activity chart.

---

## Stage 8: Advanced Features, User Profile & Onboarding (Phases 2, 3, 9)

- [x] Build Landing Page hero and feature highlights with interactive theme previews (`LandingView`).
- [x] Build 3-step interactive onboarding tour modal (`OnboardingModal`).
- [x] Build Premium First-Time Visitor Screen (`WelcomeHeroScreen`) with branded hero, ambient theme orbs, and dual CTAs ("Get Started" and "Explore as Guest").
- [x] Build 6-step Comprehensive Onboarding Wizard (`OnboardingWizard`) with progress bar:
  - [x] Step 1: Welcome & distraction-free extraction architecture.
  - [x] Step 2: 14 reading genres multi-select.
  - [x] Step 3: 5 reading styles (Casual, Deep Focus, Academic, Quick, Night).
  - [x] Step 4: 8 themes with live preview, typography stack, sample cards, and ambient soundtrack identities.
  - [x] Step 5: Reader profile (display name, username, avatar picker, daily article & minute goals).
  - [x] Step 6: Completion summary card and entry CTA.
- [x] Build User Profile & Account modal (`ProfileAuthModal`) with guest mode notice, profile editor, reading goals, theme & soundtrack summary, reset onboarding trigger, and JSON data export.
- [x] Implement Markdown export, text copying, and Web Share API on Reader Canvas.
- [x] Implement focus mode (`f` key toggle) and keyboard shortcuts.

---

## Stage 9: API Client & Backend Integration

- [x] Implement abstract API client interface (`ReaderApiClient`) and factory (`readerApi`).
- [x] Build Mock API client with realistic sample fixtures for offline/fixture mode testing.
- [x] Build Live API client connecting to Laptop 2 backend over local LAN via `VITE_API_BASE_URL`.
- [x] Ensure failure states never silently display mock data.
- [ ] `BLOCKED` (Awaiting Laptop 2 agreement): Confirm final endpoint route (`/api/read` vs. `/api/extract`) and ratify schema.

---

## Stage 10: Testing, Verification & Production Readiness (Phase 10)

- [x] Add automated unit tests for URL validation, reading time, and mock client (`src/test/urlValidator.test.ts`, `src/test/api.test.ts`).
- [x] Add automated unit tests for local guest persistence (`src/test/storage.test.ts`).
- [x] Add automated component tests for Reader Canvas, DOMPurify sanitization, LibraryView, and DashboardView (`src/test/reader.test.tsx`, `src/test/library.test.tsx`, `src/test/dashboard.test.tsx`).
- [x] Add automated unit & integration tests for First-Time Visitor Screen and Onboarding Wizard (`src/test/onboarding.test.tsx`).
- [x] Add automated unit & integration tests for Central Theme Engine and Preview Mode (`src/test/themeEngine.test.tsx`).
- [x] Add automated unit & integration tests for Soundtrack Engine, non-autoplay enforcement, and audio controller (`src/test/soundtrack.test.tsx`).
- [x] Verify all 53 automated tests pass (53/53 passing across 10 test suites).
- [x] Verify strict TypeScript typecheck passes with 0 errors (`tsc --noEmit`).
- [x] Verify production build passes cleanly (`tsc && vite build`).
- [ ] `BLOCKED`: Perform end-to-end smoke test between both laptops across local Wi-Fi once backend is live.

---

## Stage 11: Premium Personalized Dashboard & Reading Library Ecosystem

- [x] Responsive 9-Item Navigation Sidebar (`Dashboard`, `Read an Article`, `Discover`, `My Library`, `Bookmarks`, `Reading History`, `Reading Statistics`, `Profile`, `Settings`).
- [x] Responsive Mobile Bottom Navigation Bar (`MobileBottomNav`) for viewport ergonomics (< 768px).
- [x] Enhanced Top Bar (`Header`) with quick search, theme popover selector, soundtrack toggle, notification counter, and profile avatar dropdown.
- [x] Personalized Dashboard View (`DashboardView`) with time-based greetings, personal message, reading overview cards (total articles, reading time, words read, bookmarks, streak), goal progress, Continue Reading cards from genuine history, and designed empty states.
- [x] Dedicated Reading Analytics & Goals View (`StatsView`) with real volume metrics, visual goal progress bars, interactive goal customization (daily articles, daily minutes, weekly articles, streak target), and 7-day chart with zero fake numbers.
- [x] Curated Small Web Discover View (`DiscoverView`) with genuine demo articles, genre filtering, and interest matching.
- [x] Enhanced Personal Library View (`LibraryView`) with bookmarks/history tabs, multi-field search, genre filters, and sorting.
- [x] Dedicated Bookmarks View (`BookmarksView`) with direct article opening, removal, and progress indicators.
- [x] Enhanced Reading History View (`HistoryView`) with reading progress bars, time spent tracking, search, and confirmation modal for clearing.
- [x] Dedicated Settings View (`SettingsView`) with theme grid, reading canvas typography sliders, motion & background effect toggles, soundtrack controls, local data JSON export, and full storage reset modal.
- [x] Dedicated Profile View (`ProfileView`) with avatar, username, display name inline editing, reading style, preferred genres, and goal summaries.
- [x] Theme-aware animations inheriting active theme transition durations and respecting `prefers-reduced-motion`.
- [x] Integration of all 9 routes without dead buttons or unlinked views.
