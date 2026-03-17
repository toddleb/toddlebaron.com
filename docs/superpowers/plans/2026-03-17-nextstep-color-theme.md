# NeXTSTEP Color Theme — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the third theme for toddlebaron.com — a colorized, personality-infused NeXTSTEP desktop that joins the BBS and SGI IRIX themes in the era-switcher rotation.

**Architecture:** New `NXDesktop.astro` layout + `nextstep.astro` page entry point + 12 NeXT-styled components in `src/themes/nextstep/`. Shares `wm.ts` window manager (extended with `shaded` state) and `shell.ts` command engine. Two new data files (`projects.ts`, `playlist.ts`). No new npm dependencies.

**Tech Stack:** Astro 6 (static), TypeScript, vanilla CSS custom properties, vanilla JS (CustomEvent bus)

**Spec:** `docs/superpowers/specs/2026-03-17-nextstep-color-theme-design.md`

---

## File Structure

### New Files (Phase 1: Chrome & Layout)

| File | Responsibility |
|------|---------------|
| `src/themes/nextstep/theme.css` | All `--nx-*` CSS custom properties and chrome styles (window frames, scrollbars, buttons, gradients). ~400-600 lines. |
| `src/themes/nextstep/theme.ts` | `ThemeConfig` registration: id `"nextstep"`, dayOfWeek, bootDuration, colors. ~25 lines. |
| `src/themes/nextstep/NXWindow.astro` | Window component with vertical title bar, shade, close/min/resize buttons. Props: `windowId`, `title`, `x`, `y`, `width`, `height`, `visible`, `toolbar?`. ~80 lines. |
| `src/themes/nextstep/NXMenuBar.astro` | Top menu bar: NeXT brand, Info, Workspace, Tools, Services, Windows, live clock. ~60 lines. |
| `src/themes/nextstep/NXShelf.astro` | Right-side 72px nav column: Home, Resume, Projects, Blog, Museum, Contact. Listens to `wm:window-focused`. ~70 lines. |
| `src/themes/nextstep/NXDock.astro` | Bottom 64px dock: Workspace, Terminal, Fractals, Godzilla, Music, Prefs, Recycler. Blue dot for running apps, bounce on open. ~80 lines. |
| `src/themes/nextstep/nx-icons.ts` | Icon mappings for shelf, dock, and file types. Emoji for v1. ~40 lines. |
| `src/themes/nextstep/schemes.ts` | Color scheme stub (single default scheme for v1). ~30 lines. |
| `src/layouts/NXDesktop.astro` | Desktop layout wrapper: imports theme.css, renders NXMenuBar + NXShelf + NXDock + desktop bg + slot for windows. Wires wm.ts event listeners. ~300 lines. |
| `src/pages/nextstep.astro` | Page entry: fetches content collections, renders NXDesktop + NXWindow per page. Pattern matches `sgi.astro`. ~80 lines. |

### New Files (Phase 2: Content Windows)

| File | Responsibility |
|------|---------------|
| `src/data/projects.ts` | Structured project data for Miller Browser: `{ id, name, category, description, techStack, status, url? }[]`. Categories: Enterprise, Creative, Military, Open Source. ~80 lines. |
| `src/themes/nextstep/NXInfoPanel.astro` | Home/About window: avatar, name, title, tags, 2x2 status grid, rotating quote. ~70 lines. |
| `src/themes/nextstep/NXDocViewer.astro` | Resume window with toolbar tabs: Timeline, Skills, Education. Renders resume.md content + skills data. ~90 lines. |
| `src/themes/nextstep/NXMillerBrowser.astro` | Three-column Miller browser for projects. Reads from `projects.ts`. Click-to-drill. ~120 lines. |
| `src/themes/nextstep/NXMailReader.astro` | Split-pane blog reader: left = post list, right = rendered content. ~80 lines. |
| `src/themes/nextstep/NXMuseum.astro` | Timeline browser with expandable era "folders". ~80 lines. |

### New Files (Phase 3: Terminal & Easter Eggs)

| File | Responsibility |
|------|---------------|
| `src/themes/nextstep/NXTerminal.astro` | Terminal window: NeXT-styled shell with `lebaron@cube:~$` prompt, connects to shell.ts. ~80 lines. |
| `src/data/playlist.ts` | Static music playlist for Now Playing easter egg. ~30 lines. |

### Modified Files

| File | Change |
|------|--------|
| `src/engine/wm.ts` | Add `shaded: boolean` to `WindowState` interface. Add shade/unshade toggle function. Add `wm:window-focused` event dispatch in `bringToFront()`. ~20 lines added. |
| `src/engine/shell.ts` | Add new commands: `make coffee`, `deploy godzilla`, `man todd`, `sudo rm -rf /`, `mail`, `uptime`, `cat resume`, `ls projects`. **IMPORTANT:** Command handlers take a single `string` argument (not `string[]`). The `executeCommand` function splits at first space and passes remainder as one string. ~80 lines added. |
| `src/engine/era-switcher.ts` | No direct changes needed — `nextstep` theme auto-registers via `theme.ts` import in `nextstep.astro`. |
| `src/components/MobileLayout.astro` | Add NeXTSTEP mobile variant (conditional on theme). Or: create `src/themes/nextstep/NXMobile.astro`. Decision: separate file to avoid touching working SGI mobile. |

---

## Phase 1: Chrome & Layout

### Task 1: Theme Registration & CSS Tokens

**Files:**
- Create: `src/themes/nextstep/theme.ts`
- Create: `src/themes/nextstep/theme.css`
- Create: `src/themes/nextstep/schemes.ts`

- [ ] **Step 1: Create `src/themes/nextstep/theme.ts`**

Register the NeXTSTEP theme with the theme contract. Follow the exact pattern from `src/themes/sgi-irix/theme.ts` (29 lines) and `src/themes/bbs/theme.ts` (22 lines).

```typescript
import { themeRegistry } from "../theme-contract";
import type { ThemeConfig } from "../theme-contract";

export const nextstepTheme: ThemeConfig = {
  id: "nextstep",
  name: "NeXTSTEP Color",
  dayOfWeek: 1, // Monday
  bootDuration: 3500,
  sounds: {
    // Optional boot sound can be added later
  },
  colors: {
    primary: "#6aafee",
    secondary: "#6aee6a",
    background: "#1e1e22",
    surface: "#333338",
    text: "#e0e0e0",
  },
};

themeRegistry[nextstepTheme.id] = nextstepTheme;
```

- [ ] **Step 2: Create `src/themes/nextstep/schemes.ts`**

Stub file for color scheme support. Single default scheme for v1.

```typescript
export interface NXColorScheme {
  id: string;
  name: string;
  accentBlue: string;
  accentGreen: string;
  accentAmber: string;
  accentRed: string;
  chromeMid: string;
  desktopBg: string;
}

export const defaultScheme: NXColorScheme = {
  id: "default",
  name: "NeXTSTEP Color",
  accentBlue: "#6aafee",
  accentGreen: "#6aee6a",
  accentAmber: "#ccaa44",
  accentRed: "#cc4444",
  chromeMid: "#3a3a40",
  desktopBg: "#1e1e22",
};

export const nxSchemes: NXColorScheme[] = [defaultScheme];

export function getSchemeById(id: string): NXColorScheme | undefined {
  return nxSchemes.find((s) => s.id === id);
}
```

- [ ] **Step 3: Create `src/themes/nextstep/theme.css`**

All NeXTSTEP visual tokens and chrome styles. This is the largest single file. Define:
- All `--nx-*` custom properties from the spec (Section 3)
- `.nx-window` styles: vertical title bar (22px wide), close/min/resize buttons, body, toolbar
- `.nx-menu-bar` styles: 24px tall, fixed top, gradient chrome
- `.nx-shelf` styles: 72px wide, fixed right, square tiles
- `.nx-dock` styles: 64px tall, fixed bottom, tiles with blue dot
- `.nx-desktop` styles: background with grid overlay
- Custom scrollbar styles (14px wide, square thumb)
- Button styles (gradient, 1px border, pressed state)
- Typography: Inter for UI, Courier New for terminal
- `prefers-reduced-motion` overrides

Reference the spec's color tokens (Section 3) and chrome design language. Key constraints:
- **Zero border-radius** everywhere
- Subtle linear gradients on chrome (top-lighter → bottom-darker)
- 1px solid borders, `box-shadow: 2px 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)` on windows
- Minimum 13px font size for body content

