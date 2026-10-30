# SmallWebReader — Agent Guidelines & Operating Rules

This document establishes the project-wide operational rules and behavioral standards for any AI agent or contributor working on **SmallWebReader**.

---

## 1. Role & Environment Boundaries

- **Separated Workspaces**: The frontend and backend are developed across two separate laptops. There is currently no shared GitHub repository.
- **Scope Discipline**: Implement only approved components, interfaces, and user flows. Do not invent features, endpoints, request fields, response structures, or database requirements.
- **Specification First**: Before writing or modifying any code, read the canonical documents:
  - `README.md`
  - `docs/PROJECT_SPEC.md`
  - `docs/API_CONTRACT.md`
  - `docs/ARCHITECTURE.md`
  - `docs/TASKS.md`
  - `docs/FRONTEND_PLAN.md`
  - `docs/HANDOFF.md`
  - `docs/TEST_PLAN.md`
  - `docs/DECISIONS.md`

---

## 2. Code & Document Preservation

- **Inspect First**: Always inspect the workspace and verify the existing directory structure, configurations, and source code before touching files.
- **Preserve Existing Work**: Do not delete, overwrite, or refactor existing code or documentation without explicit justification and prior confirmation.
- **Relative Paths Only**: Never embed machine-specific absolute file paths (e.g., `/Users/...` or `C:\...`) or credentials into code or documentation. Use relative repository paths.
- **Handle Conflicts Transparently**: If two documents or requirements conflict, do not silently pick one. Record the conflict in `docs/DECISIONS.md` and await human alignment.

---

## 3. Technology Neutrality & Framework Selection

- **No Unapproved Assumptions**: The application framework (e.g., Vite + React vs. Next.js vs. other) remains provisional until confirmed by the team. Agents must keep architecture notes and shared types technology-neutral until an official stack selection is approved.
- **No Premature Implementation**: Do not scaffold projects, generate boilerplate, or install dependencies until the project foundation and requirements gates in `docs/TASKS.md` are unlocked.

---

## 4. UI/UX, Accessibility & Responsiveness

- **Accessibility by Default**: All interfaces must target WCAG 2.1 AA compliance, include semantic landmarks, ensure complete keyboard navigation, and support screen readers with proper ARIA attributes.
- **Motion Safety**: Respect `prefers-reduced-motion`. Keep animations subtle, performant (hardware-accelerated `transform` and `opacity`), and non-distracting.
- **Responsive Layout**: Design must adapt smoothly across mobile, tablet, and desktop viewports.
- **Stable Reader Geometry**: Theme toggling must never cause disruptive layout shifts or jumpy scrolling on the reading canvas.

---

## 5. Security & Safety First

- **URL Fetching & SSRF Prevention**: Never allow unrestricted backend fetching of arbitrary URLs. Block loopback, private RFC 1918/RFC 4193 addresses, link-local metadata addresses, and validate redirects.
- **HTML Sanitization**: All external article content must be thoroughly sanitized against XSS before DOM rendering.
- **Data Hygiene**: Error messages must never leak internal IP addresses, stack traces, tokens, or environment variables.

---

## 6. Verification & Honest Reporting

- **Real Test Results Only**: Report only actual commands executed and their genuine outputs. Never fabricate test passes or claim mock validations as live end-to-end verifications.
- **Failure Transparency**: If a test or build fails, report the exact failure message, root cause, and proposed next action.
- **Keep Documentation Synced**: After completing any verified stage, update `docs/TASKS.md`, `docs/DECISIONS.md`, and relevant plans immediately.
