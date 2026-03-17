# NeXTSTEP Color Theme — Design Spec

> **Date:** 2026-03-17
> **Status:** Draft
> **Site:** toddlebaron.com (Astro 6)
> **Theme:** NeXTSTEP Color — a personalized, colorized take on the NeXTSTEP/OPENSTEP desktop

---

## 1. Overview

A third theme for toddlebaron.com that reimagines the NeXTSTEP operating system with a modern color palette and Todd's personality baked in. This is not a museum recreation — it's "the NeXT that kept evolving into 2026 without Apple buying them."

The site already has two themes: BBS (terminal) and SGI IRIX (graphical desktop). NeXTSTEP Color joins as the third era in the era-switcher rotation.

### Goals

- Immediately recognizable as NeXTSTEP to anyone who used one
- Modernized with color depth, clean type, and smooth rendering
- Todd's personality and humor woven into every surface
- Reuses existing content (6 pages + 2 blog posts) without modification
- Shares `wm.ts` window manager with SGI theme (new layout file — see Architecture)

### Non-Goals

- Pixel-perfect NeXTSTEP recreation (that's what emulators are for)
- New content pages (content is shared across all themes)
- Server-side functionality (static Astro site)

---

## 2. Theme Architecture

### File Structure

```
src/pages/
└── nextstep.astro           # Page entry point (like sgi.astro for SGI theme)

src/layouts/
└── NXDesktop.astro          # NeXTSTEP desktop layout (new — Desktop.astro is SGI-specific)

src/themes/nextstep/
├── theme.css                # All NeXTSTEP visual tokens and chrome styles
├── NXWindow.astro           # Window component with vertical title bar
├── NXMenuBar.astro          # Top menu bar
├── NXShelf.astro            # Right-side navigation shelf
├── NXDock.astro             # Bottom application dock
├── NXMillerBrowser.astro    # Miller column file browser (projects)
├── NXTerminal.astro         # Terminal window with shell integration
├── NXMailReader.astro       # Split-pane blog reader
├── NXDocViewer.astro        # Document viewer (resume + skills tabs)
├── NXInfoPanel.astro        # Status grid panel (about/home)
├── NXMuseum.astro           # Timeline browser (computing history)
├── nx-icons.ts              # Icon mappings for shelf, dock, file types
└── schemes.ts               # Color scheme variants (if needed later)

src/data/
├── projects.ts              # Structured project data for Miller Browser (new)
└── playlist.ts              # Static hardcoded music playlist for Now Playing (new)
```

**Note on Desktop.astro:** The existing `Desktop.astro` layout is SGI-specific — it hard-codes SGI CSS imports, class names, color scheme cookies, and audio paths. Rather than refactoring it (which risks breaking the working SGI theme), the NeXTSTEP theme gets its own `NXDesktop.astro` layout. Both layouts import and use `wm.ts` for window management.

### Integration Points

| Existing Module | How NeXTSTEP Uses It |
|----------------|---------------------|
| `NXDesktop.astro` (new) | Layout wrapper — renders desktop bg, positions NeXT components |
| `wm.ts` | Window manager — drag, z-order, minimize, restore, localStorage persistence. Extended with: vertical title bar drag zone, window shade (double-click collapse) |
| `shell.ts` | Terminal command engine — reused as-is for the NXTerminal window |
| `era-switcher.ts` | Registers `nextstep` as third theme option |
| `src/content/pages/*.md` | Content rendered inside NeXT windows (same markdown, different chrome) |
| `src/content/blog/*.md` | Blog posts rendered in NXMailReader split-pane |

### wm.ts Extensions

New behaviors added to the shared window manager for NeXTSTEP:

1. **Vertical title bar drag** — drag zone is the 22px-wide left bar instead of the horizontal top bar. The wm.ts fires on `[data-drag-handle]` data attributes — each theme puts that attribute on a different element, so no collision.
2. **Window shade** — double-click title bar text to collapse window to just the vertical bar + title. Double-click again to restore. Adds `shaded: boolean` to `WindowState` in wm.ts.
3. **Dock bounce** — when a window opens, wm.ts emits a `wm:window-opened` event that the dock component listens to for the bounce animation.

These are additive — they don't break SGI's existing horizontal title bar behavior.

### Content Prerequisites

- **`src/data/projects.ts`** — The NXMillerBrowser requires structured project data organized by category (Enterprise, Creative, Military, Open Source). This file must be authored before the Miller Browser is functional. Each entry: `{ id, name, category, description, techStack, status, url? }`.
- **`src/data/playlist.ts`** — The Music "Now Playing" easter egg uses a static hardcoded playlist (no external API). Format: `{ artist, album, tracks: string[] }[]`.
- **Godzilla photos** — The "Kaiju Registry" easter egg window displays collection/tattoo photos. If photos are not available at build time, use placeholder cards with descriptions instead. Photos can be added to `public/images/kaiju/` when ready.

---

## 3. Visual Design System

### Color Tokens

```css
:root[data-theme="nextstep"] {
  /* Chrome */
  --nx-chrome-hi:    #4a4a50;
  --nx-chrome-mid:   #3a3a40;
  --nx-chrome-lo:    #2a2a2e;
  --nx-surface:      #333338;
  --nx-border:       #555555;
  --nx-border-dark:  #1a1a1e;

  /* Desktop */
  --nx-desktop-bg:   #1e1e22;
  --nx-desktop-grid: rgba(255,255,255,0.015);

  /* Accents */
  --nx-accent-blue:  #6aafee;
  --nx-accent-green: #6aee6a;
  --nx-accent-amber: #ccaa44;
  --nx-accent-red:   #cc4444;

  /* Window Buttons (derived from accents, named for clarity) */
  --nx-btn-close:    #cc4444;
  --nx-btn-minimize: #ccaa44;
  --nx-btn-resize:   #4a8a4a;

  /* Text */
  --nx-text-primary:   #e0e0e0;
  --nx-text-secondary: #999999;
  --nx-text-muted:     #666666;

  /* Terminal */
  --nx-terminal-bg:    #1a1a1e;
  --nx-terminal-green: #00aa00;
  --nx-terminal-prompt:#6aafee;
}
```

### Typography

| Context | Font | Size | Notes |
|---------|------|------|-------|
| UI chrome (menus, labels, buttons) | Inter 500 | 11-12px | Letter-spacing on uppercase labels |
| Content body | Inter 400 | 14px | Larger for readability |
| Content headings | Inter 600 | 16-20px | |
| Terminal | Courier New | 13px | Monospace, `--nx-terminal-green` |
| Menu bar clock | Inter 400 | 11px | Tabular numerals |

### Chrome Design Language

- **Gradients:** Subtle linear gradients on all chrome (top-lighter to bottom-darker). Never flat, never glossy.
- **Corners:** Square. Zero border-radius. This is NeXT.
- **Borders:** 1px solid everywhere. Windows have `box-shadow: 2px 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`.
- **Scrollbars:** Custom-styled. 14px wide, square thumb, arrow buttons at both ends, left border on track.
- **Buttons:** Gradient background, 1px border, pressed state darkens.

---

## 4. Component Specifications

### 4.1 NXWindow

The core building block. Every content page renders inside one.

```
┌──┬──────────────────────────────────────┐
│×│  [Toolbar: View1 | View2 | View3]   │
│▽│──────────────────────────────────────│
│ │                                      │
│T│        Window Body                   │
│i│        (scrollable)                  │
│t│                                      │
│l│                                      │
│e│                                      │
│ │                                      │
│▢│                                      │
└──┴──────────────────────────────────────┘
```

- **Vertical title bar:** 22px wide. Contains close (`--nx-btn-close`), minimize (`--nx-btn-minimize`), title text (vertical, rotated), resize (`--nx-btn-resize`) at bottom.
- **Toolbar:** Optional. Horizontal row of toggle buttons below the title bar top edge.
- **Body:** Scrollable content area. Background: `--nx-chrome-lo`.
- **Drag:** Title bar area (`[data-drag-handle]`). Cursor changes to grab on hover.
- **Shade:** Double-click title text collapses to 22px-wide bar only.

### 4.2 NXMenuBar

Fixed at top, 24px tall. Left-aligned items: NeXT (bold), Info, Workspace, Tools, Services, Windows. Right-aligned: live clock (`Mon Mar 17 14:47 CST`).

Menu dropdowns are stretch goals — for v1, items can link to actions (Info opens About window, Workspace resets layout, etc.).

### 4.3 NXShelf (Right Side)

Primary page navigation. Fixed right column, 72px wide. Stacked square tiles (56x56) with icon + 7px label.

Items:
1. Home (active indicator: 3px blue bar on left edge)
2. Resume (clicking opens NXDocViewer; the Skills tab lives here)
3. Projects
4. Blog
5. Museum (Computing History)
6. Contact

**Active state tracking:** The shelf listens to `wm:window-focused` events from wm.ts. When a window gains focus, the shelf updates the active indicator to match. If no window matches a shelf item (e.g., an easter egg window), no shelf item is highlighted.

Click opens the corresponding window and brings it to front. If already open, just brings to front.

### 4.4 NXDock (Bottom)

Application/personality shortcuts. Fixed bottom bar, 64px tall. Horizontal tiles.

**Functional tiles:**
- Workspace (file manager)
- Terminal

**Personality tiles:**
- Fractals (MineTheGap gallery)
- Godzilla (Kaiju Registry — uses photos from `public/images/kaiju/` or placeholder cards)
- Music (Now Playing — static playlist from `src/data/playlist.ts`)

**System tiles:**
- Prefs (color scheme picker / era switcher)
- Recycler ("0 regrets")

Running apps show a 4px blue dot below the tile. Tiles bounce once on `wm:window-opened` event.

### 4.5 NXMillerBrowser (Projects)

NeXT's signature contribution to UI design. Three-column drill-down:

```
┌──────────┬──────────┬──────────────────┐
│ Category │ Project  │ Detail Preview   │
│──────────│──────────│──────────────────│
│▸Enterpris│▸AICR     │ AICR Platform v3 │
│ Creative │ Prizym   │ Enterprise AI    │
│ Military │ BHG      │ governance...    │
│ Open Src │ ISPM     │                  │
│          │          │ Status: ● LIVE   │
└──────────┴──────────┴──────────────────┘
```

**Data source:** `src/data/projects.ts` — structured array with category, name, description, tech stack, status. Must be authored as a Phase 2 prerequisite.

- Click a row to populate the next column
- Selected row highlighted with `--nx-accent-blue` background
- Third column shows a preview: name, description, tech stack, status badge
- Click the detail to open a full project window

### 4.6 NXTerminal

Reuses `shell.ts` with NeXT-styled chrome.

**Built-in commands (additions to existing shell):**

| Command | Output |
|---------|--------|
| `whoami` | Todd LeBaron — builder of things that matter since 1994 |
| `uptime` | Calculated from career start date |
| `cat resume` | Formatted resume output |
| `ls projects` | Project listing with status indicators |
| `fortune` | Random quote from fortunes.ts |
| `make coffee` | ASCII coffee cup + "Brewing..." progress bar |
| `deploy godzilla` | WARNING: Kaiju deployment not authorized in production |
| `man todd` | Bio formatted as Unix man page |
| `mail` | Opens contact form in terminal mode |
| `help` | Lists available commands |

Prompt: `lebaron@cube:~$ `

### 4.7 NXMailReader (Blog)

Split-pane reader inspired by NeXT's original Mail.app:

```
┌──────────────────┬──────────────────────┐
│ Post List        │ Post Content         │
│──────────────────│──────────────────────│
│▸Building SGI... │ # Building the SGI   │
│ Hello World      │ Desktop Theme        │
│                  │                      │
│                  │ When I started this  │
│                  │ project, I wanted... │
└──────────────────┴──────────────────────┘
```

Left pane: post titles with dates, sorted newest first. Right pane: rendered markdown.

### 4.8 NXDocViewer (Resume)

Scrollable document window with toolbar switching between views:
- **Timeline:** Career as chronological entries (Navy → USAF AI → STRATCOM → Consulting)
- **Skills:** Categorized skill matrix with proficiency indicators (this is the skills view — no separate Skills window)
- **Education:** Physics degree, military training, certifications

### 4.9 NXInfoPanel (Home/About)

The default landing window. Contains:
- Bio header: avatar (Godzilla emoji or custom SVG), name, title, tags
- Status grid (2x2): Years Active, Active Projects, Coffee Status, 40K Backlog
- Rotating quote (from fortunes.ts)

### 4.10 NXMuseum (Computing History)

Timeline browser. Each era is a "folder" that expands to show machines:
- Apple IIe era
- NeXT Cube / NeXTstation era
- SGI era
- Sun SPARC era
- BeOS era
- Modern era

Click a machine to see description + era context.

---

## 5. Desktop Background

Dark gradient with subtle personality:
- Base: `#1e1e22` with radial gradient hints of green (fractals) and purple (cosmic)
- Faint 32px grid overlay (the NeXT desktop had a subtle texture)
- No icons on the desktop itself — all navigation through shelf/dock

---

## 6. Interactions & Animations

| Interaction | Animation |
|-------------|-----------|
| Window open | Fade in + slight scale (0.95→1.0), 200ms ease-out |
| Window close | Fade out, 150ms |
| Window shade | Height collapse to title bar only, 200ms ease |
| Dock tile hover | translateY(-2px), 150ms |
| Dock tile bounce | translateY bounce on `wm:window-opened` (3 bounces, 400ms) |
| Shelf item hover | Scale 1.05, border-color brightens |
| Miller column select | Content slides in from right, 200ms |
| Terminal typing | Blinking cursor (1s step-end), output appears instantly |
| Menu bar clock | Updates every 60 seconds |

All animations respect `prefers-reduced-motion` — reduced to simple opacity fades.

---

## 7. Easter Eggs

| Trigger | What Happens |
|---------|-------------|
| Dock → Godzilla | Opens "Kaiju Registry" window with collection/tattoo photos (or placeholder cards if photos unavailable) |
| Dock → Fractals | Opens MineTheGap gallery window with renders |
| Dock → Music | "Now Playing" mini-window with static playlist from `src/data/playlist.ts` |
| Terminal → `make coffee` | ASCII art coffee cup, progress bar animation |
| Terminal → `deploy godzilla` | "WARNING: Kaiju deployment not authorized in production" |
| Terminal → `man todd` | Full man page bio |
| Terminal → `sudo rm -rf /` | "Nice try. Access denied. This isn't your first rodeo." |
| Dock → Recycler | Shows "0 regrets" |
| Menu → About NeXT | Credits: "toddlebaron.com · Astro 6 · inspired by NeXT Computer, Inc. 1988-1997" |
| 5 rapid clicks on NeXT menu | Hidden "developer tools" window with site stats |
| Konami code | Brief screen flash, all windows shake, "CHEAT MODE ACTIVATED" in terminal |

---

## 8. Mobile Adaptation

| Desktop Element | Mobile Treatment |
|----------------|-----------------|
| Windows | Full-width stacked cards, no overlap or drag |
| Shelf (right) | Bottom tab bar (5 items + "More") |
| Dock (bottom) | Items fold into "More" menu |
| Menu bar | Stays but collapses: "NeXT" brand + hamburger |
| Miller columns | Single column with back-arrow navigation |
| Terminal | Full-width, narrower but functional |
| Window shade | Swipe down to collapse |
| Desktop background | Simplified (no grid overlay) |

Breakpoint: 768px. Below that, mobile layout activates.

---

## 9. Accessibility

- All interactive elements keyboard-navigable (Tab through shelf, dock, windows)
- Focus indicators: 2px blue outline on focused elements
- `aria-label` on all icon-only buttons
- Window title announced via `aria-labelledby`
- `prefers-reduced-motion`: all animations become simple opacity transitions
- Minimum font size: 13px for body content (Todd's readability requirement)
- Color contrast: all text meets WCAG AA against its background

---

## 10. Implementation Phases

### Phase 1: Chrome & Layout (Core)
- `nextstep.astro` page entry point
- `NXDesktop.astro` layout
- theme.css with all tokens
- NXWindow component with vertical title bar
- NXMenuBar, NXShelf, NXDock
- Desktop background
- Era-switcher registration
- wm.ts extensions (vertical drag, shade, `shaded` state)
- Mobile layout

### Phase 2: Content Windows
- Author `src/data/projects.ts` (Miller Browser data prerequisite)
- NXInfoPanel (home/about)
- NXDocViewer (resume + skills tabs)
- NXMillerBrowser (projects)
- NXMailReader (blog)
- NXMuseum (computing history)
- Contact via NXTerminal

### Phase 3: Terminal & Easter Eggs
- NXTerminal with extended commands
- Shell command additions (make coffee, deploy godzilla, man todd, etc.)
- Author `src/data/playlist.ts` (static playlist)
- Dock personality apps (Godzilla, Fractals, Music)
- Konami code + hidden dev tools
- Dock bounce animation
- Polish pass

---

## 11. Dependencies

- **Astro 6** — existing, no changes needed
- **Inter font** — Google Fonts import (or local woff2)
- **No new npm packages** — pure CSS + vanilla JS + Astro components
- Reuses existing: `wm.ts`, `shell.ts`, `era-switcher.ts`, `fortunes.ts`, content collections

---

## 12. Open Questions

1. **Custom SVG icons vs emoji** — The SGI theme uses custom SVG icons for the desktop. Should NeXTSTEP also get custom icons, or are emoji acceptable for v1? Recommendation: emoji for v1, custom SVG for polish pass.
2. **Sound effects** — The BBS theme has modem audio. Should NeXTSTEP have subtle UI sounds (window open click, dock bounce)? Recommendation: optional, behind a preference, respects system settings.
3. **Boot sequence** — BBS has a boot animation. Should NeXTSTEP have one? The original NeXT had a distinctive boot screen with the cube logo. Could be a nice touch. Recommendation: short boot sequence for first visit, skipped on return.