```css
/* src/themes/nextstep/theme.css */

/* ── Tokens ─────────────────────────────────── */
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

  /* Window Buttons */
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

/* ── Desktop ────────────────────────────────── */
.nx-desktop {
  position: fixed;
  inset: 0;
  background: var(--nx-desktop-bg);
  background-image:
    linear-gradient(var(--nx-desktop-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--nx-desktop-grid) 1px, transparent 1px),
    radial-gradient(ellipse at 30% 70%, rgba(106,175,238,0.03), transparent 60%),
    radial-gradient(ellipse at 70% 30%, rgba(106,238,106,0.02), transparent 60%);
  background-size: 32px 32px, 32px 32px, 100% 100%, 100% 100%;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--nx-text-primary);
}

/* ── Window Chrome ──────────────────────────── */
.nx-window {
  position: absolute;
  display: flex;
  flex-direction: row;
  background: var(--nx-chrome-mid);
  border: 1px solid var(--nx-border);
  box-shadow: 2px 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
  border-radius: 0;
  overflow: hidden;
}

.nx-window-titlebar {
  width: 22px;
  min-width: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, var(--nx-chrome-hi), var(--nx-chrome-lo));
  border-right: 1px solid var(--nx-border-dark);
  padding: 4px 0;
  gap: 4px;
  cursor: grab;
  user-select: none;
}

.nx-window-titlebar:active { cursor: grabbing; }

.nx-titlebar-btn {
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  line-height: 1;
}
.nx-titlebar-btn:hover { filter: brightness(1.2); }
.nx-titlebar-btn:active { filter: brightness(0.8); }
.nx-btn-close { background: var(--nx-btn-close); }
.nx-btn-minimize { background: var(--nx-btn-minimize); }
.nx-btn-resize { background: var(--nx-btn-resize); }

.nx-titlebar-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--nx-text-secondary);
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  padding: 4px 0;
}

.nx-window-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nx-window-toolbar {
  display: flex;
  gap: 1px;
  padding: 3px 6px;
  background: linear-gradient(to bottom, var(--nx-chrome-hi), var(--nx-chrome-mid));
  border-bottom: 1px solid var(--nx-border-dark);
}

.nx-toolbar-btn {
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 500;
  background: var(--nx-chrome-mid);
  border: 1px solid var(--nx-border);
  color: var(--nx-text-primary);
  cursor: pointer;
  border-radius: 0;
}
.nx-toolbar-btn:hover { background: var(--nx-chrome-hi); }
.nx-toolbar-btn.active {
  background: var(--nx-accent-blue);
  color: #fff;
  border-color: var(--nx-accent-blue);
}

.nx-window-body {
  flex: 1;
  overflow: auto;
  background: var(--nx-chrome-lo);
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.nx-window-body h1,
.nx-window-body h2,
.nx-window-body h3 {
  font-weight: 600;
  color: var(--nx-text-primary);
  margin: 1em 0 0.5em;
}
.nx-window-body h1 { font-size: 20px; }
.nx-window-body h2 { font-size: 18px; }
.nx-window-body h3 { font-size: 16px; }
.nx-window-body p { margin: 0.5em 0; }
.nx-window-body a { color: var(--nx-accent-blue); text-decoration: underline; }
.nx-window-body code {
  font-family: 'Courier New', monospace;
  background: rgba(0,0,0,0.2);
  padding: 1px 4px;
  font-size: 13px;
}

/* Shade state */
.nx-window.shaded .nx-window-main { display: none; }
.nx-window.shaded { width: 22px !important; height: auto !important; }

/* Hidden window */
.nx-window[data-visible="false"] { display: none; }

/* ── Resize Handle ──────────────────────────── */
.nx-resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 50%, var(--nx-border) 50%);
}

/* ── Menu Bar ───────────────────────────────── */
.nx-menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, var(--nx-chrome-hi), var(--nx-chrome-mid));
  border-bottom: 1px solid var(--nx-border-dark);
  padding: 0 8px;
  z-index: 9999;
  font-size: 12px;
  font-weight: 500;
}

.nx-menu-item {
  padding: 0 10px;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--nx-text-primary);
}
.nx-menu-item:hover { background: var(--nx-accent-blue); color: #fff; }
.nx-menu-brand { font-weight: 700; }

.nx-menu-clock {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: var(--nx-text-secondary);
}

/* ── Shelf (Right Nav) ──────────────────────── */
.nx-shelf {
  position: fixed;
  top: 24px; /* below menu bar */
  right: 0;
  bottom: 64px; /* above dock */
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 8px;
  background: linear-gradient(to bottom, var(--nx-chrome-mid), var(--nx-chrome-lo));
  border-left: 1px solid var(--nx-border-dark);
  z-index: 9998;
}

.nx-shelf-item {
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
  transition: transform 150ms ease, border-color 150ms ease;
}
.nx-shelf-item:hover {
  transform: scale(1.05);
  border-color: var(--nx-border);
}
.nx-shelf-item.active::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--nx-accent-blue);
}
.nx-shelf-icon { font-size: 24px; }
.nx-shelf-label {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--nx-text-muted);
}

/* ── Dock (Bottom) ──────────────────────────── */
.nx-dock {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 72px; /* shelf width */
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  background: linear-gradient(to bottom, var(--nx-chrome-hi), var(--nx-chrome-mid));
  border-top: 1px solid var(--nx-border-dark);
  z-index: 9998;
}

.nx-dock-tile {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  position: relative;
  transition: transform 150ms ease;
}
.nx-dock-tile:hover { transform: translateY(-2px); }
.nx-dock-icon { font-size: 22px; }
.nx-dock-label {
  font-size: 7px;
  text-transform: uppercase;
  color: var(--nx-text-muted);
}
.nx-dock-tile.running::after {
  content: '';
  position: absolute;
  bottom: -2px;
  width: 4px;
  height: 4px;
  background: var(--nx-accent-blue);
  border-radius: 50%;
}

/* Dock bounce animation */
@keyframes nx-dock-bounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-6px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-3px); }
}
.nx-dock-tile.bouncing {
  animation: nx-dock-bounce 400ms ease;
}

/* ── Custom Scrollbars ──────────────────────── */
.nx-window-body::-webkit-scrollbar { width: 14px; }
.nx-window-body::-webkit-scrollbar-track {
  background: var(--nx-chrome-lo);
  border-left: 1px solid var(--nx-border);
}
.nx-window-body::-webkit-scrollbar-thumb {
  background: var(--nx-chrome-hi);
  border: 1px solid var(--nx-border);
  border-radius: 0;
}
.nx-window-body::-webkit-scrollbar-thumb:hover {
  background: var(--nx-border);
}

/* ── Window open/close animations ───────────── */
@keyframes nx-window-open {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes nx-window-close {
  from { opacity: 1; }
  to { opacity: 0; }
}
.nx-window.opening { animation: nx-window-open 200ms ease-out; }
.nx-window.closing { animation: nx-window-close 150ms ease-out forwards; }

/* ── Shade animation ────────────────────────── */
.nx-window.shading .nx-window-main {
  transition: max-height 200ms ease;
  max-height: 0;
  overflow: hidden;
}

/* ── Focus ──────────────────────────────────── */
*:focus-visible {
  outline: 2px solid var(--nx-accent-blue);
  outline-offset: 1px;
}

/* ── Reduced motion ─────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .nx-window.opening,
  .nx-window.closing,
  .nx-dock-tile.bouncing {
    animation: none;
  }
  .nx-shelf-item,
  .nx-dock-tile {
    transition: none;
  }
}

/* ── Terminal ────────────────────────────────── */
.nx-terminal {
  background: var(--nx-terminal-bg);
  color: var(--nx-terminal-green);
  font-family: 'Courier New', monospace;
  font-size: 13px;
  padding: 8px;
  height: 100%;
  overflow-y: auto;
}
.nx-terminal-prompt { color: var(--nx-terminal-prompt); }
.nx-terminal-input {
  background: transparent;
  border: none;
  color: var(--nx-terminal-green);
  font-family: inherit;
  font-size: inherit;
  outline: none;
  width: calc(100% - 160px);
  caret-color: var(--nx-terminal-green);
}
@keyframes nx-blink { 50% { opacity: 0; } }
.nx-terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--nx-terminal-green);
  animation: nx-blink 1s step-end infinite;
  vertical-align: text-bottom;
}

/* ── Miller Browser ─────────────────────────── */
.nx-miller {
  display: flex;
  height: 100%;
  border-top: 1px solid var(--nx-border-dark);
}
.nx-miller-col {
  flex: 1;
  border-right: 1px solid var(--nx-border-dark);
  overflow-y: auto;
  min-width: 0;
}
.nx-miller-col:last-child { border-right: none; }
.nx-miller-row {
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.nx-miller-row:hover { background: rgba(106,175,238,0.1); }
.nx-miller-row.selected { background: var(--nx-accent-blue); color: #fff; }
.nx-miller-arrow { margin-left: auto; opacity: 0.4; font-size: 10px; }

/* ── Mail Reader ────────────────────────────── */
.nx-mail-split {
  display: flex;
  height: 100%;
}
.nx-mail-list {
  width: 220px;
  min-width: 220px;
  border-right: 1px solid var(--nx-border-dark);
  overflow-y: auto;
}
.nx-mail-item {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer;
  font-size: 12px;
}
.nx-mail-item:hover { background: rgba(106,175,238,0.1); }
.nx-mail-item.selected { background: var(--nx-accent-blue); color: #fff; }
.nx-mail-date { font-size: 10px; color: var(--nx-text-muted); }
.nx-mail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* ── Info Panel ─────────────────────────────── */
.nx-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--nx-border);
  margin-bottom: 16px;
}
.nx-info-avatar { font-size: 48px; }
.nx-info-name { font-size: 18px; font-weight: 600; }
.nx-info-title { font-size: 13px; color: var(--nx-text-secondary); }
.nx-info-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.nx-info-tag {
  padding: 2px 8px;
  font-size: 10px;
  background: rgba(106,175,238,0.15);
  color: var(--nx-accent-blue);
  border: 1px solid rgba(106,175,238,0.3);
}
.nx-status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.nx-status-card {
  background: rgba(0,0,0,0.2);
  padding: 12px;
  border: 1px solid var(--nx-border);
}
.nx-status-label { font-size: 10px; text-transform: uppercase; color: var(--nx-text-muted); letter-spacing: 0.5px; }
.nx-status-value { font-size: 20px; font-weight: 600; margin-top: 4px; }

/* ── Doc Viewer ─────────────────────────────── */
.nx-doc-viewer { display: flex; flex-direction: column; height: 100%; }
.nx-doc-content { flex: 1; overflow-y: auto; padding: 16px; }

/* ── Museum ─────────────────────────────────── */
.nx-museum-era {
  border-bottom: 1px solid var(--nx-border);
  cursor: pointer;
}
.nx-museum-era-header {
  padding: 10px 12px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.nx-museum-era-header:hover { background: rgba(106,175,238,0.1); }
.nx-museum-machines { padding: 0 12px 12px 28px; display: none; }
.nx-museum-era.open .nx-museum-machines { display: block; }
.nx-museum-machine {
  padding: 6px 0;
  font-size: 12px;
  color: var(--nx-text-secondary);
}

/* ── Mobile ─────────────────────────────────── */
@media (max-width: 768px) {
  .nx-desktop { display: none; }
  .nx-mobile { display: block; }

  .nx-shelf { display: none; }
  .nx-dock { display: none; }

  .nx-mobile-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: var(--nx-chrome-mid);
    border-bottom: 1px solid var(--nx-border-dark);
    z-index: 9999;
  }
  .nx-mobile-brand { font-weight: 700; font-size: 14px; }
  .nx-mobile-menu-btn { margin-left: auto; font-size: 20px; cursor: pointer; }

  .nx-mobile-tabs {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    display: flex;
    background: var(--nx-chrome-mid);
    border-top: 1px solid var(--nx-border-dark);
    z-index: 9999;
  }
  .nx-mobile-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 18px;
    color: var(--nx-text-muted);
    cursor: pointer;
  }
  .nx-mobile-tab.active { color: var(--nx-accent-blue); }
  .nx-mobile-tab-label { font-size: 9px; }

  .nx-mobile-content {
    padding: 56px 0;
    min-height: 100vh;
    background: var(--nx-desktop-bg);
  }

  .nx-mobile-card {
    margin: 8px 12px;
    background: var(--nx-chrome-lo);
    border: 1px solid var(--nx-border);
    overflow: hidden;
  }
  .nx-mobile-card-header {
    padding: 12px;
    background: linear-gradient(to bottom, var(--nx-chrome-hi), var(--nx-chrome-mid));
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid var(--nx-border-dark);
  }
  .nx-mobile-card-body { padding: 12px; }
}
@media (min-width: 769px) {
  .nx-mobile { display: none; }
}
```

This is substantial — expect ~350-450 lines. The code above covers every class referenced by the components. Adjust spacing and details during polish.

