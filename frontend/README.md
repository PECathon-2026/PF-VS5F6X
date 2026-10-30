# SmallWebReader

SmallWebReader is a distraction-free web reader designed to transform noisy, clutter-heavy web pages into clean, highly readable, and customizable reading experiences.

> [!NOTE]
> **Current Status: Documentation Consolidation & Requirements Phase**  
> Neither the frontend nor the backend application code has been implemented yet. This repository currently contains the canonical documentation set, architectural proposals, task tracking, and cross-machine collaboration protocols.

---

## 1. Project Overview

The modern web is inundated with intrusive overlays, trackers, auto-playing videos, sticky banners, and aggressive ad layouts. SmallWebReader strips away distractions to present core article content in a comfortable, customizable reading canvas featuring refined typography and accessible aesthetics.

---

## 2. Planned Architecture & Technology Stack (Provisional)

*Final technical stack is subject to team approval and alignment with official hackathon requirements:*

- **Frontend (Laptop 1)**: Modern component-based web framework (proposals under consideration: React + Vite SPA or Next.js App Router), paired with utility-first styling (e.g., Tailwind CSS with CSS variables for dynamic theming) and accessible UI primitives.
- **Backend (Laptop 2)**: Lightweight web extraction service responsible for secure fetching, SSRF prevention, HTML parsing, content extraction, and content sanitization.
- **Inter-Machine Communication**: Direct local network HTTP/REST requests between laptops without an intermediary GitHub repository.

---

## 3. Prerequisites

When implementation begins, developers will require:

- **Node.js**: v18.x or v20.x LTS
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+)
- **Local Network Sharing**: Wi-Fi network, mobile hotspot, or USB drive for sharing patches, git bundles, and conducting local cross-device API calls (see `docs/HANDOFF.md`).

---

## 4. Canonical Documentation Structure

```text
SmallWebReader/
├── README.md                  # Project overview, prerequisites, and setup status
├── AGENTS.md                  # Operational standards and agent constraints
└── docs/
    ├── PROJECT_SPEC.md        # Product specification, feature proposals, and blockers
    ├── API_CONTRACT.md        # Canonical API contract exchange (currently UNCONFIRMED)
    ├── ARCHITECTURE.md        # System topology, responsibilities, and security model
    ├── TASKS.md               # Deduplicated, staged roadmap with explicit blockers
    ├── FRONTEND_PLAN.md       # Frontend component plan, design, and UI choices
    ├── HANDOFF.md             # Two-laptop offline collaboration and verification guide
    ├── TEST_PLAN.md           # Security, contract, extraction, and UI testing suite
    └── DECISIONS.md           # Decision log: confirmed, proposed, unresolved, & conflicts
```

---

## 5. Next Steps

Before coding begins, the team must confirm the official problem statement, judging rubric, and finalized API contract. Review `docs/TASKS.md` and `docs/DECISIONS.md` for current blockers and prerequisites.
