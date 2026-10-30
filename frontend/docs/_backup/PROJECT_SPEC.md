# SmallWebReader — Project Specification (DRAFT)

> [!WARNING]
> **DRAFT SPECIFICATION — AWAITING OFFICIAL APPROVAL**  
> All features and specifications in this document are proposed drafts. They are **not yet confirmed** against the organizer's official requirements or the judging rubric. Nothing in this document represents a finalized commitment until explicitly approved.

---

## 1. Product Overview

SmallWebReader is a focused, distraction-free reading application. It allows users to input any web URL, extracts the primary textual and media content, and renders it in an uncluttered, accessible, and aesthetically pleasing reading interface.

---

## 2. Proposed Features & Status

| Feature | Proposed Description | Status |
| :--- | :--- | :--- |
| **URL Submission** | An input interface allowing users to submit any article or web page URL for distraction-free extraction. | `[AWAITING APPROVAL]` |
| **Extracted Article Reading** | Clean reading canvas rendering parsed title, author, publish date, content body, formatted headings, blockquotes, code snippets, and images. | `[AWAITING APPROVAL]` |
| **Reading Controls** | Configurable reading settings including font family, font size, line height, column width / margins, and reading progress indicators. | `[AWAITING APPROVAL]` |
| **Theme Customization** | An aesthetic engine supporting dynamic theme switching across distinct visual identities. | `[AWAITING APPROVAL]` |
| **Bookmarks** | Ability to save articles for future reading, stored locally or synced with backend storage. | `[AWAITING APPROVAL]` |
| **Reading History** | Log of recently viewed and parsed URLs with timestamp and read progress. | `[AWAITING APPROVAL]` |
| **Estimated Reading Time** | Calculation and display of estimated reading time based on word count. | `[AWAITING APPROVAL]` |
| **Offline Cache / Export** | Optional ability to save articles for offline reading or export as Markdown / PDF. | `[AWAITING APPROVAL]` |

---

## 3. Initial Design Direction (Design Proposals)

> [!NOTE]
> The following items are **design proposals**, not confirmed judging requirements.

1. **Default Theme: Editorial Zen**
   - Warm, balanced typography evocative of high-end editorial publications and Japanese print minimalism.
   - High legibility, neutral off-white or muted warm paper background, crisp charcoal typography.
2. **Stable Layout Geometry**
   - The core reader structure (header bar, reading canvas width, toolbar placement, settings drawer) remains stable and consistent when themes are switched.
3. **Planned Theme Families**:
   - **Japanese**: Wabi-sabi minimalism, soft earth tones, vertical typography accents, paper textures.
   - **Anime**: Vibrant accents, clean modern cel-shaded lines, dynamic accents without cluttering text.
   - **Minimalist**: Pure monochrome, zero distraction, Swiss typography scale.
   - **Academia**: Classic serif (Garamond/Merriweather), deep ink tones, classic margin notes layout.
   - **Nature**: Forest greens, warm stone, organic rounded radii, serene palette.
   - **Cyberpunk**: Terminal neon, dark mode, monospaced accents, subtle glowing accents.
   - **Experimental**: Playful typographic and layout experiments that maintain readability.
4. **Motion & Interaction Philosophy**:
   - Subtle, purposeful micro-interactions (e.g., drawer slides, progress indicators, theme transition cross-fades).
   - High performance: zero layout thrashing, pure CSS transform/opacity transitions.
   - **Strict Accessibility**: Complete honoring of `prefers-reduced-motion` settings.

---

## 4. Open Questions & Approvals Needed

1. **Organizer Requirements**: What are the mandatory problem statement requirements and technical constraints?
2. **Judging Rubric**: How are criteria weighted (e.g., UI/UX design, performance, feature completeness, backend integration, innovation)?
3. **Extraction Architecture**: Does the backend perform extraction via Readability/trafilatura/Playwright, or does the frontend participate in fallback parsing?
4. **Data Persistence**: Is persistence strictly local (IndexedDB / localStorage) or backed by a database via backend APIs?