- [ ] **Step 4: Verify build**

Run: `cd /Users/toddlebaron/Development/toddlebaron && npm run build`

Expected: Build succeeds. No pages reference the new files yet, so this only validates CSS/TS syntax.

- [ ] **Step 5: Commit**

```bash
git add src/themes/nextstep/theme.ts src/themes/nextstep/theme.css src/themes/nextstep/schemes.ts
git commit -m "feat(nextstep): theme registration and CSS tokens"
```

---

### Task 2: NXWindow Component

**Files:**
- Create: `src/themes/nextstep/NXWindow.astro`

- [ ] **Step 1: Create `src/themes/nextstep/NXWindow.astro`**

Follow the pattern of `src/themes/sgi-irix/Window.astro` (49 lines). Key differences:
- Vertical title bar (22px wide, left side) instead of horizontal
- Close button at top, minimize below, title text vertical, resize at bottom
- `data-drag-handle={windowId}` on the titlebar div (wm.ts uses this attribute)
- Optional toolbar slot (horizontal, below title bar top)
- Body area with scrollable content
- Resize handle at bottom-right
- `data-visible` attribute for show/hide

```astro
---
export interface Props {
  windowId: string;
  title: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  toolbar?: boolean;
}
const {
  windowId,
  title,
  x = 120,
  y = 60,
  width = 540,
  height = 420,
  visible = false,
  toolbar = false,
} = Astro.props;
---

<div
  class="nx-window"
  data-window-id={windowId}
  data-visible={visible ? "true" : "false"}
  style={`left:${x}px;top:${y}px;width:${width}px;height:${height}px;`}
>
  <div class="nx-window-titlebar" data-drag-handle={windowId}>
    <button class="nx-titlebar-btn nx-btn-close" data-action="close" data-target={windowId} aria-label="Close">×</button>
    <button class="nx-titlebar-btn nx-btn-minimize" data-action="minimize" data-target={windowId} aria-label="Minimize">−</button>
    <span class="nx-titlebar-text" data-shade-toggle={windowId}>{title}</span>
    <button class="nx-titlebar-btn nx-btn-resize" data-action="maximize" data-target={windowId} aria-label="Resize">◻</button>
  </div>
  <div class="nx-window-main">
    {toolbar && (
      <div class="nx-window-toolbar">
        <slot name="toolbar" />
      </div>
    )}
    <div class="nx-window-body">
      <slot />
    </div>
  </div>
  <div class="nx-resize-handle" data-resize-handle={windowId}></div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/themes/nextstep/NXWindow.astro
git commit -m "feat(nextstep): NXWindow component with vertical title bar"
```

---

### Task 3: NXMenuBar Component

**Files:**
- Create: `src/themes/nextstep/NXMenuBar.astro`

- [ ] **Step 1: Create `src/themes/nextstep/NXMenuBar.astro`**

Fixed top bar, 24px tall. Left: NeXT (bold brand), Info, Workspace, Tools, Services, Windows. Right: live clock.

