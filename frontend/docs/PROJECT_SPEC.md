# SmallWebReader — Project Specification (DRAFT)

> [!WARNING]
> **DRAFT SPECIFICATION — AWAITING OFFICIAL HACKATHON CONFIRMATION**  
> All features, architectures, and design ideas in this document are **provisional proposals**. They have **not yet been verified** against the official hackathon problem statement or judging rubric. No feature in this document is considered mandatory until approved by the team.

---

## 1. Product Overview

SmallWebReader is an accessible, distraction-free reading web application. It takes an external article or web page URL, extracts the primary article text and relevant media while filtering out clutter, and renders the content in a clean, legible, and customizable interface.

---

## 2. Proposed Features & Status Registry

The following table distinguishes core proposals from speculative features. **None are finalized.**

| Feature Area | Proposed Capability | Status | Notes |
| :--- | :--- | :--- | :--- |
| **URL Submission** | Clean input field supporting URL paste, validation, and submit-on-Enter. | `[PROVISIONAL - PROPOSAL]` | Baseline interaction for web reading. |
| **Article Extraction** | Server-side or client-assisted parsing of title, byline, date, lead image, and article body. | `[PROVISIONAL - PROPOSAL]` | Extraction engine details under discussion with backend team. |
| **Clean Reader View** | Typography-focused reading canvas rendering sanitized headings, paragraphs, lists, and images. | `[PROVISIONAL - PROPOSAL]` | Must support WCAG 2.1 AA readability. |
| **Reading Controls** | Configurable font family (Serif/Sans/Mono), font size scaling, line spacing, and reading width. | `[PROVISIONAL - PROPOSAL]` | Unconfirmed whether required by rubric. |
| **Theme System** | Dynamic theming (Editorial Zen default, plus stylistic presets). | `[PROVISIONAL - DESIGN PROPOSAL]` | Design proposal only; not confirmed as mandatory. |
| **Bookmarks** | Ability to save articles for subsequent reading sessions. | `[PROVISIONAL - UNCONFIRMED]` | Unconfirmed if storage is client-only or backend DB. |
| **Reading History** | Log of previously parsed articles and reading progress. | `[PROVISIONAL - UNCONFIRMED]` | Unconfirmed if required by organizers. |
| **Estimated Reading Time**| Word-count based calculation displayed in article header. | `[PROVISIONAL - UNCONFIRMED]` | Nice-to-have feature proposal. |
| **Offline Cache / Export**| Export to Markdown/PDF or client-side offline storage. | `[PROVISIONAL - UNCONFIRMED]` | Do not assume mandatory. |
| **Accounts / Analytics**  | User accounts, cloud sync, or telemetry tracking. | `[NOT APPROVED / OUT OF SCOPE]` | Do not implement without explicit organizer mandate. |
| **AI Summaries / Q&A**    | LLM-powered summarization or interactive article Q&A. | `[NOT APPROVED / OUT OF SCOPE]` | Do not implement unless mandated by hackathon track. |

---

## 3. Design Direction (Provisional Proposals)

> [!NOTE]
> These aesthetics are design proposals to explore, **not** confirmed judging requirements.

1. **Default Theme Proposal: Editorial Zen**
   - High-contrast, warm editorial typography reminiscent of classic paper publications and Japanese minimalist prints.
   - Neutral off-white or soft warm background with dark charcoal typography to minimize eye strain.
2. **Planned Theme Exploration Families**:
   - **Japanese**: Earth tones, subtle paper texture cues, clean vertical balance.
   - **Anime**: Crisp cel-shaded accents, vibrant contrast, modern typographic styling.
   - **Minimalist**: High-contrast monochrome, ultra-reduced chrome, Swiss typography grid.
   - **Academia**: Deep ink tones, classic serif hierarchy, traditional margins.
   - **Nature**: Calming forest and stone tones, organic rounded corners.
   - **Cyberpunk**: High-contrast dark mode with neon accents and monospaced metadata.
   - **Experimental**: Experimental typographic scales retaining core legibility.
3. **Core Geometric Stability**:
   - Switching themes must adjust color tokens, borders, and typography without shifting margins, jumping scroll positions, or altering structural reader layout.
4. **Motion & Interaction Philosophy**:
   - Transitions must be brief, hardware-accelerated (`transform`, `opacity`), and subtle.
   - Strict adherence to `@media (prefers-reduced-motion: reduce)`.

---

## 4. Critical Security & Boundary Constraints

Any web extraction application introduces serious security attack vectors. SmallWebReader mandates these non-negotiable boundaries:

1. **SSRF & Network Boundary Protection**:
   - The backend fetcher must prohibit requests to:
     - Loopback addresses (`127.0.0.1`, `::1`, `localhost`)
     - Private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
     - Link-local and cloud metadata addresses (`169.254.169.254`, `fe80::/10`)
   - Safe DNS resolution and redirect verification to prevent DNS-rebinding attacks.
2. **Content Sanitization**:
   - All extracted HTML must pass strict XSS filtering (stripping `<script>`, `<iframe>`, inline event handlers, `javascript:` URIs) prior to rendering.
3. **Resource Exhaustion Limits**:
   - Strict fetch timeouts (e.g., max 5–10 seconds).
   - Maximum download size caps (e.g., max 2MB HTML payload) to prevent denial of service.
4. **Error Masking**:
   - Never expose internal IPs, network topology, backend stack traces, or credentials in client error messages.

---

## 5. Unresolved Requirements Requiring Confirmation

1. What are the official problem statement requirements and technical constraints from hackathon organizers?
2. What is the official judging rubric and scoring weighting?
3. What is the agreed endpoint name and schema between frontend and backend (`/api/read` vs `/api/extract`)?
4. Where does persistence reside (browser localStorage/IndexedDB vs backend database)?
