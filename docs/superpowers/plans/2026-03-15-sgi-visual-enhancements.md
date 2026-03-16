# SGI Indigo Magic Visual Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 12 authentic SGI IRIX visual elements to toddlebaron.com — window menu buttons, sound pack, running man, color schemes, console, backgrounds, icon catalog, gauges, ButtonFly, desks overview, file manager, and splash screens.

**Architecture:** Component Library approach — each element is a standalone Astro component in `src/themes/sgi-irix/`. Content-bearing elements pull from typed data files in `src/data/`. All colors use CSS custom properties for live scheme switching. No new dependencies.

**Tech Stack:** Astro 6, vanilla TypeScript, CSS custom properties, SVG, CSS animations, Web Audio API

**Spec:** `docs/superpowers/specs/2026-03-15-sgi-visual-enhancements-design.md`

**Testing:** This is a static Astro site with no test framework. Verification is manual: `node node_modules/.bin/astro build` must succeed (zero errors), and visual inspection in browser via `node node_modules/.bin/astro dev`. Use Node 23 at `/opt/homebrew/Cellar/node/23.11.0/bin/node`.

**Build command:** `/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build`
**Dev command:** `/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro dev`

---

## File Map

### New files to create:
| File | Responsibility |
|------|---------------|
| `src/themes/sgi-irix/schemes.ts` | Color scheme definitions (6 schemes as typed objects) |
| `src/themes/sgi-irix/backgrounds.ts` | Desktop background definitions (6 CSS backgrounds) |
| `src/themes/sgi-irix/SchemeSelector.astro` | Color scheme picker window component |
| `src/themes/sgi-irix/Console.astro` | System console window component |
| `src/themes/sgi-irix/BackgroundPicker.astro` | Desktop background picker window component |
| `src/themes/sgi-irix/IconCatalog.astro` | Tabbed icon browser window component |
| `src/themes/sgi-irix/Gauge.astro` | Single SVG circular gauge component |
| `src/themes/sgi-irix/GaugeCluster.astro` | Flex row of Gauge components |
| `src/themes/sgi-irix/RunningMan.astro` | CSS animated running figure |
| `src/themes/sgi-irix/ButtonFly.astro` | Radial launcher FAB component |
| `src/themes/sgi-irix/FileManager.astro` | Dual-pane file browser window component |
| `src/themes/sgi-irix/SplashScreen.astro` | Window splash overlay component |
| `src/data/console-entries.ts` | Console log entries (typed array) |
| `src/data/catalog.ts` | Icon catalog categories and items |
| `src/data/skills.ts` | Skill names and proficiency values |
| `src/data/filesystem.ts` | File manager folder/file hierarchy |

### Existing files to modify:
| File | Changes |
|------|---------|
| `src/themes/theme-contract.ts` | Extend `ThemeConfig.sounds` with new sound slots |
| `src/themes/sgi-irix/theme.ts` | Add sound URLs to theme config |
| `src/themes/sgi-irix/theme.css` | Refactor colors to custom properties; add all new component styles |
| `src/themes/sgi-irix/Window.astro` | Add window menu button, splash container |
| `src/themes/sgi-irix/Toolchest.astro` | Add new windows to menu |
| `src/themes/sgi-irix/DesksPanel.astro` | Rewrite as virtual desktop minimap |
| `src/engine/wm.ts` | Add desk management, splash tracking, window-moved events |
| `src/engine/audio.ts` | No changes (existing API sufficient) |
| `src/layouts/Desktop.astro` | Add event handlers for all new features, scheme load script |
| `src/pages/index.astro` | Register all new windows, import new components |

---

## Chunk 1: CSS Custom Properties Refactor + Color Schemes

This chunk lays the foundation. All subsequent elements depend on the CSS custom property system.

### Task 1: Refactor theme.css to use semantic custom properties

**Files:**
- Modify: `src/themes/sgi-irix/theme.css`

This is a rename-and-refactor task. Every hardcoded color reference becomes a custom property. The existing `--sgi-purple` and `--sgi-teal` become `--sgi-primary` and `--sgi-secondary`.

- [ ] **Step 1: Replace `:root` variable block in theme.css**

Replace the current `:root` block (lines 1-15 of `src/themes/sgi-irix/theme.css`) with:

```css
:root {
  --sgi-primary: #6B3FA0;
  --sgi-secondary: #3A8A7A;
  --sgi-sky-dark: #465080;
  --sgi-sky-light: #8CA9D2;
  --sgi-widget: #C0C0C0;
  --sgi-widget-light: #E0E0E0;
  --sgi-widget-dark: #888888;
  --sgi-surface: #E8E8E8;
  --sgi-content-bg: #F5F5F0;
  --sgi-text: #222222;
  --sgi-text-muted: #666666;
  --sgi-title-text: #ffffff;
  --sgi-title-gradient: linear-gradient(90deg, var(--sgi-primary), #4A6FA0, var(--sgi-secondary));
  --sgi-sky-gradient: linear-gradient(180deg, var(--sgi-sky-dark) 0%, #6474A6 40%, var(--sgi-sky-light) 100%);
}
```

- [ ] **Step 2: Update all `var(--sgi-purple)` references to `var(--sgi-primary)`**

In `src/themes/sgi-irix/theme.css`, find-and-replace:
- `var(--sgi-purple)` → `var(--sgi-primary)` (should be 0 remaining after Step 1 updated the gradient, but check)

- [ ] **Step 3: Update all `var(--sgi-teal)` references to `var(--sgi-secondary)`**

Same file, find-and-replace:
- `var(--sgi-teal)` → `var(--sgi-secondary)` (should be 0 remaining, but check)

- [ ] **Step 4: Update hardcoded `#fff` in title text to use variable**

In `.sgi-window-title` (line 53), replace `color: #fff;` with `color: var(--sgi-title-text);`

- [ ] **Step 5: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```
Expected: Build succeeds with zero errors. Site looks identical (all colors same as before).

- [ ] **Step 6: Commit**

```bash
git add src/themes/sgi-irix/theme.css
git commit -m "refactor: rename CSS vars to semantic names (--sgi-primary/secondary)"
```

### Task 2: Create color scheme definitions

**Files:**
- Create: `src/themes/sgi-irix/schemes.ts`

- [ ] **Step 1: Create schemes.ts with all 6 scheme definitions**

Create `src/themes/sgi-irix/schemes.ts`:

```typescript
export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  skyDark: string;
  skyLight: string;
  widget: string;
  widgetLight: string;
  widgetDark: string;
  surface: string;
  contentBg: string;
  text: string;
  textMuted: string;
  titleText: string;
}

export const schemes: ColorScheme[] = [
  {
    id: "indigo",
    name: "Indigo",
    primary: "#6B3FA0",
    secondary: "#3A8A7A",
    skyDark: "#465080",
    skyLight: "#8CA9D2",
    widget: "#C0C0C0",
    widgetLight: "#E0E0E0",
    widgetDark: "#888888",
    surface: "#E8E8E8",
    contentBg: "#F5F5F0",
    text: "#222222",
    textMuted: "#666666",
    titleText: "#ffffff",
  },
  {
    id: "desert",
    name: "Desert",
    primary: "#B8860B",
    secondary: "#8B4513",
    skyDark: "#8B7355",
    skyLight: "#D2B48C",
    widget: "#D4C4A0",
    widgetLight: "#E8DCC0",
    widgetDark: "#A09070",
    surface: "#F0E8D8",
    contentBg: "#FAF5EB",
    text: "#3E2723",
    textMuted: "#795548",
    titleText: "#ffffff",
  },
  {
    id: "ocean",
    name: "Ocean",
    primary: "#1565C0",
    secondary: "#00ACC1",
    skyDark: "#0D2137",
    skyLight: "#1A4A6E",
    widget: "#A0B8C8",
    widgetLight: "#C0D8E8",
    widgetDark: "#607888",
    surface: "#E0E8F0",
    contentBg: "#F0F5FA",
    text: "#1A237E",
    textMuted: "#546E7A",
    titleText: "#ffffff",
  },
  {
    id: "midnight",
    name: "Midnight",
    primary: "#311B92",
    secondary: "#1A237E",
    skyDark: "#0A0A1A",
    skyLight: "#1A1A3E",
    widget: "#808098",
    widgetLight: "#9898B0",
    widgetDark: "#505068",
    surface: "#D0D0D8",
    contentBg: "#E0E0E8",
    text: "#1A1A2E",
    textMuted: "#606078",
    titleText: "#E0E0F0",
  },
  {
    id: "rosewood",
    name: "Rosewood",
    primary: "#8B1A1A",
    secondary: "#6D3A3A",
    skyDark: "#3E1A1A",
    skyLight: "#5E2A2A",
    widget: "#C0A0A0",
    widgetLight: "#D8C0C0",
    widgetDark: "#907070",
    surface: "#F0E0E0",
    contentBg: "#FAF0F0",
    text: "#3E1A1A",
    textMuted: "#8B6060",
    titleText: "#ffffff",
  },
  {
    id: "slate",
    name: "Slate",
    primary: "#455A64",
    secondary: "#607D8B",
    skyDark: "#37474F",
    skyLight: "#546E7A",
    widget: "#B0BEC5",
    widgetLight: "#CFD8DC",
    widgetDark: "#78909C",
    surface: "#ECEFF1",
    contentBg: "#F5F7F8",
    text: "#263238",
    textMuted: "#607D8B",
    titleText: "#ffffff",
  },
];

export function getSchemeById(id: string): ColorScheme | undefined {
  return schemes.find((s) => s.id === id);
}
```

- [ ] **Step 2: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```
Expected: Build succeeds (file is imported nowhere yet, but TypeScript should compile).

- [ ] **Step 3: Commit**

```bash
git add src/themes/sgi-irix/schemes.ts
git commit -m "feat: add 6 SGI color scheme definitions"
```

### Task 3: Create SchemeSelector window component

**Files:**
- Create: `src/themes/sgi-irix/SchemeSelector.astro`

- [ ] **Step 1: Create SchemeSelector.astro**

Create `src/themes/sgi-irix/SchemeSelector.astro`:

```astro
---
// src/themes/sgi-irix/SchemeSelector.astro
import { schemes } from "./schemes";
---

<div class="sgi-scheme-selector">
  <div class="sgi-scheme-header">Color Scheme</div>
  <div class="sgi-scheme-grid">
    {schemes.map((s) => (
      <button
        class="sgi-scheme-swatch"
        data-scheme-id={s.id}
        aria-label={`Apply ${s.name} color scheme`}
        title={s.name}
      >
        <div
          class="sgi-scheme-preview"
          style={`background: linear-gradient(135deg, ${s.primary}, ${s.secondary})`}
        ></div>
        <div
          class="sgi-scheme-sky"
          style={`background: linear-gradient(180deg, ${s.skyDark}, ${s.skyLight})`}
        ></div>
        <span class="sgi-scheme-label">{s.name}</span>
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Add CSS styles for SchemeSelector**

Add to the end of `src/themes/sgi-irix/theme.css` (before the `@media` query):

```css
/* Scheme Selector */
.sgi-scheme-selector {
  padding: 0;
}