Menu items are functional links for v1 (no dropdowns — that's a stretch goal per spec). "Info" opens the About window, "Workspace" resets layout.

```astro
---
// No props needed — menu bar is static chrome
---

<nav class="nx-menu-bar" role="menubar" aria-label="Menu bar">
  <div class="nx-menu-item nx-menu-brand" role="menuitem" data-menu-action="about-next">NeXT</div>
  <div class="nx-menu-item" role="menuitem" data-menu-action="open-window" data-window="about">Info</div>
  <div class="nx-menu-item" role="menuitem" data-menu-action="reset-layout">Workspace</div>
  <div class="nx-menu-item" role="menuitem" data-menu-action="open-window" data-window="terminal">Tools</div>
  <div class="nx-menu-item" role="menuitem" data-menu-action="open-window" data-window="projects">Services</div>
  <div class="nx-menu-item" role="menuitem" data-menu-action="list-windows">Windows</div>
  <time class="nx-menu-clock" aria-live="polite"></time>
</nav>
```

The clock JS is wired in NXDesktop.astro (Task 5).

- [ ] **Step 2: Commit**

```bash
git add src/themes/nextstep/NXMenuBar.astro
git commit -m "feat(nextstep): NXMenuBar component"
```

---

### Task 4: NXShelf and NXDock Components

**Files:**
- Create: `src/themes/nextstep/nx-icons.ts`
- Create: `src/themes/nextstep/NXShelf.astro`
- Create: `src/themes/nextstep/NXDock.astro`

- [ ] **Step 1: Create `src/themes/nextstep/nx-icons.ts`**

Emoji icons for v1. Maps window IDs and dock items to display icons.

```typescript
// Shelf items map to windowId values from content collection
export const shelfItems = [
  { id: "about", label: "Home", icon: "🏠", windowId: "about" },
  { id: "resume", label: "Resume", icon: "📄", windowId: "resume" },
  { id: "projects", label: "Projects", icon: "📂", windowId: "projects" },
  { id: "blog", label: "Blog", icon: "📬", windowId: "blog" },
  { id: "computing-history", label: "Museum", icon: "🖥️", windowId: "computing-history" },
  { id: "contact", label: "Contact", icon: "✉️", windowId: "contact" },
];

export const dockItems = [
  { id: "workspace", label: "Workspace", icon: "📁", action: "open-file-manager" },
  { id: "terminal", label: "Terminal", icon: "⬛", action: "open-window", windowId: "terminal" },
  { id: "separator", label: "", icon: "", action: "separator" },
  { id: "fractals", label: "Fractals", icon: "🌀", action: "open-easter-egg", windowId: "fractals" },
  { id: "godzilla", label: "Godzilla", icon: "🦎", action: "open-easter-egg", windowId: "godzilla" },
  { id: "music", label: "Music", icon: "🎵", action: "open-easter-egg", windowId: "music" },
  { id: "separator2", label: "", icon: "", action: "separator" },
  { id: "prefs", label: "Prefs", icon: "⚙️", action: "open-prefs" },
  { id: "recycler", label: "Recycler", icon: "🗑️", action: "open-recycler" },
];
```

- [ ] **Step 2: Create `src/themes/nextstep/NXShelf.astro`**

Right-side navigation. Imports `shelfItems`. Renders square tiles. Active state updated via JS listening to `wm:window-focused`.

```astro
---
import { shelfItems } from "./nx-icons";
---

<aside class="nx-shelf" role="navigation" aria-label="Page navigation">
  {shelfItems.map((item) => (
    <button
      class="nx-shelf-item"
      data-shelf-item={item.windowId}
      data-action="open-window"
      data-window={item.windowId}
      aria-label={item.label}
    >
      <span class="nx-shelf-icon">{item.icon}</span>
      <span class="nx-shelf-label">{item.label}</span>
    </button>
  ))}
</aside>
```

- [ ] **Step 3: Create `src/themes/nextstep/NXDock.astro`**

Bottom dock. Imports `dockItems`. Separators render as thin vertical lines. Running dot and bounce animation controlled via JS in NXDesktop.astro.

```astro
---
import { dockItems } from "./nx-icons";
---

<div class="nx-dock" role="toolbar" aria-label="Applications dock">
  {dockItems.map((item) =>
    item.action === "separator" ? (
      <div class="nx-dock-separator" style="width:1px;height:32px;background:var(--nx-border);"></div>
    ) : (
      <button
        class="nx-dock-tile"
        data-dock-item={item.id}
        data-action={item.action}
        data-window={item.windowId || ""}
        aria-label={item.label}
      >
        <span class="nx-dock-icon">{item.icon}</span>
        <span class="nx-dock-label">{item.label}</span>
      </button>
    )
  )}
</div>
```

**Dock action handlers:** The `open-recycler` action should open a small window showing "0 regrets" (add this window in Task 16 with other easter eggs). The `open-prefs` action should open the EraPickerOverlay (already exists at `src/components/EraPickerOverlay.astro`) or a small scheme picker window. Wire these in NXDesktop.astro (Task 5) click delegation.

- [ ] **Step 4: Commit**

```bash
git add src/themes/nextstep/nx-icons.ts src/themes/nextstep/NXShelf.astro src/themes/nextstep/NXDock.astro
git commit -m "feat(nextstep): NXShelf, NXDock, and icon mappings"
```

---

### Task 5: NXDesktop Layout

**Files:**
- Create: `src/layouts/NXDesktop.astro`

This is the most complex file in Phase 1. It wires together the menu bar, shelf, dock, window manager events, keyboard nav, clock, shade behavior, and desktop background.

- [ ] **Step 1: Create `src/layouts/NXDesktop.astro`**

Follow the pattern of `src/layouts/Desktop.astro` (667 lines) but for NeXTSTEP. Key sections:

1. **Head:** Import `theme.css`, Inter font, SEO head
2. **Body structure:** `.nx-desktop` wrapper, NXMenuBar, content area (slot for windows), NXShelf, NXDock
3. **Client-side script (inline `<script>`):**
   - Import and initialize `wm.ts` functions
   - Wire `wm:window-opened` → dock bounce, shelf active update
   - Wire `wm:window-focused` → shelf active indicator
   - Wire click delegation for `[data-action]` buttons (close, minimize, maximize, open-window)
   - Wire double-click on `[data-shade-toggle]` → shade/unshade
   - Clock update every 60s
   - Menu bar actions
   - Dock running-dot management
   - Keyboard navigation init

```astro
---
import NXMenuBar from "../themes/nextstep/NXMenuBar.astro";
import NXShelf from "../themes/nextstep/NXShelf.astro";
import NXDock from "../themes/nextstep/NXDock.astro";
import SEOHead from "../components/SEOHead.astro";
import "../themes/nextstep/theme.css";

export interface Props {
  title?: string;
  description?: string;
}
const { title = "toddlebaron.com", description = "Todd LeBaron — Builder of Things That Matter" } = Astro.props;
---
<!DOCTYPE html>
<html lang="en" data-theme="nextstep">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <SEOHead title={title} description={description} />
  <title>{title}</title>
</head>
<body>
  <div class="nx-desktop" id="nx-desktop">
    <NXMenuBar />
    <main
      class="nx-window-area"
      style="position:fixed;top:24px;left:0;right:72px;bottom:64px;overflow:hidden;"
    >
      <slot />
    </main>
    <NXShelf />
    <NXDock />
  </div>

  <!-- Mobile layout goes here (Task 8) -->

  <script>
    import {
      registerWindow, openWindow, closeWindow, minimizeWindow,
      maximizeWindow, bringToFront, startDrag, startResize,
      getWindows, getActiveWindowId, initKeyboardNav,
    } from "../engine/wm";
    import "../themes/nextstep/theme";

    // ── Clock ──────────────────────────────
    function updateClock() {
      const el = document.querySelector(".nx-menu-clock");
      if (!el) return;
      const now = new Date();
      el.textContent = now.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false,
      });
    }
    updateClock();
    setInterval(updateClock, 60_000);

    // ── Register all windows ───────────────
    document.querySelectorAll<HTMLElement>(".nx-window").forEach((el) => {
      const id = el.dataset.windowId;
      if (!id) return;
      const title = el.querySelector(".nx-titlebar-text")?.textContent || id;
      registerWindow(id, title, {
        x: parseInt(el.style.left) || 120,
        y: parseInt(el.style.top) || 60,
        width: parseInt(el.style.width) || 540,
        height: parseInt(el.style.height) || 420,
      });
    });

    // ── Click delegation ───────────────────
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      // Window control buttons
      const action = target.closest<HTMLElement>("[data-action]");
      if (action) {
        const act = action.dataset.action;
        const win = action.dataset.window || action.dataset.target;
        if (!win) return;

        switch (act) {
          case "close": closeWindow(win); break;
          case "minimize": minimizeWindow(win); break;
          case "maximize": maximizeWindow(win); break;
          case "open-window": openWindow(win); bringToFront(win); break;
          case "open-easter-egg": openWindow(win); bringToFront(win); break;
          case "open-recycler":
            // Easter egg: just show a tooltip or mini-window
            break;
          case "about-next":
            openWindow("about-next-credits");
            bringToFront("about-next-credits");
            break;
        }
        return;
      }

      // Bring clicked window to front
      const windowEl = target.closest<HTMLElement>(".nx-window");
      if (windowEl?.dataset.windowId) {
        bringToFront(windowEl.dataset.windowId);
      }
    });

    // ── Drag start ─────────────────────────
    document.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;
      const dragHandle = target.closest<HTMLElement>("[data-drag-handle]");
      if (dragHandle) {
        const id = dragHandle.dataset.dragHandle;
        if (id) startDrag(id, e);
      }
      const resizeHandle = target.closest<HTMLElement>("[data-resize-handle]");
      if (resizeHandle) {
        const id = resizeHandle.dataset.resizeHandle;
        if (id) startResize(id, e);
      }
    });

    // ── Shade (double-click title text) ────
    document.addEventListener("dblclick", (e) => {
      const target = e.target as HTMLElement;
      const shadeToggle = target.closest<HTMLElement>("[data-shade-toggle]");
      if (shadeToggle) {
        const id = shadeToggle.dataset.shadeToggle;
        const windowEl = document.querySelector<HTMLElement>(`.nx-window[data-window-id="${id}"]`);
        if (windowEl) {
          windowEl.classList.toggle("shaded");
        }
      }
    });

    // ── Shelf active tracking ──────────────
    document.addEventListener("wm:window-focused", ((e: CustomEvent) => {
      const focusedId = e.detail?.id;
      document.querySelectorAll(".nx-shelf-item").forEach((item) => {
        const el = item as HTMLElement;
        el.classList.toggle("active", el.dataset.shelfItem === focusedId);
      });
    }) as EventListener);

    // ── Window opened → Sync DOM ───────────
    document.addEventListener("wm:window-opened", ((e: CustomEvent) => {
      const id = e.detail?.id;
      const windowEl = document.querySelector<HTMLElement>(`.nx-window[data-window-id="${id}"]`);
      if (windowEl) {
        windowEl.dataset.visible = "true";
        windowEl.classList.add("opening");
        setTimeout(() => windowEl.classList.remove("opening"), 200);
      }
      // Dock bounce
      const dockTile = document.querySelector<HTMLElement>(`.nx-dock-tile[data-window="${id}"]`);
      if (dockTile) {
        dockTile.classList.add("running", "bouncing");
        setTimeout(() => dockTile.classList.remove("bouncing"), 400);
      }
    }) as EventListener);

    // ── Window closed → Sync DOM ───────────
    document.addEventListener("wm:window-closed", ((e: CustomEvent) => {
      const id = e.detail?.id;
      const windowEl = document.querySelector<HTMLElement>(`.nx-window[data-window-id="${id}"]`);
      if (windowEl) {
        windowEl.classList.add("closing");
        setTimeout(() => {
          windowEl.dataset.visible = "false";
          windowEl.classList.remove("closing");
        }, 150);
      }
      // Remove dock running dot
      const dockTile = document.querySelector<HTMLElement>(`.nx-dock-tile[data-window="${id}"]`);
      if (dockTile) dockTile.classList.remove("running");
    }) as EventListener);

    // ── Window minimized → Sync DOM ────────
    document.addEventListener("wm:window-minimized", ((e: CustomEvent) => {
      const id = e.detail?.id;
      const windowEl = document.querySelector<HTMLElement>(`.nx-window[data-window-id="${id}"]`);
      if (windowEl) windowEl.dataset.visible = "false";
    }) as EventListener);

    // ── Open default windows ───────────────
    // Open About (home) on load
    setTimeout(() => openWindow("about"), 300);

    // ── Keyboard nav ───────────────────────
    initKeyboardNav();
  </script>
</body>
</html>
```

This is ~150 lines. The actual file will be longer once mobile layout is integrated (Task 8).

- [ ] **Step 2: Verify build**

Run: `cd /Users/toddlebaron/Development/toddlebaron && npm run build`

Expected: Build succeeds. NXDesktop isn't routed yet, but imports should resolve.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/NXDesktop.astro
git commit -m "feat(nextstep): NXDesktop layout with event wiring"
```

---

### Task 6: Page Entry Point & wm.ts Extension

**Files:**
- Create: `src/pages/nextstep.astro`
- Modify: `src/engine/wm.ts`

- [ ] **Step 1: Add `shaded` to WindowState in `src/engine/wm.ts`**

Open `src/engine/wm.ts`. The `WindowState` interface is at lines 1-13. Add `shaded: boolean` after `maximized: boolean`. Default to `false` wherever WindowState objects are created (look for `registerWindow` function).

In the `WindowState` interface, add:
```typescript
  shaded: boolean;
```

In `registerWindow` (line ~36), add `shaded: false` to the default state object.

Also add `wm:window-focused` event dispatch to `bringToFront()` (line ~106). After updating z-index, add:
```typescript
document.dispatchEvent(new CustomEvent("wm:window-focused", { detail: { id } }));
```
This event is needed by NXShelf to track the active window.

- [ ] **Step 2: Create `src/pages/nextstep.astro`**

Follow the pattern of `src/pages/sgi.astro` (127 lines). Fetches content collections, renders each page inside an NXWindow. Special handling for contact (terminal-based), resume (doc viewer with tabs), projects (Miller browser), blog (mail reader), computing-history (museum).

```astro
---
import { getCollection } from "astro:content";
import NXDesktop from "../layouts/NXDesktop.astro";
import NXWindow from "../themes/nextstep/NXWindow.astro";
import NXInfoPanel from "../themes/nextstep/NXInfoPanel.astro";
import NXDocViewer from "../themes/nextstep/NXDocViewer.astro";
import NXMillerBrowser from "../themes/nextstep/NXMillerBrowser.astro";
import NXMailReader from "../themes/nextstep/NXMailReader.astro";
import NXMuseum from "../themes/nextstep/NXMuseum.astro";
import NXTerminal from "../themes/nextstep/NXTerminal.astro";

const pages = (await getCollection("pages")).sort((a, b) => a.data.order - b.data.order);
const blog = await getCollection("blog");

// Window positions — staggered cascade
const positions = [
  { x: 100, y: 50, width: 520, height: 400 },  // about
  { x: 160, y: 80, width: 560, height: 450 },  // resume
  { x: 220, y: 60, width: 600, height: 420 },  // projects
  { x: 140, y: 90, width: 500, height: 400 },  // blog
  { x: 180, y: 70, width: 540, height: 380 },  // computing-history
  { x: 130, y: 100, width: 480, height: 360 }, // contact
];
---

<NXDesktop title="toddlebaron.com — NeXTSTEP">
  {await Promise.all(pages.map(async (page, i) => {
    const { Content } = await page.render();
    const pos = positions[i] || positions[0];
    const wid = page.data.windowId;

    // Special window types
    if (wid === "about") {
      return (
        <NXWindow windowId={wid} title={page.data.title} {...pos}>
          <NXInfoPanel />
        </NXWindow>
      );
    }

    if (wid === "resume") {
      return (
        <NXWindow windowId={wid} title={page.data.title} {...pos}>
          <NXDocViewer />
        </NXWindow>
      );
    }

    if (wid === "projects") {
      return (
        <NXWindow windowId={wid} title={page.data.title} {...pos}>
          <NXMillerBrowser />
        </NXWindow>
      );
    }

    if (wid === "blog") {
      return (
        <NXWindow windowId={wid} title={page.data.title} {...pos}>
          <NXMailReader posts={blog} />
        </NXWindow>
      );
    }

    if (wid === "computing-history") {
      return (
        <NXWindow windowId={wid} title={page.data.title} {...pos}>
          <NXMuseum />
        </NXWindow>
      );
    }

    if (wid === "contact") {
      return (
        <NXWindow windowId={wid} title={page.data.title} {...pos}>
          <NXTerminal />
        </NXWindow>
      );
    }

    // Default: render markdown content
    return (
      <NXWindow windowId={wid} title={page.data.title} {...pos}>
        <Content />
      </NXWindow>
    );
  }))}
</NXDesktop>
```

**Note:** NXInfoPanel, NXDocViewer, NXMillerBrowser, NXMailReader, NXMuseum, and NXTerminal don't exist yet. Create placeholder files that render simple text so the build passes. They'll be fully implemented in Phase 2 and 3.

- [ ] **Step 3: Create placeholder components for Phase 2/3**

Create minimal placeholder `.astro` files for each not-yet-implemented component so the page entry point builds. Each is ~5 lines:

```astro
---
// Placeholder — full implementation in Phase 2
---
<div class="nx-placeholder">
  <p style="color:var(--nx-text-muted);font-style:italic;">Coming soon...</p>
</div>
```

Create this for: `NXInfoPanel.astro`, `NXDocViewer.astro`, `NXMillerBrowser.astro`, `NXMailReader.astro`, `NXMuseum.astro`, `NXTerminal.astro`.

- [ ] **Step 4: Verify dev server**

Run: `cd /Users/toddlebaron/Development/toddlebaron && npm run dev`

Navigate to `http://localhost:4321/nextstep`. Expected: Dark desktop with menu bar, shelf on right, dock at bottom, and one About window visible with placeholder content. Windows should be draggable and closable.

- [ ] **Step 5: Commit**

```bash
git add src/engine/wm.ts src/pages/nextstep.astro src/themes/nextstep/NXInfoPanel.astro \
  src/themes/nextstep/NXDocViewer.astro src/themes/nextstep/NXMillerBrowser.astro \
  src/themes/nextstep/NXMailReader.astro src/themes/nextstep/NXMuseum.astro \
  src/themes/nextstep/NXTerminal.astro
git commit -m "feat(nextstep): page entry point, wm.ts shade extension, placeholder components"
```

---

### Task 7: Era Switcher Integration

**Files:**
- Verify: `src/engine/era-switcher.ts` (no changes needed if theme auto-registers)
- Modify: `src/pages/index.astro` or `src/pages/[...slug].astro` (add nextstep routing)

- [ ] **Step 1: Read `src/pages/index.astro` to understand current routing**

**IMPORTANT:** The era-switcher (`era-switcher.ts`) is a **client-side** module that reads cookies via `document.cookie`. It cannot run in Astro frontmatter (build-time). `Astro.redirect()` won't work for cookie-based routing in SSG mode.

Read `src/pages/index.astro` and `src/pages/[...slug].astro` to understand the current routing mechanism. The BBS and SGI themes are accessed via direct URLs (`/` for BBS, `/sgi` for SGI). The era-switcher is used client-side to set a preference.

- [ ] **Step 2: Add client-side theme redirect**

Add a small `<script>` to `src/pages/index.astro` (or create a shared redirect component) that checks the cookie and redirects:

```html
<script>
  // Client-side era-switcher redirect
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("toddlebaron-era="));
  if (cookie) {
    const theme = cookie.split("=")[1];
    if (theme === "nextstep" && window.location.pathname === "/") {
      window.location.replace("/nextstep");
    }
    if (theme === "sgi-irix" && window.location.pathname === "/") {
      window.location.replace("/sgi");
    }
  }
</script>
```

This must run early (in `<head>` or at top of `<body>`) to avoid a flash of the wrong theme.

- [ ] **Step 3: Verify era-switcher picks up nextstep**

Run dev server, set cookie `toddlebaron-era=nextstep` in browser console:
```javascript
document.cookie = "toddlebaron-era=nextstep;path=/;max-age=2592000";
```
Then visit `/`. Should redirect to `/nextstep`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(nextstep): client-side era-switcher routing"
```

---

### Task 8: Mobile Layout

**Files:**
- Create: `src/themes/nextstep/NXMobile.astro`
- Modify: `src/layouts/NXDesktop.astro` (include mobile layout)

- [ ] **Step 1: Create `src/themes/nextstep/NXMobile.astro`**

Mobile layout for screens below 768px. Pattern from `src/components/MobileLayout.astro` (700 lines) but simpler — NeXT-styled cards that stack vertically, bottom tab bar instead of shelf.

Props: receives the page/window data so it can render content cards.

```astro
---
import { shelfItems } from "./nx-icons";

export interface Props {
  windows: { windowId: string; title: string; icon: string }[];
}
const { windows } = Astro.props;
---

<div class="nx-mobile">
  <header class="nx-mobile-bar">
    <span class="nx-mobile-brand">NeXT</span>
    <time class="nx-menu-clock nx-mobile-clock"></time>
  </header>

  <div class="nx-mobile-content">
    {windows.map((win) => (
      <article class="nx-mobile-card" data-mobile-window={win.windowId}>
        <div class="nx-mobile-card-header">
          <span>{win.icon}</span> {win.title}
        </div>
        <div class="nx-mobile-card-body">
          <slot name={win.windowId} />
        </div>
      </article>
    ))}
  </div>

  <nav class="nx-mobile-tabs" role="tablist" aria-label="Navigation">
    {shelfItems.slice(0, 5).map((item) => (
      <button class="nx-mobile-tab" data-mobile-tab={item.windowId} role="tab" aria-label={item.label}>
        <span>{item.icon}</span>
        <span class="nx-mobile-tab-label">{item.label}</span>
      </button>
    ))}
    <button class="nx-mobile-tab" data-mobile-tab="more" role="tab" aria-label="More">
      <span>⋯</span>
      <span class="nx-mobile-tab-label">More</span>
    </button>
  </nav>
</div>

<script>
  // Mobile tab switching
  document.querySelectorAll<HTMLElement>(".nx-mobile-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.mobileTab;
      // Scroll to the matching card
      const card = document.querySelector<HTMLElement>(`.nx-mobile-card[data-mobile-window="${targetId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update active tab
        document.querySelectorAll(".nx-mobile-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      }
    });
  });
</script>
```

- [ ] **Step 2: Include NXMobile in NXDesktop.astro**

Add the mobile component to `NXDesktop.astro`, passing window data. The CSS media queries in `theme.css` handle show/hide.

- [ ] **Step 3: Test at mobile viewport**

Open Chrome DevTools, set viewport to 375x812 (iPhone). Verify: cards stack, bottom tab bar visible, no shelf/dock/overlap.

- [ ] **Step 4: Commit**

```bash
git add src/themes/nextstep/NXMobile.astro src/layouts/NXDesktop.astro
git commit -m "feat(nextstep): mobile layout with card stacking and tab bar"
```

---

## Phase 2: Content Windows

### Task 9: Project Data & NXMillerBrowser

**Files:**
- Create: `src/data/projects.ts`
- Replace placeholder: `src/themes/nextstep/NXMillerBrowser.astro`

- [ ] **Step 1: Create `src/data/projects.ts`**

Structured project data for the Miller Browser. Categories: Enterprise, Creative, Military, Open Source.

```typescript
export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  techStack: string[];
  status: "live" | "active" | "archived" | "prototype";
  url?: string;
}

export const categories = ["Enterprise", "Creative", "Military", "Open Source"] as const;

export const projects: Project[] = [
  // Enterprise
  {
    id: "aicr",
    name: "AICR Platform",
    category: "Enterprise",
    description: "Enterprise governance platform for AI-assisted development. Policy enforcement, usage metering, audit trails, and multi-tenant governance.",
    techStack: ["Next.js", "TypeScript", "Go", "PostgreSQL", "gRPC"],
    status: "live",
    url: "https://app.aicoderally.com",
  },
  {
    id: "prizym",
    name: "Prizym ICM",
    category: "Enterprise",
    description: "Incentive compensation management platform. Plan modeling, calculation engine, dispute resolution.",
    techStack: ["Next.js", "TypeScript", "Go", "PostgreSQL"],
    status: "active",
  },
  {
    id: "bhg",
    name: "Blue Horizons Group",
    category: "Enterprise",
    description: "SPM consulting channel partner. SPARCC suite deployment for sales performance management.",
    techStack: ["Next.js", "TypeScript", "Prisma"],
    status: "active",
  },
  {
    id: "ispm",
    name: "ISPM Consulting",
    category: "Enterprise",
    description: "Custom SPM consulting platform. 30+ years of enterprise consulting distilled into software.",
    techStack: ["Next.js", "TypeScript"],
    status: "live",
  },
  // Creative
  {
    id: "minethegap",
    name: "MineTheGap",
    category: "Creative",
    description: "Fractal art exploration and rendering. Mathematical beauty at infinite zoom.",
    techStack: ["TypeScript", "WebGL", "Canvas"],
    status: "active",
  },
  {
    id: "toddlebaron",
    name: "toddlebaron.com",
    category: "Creative",
    description: "This website. Three themed eras: BBS terminal, SGI IRIX desktop, NeXTSTEP Color.",
    techStack: ["Astro", "TypeScript", "CSS"],
    status: "live",
    url: "https://toddlebaron.com",
  },
  // Military
  {
    id: "navy",
    name: "U.S. Navy Service",
    category: "Military",
    description: "Naval service record and contributions. Foundation for systems thinking and leadership.",
    techStack: [],
    status: "archived",
  },
  {
    id: "usaf-ai",
    name: "USAF AI Programs",
    category: "Military",
    description: "Air Force artificial intelligence initiatives and advisory work.",
    techStack: ["AI/ML", "Policy"],
    status: "archived",
  },
  {
    id: "stratcom",
    name: "STRATCOM",
    category: "Military",
    description: "Strategic Command consulting and support operations.",
    techStack: ["Systems Engineering"],
    status: "archived",
  },
  // Open Source
  {
    id: "astro-themes",
    name: "Astro Theme Engine",
    category: "Open Source",
    description: "Multi-theme engine for Astro sites with day-of-week rotation and cookie overrides.",
    techStack: ["Astro", "TypeScript"],
    status: "active",
  },
];
```

Todd should review and expand this data. The structure matters more than completeness — he can add projects later.

- [ ] **Step 2: Implement `NXMillerBrowser.astro`**

Replace the placeholder. Three-column drill-down browser reading from `projects.ts`.

```astro
---
import { projects, categories } from "../../data/projects";
---

<div class="nx-miller">
  <div class="nx-miller-col" id="nx-miller-categories">
    {categories.map((cat) => (
      <div class="nx-miller-row" data-miller-category={cat}>
        <span>📁</span> {cat}
        <span class="nx-miller-arrow">▸</span>
      </div>
    ))}
  </div>
  <div class="nx-miller-col" id="nx-miller-projects"></div>
  <div class="nx-miller-col" id="nx-miller-detail"></div>
</div>

<script define:vars={{ projects }}>
  // Miller column interaction
  const projectData = projects;

  document.querySelectorAll<HTMLElement>("[data-miller-category]").forEach((row) => {
    row.addEventListener("click", () => {
      // Highlight selected category
      document.querySelectorAll("[data-miller-category]").forEach((r) => r.classList.remove("selected"));
      row.classList.add("selected");

      // Populate projects column
      const cat = row.dataset.millerCategory;
      const filtered = projectData.filter((p) => p.category === cat);
      const col = document.getElementById("nx-miller-projects");
      if (!col) return;

      col.innerHTML = filtered.map((p) =>
        `<div class="nx-miller-row" data-miller-project="${p.id}">
          <span>${p.status === "live" ? "🟢" : p.status === "active" ? "🔵" : "⚪"}</span>
          ${p.name}
          <span class="nx-miller-arrow">▸</span>
        </div>`
      ).join("");

      // Clear detail column
      const detail = document.getElementById("nx-miller-detail");
      if (detail) detail.innerHTML = "";

      // Wire project clicks
      col.querySelectorAll<HTMLElement>("[data-miller-project]").forEach((projRow) => {
        projRow.addEventListener("click", () => {
          col.querySelectorAll("[data-miller-project]").forEach((r) => r.classList.remove("selected"));
          projRow.classList.add("selected");

          const proj = projectData.find((p) => p.id === projRow.dataset.millerProject);
          if (!proj || !detail) return;

          detail.innerHTML = `
            <div style="padding:12px;">
              <h3 style="margin:0 0 8px;font-size:16px;color:var(--nx-text-primary);">${proj.name}</h3>
              <p style="font-size:13px;color:var(--nx-text-secondary);margin:0 0 12px;">${proj.description}</p>
              ${proj.techStack.length ? `<div style="margin-bottom:8px;">
                <span style="font-size:10px;text-transform:uppercase;color:var(--nx-text-muted);">Tech Stack</span>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
                  ${proj.techStack.map((t) => `<span class="nx-info-tag">${t}</span>`).join("")}
                </div>
              </div>` : ""}
              <div style="margin-top:8px;">
                <span class="nx-info-tag" style="background:${
                  proj.status === "live" ? "rgba(106,238,106,0.15)" :
                  proj.status === "active" ? "rgba(106,175,238,0.15)" : "rgba(255,255,255,0.05)"
                };color:${
                  proj.status === "live" ? "var(--nx-accent-green)" :
                  proj.status === "active" ? "var(--nx-accent-blue)" : "var(--nx-text-muted)"
                };">● ${proj.status.toUpperCase()}</span>
              </div>
              ${proj.url ? `<a href="${proj.url}" target="_blank" style="display:inline-block;margin-top:12px;font-size:12px;color:var(--nx-accent-blue);">Visit →</a>` : ""}
            </div>
          `;
        });
      });
    });
  });
</script>
```

- [ ] **Step 3: Verify in dev server**

Navigate to `/nextstep`, open the Projects window. Click categories → projects → see detail. All three columns should populate correctly.

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.ts src/themes/nextstep/NXMillerBrowser.astro
git commit -m "feat(nextstep): Miller Browser with project data"
```

---

### Task 10: NXInfoPanel (Home/About)

**Files:**
- Replace placeholder: `src/themes/nextstep/NXInfoPanel.astro`

- [ ] **Step 1: Implement NXInfoPanel**

Bio header (avatar, name, title, tags), 2x2 status grid, rotating quote from `fortunes.ts`.

```astro
---
import { fortunes } from "../../data/fortunes";
const randomQuote = fortunes[Math.floor(Math.random() * fortunes.length)];
---

<div class="nx-info-panel">
  <div class="nx-info-header">
    <span class="nx-info-avatar">🦎</span>
    <div>
      <div class="nx-info-name">Todd LeBaron</div>
      <div class="nx-info-title">Builder of Things That Matter Since 1994</div>
      <div class="nx-info-tags">
        <span class="nx-info-tag">Enterprise SPM</span>
        <span class="nx-info-tag">AI Governance</span>
        <span class="nx-info-tag">Fractal Art</span>
        <span class="nx-info-tag">Warhammer 40K</span>
        <span class="nx-info-tag">Retro Computing</span>
      </div>
    </div>
  </div>

  <div class="nx-status-grid">
    <div class="nx-status-card">
      <div class="nx-status-label">Years Active</div>
      <div class="nx-status-value">{new Date().getFullYear() - 1994}+</div>
    </div>
    <div class="nx-status-card">
      <div class="nx-status-label">Active Projects</div>
      <div class="nx-status-value">6</div>
    </div>
    <div class="nx-status-card">
      <div class="nx-status-label">Coffee Status</div>
      <div class="nx-status-value" style="color:var(--nx-accent-green);">● BREWING</div>
    </div>
    <div class="nx-status-card">
      <div class="nx-status-label">40K Backlog</div>
      <div class="nx-status-value" style="color:var(--nx-accent-amber);">∞</div>
    </div>
  </div>

  <blockquote style="margin-top:20px;padding:12px;border-left:3px solid var(--nx-accent-blue);font-style:italic;color:var(--nx-text-secondary);font-size:13px;">
    {randomQuote}
  </blockquote>
</div>
```

- [ ] **Step 2: Verify in dev server**

Open About window. Check: avatar, name, tags, 2x2 grid, quote renders.

- [ ] **Step 3: Commit**

```bash
git add src/themes/nextstep/NXInfoPanel.astro
git commit -m "feat(nextstep): NXInfoPanel with bio and status grid"
```

---

### Task 11: NXDocViewer (Resume)

**Files:**
- Replace placeholder: `src/themes/nextstep/NXDocViewer.astro`

- [ ] **Step 1: Implement NXDocViewer**

Toolbar with 3 tab buttons (Timeline, Skills, Education). Body content switches via JS. Timeline renders career chronology. Skills reads from `src/data/skills.ts` (already exists). Education section with degrees/certs.

```astro
---
import { skills } from "../../data/skills";
---

<div class="nx-doc-viewer">
  <div class="nx-window-toolbar">
    <button class="nx-toolbar-btn active" data-doc-tab="timeline">Timeline</button>
    <button class="nx-toolbar-btn" data-doc-tab="skills">Skills</button>
    <button class="nx-toolbar-btn" data-doc-tab="education">Education</button>
  </div>
  <div class="nx-doc-content" data-doc-panel="timeline">
    <h2>Career Timeline</h2>
    <div style="border-left:2px solid var(--nx-accent-blue);padding-left:16px;margin-left:8px;">
      <div style="margin-bottom:16px;">
        <div style="font-weight:600;">U.S. Navy</div>
        <div style="font-size:12px;color:var(--nx-text-muted);">Service Member</div>
        <p style="font-size:13px;color:var(--nx-text-secondary);">Foundation for systems thinking, discipline, and leadership under pressure.</p>
      </div>
      <div style="margin-bottom:16px;">
        <div style="font-weight:600;">USAF AI Programs</div>
        <div style="font-size:12px;color:var(--nx-text-muted);">AI Advisory</div>
        <p style="font-size:13px;color:var(--nx-text-secondary);">Air Force artificial intelligence initiatives and policy work.</p>
      </div>
      <div style="margin-bottom:16px;">
        <div style="font-weight:600;">STRATCOM</div>
        <div style="font-size:12px;color:var(--nx-text-muted);">Strategic Consulting</div>
        <p style="font-size:13px;color:var(--nx-text-secondary);">Strategic Command consulting and support operations.</p>
      </div>
      <div style="margin-bottom:16px;">
        <div style="font-weight:600;">Enterprise SPM Consulting</div>
        <div style="font-size:12px;color:var(--nx-text-muted);">1994 — Present · 30+ Years</div>
        <p style="font-size:13px;color:var(--nx-text-secondary);">Sales Performance Management consulting across Fortune 500. Built ISPM, AICR, Prizym, and the Foundry model.</p>
      </div>
    </div>
  </div>

  <div class="nx-doc-content" data-doc-panel="skills" style="display:none;">
    <h2>Skills Matrix</h2>
    <div style="display:flex;flex-wrap:wrap;gap:6px;">
      {skills.map((skill) => (
        <span class="nx-info-tag">{skill.label}</span>
      ))}
    </div>
    <p style="font-size:11px;color:var(--nx-text-muted);margin-top:12px;">
      Skills data from src/data/skills.ts — uses label/value/color schema (no categories).
    </p>
  </div>

  <div class="nx-doc-content" data-doc-panel="education" style="display:none;">
    <h2>Education & Certifications</h2>
    <div style="margin-bottom:16px;">
      <div style="font-weight:600;">Physics</div>
      <div style="font-size:12px;color:var(--nx-text-muted);">University Degree</div>
      <p style="font-size:13px;color:var(--nx-text-secondary);">Foundation in analytical thinking, mathematical modeling, and first-principles reasoning.</p>
    </div>
    <div style="margin-bottom:16px;">
      <div style="font-weight:600;">Military Training</div>
      <div style="font-size:12px;color:var(--nx-text-muted);">U.S. Navy & Air Force</div>
      <p style="font-size:13px;color:var(--nx-text-secondary);">Leadership, systems engineering, strategic operations.</p>
    </div>
  </div>
</div>

<script>
  // Tab switching for doc viewer
  document.querySelectorAll<HTMLElement>("[data-doc-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.docTab;
      // Toggle active button
      btn.closest(".nx-doc-viewer")?.querySelectorAll(".nx-toolbar-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      // Toggle panels
      const viewer = btn.closest(".nx-doc-viewer");
      if (!viewer) return;
      viewer.querySelectorAll<HTMLElement>("[data-doc-panel]").forEach((panel) => {
        panel.style.display = panel.dataset.docPanel === tab ? "block" : "none";
      });
    });
  });
