# Proposed Architecture — SmallWebReader

> [!WARNING]
> **PROVISIONAL ARCHITECTURE**  
> This architecture is a proposal and remains provisional until the official project requirements, judging criteria, and backend API contracts are provided and reviewed.

---

## 1. System Topology & Separation of Concerns

```
+-------------------------------------------------------------+
|                      LAPTOP 1: FRONTEND                     |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                   UI & Layout Layer                   |  |
|  |  (Reader Canvas, Controls Toolbar, Theme Engine)      |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|  +-------------------------------------------------------+  |
|  |                   State Management                    |  |
|  |  (Reader Settings, Active Article, Offline Cache)     |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|  +-------------------------------------------------------+  |
|  |               API Client / Network Layer              |  |
|  |   - Mock Client (for isolated local development)      |  |
|  |   - Live HTTP Client (configured via .env baseURL)    |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
                             |
                   HTTP / REST (Local LAN)
                             |
+-------------------------------------------------------------+
|                      LAPTOP 2: BACKEND                      |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                   Web Extraction API                  |  |
|  |    (HTML fetching, article parsing, sanitization)     |  |
|  +-------------------------------------------------------+  |
|  +-------------------------------------------------------+  |
|  |             Persistence Layer (Optional)              |  |
|  |              (Bookmarks, History, Cache)              |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

---

## 2. Frontend Layering (Proposed)

1. **Presentation / Component Layer**:
   - **Reader Canvas**: Renders parsed title, metadata, and sanitized article blocks with optimal typographic spacing.
   - **Control Dock / Floating Toolbar**: Quick actions for adjusting font size, line spacing, layout width, theme switcher, and bookmark toggle.
   - **Navigation & Drawer Panels**: Side panels for reading history, bookmarks, and advanced settings.

2. **Theming & Style System**:
   - Central CSS variable tokens for background, foreground, surface, accent, muted, border, and typography.
   - Dynamic theme classes applied at the root container or `<body>`.
   - Default theme: **Editorial Zen**.
   - Planned theme presets: Japanese, Anime, Minimalist, Academia, Nature, Cyberpunk, Experimental.
   - Motion safety: All transitions and animations wrapped with `prefers-reduced-motion` guards.

3. **State & Local Persistence Layer**:
   - **Reader Preferences Store**: Stores user theme, font size, font family, line height, reading width preferences in `localStorage`.
   - **Active Document State**: Holds current URL, parsed article payload, loading status, and error states.
   - **Local Cache / History**: Client-side storage fallback for bookmarks and reading history if backend persistence is not present.

4. **Service & API Client Layer**:
   - Single entry-point API service implementing an interface.
   - Supports switching between:
     - `LiveApiClient`: Calls the backend laptop using `VITE_API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL`.
     - `MockApiClient`: Feeds fixture data during offline UI development before backend integration.
   - Graceful error boundary and connection diagnostic handling.

---

## 3. Boundary Guarantees

- **Sanitization & Safety**: All extracted HTML or rich text must be sanitized before rendering to eliminate XSS risks.
- **Contract Decoupling**: Frontend UI components do not interact directly with raw network responses; they consume domain-mapped TypeScript interfaces defined in the client layer.
- **Responsive Layout Stability**: Core reader width, scroll position, and navigation landmarks remain stable when changing themes.
