# Frontend Implementation Plan & Readiness Assessment

> [!NOTE]
> **Implementation Status: NOT YET BEGUN**  
> This document details the component architecture, design philosophy, accessibility standards, and unresolved technical decisions prior to implementation.

---

## 1. Readiness & Inspection Baseline

- **Workspace Inspection**: The repository contains documentation only. No application code, build configurations, or dependencies have been installed.
- **Environment Context**: Standalone frontend environment on Laptop 1. Laptop 2 develops the backend independently. No GitHub repository is used.
- **Implementation Gate**: Coding will not start until Stage 2 (Requirements) and Stage 3 (API Contract) from `docs/TASKS.md` are unlocked.

---

## 2. Design System & Theming Philosophy

1. **Default Experience: Editorial Zen**
   - Clean, high-legibility reading surface emphasizing typographic proportion, generous line height, and subdued contrast.
   - Off-white / warm paper background paired with deep ink/charcoal typography.
2. **Layout Geometry Preservation**:
   - The structural container, header bar, controls dock, and reading canvas width must remain strictly stable when themes change.
   - Theme changes should modify color tokens, font families, and border accents via CSS variables without triggering reflows.
3. **Proposed Aesthetic Families (Provisional)**:
   - Japanese (wabi-sabi minimalism, soft earth tones)
   - Anime (crisp contrast, stylized headers)
   - Minimalist (monochrome, zero-chrome reading)
   - Academia (traditional serif, classic proportions)
   - Nature (organic stone and foliage tones)
   - Cyberpunk (high-contrast dark mode, monospaced accents)
   - Experimental (novel typographic grids preserving legibility)
4. **Motion & Interaction Rules**:
   - Transitions must use hardware-accelerated CSS properties (`transform`, `opacity`).
   - Must strictly respect `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions.

---

## 3. Accessibility Standards (WCAG 2.1 AA)

- **Semantic HTML**: Proper use of `<main>`, `<header>`, `<article>`, `<nav>`, and `<aside>` landmark elements.
- **Keyboard Navigation**: All interactive elements (inputs, buttons, sliders, modals) must be fully navigable and operable via `Tab`, `Enter`, `Escape`, and arrow keys.
- **Focus Indicators**: Visible, high-contrast focus rings on all active elements.
- **Color Contrast**: Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text across all themes.
- **Screen Reader Support**: Appropriate `aria-label`, `aria-expanded`, `aria-live`, and `role` attributes on controls and dynamic state containers.

---

## 4. Provisional Component Hierarchy

*Planned component organization (framework-neutral structure):*

```text
src/
├── components/
│   ├── reader/
│   │   ├── ReaderCanvas      # Renders sanitized title, byline, date, and article body
│   │   ├── ReaderToolbar     # Controls dock (font, size, width, theme)
│   │   ├── ReadingProgress   # Top scroll progress bar
│   │   └── ArticleMetadata   # Byline, domain, estimated reading time
│   ├── controls/
│   │   ├── FontSelector      # Serif, Sans, Mono switcher
│   │   ├── SizeSlider        # Font size and line spacing slider
│   │   ├── WidthSlider       # Reading canvas max-width control
│   │   └── ThemeSelector     # Theme switcher interface
│   ├── panels/
│   │   ├── UrlSubmitBar      # URL input with validation and submit button
│   │   ├── BookmarksDrawer   # Saved articles drawer (if in scope)
│   │   └── HistoryDrawer     # Reading history list (if in scope)
│   └── ui/
│       ├── Button            # Accessible button primitive
│       ├── Input             # Accessible text input primitive
│       ├── Slider            # Accessible range slider primitive
│       └── Modal / Drawer    # Accessible dialog / slide-over primitive
├── services/
│   ├── api.ts                # Abstract API client interface
│   ├── mockClient.ts         # Mock implementation for isolated testing
│   └── liveClient.ts         # Real HTTP fetch client calling Laptop 2
├── store/
│   ├── useReaderSettings     # Theme and typography preferences (persisted locally)
│   └── useArticleState       # Current article content, loading, and error states
└── styles/
    └── themes.css            # CSS variable definitions for all theme tokens
```

---

## 5. Unresolved Implementation Decisions

The following choices must be approved before coding commences:

1. **Framework Selection**:
   - Option A: React + Vite SPA (lightweight, rapid local dev, trivial static asset serving).
   - Option B: Next.js App Router (built-in API routing, server-side capabilities).
2. **HTML Sanitization Responsibility**:
   - Confirm whether backend delivers pre-sanitized HTML, or if the frontend must also include a client-side sanitizer (e.g., DOMPurify) as defense-in-depth.
3. **Scope of Bookmarks & History**:
   - Determine whether bookmarks/history are needed for the hackathon MVP, and whether they live in browser `localStorage`/IndexedDB or backend storage.