</script>
```

**Note:** `src/data/skills.ts` exports `Skill` objects with `{ label: string, value: number, color: string }` — no `category` field. The template above uses `skill.label` (not `skill.name`) and displays all skills in a flat list.

- [ ] **Step 2: Verify in dev server**

Open Resume window. Click Timeline → Skills → Education tabs. Content should switch.

- [ ] **Step 3: Commit**

```bash
git add src/themes/nextstep/NXDocViewer.astro
git commit -m "feat(nextstep): NXDocViewer with tab switching"
```

---

### Task 12: NXMailReader (Blog)

**Files:**
- Replace placeholder: `src/themes/nextstep/NXMailReader.astro`

- [ ] **Step 1: Implement NXMailReader**

Split-pane blog reader. Left: post titles with dates. Right: rendered markdown. Click post to load content.

**IMPORTANT:** Blog content rendering requires `await post.render()` which must happen in the page file (`nextstep.astro`), not inside a component. The approach: pre-render all posts in `nextstep.astro` and pass an array of `{ id, title, date, description, html: string }` to NXMailReader.

**In `nextstep.astro`**, before rendering the blog window, add:

```typescript
// Pre-render blog posts for NXMailReader
const renderedBlog = await Promise.all(
  blog.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(async (post) => {
      const rendered = await post.render();
      // Astro render() returns { Content } component, but we need HTML string.
      // Use the collection entry's compiled output or render to string.
      return {
        id: post.id,
        title: post.data.title,
        date: post.data.date,
        description: post.data.description,
        // body is raw markdown; for HTML, render each post as a slot in the window
      };
    })
);
```

Then for the blog window in `nextstep.astro`, render each post's Content inline:

```astro
if (wid === "blog") {
  const sortedBlog = [...blog].sort((a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  return (
    <NXWindow windowId={wid} title={page.data.title} {...pos}>
      <div class="nx-mail-split">
        <div class="nx-mail-list">
          {sortedBlog.map((post, i) => (
            <div class={`nx-mail-item ${i === 0 ? "selected" : ""}`} data-mail-post={post.id}>
              <div>{post.data.title}</div>
              <div class="nx-mail-date">{new Date(post.data.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <div class="nx-mail-content">
          {await Promise.all(sortedBlog.map(async (post, i) => {
            const { Content } = await post.render();
            return (
              <div data-mail-body={post.id} style={i > 0 ? "display:none;" : ""}>
                <h2>{post.data.title}</h2>
                <p style="color:var(--nx-text-muted);font-size:12px;margin-bottom:16px;">
                  {new Date(post.data.date).toLocaleDateString()} · {post.data.description}
                </p>
                <Content />
              </div>
            );
          }))}
        </div>
      </div>
    </NXWindow>
  );
}
```

The NXMailReader component becomes simpler — or can be inlined directly in the page entry point (as shown above). The click-to-switch JS toggles `display:none` on `[data-mail-body]` divs.

Add this click handler script to `NXDesktop.astro`:

```typescript
// Mail reader post switching
document.querySelectorAll<HTMLElement>("[data-mail-post]").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nx-mail-item").forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");
    const postId = item.dataset.mailPost;
    document.querySelectorAll<HTMLElement>("[data-mail-body]").forEach((body) => {
      body.style.display = body.dataset.mailBody === postId ? "block" : "none";
    });
  });
});
```

- [ ] **Step 2: Remove NXMailReader placeholder** (it's now inlined in nextstep.astro)

Delete `src/themes/nextstep/NXMailReader.astro` or keep it as a thin wrapper. The blog rendering logic lives in the page entry point because Astro requires `render()` at the page level.

- [ ] **Step 3: Verify in dev server**

Open Blog window. See post list on left, content on right. Click different posts.

- [ ] **Step 4: Commit**

```bash
git add src/themes/nextstep/NXMailReader.astro src/pages/nextstep.astro
git commit -m "feat(nextstep): NXMailReader with split-pane blog reading"
```

---

### Task 13: NXMuseum (Computing History)

**Files:**
- Replace placeholder: `src/themes/nextstep/NXMuseum.astro`

- [ ] **Step 1: Implement NXMuseum**

Timeline browser with expandable era "folders". Static data inline (small enough to not warrant a separate data file).

```astro
---
const eras = [
  {
    name: "Apple IIe Era",
    icon: "🍎",
    years: "1983-1990",
    machines: [
      { name: "Apple IIe", desc: "First personal computer. Learned BASIC. The machine that started everything." },
      { name: "Apple IIGS", desc: "Color graphics and sound. A revelation after the green screen." },
    ],
  },
  {
    name: "NeXT Era",
    icon: "⬛",
    years: "1990-1996",
    machines: [
      { name: "NeXT Cube", desc: "Steve Jobs' other computer. Object-oriented everything. Ahead of its time." },
      { name: "NeXTstation", desc: "The pizza box. Matte black. This theme's spiritual ancestor." },
    ],
  },
  {
    name: "SGI Era",
    icon: "🟣",
    years: "1994-2002",
    machines: [
      { name: "SGI Indy", desc: "The machine that made you believe in 3D. IndyCam, IRIX, and purple everywhere." },
      { name: "SGI O2", desc: "Unified memory architecture. Beautiful teal case. The site's SGI theme was born here." },
      { name: "SGI Octane", desc: "Workstation powerhouse. Dual-head, real-time 3D. The dream machine." },
    ],
  },
  {
    name: "Sun SPARC Era",
    icon: "☀️",
    years: "1996-2006",
    machines: [
      { name: "SPARCstation 5", desc: "The pizza box that ran Solaris. CDE desktop. Enterprise computing." },
      { name: "Ultra 60", desc: "Dual UltraSPARC. The machine that taught me about real multiprocessing." },
    ],
  },
  {
    name: "BeOS Era",
    icon: "🔵",
    years: "1998-2001",
    machines: [
      { name: "BeBox", desc: "Dual PowerPC. The Blinkenlights. An OS that was pure joy to use." },
      { name: "BeOS R5", desc: "Real-time media OS on x86. Pervasive multithreading. Gone too soon." },
    ],
  },
  {
    name: "Modern Era",
    icon: "💻",
    years: "2006-Present",
    machines: [
      { name: "MacBook Pro", desc: "The daily driver. NeXT's DNA lives on in macOS." },
      { name: "Custom Workstation", desc: "Multi-monitor, GPU compute, fractal rendering." },
    ],
  },
];
---

<div class="nx-museum">
  {eras.map((era) => (
    <div class="nx-museum-era">
      <div class="nx-museum-era-header" data-museum-toggle>
        <span>▸</span>
        <span>{era.icon}</span>
        <span>{era.name}</span>
        <span style="margin-left:auto;font-size:11px;color:var(--nx-text-muted);">{era.years}</span>
      </div>
      <div class="nx-museum-machines">
        {era.machines.map((m) => (
          <div class="nx-museum-machine">
            <div style="font-weight:600;color:var(--nx-text-primary);">{m.name}</div>
            <div>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

<script>
  document.querySelectorAll<HTMLElement>("[data-museum-toggle]").forEach((header) => {
    header.addEventListener("click", () => {
      const era = header.closest(".nx-museum-era");
      if (!era) return;
      era.classList.toggle("open");
      const arrow = header.querySelector("span");
      if (arrow) arrow.textContent = era.classList.contains("open") ? "▾" : "▸";
    });
  });
</script>
```

- [ ] **Step 2: Verify in dev server**

Open Museum window. Click era headers to expand/collapse. Machines should show/hide.

- [ ] **Step 3: Commit**

```bash
git add src/themes/nextstep/NXMuseum.astro
git commit -m "feat(nextstep): NXMuseum computing history timeline"
```

---

## Phase 3: Terminal & Easter Eggs

### Task 14: NXTerminal

**Files:**
- Replace placeholder: `src/themes/nextstep/NXTerminal.astro`

- [ ] **Step 1: Implement NXTerminal**

Terminal window that connects to `shell.ts`. Custom prompt: `lebaron@cube:~$`. Styled with NeXT terminal colors. Keyboard input, command history, scrolling output.

Follow the pattern of `src/themes/sgi-irix/Console.astro` but with NeXT styling.

```astro
---
// NXTerminal — connects to shell.ts engine
---

<div class="nx-terminal" id="nx-terminal">
  <div id="nx-terminal-output">
    <div style="color:var(--nx-accent-blue);margin-bottom:8px;">
      NeXTSTEP Terminal — toddlebaron.com<br/>
      Type 'help' for available commands.<br/><br/>
    </div>
  </div>
  <div style="display:flex;align-items:center;">
    <span class="nx-terminal-prompt">lebaron@cube:~$&nbsp;</span>
    <input
      type="text"
      class="nx-terminal-input"
      id="nx-terminal-input"
      autocomplete="off"
      spellcheck="false"
      autofocus
      aria-label="Terminal input"
    />
  </div>
</div>

<script>
  import { executeCommand, getPromptHTML } from "../../engine/shell";

  const output = document.getElementById("nx-terminal-output");
  const input = document.getElementById("nx-terminal-input") as HTMLInputElement;
  const history: string[] = [];
  let historyIndex = -1;

  // Override prompt style for NeXT
  function getPrompt(): string {
    return '<span class="nx-terminal-prompt">lebaron@cube:~$</span>&nbsp;';
  }

  function addOutput(html: string) {
    if (!output) return;
    const line = document.createElement("div");
    line.innerHTML = html;
    output.appendChild(line);
    // Scroll to bottom
    const terminal = document.getElementById("nx-terminal");
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.trim();
      if (!cmd) return;

      // Echo command
      addOutput(`${getPrompt()}${cmd}`);
      history.unshift(cmd);
      historyIndex = -1;
      input.value = "";

      // Execute
      const result = executeCommand(cmd);
      switch (result.type) {
        case "output":
          addOutput(result.html);
          break;
        case "clear":
          if (output) output.innerHTML = "";
          break;
        case "event":
          document.dispatchEvent(new CustomEvent(result.name, { detail: result.detail }));
          break;
      }
    }

    // History navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      } else {
        historyIndex = -1;
        input.value = "";
      }
    }
  });

  // Focus terminal on click
  document.getElementById("nx-terminal")?.addEventListener("click", () => input?.focus());
</script>
```

- [ ] **Step 2: Verify in dev server**

Open terminal (via Dock or contact window). Type `help`, `ls`, `whoami`, `fortune`. Commands should execute and output should render in green on dark background.

- [ ] **Step 3: Commit**

```bash
git add src/themes/nextstep/NXTerminal.astro
git commit -m "feat(nextstep): NXTerminal with shell integration"
```

---

### Task 15: Extended Shell Commands

**Files:**
- Modify: `src/engine/shell.ts`

- [ ] **Step 1: Add new commands to `src/engine/shell.ts`**

Add these commands to the commands registry (the `Record<string, ...>` object around line 85). Follow the existing command pattern — each is a function receiving a single `string` argument (not an array) and returning `CommandResult`. The `executeCommand` function splits the input at the first space: `cmd` gets the command name, `args` gets everything after it as one string.

```typescript
// Add to the commands object:

"make": (args) => {
  if (args.trim() === "coffee") {
    return {
      type: "output",
      html: `<pre style="color:#ccaa44;">
   ( (
    ) )
  ........
  |      |]
  \\      /
   \`----'
</pre>
<div>Brewing... ████████░░ 80%</div>
<div>Brewing... ██████████ 100%</div>
<div style="color:#6aee6a;">☕ Coffee ready. Productivity increased by 47%.</div>`,
    };
  }
  return { type: "output", html: `make: *** No rule to make target '${args.trim() || ""}'. Stop.` };
},

"deploy": (args) => {
  if (args.trim() === "godzilla") {
    return {
      type: "output",
      html: `<span style="color:#cc4444;">⚠️  WARNING: Kaiju deployment not authorized in production.</span>
<span style="color:#ccaa44;">Reason: Last deployment resulted in $2.4T in infrastructure damage.</span>
<span style="color:#999;">Contact site admin for Kaiju deployment credentials.</span>`,
    };
  }
  return { type: "output", html: `deploy: unknown target '${args.trim() || ""}'` };
},

"man": (args) => {
  if (args.trim() === "todd") {
    return {
      type: "output",
      html: `<pre style="color:var(--nx-text-primary, #e0e0e0);">
TODD(1)                    USER COMMANDS                    TODD(1)

NAME
       todd - builder of things that matter

SYNOPSIS
       todd [--coffee] [--code] [--consult] [--create]

DESCRIPTION
       Enterprise architect and consultant with 30+ years building
       systems that help organizations perform at their best. Known
       for SPM expertise, AI governance platforms, fractal art, and
       an unreasonable Godzilla collection.

       Started with an Apple IIe, fell in love with NeXT, spent
       formative years on SGI workstations, and never stopped
       building.

OPTIONS
       --coffee    Required. Do not operate without.
       --code      TypeScript, Go, Python, SQL, and whatever
                   the project needs.
       --consult   30+ years of enterprise consulting. Fortune 500
                   clients. SPM domain expertise.
       --create    Fractal art, retro computing, this website.

SEE ALSO
       resume(1), projects(1), godzilla(7)

BUGS
       Warhammer 40K backlog is technically infinite.
       Coffee consumption may exceed recommended limits.

                         toddlebaron.com                    TODD(1)
</pre>`,
    };
  }
  return { type: "output", html: `No manual entry for ${args.trim() || "man"}` };
},

"sudo": (args) => {
  if (args.includes("rm -rf /")) {
    return {
      type: "output",
      html: `<span style="color:#cc4444;">Nice try. Access denied.</span>
<span style="color:#999;">This isn't your first rodeo, and it isn't mine either.</span>`,
    };
  }
  return { type: "output", html: `sudo: permission denied` };
},

"uptime": () => {
  const start = new Date(1994, 0, 1);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const days = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return {
    type: "output",
    html: `up ${years} years, ${days} days. load average: coffee, code, consulting`,
  };
},

"mail": () => {
  return {
    type: "output",
    html: `<span style="color:var(--nx-accent-blue, #6aafee);">📬 Contact: todd@toddlebaron.com</span>
<span style="color:#999;">Or find me on LinkedIn / GitHub. Links in the shelf.</span>`,
  };
},
```

- [ ] **Step 2: Update the `help` command to list new commands**

Add the new commands to the help output string.

- [ ] **Step 3: Verify in dev server**

In terminal, test each new command: `make coffee`, `deploy godzilla`, `man todd`, `sudo rm -rf /`, `uptime`, `mail`.

- [ ] **Step 4: Commit**

```bash
git add src/engine/shell.ts
git commit -m "feat(nextstep): extended shell commands (coffee, godzilla, man todd)"
```

---

### Task 16: Playlist Data & Easter Egg Windows

**Files:**
- Create: `src/data/playlist.ts`
- Modify: `src/pages/nextstep.astro` (add easter egg windows)

- [ ] **Step 1: Create `src/data/playlist.ts`**

Static music playlist for the "Now Playing" dock easter egg.

```typescript
export interface Album {
  artist: string;
  album: string;
  tracks: string[];
}

export const playlist: Album[] = [
  {
    artist: "Tool",
    album: "Lateralus",
    tracks: ["The Grudge", "Eon Blue Apocalypse", "The Patient", "Lateralus", "Schism"],
  },
  {
    artist: "Mastodon",
    album: "Crack the Skye",
    tracks: ["Oblivion", "Divinations", "Quintessence", "The Czar", "The Last Baron"],
  },
  {
    artist: "Rush",
    album: "Moving Pictures",
    tracks: ["Tom Sawyer", "Red Barchetta", "YYZ", "Limelight", "The Camera Eye"],
  },
  {
    artist: "Iron Maiden",
    album: "Powerslave",
    tracks: ["Aces High", "2 Minutes to Midnight", "Flash of the Blade", "Rime of the Ancient Mariner"],
  },
];
```

Todd should customize this list. The structure is what matters.

- [ ] **Step 2: Add easter egg windows to `nextstep.astro`**

After the main content windows, add windows for: Fractals (Godzilla and Music windows are opened via dock). These are hidden by default and opened via dock clicks.

```astro
<!-- Easter egg windows -->
<NXWindow windowId="fractals" title="MineTheGap — Fractal Gallery" x={200} y={80} width={480} height={400}>
  <div style="text-align:center;padding:24px;">
    <div style="font-size:48px;margin-bottom:12px;">🌀</div>
    <h2>MineTheGap</h2>
    <p style="color:var(--nx-text-secondary);">Fractal art exploration. Mathematical beauty at infinite zoom.</p>
    <p style="color:var(--nx-text-muted);font-size:12px;margin-top:16px;">Gallery images coming soon. Check back after the polish pass.</p>
  </div>
</NXWindow>

<NXWindow windowId="godzilla" title="Kaiju Registry" x={240} y={60} width={460} height={380}>
  <div style="text-align:center;padding:24px;">
    <div style="font-size:48px;margin-bottom:12px;">🦎</div>
    <h2>Kaiju Registry</h2>
    <p style="color:var(--nx-text-secondary);">Collection & tattoo photos.</p>
    <p style="color:var(--nx-text-muted);font-size:12px;margin-top:16px;">Photos pending. In the meantime: yes, the tattoos are real.</p>
  </div>
</NXWindow>

<NXWindow windowId="music" title="Now Playing" x={300} y={120} width={320} height={280}>
  <div id="nx-now-playing" style="padding:12px;">
    <!-- Populated by script -->
  </div>
</NXWindow>
```

- [ ] **Step 3: Wire "Now Playing" script in NXDesktop.astro**

Add a script block that imports `playlist` and populates the music window with a random album/track.

- [ ] **Step 4: Verify in dev server**

Click dock tiles for Fractals, Godzilla, Music. Windows should open with content. Music should show a random album.

- [ ] **Step 5: Commit**

```bash
git add src/data/playlist.ts src/pages/nextstep.astro src/layouts/NXDesktop.astro
git commit -m "feat(nextstep): easter egg windows (fractals, godzilla, music)"
```

---

### Task 17: Konami Code & Dev Tools Easter Egg

**Files:**
- Modify: `src/layouts/NXDesktop.astro` (add script)

- [ ] **Step 1: Add Konami code listener to NXDesktop.astro**

Add to the `<script>` block:

```typescript
// ── Konami Code ────────────────────────
const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiIndex = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === konami[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      // Screen flash
      const flash = document.createElement("div");
      flash.style.cssText = "position:fixed;inset:0;background:#fff;z-index:99999;opacity:0.8;pointer-events:none;";
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 150);
      // Shake windows
      document.querySelectorAll(".nx-window").forEach((w) => {
        (w as HTMLElement).style.animation = "nx-shake 300ms ease";
        setTimeout(() => (w as HTMLElement).style.animation = "", 300);
      });
      // Terminal message
      const termOutput = document.getElementById("nx-terminal-output");
      if (termOutput) {
        const msg = document.createElement("div");
        msg.innerHTML = '<span style="color:#6aee6a;font-weight:bold;">🎮 CHEAT MODE ACTIVATED</span>';
        termOutput.appendChild(msg);
      }
    }
  } else {
    konamiIndex = 0;
  }
});

