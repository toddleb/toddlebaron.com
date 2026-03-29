# Style Guide Page & Production Hardening

**Date:** 2026-03-29
**Status:** Draft
**Scope:** New `/style-guide` page + production readiness fixes

---

## 1. Production Hardening (already implemented)

These fixes address the AICR production readiness review findings:

### P0 — Build Reproducibility
- Added `.nvmrc` pinning Node 22
- Build verified clean on Node 22.22.1

### P1 — Automated Quality Gates
- Added `npm run check` script (`astro check` for type/content validation)
- Installed `@astrojs/check` + `typescript` as dependencies

### P1 — Deploy/Rollback Documentation
- Replaced Astro starter README with real setup, deploy, rollback, and smoke test instructions

### P2 — SEO Metadata
- `SEOHead.astro` now generates per-route `canonical` and `og:url` using `Astro.url.pathname` + `Astro.site`

### Viewport Lock
- All three eras locked to `min-width: 1440px` (laptop viewport)
- Viewport meta tag set to `width=1440` (no responsive reflow)

### Not Yet Addressed
- **P2 — Observability:** Client-side error monitoring (Sentry, etc.) deferred to future work
- **CI pipeline:** No GitHub Actions workflow yet — `npm run check` is available but not automated

---

## 2. Style Guide Page

### Purpose

Developer reference page documenting the design system across all three eras (BBS, SGI IRIX, NeXTSTEP). Not a visitor-facing interactive editor — a practical page for the site maintainer to see all design tokens, colors, typography, and components at a glance.

### Location

- Route: `/style-guide`
- File: `src/pages/style-guide.astro`
- Era: None — standalone page with its own minimal layout (dark neutral background, no era chrome)

### Sections

#### 2.1 Era Overview

A three-column summary showing each era's identity:

| | BBS | SGI IRIX | NeXTSTEP |
|---|---|---|---|
| **Aesthetic** | CRT terminal, green-on-black | Window manager, Indigo workstation | Sharp geometry, dark chrome |
| **Font** | Cascadia Mono | Helvetica Neue | Inter |
| **Route** | `/` (home) | `/sgi` | `/nextstep` |

#### 2.2 Color Tokens

Display each era's CSS custom properties as rendered color swatches with their variable names and hex values.

**BBS tokens:**
- `--tf-purple-deep` through `--tf-gold` (brand palette)
- `--ansi-*` colors (16 ANSI-mapped terminal colors)
- `--bbs-border-color`, `--bbs-accent`, `--bbs-heading`

**SGI IRIX tokens:**
- `--sgi-primary`, `--sgi-secondary` (brand)
- `--sgi-sky-dark/light` (gradient endpoints)
- `--sgi-widget`, `--sgi-widget-light/dark` (3D chrome)
- `--sgi-surface`, `--sgi-content-bg`, `--sgi-text`, `--sgi-text-muted`
- 6 color schemes shown as mini swatch rows: indigo (default), desert, ocean, midnight, rosewood, slate. Each row shows the scheme's primary/secondary/widget/surface values side by side.

**NeXTSTEP tokens:**
- `--nx-chrome-hi/mid/lo` (chrome gradient)
- `--nx-surface`, `--nx-border`, `--nx-border-dark`
- `--nx-accent-blue/green/amber/red`
- `--nx-text-primary/secondary/muted`
- `--nx-terminal-bg/green/prompt`

#### 2.3 Typography

Show each era's font stack with sample text at key sizes:
- BBS: monospace at `--bbs-font-size` (20px default)
- SGI: Helvetica Neue at various window title/body sizes
- NeXTSTEP: Inter at 14px body, 20px h1, 16px h2

#### 2.4 Component Specimens

Static rendered examples of key UI elements from each era:
- **BBS:** Terminal text with ANSI colors, menu items, status bar, hardware chrome
- **SGI:** Window titlebar + controls, toolchest menu, scrollbar, 3D outset/inset borders
- **NeXTSTEP:** Window chrome, dock item, shelf item, button states

Each specimen is a small, self-contained HTML/CSS snippet rendered inline — not a live component. This keeps the page simple and avoids importing era-specific JS.

#### 2.5 Shared Engine Modules

A reference list of shared engine modules (`src/engine/`) with brief descriptions:
- `audio.ts` — Web Audio API synth engine
- `time-of-day.ts` — `body[data-time]` attribute system
- `ambient.ts` — Background ambiance per era
- `typing-sounds.ts` — Keyboard/UI sound effects
- `weather.ts` — Rain/weather system
- `seasonal.ts` — Seasonal decorations

### Implementation Approach

- Single Astro page, no framework islands needed (all static HTML/CSS)
- Reads CSS custom property values at build time by importing the theme CSS files
- Color swatches rendered as `<div>` elements with inline `background-color`
- Uses a minimal neutral layout (not BBS, SGI, or NX)
- Dark background (`#1a1a1e`) with light text, monospace font for token names

### Layout

```
┌─────────────────────────────────────────────┐
│  toddlebaron.com / style guide              │
├─────────────────────────────────────────────┤
│                                             │
│  ERA OVERVIEW                               │
│  ┌──────────┬──────────┬──────────┐         │
│  │   BBS    │   SGI    │ NeXTSTEP │         │
│  └──────────┴──────────┴──────────┘         │
│                                             │
│  COLOR TOKENS                               │
│  ┌──────────────────────────────────┐       │
│  │ BBS Palette                      │       │
│  │ [■] --tf-purple-deep  #4A1A7A   │       │
│  │ [■] --tf-purple       #7B2FBE   │       │
│  │ ...                              │       │
│  ├──────────────────────────────────┤       │
│  │ SGI IRIX Palette                 │       │
│  │ [■] --sgi-primary     #6B3FA0   │       │
│  │ ...                              │       │
│  ├──────────────────────────────────┤       │
│  │ NeXTSTEP Palette                 │       │
│  │ [■] --nx-chrome-hi    #4a4a50   │       │
│  │ ...                              │       │
│  └──────────────────────────────────┘       │
│                                             │
│  TYPOGRAPHY                                 │
│  ...                                        │
│                                             │
│  COMPONENTS                                 │
│  ...                                        │
│                                             │
│  ENGINE MODULES                             │
│  ...                                        │
└─────────────────────────────────────────────┘
```

### Files to Create/Modify

| Action | File | Description |
|--------|------|-------------|
| Create | `src/pages/style-guide.astro` | The style guide page |
| Create | `src/layouts/Neutral.astro` | Minimal era-neutral layout |

No existing files need modification beyond what was already changed for production hardening.
