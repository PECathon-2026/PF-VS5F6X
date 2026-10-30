# Project Task Board — SmallWebReader

> [!NOTE]
> Tasks are categorized by stage. Dependencies and blocking prerequisites are marked explicitly. No implementation task should begin until its preceding gate is cleared.

---

## Stage 1: Documentation & Project Foundation (Current)

- [x] Inspect workspace to confirm starting baseline (empty workspace verified).
- [x] Create project agent operating rules (`AGENTS.md`).
- [x] Create project overview & setup guide (`README.md`).
- [x] Create draft product specification (`docs/PROJECT_SPEC.md`).
- [x] Create unconfirmed API contract holding document (`docs/API_CONTRACT.md`).
- [x] Create provisional frontend architecture document (`docs/ARCHITECTURE.md`).
- [x] Create staged task roadmap (`docs/TASKS.md`).
- [x] Create frontend gap analysis and readiness plan (`docs/FRONTEND_PLAN.md`).
- [x] Create two-laptop offline collaboration protocol (`docs/HANDOFF.md`).

---

## Stage 2: Requirements Clarification & Approvals

- [ ] `BLOCKED`: Obtain and verify official hackathon / organizer requirements.
- [ ] `BLOCKED`: Obtain and review the judging rubric to align scoring priorities.
- [ ] `BLOCKED`: Review and confirm proposed features (URL submission, reading controls, bookmarks, history).
- [ ] `BLOCKED`: Obtain confirmed API contract and connection details from backend developer.

---

## Stage 3: Frontend Foundation & Tooling Setup

- [ ] `BLOCKED` (Awaiting Stage 2 approvals): Select and initialize frontend framework (e.g., Next.js or Vite + React with TypeScript).
- [ ] `BLOCKED`: Configure Tailwind CSS and CSS Variable design token structure.
- [ ] `BLOCKED`: Configure code formatting, linting, and TypeScript strict mode.
- [ ] `BLOCKED`: Configure testing runner (Vitest / Playwright).
- [ ] `BLOCKED`: Set up environment variable structure (`.env.example`).

---

## Stage 4: Shared Components & Design System

- [ ] `BLOCKED`: Implement accessible foundational primitives (Button, Input, Modal, Dropdown, Slider, Drawer).
- [ ] `BLOCKED`: Create layout shell (Header, Sidebar/Drawer container, Main Reader Canvas).
- [ ] `BLOCKED`: Ensure WCAG AA compliance, ARIA landmark roles, and keyboard navigation.
- [ ] `BLOCKED`: Set up `prefers-reduced-motion` utility wrappers for transitions.

---

## Stage 5: Reader Implementation & Layout

- [ ] `BLOCKED`: Implement URL submission input with validation and loading states.
- [ ] `BLOCKED`: Build clean Reader Canvas rendering title, byline, date, and sanitized content blocks.
- [ ] `BLOCKED`: Implement reading settings toolbar (font family, font size, line height, column width).
- [ ] `BLOCKED`: Implement reading progress indicator and estimated reading time display.
- [ ] `BLOCKED`: Implement local bookmarks drawer and reading history tracker.

---

## Stage 6: Theme System Implementation

- [ ] `BLOCKED`: Implement dynamic CSS-variable theme engine with persistent user selection.
- [ ] `BLOCKED`: Build **Editorial Zen** theme (default experience).
- [ ] `BLOCKED`: Build theme family presets:
  - [ ] Japanese theme
  - [ ] Anime theme
  - [ ] Minimalist theme
  - [ ] Academia theme
  - [ ] Nature theme
  - [ ] Cyberpunk theme
  - [ ] Experimental theme
- [ ] `BLOCKED`: Verify layout consistency across theme transitions.

---

## Stage 7: API Integration & Backend Contract Alignment

- [ ] `BLOCKED` (Awaiting confirmed `API_CONTRACT.md`): Implement API client interface with error handling.
- [ ] `BLOCKED`: Build Mock API client with sample fixtures for testing edge cases (e.g., paywalls, short posts, heavy media).
- [ ] `BLOCKED`: Build Live API client connecting to backend laptop over local network.
- [ ] `BLOCKED`: Verify cross-laptop connectivity and CORS handling.

---

## Stage 8: Testing, Polish & Handoff

- [ ] `BLOCKED`: Run accessibility audit (axe-core or lighthouse) across desktop and mobile viewports.
- [ ] `BLOCKED`: Run unit and component integration tests.
- [ ] `BLOCKED`: Execute cross-laptop integration test checklist (see `docs/HANDOFF.md`).
- [ ] `BLOCKED`: Final demo script and submission package preparation.