// ── 5-click NeXT brand easter egg ──────
let brandClicks = 0;
let brandTimer: ReturnType<typeof setTimeout>;
document.querySelector(".nx-menu-brand")?.addEventListener("click", () => {
  brandClicks++;
  clearTimeout(brandTimer);
  brandTimer = setTimeout(() => brandClicks = 0, 1500);
  if (brandClicks >= 5) {
    brandClicks = 0;
    // Open dev tools window (or About NeXT)
    openWindow("about-next-credits");
  }
});
```

- [ ] **Step 2: Add shake keyframe to theme.css**

```css
@keyframes nx-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(2px); }
}
```

- [ ] **Step 3: Add About NeXT credits window to nextstep.astro**

```astro
<NXWindow windowId="about-next-credits" title="About NeXT" x={250} y={100} width={360} height={240}>
  <div style="text-align:center;padding:24px;">
    <div style="font-size:32px;margin-bottom:12px;">⬛</div>
    <h2 style="margin-bottom:4px;">toddlebaron.com</h2>
    <p style="color:var(--nx-text-secondary);font-size:12px;">Astro 6 · TypeScript · Vanilla CSS</p>
    <p style="color:var(--nx-text-muted);font-size:11px;margin-top:12px;">
      Inspired by NeXT Computer, Inc. 1988–1997<br/>
      "The NeXT that kept evolving into 2026"
    </p>
    <p style="color:var(--nx-text-muted);font-size:10px;margin-top:16px;">
      Built with ☕ and 🦎 by Todd LeBaron
    </p>
  </div>