.sgi-scheme-header {
  padding: 8px 12px;
  background: linear-gradient(180deg, #D8D8D8, #B0B0B0);
  font-weight: bold;
  font-size: 12px;
  border-bottom: 1px solid var(--sgi-widget-dark);
}

.sgi-scheme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.sgi-scheme-swatch {
  border: 2px outset var(--sgi-widget-light);
  background: var(--sgi-widget);
  cursor: pointer;
  padding: 4px;
  text-align: center;
}

.sgi-scheme-swatch:hover {
  border-color: var(--sgi-primary);
}

.sgi-scheme-swatch.active {
  border: 2px solid var(--sgi-primary);
  box-shadow: 0 0 4px var(--sgi-primary);
}

.sgi-scheme-preview {
  height: 20px;
  border: 1px solid #333;
}

.sgi-scheme-sky {
  height: 16px;
  border: 1px solid #333;
  border-top: none;
}

.sgi-scheme-label {
  display: block;
  font-size: 10px;
  margin-top: 4px;
  color: var(--sgi-text);
}
```

- [ ] **Step 3: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 4: Commit**

```bash
git add src/themes/sgi-irix/SchemeSelector.astro src/themes/sgi-irix/theme.css
git commit -m "feat: add SchemeSelector component with grid of scheme swatches"
```

### Task 4: Wire scheme selector into page + add live switching JS

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/themes/sgi-irix/Toolchest.astro`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Add SchemeSelector window to index.astro**

In `src/pages/index.astro`, add the import at the top of the frontmatter (after the existing imports around line 8):

```astro
import SchemeSelector from "../themes/sgi-irix/SchemeSelector.astro";
```

Then add the SchemeSelector window after the `</DesksPanel>` closing tag (before `</SGIDesktop>`), around line 58:

```astro
      <Window windowId="scheme-selector" title="Color Scheme" x={300} y={150} width={360} height={320}>
        <SchemeSelector />
      </Window>
```

- [ ] **Step 2: Add scheme-selector to Toolchest**

In `src/themes/sgi-irix/Toolchest.astro`, add a new item before the "Choose Era..." divider. After the closing `)}` of the windows map (around line 15), before the `<div class="sgi-toolchest-divider">`, add:

```astro
  <div class="sgi-toolchest-item" data-menu-open="scheme-selector" role="menuitem" tabindex="0">
    <span>Color Scheme...</span>
  </div>
```

- [ ] **Step 3: Add scheme switching JavaScript to Desktop.astro**

In `src/layouts/Desktop.astro`, add this script block inside `<head>` (after `<SEOHead>`, before `</head>`, around line 16). This MUST be `is:inline` to prevent FOUC:

```astro
    <script is:inline>
      (function() {
        var c = document.cookie.match(/toddlebaron-scheme=([^;]+)/);
        if (!c) return;
        var id = c[1];
        var schemes = {
          indigo: {"--sgi-primary":"#6B3FA0","--sgi-secondary":"#3A8A7A","--sgi-sky-dark":"#465080","--sgi-sky-light":"#8CA9D2","--sgi-widget":"#C0C0C0","--sgi-widget-light":"#E0E0E0","--sgi-widget-dark":"#888888","--sgi-surface":"#E8E8E8","--sgi-content-bg":"#F5F5F0","--sgi-text":"#222222","--sgi-text-muted":"#666666","--sgi-title-text":"#ffffff"},
          desert: {"--sgi-primary":"#B8860B","--sgi-secondary":"#8B4513","--sgi-sky-dark":"#8B7355","--sgi-sky-light":"#D2B48C","--sgi-widget":"#D4C4A0","--sgi-widget-light":"#E8DCC0","--sgi-widget-dark":"#A09070","--sgi-surface":"#F0E8D8","--sgi-content-bg":"#FAF5EB","--sgi-text":"#3E2723","--sgi-text-muted":"#795548","--sgi-title-text":"#ffffff"},
          ocean: {"--sgi-primary":"#1565C0","--sgi-secondary":"#00ACC1","--sgi-sky-dark":"#0D2137","--sgi-sky-light":"#1A4A6E","--sgi-widget":"#A0B8C8","--sgi-widget-light":"#C0D8E8","--sgi-widget-dark":"#607888","--sgi-surface":"#E0E8F0","--sgi-content-bg":"#F0F5FA","--sgi-text":"#1A237E","--sgi-text-muted":"#546E7A","--sgi-title-text":"#ffffff"},
          midnight: {"--sgi-primary":"#311B92","--sgi-secondary":"#1A237E","--sgi-sky-dark":"#0A0A1A","--sgi-sky-light":"#1A1A3E","--sgi-widget":"#808098","--sgi-widget-light":"#9898B0","--sgi-widget-dark":"#505068","--sgi-surface":"#D0D0D8","--sgi-content-bg":"#E0E0E8","--sgi-text":"#1A1A2E","--sgi-text-muted":"#606078","--sgi-title-text":"#E0E0F0"},
          rosewood: {"--sgi-primary":"#8B1A1A","--sgi-secondary":"#6D3A3A","--sgi-sky-dark":"#3E1A1A","--sgi-sky-light":"#5E2A2A","--sgi-widget":"#C0A0A0","--sgi-widget-light":"#D8C0C0","--sgi-widget-dark":"#907070","--sgi-surface":"#F0E0E0","--sgi-content-bg":"#FAF0F0","--sgi-text":"#3E1A1A","--sgi-text-muted":"#8B6060","--sgi-title-text":"#ffffff"},
          slate: {"--sgi-primary":"#455A64","--sgi-secondary":"#607D8B","--sgi-sky-dark":"#37474F","--sgi-sky-light":"#546E7A","--sgi-widget":"#B0BEC5","--sgi-widget-light":"#CFD8DC","--sgi-widget-dark":"#78909C","--sgi-surface":"#ECEFF1","--sgi-content-bg":"#F5F7F8","--sgi-text":"#263238","--sgi-text-muted":"#607D8B","--sgi-title-text":"#ffffff"}
        };
        var s = schemes[id];
        if (!s) return;
        var r = document.documentElement;
        for (var k in s) r.style.setProperty(k, s[k]);
        r.style.setProperty("--sgi-title-gradient", "linear-gradient(90deg, " + s["--sgi-primary"] + ", " + s["--sgi-secondary"] + ")");
        r.style.setProperty("--sgi-sky-gradient", "linear-gradient(180deg, " + s["--sgi-sky-dark"] + " 0%, " + s["--sgi-sky-light"] + " 100%)");
      })();
    </script>
```

- [ ] **Step 4: Add scheme click handler in Desktop.astro main script**

In the main `<script>` block of `src/layouts/Desktop.astro`, inside the click event handler (after the volume toggle handler around line 98), add:

```typescript
        // Scheme selector
        const schemeSwatch = target.closest<HTMLElement>("[data-scheme-id]");
        if (schemeSwatch) {
          const schemeId = schemeSwatch.dataset.schemeId!;
          document.querySelectorAll(".sgi-scheme-swatch").forEach((s) => s.classList.remove("active"));
          schemeSwatch.classList.add("active");
          // Apply scheme
          import("../themes/sgi-irix/schemes").then(({ getSchemeById }) => {
            const scheme = getSchemeById(schemeId);
            if (!scheme) return;
            const r = document.documentElement;
            r.style.setProperty("--sgi-primary", scheme.primary);
            r.style.setProperty("--sgi-secondary", scheme.secondary);
            r.style.setProperty("--sgi-sky-dark", scheme.skyDark);
            r.style.setProperty("--sgi-sky-light", scheme.skyLight);
            r.style.setProperty("--sgi-widget", scheme.widget);
            r.style.setProperty("--sgi-widget-light", scheme.widgetLight);
            r.style.setProperty("--sgi-widget-dark", scheme.widgetDark);
            r.style.setProperty("--sgi-surface", scheme.surface);
            r.style.setProperty("--sgi-content-bg", scheme.contentBg);
            r.style.setProperty("--sgi-text", scheme.text);
            r.style.setProperty("--sgi-text-muted", scheme.textMuted);
            r.style.setProperty("--sgi-title-text", scheme.titleText);
            r.style.setProperty("--sgi-title-gradient", `linear-gradient(90deg, ${scheme.primary}, ${scheme.secondary})`);
            r.style.setProperty("--sgi-sky-gradient", `linear-gradient(180deg, ${scheme.skyDark} 0%, ${scheme.skyLight} 100%)`);
            document.cookie = `toddlebaron-scheme=${schemeId};path=/;max-age=${30 * 24 * 60 * 60}`;
          });
          return;
        }
```

- [ ] **Step 5: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/themes/sgi-irix/Toolchest.astro src/layouts/Desktop.astro
git commit -m "feat: wire scheme selector — live switching with cookie persistence"
```

---

## Chunk 2: Window Menu Button + Sound Pack + Theme Contract

### Task 5: Extend ThemeConfig.sounds and update SGI theme

**Files:**
- Modify: `src/themes/theme-contract.ts`
- Modify: `src/themes/sgi-irix/theme.ts`

- [ ] **Step 1: Add new sound slots to ThemeConfig interface**

In `src/themes/theme-contract.ts`, replace the `sounds` block (lines 6-12) with:

```typescript
  sounds: {
    boot?: string;
    shutdown?: string;
    windowOpen?: string;
    windowClose?: string;
    click?: string;
    menuClick?: string;
    iconSelect?: string;
    error?: string;
    ding?: string;
  };
```

- [ ] **Step 2: Add sound URLs to SGI theme**

In `src/themes/sgi-irix/theme.ts`, replace the `sounds` block (lines 9-12) with:

```typescript
  sounds: {
    boot: "/audio/sgi-boot.mp3",
    shutdown: "/audio/sgi-shutdown.mp3",
    windowOpen: "/audio/sgi-window-open.mp3",
    windowClose: "/audio/sgi-window-close.mp3",
    menuClick: "/audio/sgi-menu-click.mp3",
    iconSelect: "/audio/sgi-icon-select.mp3",
    error: "/audio/sgi-error.mp3",
    ding: "/audio/sgi-ding.mp3",
  },
```

- [ ] **Step 3: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 4: Commit**

```bash
git add src/themes/theme-contract.ts src/themes/sgi-irix/theme.ts
git commit -m "feat: extend ThemeConfig.sounds with 6 new sound slots"
```

### Task 6: Add sound effect audio files

**Files:**
- Create: `public/audio/sgi-window-open.mp3`
- Create: `public/audio/sgi-window-close.mp3`
- Create: `public/audio/sgi-menu-click.mp3`
- Create: `public/audio/sgi-icon-select.mp3`
- Create: `public/audio/sgi-error.mp3`
- Create: `public/audio/sgi-ding.mp3`

- [ ] **Step 1: Search Internet Archive for SGI IRIX sounds**

Search for SGI IRIX sound effects on the Internet Archive. Look for collections like "SGI IRIX sounds", "Indigo Magic sounds", "IRIX 6.5 audio". If exact SGI sounds are unavailable, search for Motif/CDE UI sounds or generic retro UI beeps.

Download 6 short sound effects (100-300ms each) and save them to `public/audio/`. Use `curl` or `wget` to download directly.

If no suitable sounds are found online, generate minimal placeholder sounds using `ffmpeg` (sine wave beeps):

```bash
cd /Users/todd.lebaron/Development/toddlebaron.com/public/audio
# Window open: short rising tone
ffmpeg -f lavfi -i "sine=frequency=800:duration=0.15" -af "afade=t=out:st=0.1:d=0.05" -y sgi-window-open.mp3
# Window close: short falling tone
ffmpeg -f lavfi -i "sine=frequency=600:duration=0.12" -af "afade=t=out:st=0.08:d=0.04" -y sgi-window-close.mp3
# Menu click: very short click
ffmpeg -f lavfi -i "sine=frequency=1200:duration=0.05" -af "afade=t=out:st=0.03:d=0.02" -y sgi-menu-click.mp3
# Icon select: soft tap
ffmpeg -f lavfi -i "sine=frequency=1000:duration=0.08" -af "afade=t=out:st=0.05:d=0.03" -y sgi-icon-select.mp3
# Error: two-tone beep
ffmpeg -f lavfi -i "sine=frequency=400:duration=0.3" -af "afade=t=out:st=0.2:d=0.1" -y sgi-error.mp3
# Ding: pleasant chime
ffmpeg -f lavfi -i "sine=frequency=1400:duration=0.2" -af "afade=t=out:st=0.1:d=0.1" -y sgi-ding.mp3
```

- [ ] **Step 2: Verify files exist and are valid**

```bash
ls -la /Users/todd.lebaron/Development/toddlebaron.com/public/audio/sgi-*.mp3
file /Users/todd.lebaron/Development/toddlebaron.com/public/audio/sgi-window-open.mp3
```

- [ ] **Step 3: Commit**

```bash
git add public/audio/sgi-window-open.mp3 public/audio/sgi-window-close.mp3 public/audio/sgi-menu-click.mp3 public/audio/sgi-icon-select.mp3 public/audio/sgi-error.mp3 public/audio/sgi-ding.mp3
git commit -m "feat: add 6 SGI UI sound effects"
```

### Task 7: Wire sound effects into event handlers

**Files:**
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Add playSound calls to existing event handlers**

In `src/layouts/Desktop.astro`, in the main `<script>` block, add sound triggers at the following locations:

After `closeWindow(windowTarget)` (line 55):
```typescript
          if (action === "close") { closeWindow(windowTarget); playSound("/audio/sgi-window-close.mp3"); }
```

After `minimizeWindow(windowTarget)` (line 56):
```typescript
          if (action === "minimize") { minimizeWindow(windowTarget); playSound("/audio/sgi-window-close.mp3"); }
```

In the `menuOpen` handler (line 64), after `openWindow(...)`:
```typescript
          openWindow(menuOpen.dataset.menuOpen!);
          playSound("/audio/sgi-menu-click.mp3");
```

In the `menuAction` handler, before the existing action logic:
```typescript
          playSound("/audio/sgi-menu-click.mp3");
```

- [ ] **Step 2: Add window-open sound to wm:window-opened listener**

Add a new listener in the main script block (after the boot:complete handler, around line 32):

```typescript
      document.addEventListener("wm:window-opened", () => {
        playSound("/audio/sgi-window-open.mp3");
      });
```

- [ ] **Step 3: Add icon select sound to desktop.ts**

In `src/engine/desktop.ts`, add the import at the top:

```typescript
import { playSound } from "./audio";
```

In the `selectIcon` function (line 26), add after `icon.classList.add("selected")`:

```typescript
  playSound("/audio/sgi-icon-select.mp3");
```

- [ ] **Step 4: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Desktop.astro src/engine/desktop.ts
git commit -m "feat: wire sound effects to window/menu/icon interactions"
```

### Task 8: Add window menu button to Window.astro

**Files:**
- Modify: `src/themes/sgi-irix/Window.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Add window menu button markup to Window.astro**

Replace the entire content of `src/themes/sgi-irix/Window.astro` with:

```astro
---
// src/themes/sgi-irix/Window.astro
export interface Props {
  windowId: string;
  title: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
}
const { windowId, title, x = 150, y = 80, width = 520, height = 420, visible = false } = Astro.props;
---

<div
  class="sgi-window"
  data-window-id={windowId}
  style={`left:${x}px; top:${y}px; width:${width}px; height:${height}px; display:${visible ? "flex" : "none"}`}
>
  <div class="sgi-window-titlebar" data-drag-handle={windowId}>
    <button class="sgi-window-menu-btn" data-window-menu={windowId} aria-label="Window menu">
      <span class="sgi-menu-lines"></span>
    </button>
    <span class="sgi-window-title">{title}</span>
    <div class="sgi-window-controls">
      <button class="sgi-window-btn" data-action="minimize" data-target={windowId} aria-label="Minimize">_</button>
      <button class="sgi-window-btn" data-action="maximize" data-target={windowId} aria-label="Maximize">□</button>
      <button class="sgi-window-btn" data-action="close" data-target={windowId} aria-label="Close">×</button>
    </div>
    <div class="sgi-window-dropdown" data-dropdown-for={windowId} style="display:none">
      <div class="sgi-dropdown-item" data-action="minimize" data-target={windowId}>Minimize</div>
      <div class="sgi-dropdown-item" data-action="maximize" data-target={windowId}>Maximize</div>
      <div class="sgi-dropdown-item" data-action="raise" data-target={windowId}>Raise</div>
      <div class="sgi-dropdown-divider"></div>
      <div class="sgi-dropdown-item" data-action="close" data-target={windowId}>Close</div>
    </div>
  </div>
  <div class="sgi-window-content">
    <slot />
  </div>
  <div class="sgi-window-resize" data-resize-handle={windowId}></div>
</div>
```

- [ ] **Step 2: Add CSS for window menu button and dropdown**

Add to `src/themes/sgi-irix/theme.css` (before the `@media` query):

```css
/* Window Menu Button */
.sgi-window-menu-btn {
  width: 16px;
  height: 16px;
  background: var(--sgi-widget);
  border: 1px outset var(--sgi-widget-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  padding: 0;
  flex-shrink: 0;
}

.sgi-window-menu-btn:active {
  border-style: inset;
}

.sgi-menu-lines {
  display: block;
  width: 10px;
  height: 8px;
  background: repeating-linear-gradient(
    to bottom,
    #333 0px, #333 2px,
    transparent 2px, transparent 4px
  );
}

/* Dropdown Menu (shared style) */
.sgi-window-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5000;
  background: var(--sgi-widget);
  border: 2px outset var(--sgi-widget-light);
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  min-width: 160px;
}

.sgi-dropdown-item {
  padding: 4px 12px;
  cursor: pointer;
  border-bottom: 1px solid #AAA;
}

.sgi-dropdown-item:hover {
  background: var(--sgi-title-gradient);
  color: #fff;
}

.sgi-dropdown-item:last-child {
  border-bottom: none;
}

.sgi-dropdown-divider {
  height: 1px;
  background: #AAA;
  margin: 2px 0;
}
```

- [ ] **Step 3: Add window menu click handler in Desktop.astro**

In `src/layouts/Desktop.astro`, in the main `<script>` click handler, add before the existing window button handler (around line 48):

```typescript
        // Window menu button
        const menuBtn = target.closest<HTMLElement>("[data-window-menu]");
        if (menuBtn) {
          e.stopPropagation();
          const wId = menuBtn.dataset.windowMenu!;
          const dropdown = document.querySelector<HTMLElement>(`[data-dropdown-for="${wId}"]`);
          if (dropdown) {
            const isOpen = dropdown.style.display !== "none";
            // Close all dropdowns first
            document.querySelectorAll<HTMLElement>(".sgi-window-dropdown").forEach((d) => d.style.display = "none");
            if (!isOpen) {
              dropdown.style.display = "block";
              playSound("/audio/sgi-menu-click.mp3");
            }
          }
          return;
        }

        // Dropdown item click
        const dropdownItem = target.closest<HTMLElement>(".sgi-dropdown-item");
        if (dropdownItem) {
          const action = dropdownItem.dataset.action;
          const windowTarget = dropdownItem.dataset.target;
          if (action && windowTarget) {
            if (action === "close") { closeWindow(windowTarget); playSound("/audio/sgi-window-close.mp3"); }
            if (action === "minimize") { minimizeWindow(windowTarget); playSound("/audio/sgi-window-close.mp3"); }
            if (action === "maximize") maximizeWindow(windowTarget);
            if (action === "raise") bringToFront(windowTarget);
          }
          // Close all dropdowns
          document.querySelectorAll<HTMLElement>(".sgi-window-dropdown").forEach((d) => d.style.display = "none");
          return;
        }

        // Close dropdowns on any other click
        document.querySelectorAll<HTMLElement>(".sgi-window-dropdown").forEach((d) => d.style.display = "none");
```

- [ ] **Step 4: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 5: Commit**

```bash
git add src/themes/sgi-irix/Window.astro src/themes/sgi-irix/theme.css src/layouts/Desktop.astro
git commit -m "feat: add window menu button with dropdown to all windows"
```

---

## Chunk 3: Running Man + Console Window + Desktop Backgrounds

### Task 9: Create RunningMan component

**Files:**
- Create: `src/themes/sgi-irix/RunningMan.astro`
- Modify: `src/themes/sgi-irix/theme.css`

- [ ] **Step 1: Create RunningMan.astro**

Create `src/themes/sgi-irix/RunningMan.astro`:

```astro
---
// src/themes/sgi-irix/RunningMan.astro
export interface Props {
  size?: number;
  color?: string;
}
const { size = 32, color = "#33FF33" } = Astro.props;
---

<div class="sgi-running-man" style={`width:${size}px; height:${size}px; --rm-color:${color}`}>
  <div class="rm-head"></div>
  <div class="rm-body"></div>
  <div class="rm-arm rm-arm-l"></div>
  <div class="rm-arm rm-arm-r"></div>
  <div class="rm-leg rm-leg-l"></div>
  <div class="rm-leg rm-leg-r"></div>
</div>
```

- [ ] **Step 2: Add RunningMan CSS animation to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* Running Man */
.sgi-running-man {
  position: relative;
  display: inline-block;
}

.sgi-running-man .rm-head {
  position: absolute;
  width: 25%;
  height: 25%;
  background: var(--rm-color);
  border-radius: 50%;
  top: 0;
  left: 37.5%;
}

.sgi-running-man .rm-body {
  position: absolute;
  width: 12.5%;
  height: 35%;
  background: var(--rm-color);
  top: 22%;
  left: 43.75%;
}

.sgi-running-man .rm-arm {
  position: absolute;
  width: 6%;
  height: 30%;
  background: var(--rm-color);
  top: 25%;
  transform-origin: top center;
}

.sgi-running-man .rm-arm-l {
  left: 35%;
  animation: rm-arm-swing 0.4s ease-in-out infinite alternate;
}

.sgi-running-man .rm-arm-r {
  left: 59%;
  animation: rm-arm-swing 0.4s ease-in-out infinite alternate-reverse;
}

.sgi-running-man .rm-leg {
  position: absolute;
  width: 6%;
  height: 35%;
  background: var(--rm-color);
  top: 55%;
  transform-origin: top center;
}

.sgi-running-man .rm-leg-l {
  left: 38%;
  animation: rm-leg-swing 0.4s ease-in-out infinite alternate;
}

.sgi-running-man .rm-leg-r {
  left: 56%;
  animation: rm-leg-swing 0.4s ease-in-out infinite alternate-reverse;
}

@keyframes rm-arm-swing {
  from { transform: rotate(-35deg); }
  to { transform: rotate(35deg); }
}

@keyframes rm-leg-swing {
  from { transform: rotate(-30deg); }
  to { transform: rotate(30deg); }
}
```

- [ ] **Step 3: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 4: Commit**

```bash
git add src/themes/sgi-irix/RunningMan.astro src/themes/sgi-irix/theme.css
git commit -m "feat: add RunningMan CSS animated busy indicator"
```

### Task 10: Create Console window

**Files:**
- Create: `src/data/console-entries.ts`
- Create: `src/themes/sgi-irix/Console.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Create console-entries.ts data file**

Create `src/data/console-entries.ts`:

```typescript
export interface ConsoleEntry {
  date: string;
  time: string;
  message: string;
  type: "info" | "warn" | "success" | "system";
}

export const consoleEntries: ConsoleEntry[] = [
  { date: "03/15", time: "09:00", message: "IRIX 6.5 — toddlebaron.com workstation online", type: "system" },
  { date: "03/15", time: "08:45", message: "toddlebaron.com deployed to Cloudflare Pages", type: "success" },
  { date: "03/15", time: "08:30", message: "SGI visual enhancements spec approved", type: "success" },
  { date: "03/14", time: "22:30", message: "New post: Building an SGI Desktop in 2026", type: "info" },
  { date: "03/14", time: "16:45", message: "GitHub: pushed 3 commits to toddleb/toddlebaron.com", type: "info" },
  { date: "03/14", time: "14:20", message: "Boot sequence: full SGI Indy PROM simulation complete", type: "success" },
  { date: "03/13", time: "11:20", message: "Project PRIZYM: Sprint 5 complete", type: "info" },
  { date: "03/12", time: "09:15", message: "WARNING: Audio context requires user interaction to unlock", type: "warn" },
  { date: "03/12", time: "08:00", message: "System startup — all services nominal", type: "system" },
  { date: "03/11", time: "17:30", message: "Astro 6 migration complete — content collections updated", type: "success" },
];
```

- [ ] **Step 2: Create Console.astro component**

Create `src/themes/sgi-irix/Console.astro`:

```astro
---
// src/themes/sgi-irix/Console.astro
import { consoleEntries } from "../../data/console-entries";
import RunningMan from "./RunningMan.astro";
---

<div class="sgi-console">
  <div class="sgi-console-header">
    <span>/dev/console</span>
    <RunningMan size={16} color="#33FF33" />
  </div>
  <div class="sgi-console-output">
    {consoleEntries.map((entry) => (
      <div class:list={["sgi-console-line", `sgi-console-${entry.type}`]}>
        <span class="sgi-console-timestamp">[{entry.date} {entry.time}]</span>
        {" "}{entry.message}
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Add Console CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* Console Window */
.sgi-console {
  background: #0A0A1A;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "Courier New", Courier, monospace;
  font-size: 11px;
  line-height: 1.5;
}

.sgi-console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: #111;
  border-bottom: 1px solid #333;
  color: #888;
  font-size: 10px;
}

.sgi-console-output {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.sgi-console-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sgi-console-timestamp {
  color: #666;
}

.sgi-console-info { color: #33FF33; }
.sgi-console-warn { color: #FFD700; }
.sgi-console-success { color: #00E5FF; }
.sgi-console-system { color: #888; }
```

- [ ] **Step 4: Add Console window to index.astro**

In `src/pages/index.astro`, add import:
```astro
import Console from "../themes/sgi-irix/Console.astro";
```

Add the window (after the SchemeSelector window):
```astro
      <Window windowId="console" title="Console — /dev/console" x={20} y={400} width={500} height={220}>
        <Console />
      </Window>
```

Note: The Console window content replaces the default padding. Add a style override on this Window's content by wrapping Console in a div:
```astro
      <Window windowId="console" title="Console — /dev/console" x={20} y={400} width={500} height={220}>
        <div style="margin:-16px; height:calc(100% + 32px);">
          <Console />
        </div>
      </Window>
```

- [ ] **Step 5: Auto-open console on boot**

In `src/layouts/Desktop.astro`, inside the `boot:complete` event handler (around line 30, after `initKeyboardNav()`), add:

```typescript
        openWindow("console");
```

- [ ] **Step 6: Add console to Toolchest**

In `src/themes/sgi-irix/Toolchest.astro`, add before the "Color Scheme..." item:

```astro
  <div class="sgi-toolchest-item" data-menu-open="console" role="menuitem" tabindex="0">
    <span>Console</span>
  </div>
```

- [ ] **Step 7: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 8: Commit**

```bash
git add src/data/console-entries.ts src/themes/sgi-irix/Console.astro src/themes/sgi-irix/theme.css src/pages/index.astro src/layouts/Desktop.astro src/themes/sgi-irix/Toolchest.astro
git commit -m "feat: add Console window with running man indicator"
```

### Task 11: Create desktop backgrounds system

**Files:**
- Create: `src/themes/sgi-irix/backgrounds.ts`
- Create: `src/themes/sgi-irix/BackgroundPicker.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Create backgrounds.ts**

Create `src/themes/sgi-irix/backgrounds.ts`:

```typescript
export interface DesktopBackground {
  id: string;
  name: string;
  css: string;
}

export const backgrounds: DesktopBackground[] = [
  {
    id: "sky",
    name: "Sky Gradient",
    css: "var(--sgi-sky-gradient)",
  },
  {
    id: "granite",
    name: "Granite",
    css: `repeating-conic-gradient(#808080 0% 25%, #909090 0% 50%) 0/4px 4px`,
  },
  {
    id: "deep-space",
    name: "Deep Space",
    css: `radial-gradient(1px 1px at 20% 30%, #fff, transparent),
          radial-gradient(1px 1px at 40% 70%, #fff, transparent),
          radial-gradient(1px 1px at 60% 20%, #fff, transparent),
          radial-gradient(1px 1px at 80% 50%, #fff, transparent),
          radial-gradient(1px 1px at 10% 80%, #ddd, transparent),
          radial-gradient(1px 1px at 70% 90%, #ddd, transparent),
          radial-gradient(1px 1px at 50% 10%, #ddd, transparent),
          radial-gradient(1px 1px at 90% 40%, #ddd, transparent),
          linear-gradient(180deg, #050510 0%, #0A0A2E 50%, #0D1020 100%)`,
  },
  {
    id: "abstract",
    name: "Abstract SGI",
    css: "linear-gradient(135deg, #6B3FA0 0%, #E040A0 40%, #FF8040 100%)",
  },
  {
    id: "circuit",
    name: "Circuit Board",
    css: `repeating-linear-gradient(0deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),
          linear-gradient(180deg, #0a1a0a, #0d2d0d)`,
  },
  {
    id: "mountain",
    name: "Mountain",
    css: `linear-gradient(170deg, transparent 60%, #2a1a3a 60%, #3a2a4a 70%, transparent 70%),
          linear-gradient(175deg, transparent 55%, #1a2a1a 55%, #2a3a2a 65%, transparent 65%),
          linear-gradient(168deg, transparent 50%, #3a2a1a 50%, #4a3a2a 58%, transparent 58%),
          linear-gradient(180deg, #1a1030 0%, #2a2050 30%, #4a3060 60%, #3a2040 100%)`,
  },
];

export function getBackgroundById(id: string): DesktopBackground | undefined {
  return backgrounds.find((b) => b.id === id);
}
```

- [ ] **Step 2: Create BackgroundPicker.astro**

Create `src/themes/sgi-irix/BackgroundPicker.astro`:

```astro
---
// src/themes/sgi-irix/BackgroundPicker.astro
import { backgrounds } from "./backgrounds";
---

<div class="sgi-bg-picker">
  <div class="sgi-scheme-header">Desktop Background</div>
  <div class="sgi-bg-grid">
    {backgrounds.map((bg) => (
      <button
        class="sgi-bg-swatch"
        data-bg-id={bg.id}
        aria-label={`Set ${bg.name} background`}
        title={bg.name}
      >
        <div class="sgi-bg-preview" style={`background: ${bg.css}`}></div>
        <span class="sgi-scheme-label">{bg.name}</span>
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Add BackgroundPicker CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* Background Picker */
.sgi-bg-picker {
  padding: 0;
}

.sgi-bg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.sgi-bg-swatch {
  border: 2px outset var(--sgi-widget-light);
  background: var(--sgi-widget);
  cursor: pointer;
  padding: 4px;
  text-align: center;
}

.sgi-bg-swatch:hover {
  border-color: var(--sgi-primary);
}

.sgi-bg-swatch.active {
  border: 2px solid var(--sgi-primary);
  box-shadow: 0 0 4px var(--sgi-primary);
}

.sgi-bg-preview {
  height: 48px;
  border: 1px solid #333;
}
```

- [ ] **Step 4: Add BackgroundPicker window to index.astro**

In `src/pages/index.astro`, add import:
```astro
import BackgroundPicker from "../themes/sgi-irix/BackgroundPicker.astro";
```

Add the window:
```astro
      <Window windowId="background-picker" title="Desktop Background" x={350} y={200} width={380} height={340}>
        <BackgroundPicker />
      </Window>
```

- [ ] **Step 5: Add background click handler + context menu item in Desktop.astro**

In `src/layouts/Desktop.astro`, add a background cookie loader in the `<head>` `<script is:inline>` block (the one from Task 4), after the scheme loader:

```javascript
        // Background
        var b = document.cookie.match(/toddlebaron-bg=([^;]+)/);
        if (b && b[1] !== "sky") {
          var bgs = {
            granite: "repeating-conic-gradient(#808080 0% 25%, #909090 0% 50%) 0/4px 4px",
            "deep-space": "radial-gradient(1px 1px at 20% 30%, #fff, transparent),radial-gradient(1px 1px at 40% 70%, #fff, transparent),radial-gradient(1px 1px at 60% 20%, #fff, transparent),radial-gradient(1px 1px at 80% 50%, #fff, transparent),radial-gradient(1px 1px at 10% 80%, #ddd, transparent),radial-gradient(1px 1px at 70% 90%, #ddd, transparent),radial-gradient(1px 1px at 50% 10%, #ddd, transparent),radial-gradient(1px 1px at 90% 40%, #ddd, transparent),linear-gradient(180deg, #050510 0%, #0A0A2E 50%, #0D1020 100%)",
            abstract: "linear-gradient(135deg, #6B3FA0 0%, #E040A0 40%, #FF8040 100%)",
            circuit: "repeating-linear-gradient(0deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),repeating-linear-gradient(90deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),linear-gradient(180deg, #0a1a0a, #0d2d0d)",
            mountain: "linear-gradient(170deg, transparent 60%, #2a1a3a 60%, #3a2a4a 70%, transparent 70%),linear-gradient(175deg, transparent 55%, #1a2a1a 55%, #2a3a2a 65%, transparent 65%),linear-gradient(168deg, transparent 50%, #3a2a1a 50%, #4a3a2a 58%, transparent 58%),linear-gradient(180deg, #1a1030 0%, #2a2050 30%, #4a3060 60%, #3a2040 100%)"
          };
          var bgCss = bgs[b[1]];
          if (bgCss) document.documentElement.style.setProperty("--sgi-sky-gradient", bgCss);
        }
```

In the main `<script>` click handler, add a background swatch handler:

```typescript
        // Background swatch
        const bgSwatch = target.closest<HTMLElement>("[data-bg-id]");
        if (bgSwatch) {
          const bgId = bgSwatch.dataset.bgId!;
          document.querySelectorAll(".sgi-bg-swatch").forEach((s) => s.classList.remove("active"));
          bgSwatch.classList.add("active");
          import("../themes/sgi-irix/backgrounds").then(({ getBackgroundById }) => {
            const bg = getBackgroundById(bgId);
            if (!bg) return;
            const desktop = document.getElementById("desktop");
            if (desktop) desktop.style.background = bg.css;
            document.cookie = `toddlebaron-bg=${bgId};path=/;max-age=${30 * 24 * 60 * 60}`;
          });
          return;
        }
```

In the right-click context menu items array (around line 130), add after "About This Workstation":
```typescript
          { label: "Change Background...", action: () => openWindow("background-picker") },
```

- [ ] **Step 6: Add background-picker to Toolchest**

In `src/themes/sgi-irix/Toolchest.astro`, add before the divider:
```astro
  <div class="sgi-toolchest-item" data-menu-open="background-picker" role="menuitem" tabindex="0">
    <span>Backgrounds...</span>
  </div>
```

- [ ] **Step 7: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 8: Commit**

```bash
git add src/themes/sgi-irix/backgrounds.ts src/themes/sgi-irix/BackgroundPicker.astro src/themes/sgi-irix/theme.css src/pages/index.astro src/layouts/Desktop.astro src/themes/sgi-irix/Toolchest.astro
git commit -m "feat: add desktop background picker with 6 CSS backgrounds"
```

---

## Chunk 4: Icon Catalog + Gauges

### Task 12: Create Icon Catalog window

**Files:**
- Create: `src/data/catalog.ts`
- Create: `src/themes/sgi-irix/IconCatalog.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create catalog.ts data file**

Create `src/data/catalog.ts`:

```typescript
export interface CatalogItem {
  icon: string;
  label: string;
  description: string;
  url?: string;
  tags?: string[];
}

export interface CatalogCategory {
  id: string;
  label: string;
  items: CatalogItem[];
}

export const catalog: CatalogCategory[] = [
  {
    id: "development",
    label: "Development",
    items: [
      { icon: "🌐", label: "Web Development", description: "Full-stack web applications with React, Next.js, Astro, and TypeScript", tags: ["React", "Next.js", "TypeScript"] },
      { icon: "📱", label: "Mobile", description: "Cross-platform mobile development", tags: ["React Native", "Swift"] },
      { icon: "🔧", label: "CLI Tools", description: "Command-line tools and developer utilities", tags: ["Node.js", "Go"] },
      { icon: "🗄️", label: "Databases", description: "PostgreSQL, Redis, vector databases, and data modeling", tags: ["PostgreSQL", "Prisma", "pgvector"] },
    ],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    items: [
      { icon: "🤖", label: "AI Agents", description: "Autonomous AI agent systems and orchestration platforms", tags: ["Claude", "GPT", "Agent SDK"] },
      { icon: "🧠", label: "RAG Systems", description: "Retrieval-augmented generation with vector search", tags: ["Embeddings", "pgvector", "Pinecone"] },
      { icon: "📊", label: "ML Pipelines", description: "Model training, evaluation, and deployment workflows", tags: ["Python", "TensorFlow"] },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    items: [
      { icon: "☁️", label: "Cloud & DevOps", description: "Cloud infrastructure, CI/CD pipelines, and deployment automation", tags: ["Vercel", "Cloudflare", "GitHub Actions"] },
      { icon: "🐳", label: "Containers", description: "Docker, Kubernetes, and container orchestration", tags: ["Docker", "K8s"] },
      { icon: "🔐", label: "Security", description: "Authentication, authorization, and security auditing", tags: ["OAuth", "RBAC"] },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { icon: "⚡", label: "Turborepo", description: "Monorepo build orchestration and caching", tags: ["Turborepo", "pnpm"] },
      { icon: "📝", label: "Documentation", description: "Technical writing, API docs, and knowledge bases", tags: ["MDX", "Astro"] },
      { icon: "🎨", label: "Design Systems", description: "Component libraries, theming, and UI frameworks", tags: ["Tailwind", "Radix UI"] },
    ],
  },
];
```

- [ ] **Step 2: Create IconCatalog.astro component**

Create `src/themes/sgi-irix/IconCatalog.astro`:

```astro
---
// src/themes/sgi-irix/IconCatalog.astro
import { catalog } from "../../data/catalog";
---

<div class="sgi-catalog">
  <div class="sgi-catalog-tabs">
    {catalog.map((cat, i) => (
      <button
        class:list={["sgi-catalog-tab", { active: i === 0 }]}
        data-catalog-tab={cat.id}
      >
        {cat.label}
      </button>
    ))}
  </div>
  {catalog.map((cat, i) => (
    <div
      class="sgi-catalog-panel"
      data-catalog-panel={cat.id}
      style={i === 0 ? "" : "display:none"}
    >
      <div class="sgi-catalog-grid">
        {cat.items.map((item) => (
          <button class="sgi-catalog-icon" data-catalog-item={item.label} title={item.description}>
            <div class="sgi-catalog-icon-image">{item.icon}</div>
            <div class="sgi-catalog-icon-label">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  ))}
  <div class="sgi-catalog-detail" id="catalog-detail" style="display:none">
    <div class="sgi-catalog-detail-title" id="catalog-detail-title"></div>
    <div class="sgi-catalog-detail-desc" id="catalog-detail-desc"></div>
    <div class="sgi-catalog-detail-tags" id="catalog-detail-tags"></div>
  </div>
</div>
```

- [ ] **Step 3: Add IconCatalog CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* Icon Catalog */
.sgi-catalog {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.sgi-catalog-tabs {
  display: flex;
  gap: 2px;
  padding: 4px 4px 0;
  background: var(--sgi-widget);
  border-bottom: 1px solid var(--sgi-widget-dark);
}

.sgi-catalog-tab {
  padding: 4px 12px;
  background: #B0B0B0;
  border: 1px outset var(--sgi-widget-light);
  border-bottom: none;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  color: var(--sgi-text);
}

.sgi-catalog-tab:hover {
  background: #C8C8C8;
}

.sgi-catalog-tab.active {
  background: var(--sgi-content-bg);
  border-bottom: 1px solid var(--sgi-content-bg);
  position: relative;
  top: 1px;
}

.sgi-catalog-panel {
  flex: 1;
  overflow-y: auto;
  background: var(--sgi-content-bg);
}

.sgi-catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  padding: 12px;
}

.sgi-catalog-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  border-radius: 0;
}

.sgi-catalog-icon:hover {
  background: rgba(107, 63, 160, 0.1);
}

.sgi-catalog-icon.selected {
  border: 2px solid var(--sgi-primary);
  background: rgba(107, 63, 160, 0.15);
}

.sgi-catalog-icon-image {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8060C0, #6090B0);
  border: 1px outset var(--sgi-widget-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.sgi-catalog-icon-label {
  font-size: 10px;
  margin-top: 4px;
  text-align: center;
  color: var(--sgi-text);
  word-break: break-word;
}

.sgi-catalog-detail {
  border-top: 2px inset var(--sgi-widget-dark);
  padding: 8px 12px;
  background: var(--sgi-widget);
  font-size: 12px;
}

.sgi-catalog-detail-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.sgi-catalog-detail-desc {
  color: var(--sgi-text-muted);
  margin-bottom: 4px;
}

.sgi-catalog-detail-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.sgi-catalog-tag {
  background: var(--sgi-widget-light);
  border: 1px solid var(--sgi-widget-dark);
  padding: 1px 6px;
  font-size: 10px;
}
```

- [ ] **Step 4: Add IconCatalog window to index.astro**

In `src/pages/index.astro`, add import:
```astro
import IconCatalog from "../themes/sgi-irix/IconCatalog.astro";
```

Add the window:
```astro
      <Window windowId="icon-catalog" title="Icon Catalog" x={180} y={80} width={600} height={420}>
        <div style="margin:-16px; height:calc(100% + 32px);">
          <IconCatalog />
        </div>
      </Window>
```

- [ ] **Step 5: Add catalog tab switching + item selection JS to Desktop.astro**

In `src/layouts/Desktop.astro` main `<script>` click handler, add:

```typescript
        // Catalog tab click
        const catalogTab = target.closest<HTMLElement>("[data-catalog-tab]");
        if (catalogTab) {
          const tabId = catalogTab.dataset.catalogTab!;
          document.querySelectorAll(".sgi-catalog-tab").forEach((t) => t.classList.remove("active"));
          catalogTab.classList.add("active");
          document.querySelectorAll<HTMLElement>(".sgi-catalog-panel").forEach((p) => {
            p.style.display = p.dataset.catalogPanel === tabId ? "" : "none";
          });
          playSound("/audio/sgi-menu-click.mp3");
          return;
        }

        // Catalog icon click
        const catalogIcon = target.closest<HTMLElement>("[data-catalog-item]");
        if (catalogIcon) {
          document.querySelectorAll(".sgi-catalog-icon").forEach((i) => i.classList.remove("selected"));
          catalogIcon.classList.add("selected");
          const label = catalogIcon.dataset.catalogItem!;
          const desc = catalogIcon.getAttribute("title") || "";
          const detailEl = document.getElementById("catalog-detail");
          const titleEl = document.getElementById("catalog-detail-title");
          const descEl = document.getElementById("catalog-detail-desc");
          if (detailEl && titleEl && descEl) {
            detailEl.style.display = "";
            titleEl.textContent = label;
            descEl.textContent = desc;
          }
          playSound("/audio/sgi-icon-select.mp3");
          return;
        }
```

- [ ] **Step 6: Add icon-catalog to Toolchest and as desktop icon**

In `src/themes/sgi-irix/Toolchest.astro`, add before Console:
```astro
  <div class="sgi-toolchest-item" data-menu-open="icon-catalog" role="menuitem" tabindex="0">
    <span>Icon Catalog</span>
  </div>
```

- [ ] **Step 7: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 8: Commit**

```bash
git add src/data/catalog.ts src/themes/sgi-irix/IconCatalog.astro src/themes/sgi-irix/theme.css src/pages/index.astro src/themes/sgi-irix/Toolchest.astro
git commit -m "feat: add Icon Catalog with tabbed categories and detail panel"
```

### Task 13: Create Gauge and GaugeCluster components

**Files:**
- Create: `src/data/skills.ts`
- Create: `src/themes/sgi-irix/Gauge.astro`
- Create: `src/themes/sgi-irix/GaugeCluster.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/content/pages/resume.md`

- [ ] **Step 1: Create skills.ts data file**

Create `src/data/skills.ts`:

```typescript
export interface Skill {
  label: string;
  value: number; // 0-100
  color: string;
}

export const skills: Skill[] = [
  { label: "TypeScript", value: 95, color: "#3178C6" },
  { label: "React", value: 90, color: "#61DAFB" },
  { label: "Next.js", value: 88, color: "#000000" },
  { label: "Go", value: 75, color: "#00ADD8" },
  { label: "Python", value: 80, color: "#3776AB" },
  { label: "PostgreSQL", value: 85, color: "#4169E1" },
  { label: "DevOps", value: 78, color: "#FF6C37" },
  { label: "AI/ML", value: 82, color: "#6B3FA0" },
];
```

- [ ] **Step 2: Create Gauge.astro SVG component**

Create `src/themes/sgi-irix/Gauge.astro`:

```astro
---
// src/themes/sgi-irix/Gauge.astro
export interface Props {
  label: string;
  value: number;
  color?: string;
  size?: number;
}
const { label, value, color = "#6B3FA0", size = 80 } = Astro.props;

const cx = size / 2;
const cy = size / 2;
const r = (size / 2) - 8;
const startAngle = 135;
const endAngle = 405;
const sweepAngle = endAngle - startAngle; // 270 degrees
const valueAngle = startAngle + (sweepAngle * value / 100);

function polarToCart(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

const arcStart = polarToCart(startAngle, r);
const arcEnd = polarToCart(endAngle, r);
const valueEnd = polarToCart(valueAngle, r);
const needleEnd = polarToCart(valueAngle, r - 4);
const largeArc = sweepAngle > 180 ? 1 : 0;
const valueSweep = valueAngle - startAngle;
const valueLargeArc = valueSweep > 180 ? 1 : 0;
---

<div class="sgi-gauge" style={`width:${size}px`}>
  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
    {/* Track arc (gray) */}
    <path
      d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`}
      fill="none"
      stroke="#AAA"
      stroke-width="3"
      stroke-linecap="round"
    />
    {/* Value arc (colored) */}
    <path
      d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${valueLargeArc} 1 ${valueEnd.x} ${valueEnd.y}`}
      fill="none"
      stroke={color}
      stroke-width="3"
      stroke-linecap="round"
    />
    {/* Needle */}
    <line
      x1={cx}
      y1={cy}
      x2={needleEnd.x}
      y2={needleEnd.y}
      stroke="#333"
      stroke-width="2"
      stroke-linecap="round"
    />
    {/* Center dot */}
    <circle cx={cx} cy={cy} r="3" fill="#333" />
    {/* Value text */}
    <text
      x={cx}
      y={cy + r / 2 + 4}
      text-anchor="middle"
      font-size={size * 0.14}
      fill="var(--sgi-text)"
      font-family="Helvetica, sans-serif"
    >{value}%</text>
  </svg>
  <div class="sgi-gauge-label">{label}</div>
</div>
```

- [ ] **Step 3: Create GaugeCluster.astro**

Create `src/themes/sgi-irix/GaugeCluster.astro`:

```astro
---
// src/themes/sgi-irix/GaugeCluster.astro
import Gauge from "./Gauge.astro";
import { skills } from "../../data/skills";
---

<div class="sgi-gauge-cluster">
  {skills.map((s) => (
    <Gauge label={s.label} value={s.value} color={s.color} size={80} />
  ))}
</div>
```

- [ ] **Step 4: Add Gauge CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* Gauges */
.sgi-gauge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.sgi-gauge-label {
  font-size: 10px;
  text-align: center;
  margin-top: 2px;
  color: var(--sgi-text);
}

.sgi-gauge-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 8px;
  background: var(--sgi-widget);
  border: 2px inset var(--sgi-widget-dark);
}
```

- [ ] **Step 5: Add GaugeCluster to resume page**

In `src/content/pages/resume.md`, add at the bottom of the existing content (after whatever placeholder text exists). Since Markdown can't directly embed Astro components, we'll instead add GaugeCluster directly in `index.astro` inside the resume window.

In `src/pages/index.astro`, add import:
```astro
import GaugeCluster from "../themes/sgi-irix/GaugeCluster.astro";
```

Modify the pages map to inject GaugeCluster into the resume window. After the `<Content />` inside the pages map, add a conditional:
```astro
            <Content />
            {page.data.windowId === "resume" && <GaugeCluster />}
```

- [ ] **Step 6: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 7: Commit**

```bash
git add src/data/skills.ts src/themes/sgi-irix/Gauge.astro src/themes/sgi-irix/GaugeCluster.astro src/themes/sgi-irix/theme.css src/pages/index.astro
git commit -m "feat: add SVG gauge components with skill proficiency display"
```

---

## Chunk 5: ButtonFly + File Manager

### Task 14: Create ButtonFly radial launcher

**Files:**
- Create: `src/themes/sgi-irix/ButtonFly.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Create ButtonFly.astro**

Create `src/themes/sgi-irix/ButtonFly.astro`:

```astro
---
// src/themes/sgi-irix/ButtonFly.astro
const items = [
  { icon: "💻", label: "GitHub", action: "https://github.com/toddleb", external: true },
  { icon: "💼", label: "LinkedIn", action: "https://linkedin.com/in/toddlebaron", external: true },
  { icon: "✉️", label: "Email", action: "mailto:todd@toddlebaron.com", external: true },
  { icon: "📝", label: "Blog", action: "blog", external: false },
  { icon: "📄", label: "Resume", action: "resume", external: false },
  { icon: "📁", label: "Projects", action: "icon-catalog", external: false },
];

// Calculate positions in a 180-degree arc (from left to up)
const radius = 80;
const startAngle = 180; // left
const endAngle = 0;     // right (top half)
---

<div class="sgi-buttonfly" id="buttonfly">
  <button class="sgi-buttonfly-trigger" id="buttonfly-trigger" aria-label="Quick navigation">
    ✦
  </button>
  <div class="sgi-buttonfly-items">
    {items.map((item, i) => {
      const angle = startAngle + (endAngle - startAngle) * (i / (items.length - 1));
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      return (
        <button
          class="sgi-buttonfly-item"
          data-fly-action={item.action}
          data-fly-external={item.external ? "true" : "false"}
          style={`--fly-x:${x}px; --fly-y:${y}px; transition-delay:${i * 50}ms`}
          title={item.label}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      );
    })}
  </div>
</div>
```

- [ ] **Step 2: Add ButtonFly CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* ButtonFly */
.sgi-buttonfly {
  position: fixed;
  bottom: 48px;
  right: 16px;
  z-index: 1100;
}

.sgi-buttonfly-trigger {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--sgi-title-gradient);
  border: 2px outset var(--sgi-widget-light);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}

.sgi-buttonfly-trigger:hover {
  transform: scale(1.1);
}

.sgi-buttonfly.open .sgi-buttonfly-trigger {
  transform: rotate(45deg);
}

.sgi-buttonfly-items {
  position: absolute;
  bottom: 24px;
  right: 24px;
  pointer-events: none;
}

.sgi-buttonfly-item {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--sgi-widget);
  border: 2px outset var(--sgi-widget-light);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translate(0, 0) scale(0);
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.sgi-buttonfly.open .sgi-buttonfly-item {
  opacity: 1;
  transform: translate(var(--fly-x), var(--fly-y)) scale(1);
  pointer-events: auto;
}

.sgi-buttonfly-item:hover {
  transform: translate(var(--fly-x), var(--fly-y)) scale(1.15);
  border-color: var(--sgi-primary);
}
```

- [ ] **Step 3: Add ButtonFly to index.astro**

In `src/pages/index.astro`, add import:
```astro
import ButtonFly from "../themes/sgi-irix/ButtonFly.astro";
```

Add inside the `<SGIDesktop>` block (after DesksPanel):
```astro
      <ButtonFly />
```

- [ ] **Step 4: Add ButtonFly interaction JS to Desktop.astro**

In `src/layouts/Desktop.astro` main `<script>`, add:

```typescript
      // ButtonFly toggle
      const bfTrigger = document.getElementById("buttonfly-trigger");
      const bfEl = document.getElementById("buttonfly");
      if (bfTrigger && bfEl) {
        bfTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          bfEl.classList.toggle("open");
          playSound("/audio/sgi-menu-click.mp3");
        });
      }

      // ButtonFly item click
      document.addEventListener("click", (e) => {
        const flyItem = (e.target as HTMLElement).closest<HTMLElement>("[data-fly-action]");
        if (flyItem) {
          const action = flyItem.dataset.flyAction!;
          const external = flyItem.dataset.flyExternal === "true";
          if (external) {
            window.open(action, "_blank");
          } else {
            openWindow(action);
          }
          bfEl?.classList.remove("open");
          playSound("/audio/sgi-menu-click.mp3");
          return;
        }
        // Close buttonfly on outside click
        if (bfEl?.classList.contains("open") && !(e.target as HTMLElement).closest(".sgi-buttonfly")) {
          bfEl.classList.remove("open");
        }
      });
```

Also add Escape handler (in the existing `initKeyboardNav` area or as a new listener):
```typescript
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && bfEl?.classList.contains("open")) {
          bfEl.classList.remove("open");
        }
      });
```

- [ ] **Step 5: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 6: Commit**

```bash
git add src/themes/sgi-irix/ButtonFly.astro src/themes/sgi-irix/theme.css src/pages/index.astro src/layouts/Desktop.astro
git commit -m "feat: add ButtonFly radial launcher with 6 quick-nav items"
```

### Task 15: Create File Manager window

**Files:**
- Create: `src/data/filesystem.ts`
- Create: `src/themes/sgi-irix/FileManager.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Create filesystem.ts data file**

Create `src/data/filesystem.ts`:

```typescript
export interface FMFile {
  id: string;
  label: string;
  icon: string;
  description: string;
  date?: string;
  size?: string;
  url?: string;
}

export interface FMFolder {
  id: string;
  label: string;
  icon?: string;
  children?: FMFolder[];
  files?: FMFile[];
}

export const filesystem: FMFolder = {
  id: "root",
  label: "/home/todd",
  children: [
    {
      id: "development",
      label: "Development",
      icon: "📂",
      children: [
        {
          id: "web",
          label: "Web",
          icon: "📂",
          files: [
            { id: "toddlebaron", label: "toddlebaron.com", icon: "🌐", description: "Personal website — SGI IRIX desktop simulation", date: "2026-03-15", size: "Astro 6" },
            { id: "aicr", label: "AICR Platform", icon: "🏢", description: "Enterprise AI governance platform", date: "2026-03-15", size: "Next.js 16", url: "https://app.aicoderally.com" },
          ],
        },
        {
          id: "ai",
          label: "AI",
          icon: "📂",
          files: [
            { id: "prizym", label: "Prizym ICM", icon: "💎", description: "Incentive compensation management engine", date: "2026-03-14", size: "Go + TS" },
            { id: "agents", label: "Agent Systems", icon: "🤖", description: "Autonomous AI agent orchestration", date: "2026-03-10", size: "Claude SDK" },
          ],
        },
        {
          id: "opensource",
          label: "Open Source",
          icon: "📂",
          files: [
            { id: "contrib1", label: "Contributions", icon: "🔀", description: "Open source contributions and patches", date: "2026-02", size: "Various" },
          ],
        },
      ],
    },
    {
      id: "writing",
      label: "Writing",
      icon: "📂",
      children: [
        {
          id: "blog",
          label: "Blog",
          icon: "📂",
          files: [
            { id: "sgi-post", label: "Building an SGI Desktop", icon: "📝", description: "How I recreated the Indigo Magic desktop in a browser", date: "2026-03-15" },
          ],
        },
      ],
    },
    {
      id: "career",
      label: "Career",
      icon: "📂",
      files: [
        { id: "resume", label: "Resume.pdf", icon: "📄", description: "Current resume and work history", date: "2026-03" },
        { id: "linkedin", label: "LinkedIn", icon: "💼", description: "Professional profile", url: "https://linkedin.com/in/toddlebaron" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Create FileManager.astro component**

Create `src/themes/sgi-irix/FileManager.astro`:

```astro
---
// src/themes/sgi-irix/FileManager.astro
import { filesystem } from "../../data/filesystem";

function flattenFolders(folder: typeof filesystem, path = ""): { id: string; label: string; path: string; depth: number; files: typeof filesystem.files }[] {
  const result: { id: string; label: string; path: string; depth: number; files: typeof filesystem.files }[] = [];
  const currentPath = path ? `${path}/${folder.label}` : folder.label;
  const depth = path ? path.split("/").length : 0;
  result.push({ id: folder.id, label: folder.label, path: currentPath, depth, files: folder.files });
  if (folder.children) {
    for (const child of folder.children) {
      result.push(...flattenFolders(child, currentPath));
    }
  }
  return result;
}

const allFolders = flattenFolders(filesystem);
---

<div class="sgi-fm">
  <div class="sgi-fm-toolbar">
    <span class="sgi-fm-path" id="fm-path">/home/todd</span>
  </div>
  <div class="sgi-fm-body">
    <div class="sgi-fm-tree">
      {allFolders.map((f) => (
        <button
          class:list={["sgi-fm-tree-item", { active: f.id === "root" }]}
          data-fm-folder={f.id}
          style={`padding-left:${8 + f.depth * 16}px`}
        >
          {f.depth > 0 ? "📂" : "🏠"} {f.label}
        </button>
      ))}
    </div>
    <div class="sgi-fm-files" id="fm-files">
      {allFolders.map((f) => (
        <div
          class="sgi-fm-file-panel"
          data-fm-file-panel={f.id}
          style={f.id === "root" ? "" : "display:none"}
        >
          {f.files && f.files.length > 0 ? (
            <div class="sgi-fm-file-grid">
              {f.files.map((file) => (
                <button
                  class="sgi-fm-file"
                  data-fm-file={file.id}
                  data-fm-desc={file.description}
                  data-fm-url={file.url || ""}
                  title={file.description}
                >
                  <div class="sgi-fm-file-icon">{file.icon}</div>
                  <div class="sgi-fm-file-label">{file.label}</div>
                </button>
              ))}
            </div>
          ) : (
            <div class="sgi-fm-empty">(empty)</div>
          )}
        </div>
      ))}
    </div>
  </div>
  <div class="sgi-fm-status" id="fm-status">
    Select a file for details
  </div>
</div>
```

- [ ] **Step 3: Add FileManager CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* File Manager */
.sgi-fm {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.sgi-fm-toolbar {
  padding: 4px 8px;
  background: var(--sgi-widget);
  border-bottom: 1px solid var(--sgi-widget-dark);
  font-size: 11px;
  font-family: monospace;
  color: var(--sgi-text);
}

.sgi-fm-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sgi-fm-tree {
  width: 180px;
  background: var(--sgi-content-bg);
  border-right: 2px inset var(--sgi-widget-dark);
  overflow-y: auto;
  flex-shrink: 0;
}

.sgi-fm-tree-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 3px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 11px;
  color: var(--sgi-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sgi-fm-tree-item:hover {
  background: rgba(107, 63, 160, 0.1);
}

.sgi-fm-tree-item.active {
  background: var(--sgi-primary);
  color: #fff;
}

.sgi-fm-files {
  flex: 1;
  overflow-y: auto;
  background: var(--sgi-content-bg);
}

.sgi-fm-file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  padding: 12px;
}

.sgi-fm-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: transparent;
  border: 2px solid transparent;
  cursor: pointer;
}

.sgi-fm-file:hover {
  background: rgba(107, 63, 160, 0.1);
}

.sgi-fm-file.selected {
  border: 2px solid var(--sgi-primary);
  background: rgba(107, 63, 160, 0.15);
}

.sgi-fm-file-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #C0A020, #D0B840);
  border: 1px outset var(--sgi-widget-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.sgi-fm-file-label {
  font-size: 10px;
  margin-top: 4px;
  text-align: center;
  color: var(--sgi-text);
  word-break: break-word;
}

.sgi-fm-status {
  padding: 4px 8px;
  background: var(--sgi-widget);
  border-top: 2px inset var(--sgi-widget-dark);
  font-size: 11px;
  color: var(--sgi-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sgi-fm-empty {
  padding: 24px;
  text-align: center;
  color: var(--sgi-text-muted);
  font-style: italic;
}
```

- [ ] **Step 4: Add FileManager window to index.astro**

In `src/pages/index.astro`, add import:
```astro
import FileManager from "../themes/sgi-irix/FileManager.astro";
```

Add the window:
```astro
      <Window windowId="file-manager" title="File Manager — /home/todd" x={200} y={100} width={620} height={400}>
        <div style="margin:-16px; height:calc(100% + 32px);">
          <FileManager />
        </div>
      </Window>
```

- [ ] **Step 5: Add FileManager interaction JS to Desktop.astro**

In `src/layouts/Desktop.astro` main `<script>` click handler, add:

```typescript
        // File Manager folder click
        const fmFolder = target.closest<HTMLElement>("[data-fm-folder]");
        if (fmFolder) {
          const folderId = fmFolder.dataset.fmFolder!;
          document.querySelectorAll(".sgi-fm-tree-item").forEach((t) => t.classList.remove("active"));
          fmFolder.classList.add("active");
          document.querySelectorAll<HTMLElement>(".sgi-fm-file-panel").forEach((p) => {
            p.style.display = p.dataset.fmFilePanel === folderId ? "" : "none";
          });
          document.querySelectorAll(".sgi-fm-file").forEach((f) => f.classList.remove("selected"));
          const statusEl = document.getElementById("fm-status");
          if (statusEl) statusEl.textContent = "Select a file for details";
          playSound("/audio/sgi-menu-click.mp3");
          return;
        }

        // File Manager file click
        const fmFile = target.closest<HTMLElement>("[data-fm-file]");
        if (fmFile) {
          document.querySelectorAll(".sgi-fm-file").forEach((f) => f.classList.remove("selected"));
          fmFile.classList.add("selected");
          const desc = fmFile.dataset.fmDesc || "";
          const statusEl = document.getElementById("fm-status");
          if (statusEl) statusEl.textContent = desc;
          playSound("/audio/sgi-icon-select.mp3");
          return;
        }
```

Add double-click handler for file manager files (in the mousedown or separate dblclick handler):
```typescript
      document.addEventListener("dblclick", (e) => {
        const fmFile = (e.target as HTMLElement).closest<HTMLElement>("[data-fm-file]");
        if (fmFile) {
          const url = fmFile.dataset.fmUrl;
          if (url) window.open(url, "_blank");
        }
      });
```

- [ ] **Step 6: Add file-manager to Toolchest**

In `src/themes/sgi-irix/Toolchest.astro`, add before Icon Catalog:
```astro
  <div class="sgi-toolchest-item" data-menu-open="file-manager" role="menuitem" tabindex="0">
    <span>File Manager</span>
  </div>
```

- [ ] **Step 7: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 8: Commit**

```bash
git add src/data/filesystem.ts src/themes/sgi-irix/FileManager.astro src/themes/sgi-irix/theme.css src/pages/index.astro src/layouts/Desktop.astro src/themes/sgi-irix/Toolchest.astro
git commit -m "feat: add File Manager with dual-pane folder/file browser"
```

---

## Chunk 6: Desks Overview + Splash Screens

### Task 16: Rewrite DesksPanel as virtual desktop minimap

**Files:**
- Modify: `src/engine/wm.ts`
- Modify: `src/themes/sgi-irix/DesksPanel.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Add desk management to wm.ts**

In `src/engine/wm.ts`, add the `desk` field to the `WindowState` interface (after `contentUrl`, line 11):

```typescript
  desk?: string;
```

Add these new exported functions at the bottom of the file (before the existing `getWindows()` function):

```typescript
let activeDesk = "work";

export function getActiveDesk(): string {
  return activeDesk;
}

export function switchDesk(deskId: string): void {
  activeDesk = deskId;
  windows.forEach((win) => {
    const el = getWindowEl(win.id);
    if (!el) return;
    if (win.desk === deskId || !win.desk) {
      // Show windows belonging to this desk (or unassigned windows)
      if (!win.minimized) el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });
  document.dispatchEvent(new CustomEvent("wm:desk-switched", { detail: { desk: deskId } }));
}

export function setWindowDesk(id: string, desk: string): void {
  const win = windows.get(id);
  if (win) win.desk = desk;
}
```

- [ ] **Step 2: Rewrite DesksPanel.astro as minimap**

Replace entire content of `src/themes/sgi-irix/DesksPanel.astro`:

```astro
---
// src/themes/sgi-irix/DesksPanel.astro
export interface Props {
  windows: { windowId: string; title: string }[];
}
const { windows } = Astro.props;

const desks = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "personal", label: "Personal" },
  { id: "system", label: "System" },
];
---

<div class="sgi-desks-panel" aria-label="Virtual desktops">
  <div class="sgi-desks-minimap">
    {desks.map((desk, i) => (
      <button
        class:list={["sgi-desk-mini", { active: i === 0 }]}
        data-desk-id={desk.id}
        aria-label={`Switch to ${desk.label} desk`}
      >
        <div class="sgi-desk-mini-label">{desk.label}</div>
        <div class="sgi-desk-mini-preview"></div>
      </button>
    ))}
  </div>
  <div style="margin-left:auto; display:flex; align-items:center; gap:8px">
    <button id="volume-toggle" class="sgi-desk-tab" aria-label="Toggle sound" style="font-size:14px">
      🔇
    </button>
  </div>
</div>
```

- [ ] **Step 3: Add minimap CSS to theme.css**

Replace the existing `.sgi-desk-tab` styles (lines 144-158 of original theme.css) and add new minimap styles. Keep the `.sgi-desk-tab` for the volume button. Add before `@media`:

```css
/* Desks Minimap */
.sgi-desks-minimap {
  display: flex;
  gap: 6px;
}

.sgi-desk-mini {
  width: 100px;
  height: 50px;
  background: var(--sgi-widget);
  border: 2px outset var(--sgi-widget-light);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 2px;
  position: relative;
}

.sgi-desk-mini:hover {
  border-color: var(--sgi-primary);
}

.sgi-desk-mini.active {
  border: 2px solid var(--sgi-primary);
  box-shadow: 0 0 4px var(--sgi-primary);
}

.sgi-desk-mini-label {
  font-size: 8px;
  font-weight: bold;
  text-align: center;
  color: var(--sgi-text);
}

.sgi-desk-mini-preview {
  flex: 1;
  background: var(--sgi-sky-gradient);
  border: 1px inset var(--sgi-widget-dark);
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 4: Assign desks to windows in index.astro**

In `src/pages/index.astro`, add `data-desk` attributes to each Window. Since we're rendering via a map, we'll use a lookup. Add this after the `windowList` const:

```typescript
const deskAssignments: Record<string, string> = {
  about: "work",
  resume: "work",
  console: "work",
  projects: "projects",
  "icon-catalog": "projects",
  "file-manager": "projects",
  blog: "personal",
  contact: "personal",
  "computing-history": "personal",
  "scheme-selector": "system",
  "background-picker": "system",
};
```

Then modify the Window rendering in the pages map to pass the desk. Since Window.astro doesn't have a desk prop, we'll wrap each window div with a data attribute. The simplest approach: add a wrapping div or handle via the wm.ts `setWindowDesk` call.

Better approach: call `setWindowDesk` in the Desktop.astro boot:complete handler. Add after `registerWindow` loop:

```typescript
      // Assign desks
      const deskMap: Record<string, string> = {
        about: "work", resume: "work", console: "work",
        projects: "projects", "icon-catalog": "projects", "file-manager": "projects",
        blog: "personal", contact: "personal", "computing-history": "personal",
        "scheme-selector": "system", "background-picker": "system",
      };
      for (const [winId, desk] of Object.entries(deskMap)) {
        setWindowDesk(winId, desk);
      }
```

Add `setWindowDesk` and `switchDesk` to the import from wm.ts.

- [ ] **Step 5: Add desk switching handler in Desktop.astro**

In the click handler, add:

```typescript
        // Desk minimap click
        const deskMini = target.closest<HTMLElement>("[data-desk-id]");
        if (deskMini) {
          const deskId = deskMini.dataset.deskId!;
          document.querySelectorAll(".sgi-desk-mini").forEach((d) => d.classList.remove("active"));
          deskMini.classList.add("active");
          switchDesk(deskId);
          playSound("/audio/sgi-menu-click.mp3");
          return;
        }
```

- [ ] **Step 6: Initialize with "work" desk on boot**

In the `boot:complete` handler, after desk assignments, add:

```typescript
        switchDesk("work");
```

- [ ] **Step 7: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 8: Commit**

```bash
git add src/engine/wm.ts src/themes/sgi-irix/DesksPanel.astro src/themes/sgi-irix/theme.css src/pages/index.astro src/layouts/Desktop.astro
git commit -m "feat: replace DesksPanel with virtual desktop minimap (4 desks)"
```

### Task 17: Create SplashScreen system

**Files:**
- Create: `src/themes/sgi-irix/SplashScreen.astro`
- Modify: `src/engine/wm.ts`
- Modify: `src/themes/sgi-irix/Window.astro`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/layouts/Desktop.astro`

- [ ] **Step 1: Add splash tracking to wm.ts**

In `src/engine/wm.ts`, add at the top (after the state declarations, around line 16):

```typescript
const splashShown = new Set<string>();
```

In the `openWindow` function, before the existing `document.dispatchEvent(new CustomEvent("wm:window-opened"...))` line, add:

```typescript
  if (!splashShown.has(id)) {
    splashShown.add(id);
    document.dispatchEvent(new CustomEvent("wm:splash-start", { detail: { id } }));
  }
```

- [ ] **Step 2: Create SplashScreen.astro component**

Create `src/themes/sgi-irix/SplashScreen.astro`:

```astro
---
// src/themes/sgi-irix/SplashScreen.astro
// This component is rendered inside each Window as an overlay.
// It shows a brief splash on first open, then fades out.
---

<div class="sgi-splash" style="display:none">
  <div class="sgi-splash-content">
    <div class="sgi-splash-icon"></div>
    <div class="sgi-splash-title"></div>
    <div class="sgi-splash-line"></div>
  </div>
</div>
```

- [ ] **Step 3: Add splash overlay to Window.astro**

In `src/themes/sgi-irix/Window.astro`, add a splash overlay div inside the window, after `.sgi-window-content` and before `.sgi-window-resize`:

```astro
  <div class="sgi-splash-overlay" data-splash-for={windowId} style="display:none">
    <div class="sgi-splash-title-text">{title}</div>
    <div class="sgi-splash-line-decoration"></div>
  </div>
```

- [ ] **Step 4: Add splash CSS to theme.css**

Add to `src/themes/sgi-irix/theme.css` (before `@media`):

```css
/* Splash Screen */
.sgi-splash-overlay {
  position: absolute;
  top: 24px; /* below titlebar */
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sgi-title-gradient);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: opacity 0.5s ease;
}

.sgi-splash-overlay.fading {
  opacity: 0;
}

.sgi-splash-title-text {
  color: var(--sgi-title-text);
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.sgi-splash-line-decoration {
  width: 60%;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  margin-top: 12px;
}
```

- [ ] **Step 5: Add splash event handler in Desktop.astro**

In `src/layouts/Desktop.astro` main `<script>`, add a listener:

```typescript
      document.addEventListener("wm:splash-start", ((e: CustomEvent) => {
        const windowId = e.detail.id;
        const splashEl = document.querySelector<HTMLElement>(`[data-splash-for="${windowId}"]`);
        if (!splashEl) return;
        splashEl.style.display = "flex";
        setTimeout(() => {
          splashEl.classList.add("fading");
          setTimeout(() => {
            splashEl.style.display = "none";
            splashEl.classList.remove("fading");
          }, 500);
        }, 1500);
      }) as EventListener);
```

- [ ] **Step 6: Verify build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

- [ ] **Step 7: Commit**

```bash
git add src/themes/sgi-irix/SplashScreen.astro src/engine/wm.ts src/themes/sgi-irix/Window.astro src/themes/sgi-irix/theme.css src/layouts/Desktop.astro
git commit -m "feat: add splash screen system — 1.5s splash on first window open"
```

---

## Chunk 7: Final Integration + Deploy

### Task 18: Final build verification and deploy

**Files:**
- No new files

- [ ] **Step 1: Full build**

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build
```

Expected: Zero errors. All 16 new files + 8 modified files compile successfully.

- [ ] **Step 2: Visual verification**

Start dev server and verify in browser:

```bash
/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro dev
```

Open http://localhost:4321 and verify:
- Boot sequence plays with sounds
- Windows have menu button (top-left hamburger)
- Window menu dropdown works (minimize, maximize, close, raise)
- Console window auto-opens after boot
- Color Scheme picker works (all 6 schemes repaint desktop)
- Background picker works (all 6 backgrounds apply)
- Icon Catalog tabs switch, icons are clickable, detail panel shows
- Gauges appear in Resume window
- ButtonFly fans out from bottom-right
- File Manager tree navigation works
- Desks minimap switches between 4 virtual desktops
- Splash screens show on first window open
- All sounds play on interactions
- Scheme/background persist across page reload (cookies)

- [ ] **Step 3: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 4: Deploy to Cloudflare Pages**

```bash
cd /Users/todd.lebaron/Development/toddlebaron.com
npx wrangler pages deploy dist --project-name=toddlebaron-com
```

- [ ] **Step 5: Verify live site**

Visit https://toddlebaron.com and verify all features work in production.