</NXWindow>
```

- [ ] **Step 4: Verify in dev server**

Test Konami code (↑↑↓↓←→←→BA). Flash, shake, terminal message should trigger. Test 5-rapid-click on NeXT brand → credits window.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/NXDesktop.astro src/themes/nextstep/theme.css src/pages/nextstep.astro
git commit -m "feat(nextstep): Konami code and dev tools easter eggs"
```

---

### Task 18: Polish Pass

**Files:**
- Various (all NeXTSTEP files)

- [ ] **Step 1: Accessibility audit**

Walk through the theme with keyboard only:
- Tab through shelf items, dock tiles, window controls
- Verify `aria-label` on all icon-only buttons
- Verify focus indicators (2px blue outline)
- Check `prefers-reduced-motion` — all animations should become opacity fades
- Verify minimum 13px font size for body content

- [ ] **Step 2: Cross-browser test**

Test in Chrome, Firefox, Safari:
- Window drag/resize
- Scrollbar styling (Firefox uses different scrollbar API)
- Custom properties inheritance
- Grid overlay rendering

- [ ] **Step 3: Mobile test**

Test at 375x812 (iPhone) and 768x1024 (iPad):
- Cards stack properly
- Bottom tab bar visible and functional
- No horizontal scroll
- Touch targets ≥ 44px

- [ ] **Step 4: Content review**

Ask Todd to review:
- Project data in `src/data/projects.ts`
- Music playlist in `src/data/playlist.ts`
- Museum era descriptions
- Career timeline in NXDocViewer
- Bio tags in NXInfoPanel

- [ ] **Step 5: Build and verify**

Run: `cd /Users/toddlebaron/Development/toddlebaron && npm run build && npm run preview`

Navigate to `/nextstep`. Full theme should work in production build.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat(nextstep): polish pass — accessibility, mobile, cross-browser"
```

---

## Summary

| Phase | Tasks | Estimated Steps | Key Deliverable |
|-------|-------|----------------|-----------------|
| 1: Chrome & Layout | Tasks 1-8 | ~30 steps | Navigable desktop with empty windows |
| 2: Content Windows | Tasks 9-13 | ~18 steps | All 6 content pages functional |
| 3: Terminal & Easter Eggs | Tasks 14-18 | ~20 steps | Terminal, extended commands, easter eggs, polish |

**Dependencies between tasks:**
- Task 6 (nextstep.astro) depends on Tasks 1-4 (components exist)
- Task 5 (NXDesktop) depends on Tasks 2-4 (imports components)
- Tasks 9-13 (content windows) can be done in any order
- Task 14 (terminal) is independent of Tasks 9-13
- Task 15 (shell commands) depends on Task 14
- Task 16 (easter eggs) depends on Task 5 (NXDesktop wiring)
- Task 17 (Konami) depends on Task 5
- Task 18 (polish) is last

**Total new files:** ~20
**Total modified files:** ~3 (wm.ts, shell.ts, index.astro routing)
**New npm dependencies:** 0
