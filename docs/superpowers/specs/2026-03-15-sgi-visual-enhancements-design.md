# SGI Indigo Magic Visual Enhancements — Design Spec

## Goal

Add 12 authentic SGI IRIX Indigo Magic desktop elements to toddlebaron.com, transforming it from a basic window manager simulation into a rich, interactive SGI experience. Each element serves double duty: visual authenticity AND content container for Todd's portfolio, skills, and activity.

## Architecture

Component Library approach — each SGI element is a standalone Astro component in `src/themes/sgi-irix/`. Content-bearing elements pull from Astro content collections or data files. Visual-only elements are pure CSS/JS. All colors use CSS custom properties for scheme switching. Sounds sourced from Internet Archive.

## Tech Stack

- Astro 6 (static SSG)
- Vanilla TypeScript (no frameworks)
- CSS custom properties (scheme system)
- SVG (gauges)
- CSS animations (Running Man, ButtonFly, splashes)
- Web Audio API (existing audio engine)

---

## Tier 1: Chrome Polish

### 1.1 Window Menu Button

**What:** Small button at top-left of every window title bar. Click opens a dropdown menu with window operations.

**Component:** Modify existing `src/themes/sgi-irix/Window.astro`

**Visual:**
- 16x16 button with horizontal-lines icon (three 2px lines), outset border
- Positioned before the title text in the title bar
- Dropdown: absolute-positioned, uses CSS classes (not inline styles like the existing context menu). Extract shared `.sgi-dropdown-menu` styles: `background:#C0C0C0; border:2px outset #E0E0E0; font-family:Helvetica,sans-serif; font-size:13px; min-width:160px;` with `.sgi-dropdown-item` for hover states

**Menu items:**
- Move (visual only — drag handle already exists)
- Resize (visual only — resize handle already exists)
- Minimize → calls `minimizeWindow(id)`
- Maximize → calls `maximizeWindow(id)`
- Raise → calls `bringToFront(id)`
- Close → calls `closeWindow(id)`

**Interaction:**
- Click button → show dropdown
- Click menu item → execute action, close dropdown
- Click elsewhere → close dropdown
- Dropdown positioned below button, left-aligned

**Files touched:**
- Modify: `src/themes/sgi-irix/Window.astro` (add button + dropdown markup)
- Modify: `src/themes/sgi-irix/theme.css` (add window menu styles)
- Modify: `src/layouts/Desktop.astro` (add click handler for `[data-window-menu]`)

### 1.2 Full Sound Pack

**What:** Expand from 2 sounds to 8, providing audio feedback for all major interactions.

**Sounds to add:**

| Sound | File | Trigger | Duration |
|-------|------|---------|----------|
| Window open | `sgi-window-open.mp3` | `openWindow()` | ~200ms |
| Window close | `sgi-window-close.mp3` | `closeWindow()` | ~150ms |
| Menu click | `sgi-menu-click.mp3` | Toolchest/context menu item click | ~100ms |
| Icon select | `sgi-icon-select.mp3` | Desktop icon single-click | ~100ms |
| Error beep | `sgi-error.mp3` | Invalid action attempts | ~300ms |
| Notification ding | `sgi-ding.mp3` | Console new entry highlight | ~200ms |

**Source:** Internet Archive SGI IRIX sound collections. If exact matches unavailable, use closest Motif/CDE equivalents or synthesize short beeps/clicks matching the SGI aesthetic.

**Integration:**
- Add `playSound()` calls into existing event handlers in `Desktop.astro`
- Window open/close: add to `openWindow()`/`closeWindow()` in `src/engine/wm.ts` (dispatch custom events, play in Desktop.astro handler)
- All sounds respect existing mute toggle
- Sounds are fire-and-forget, never block interaction

**Files touched:**
- Add: `public/audio/sgi-window-open.mp3`, `sgi-window-close.mp3`, `sgi-menu-click.mp3`, `sgi-icon-select.mp3`, `sgi-error.mp3`, `sgi-ding.mp3`
- Modify: `src/layouts/Desktop.astro` (add playSound calls to event handlers)
- Modify: `src/themes/sgi-irix/theme.ts` (add sound URLs to theme config)
- Modify: `src/themes/theme-contract.ts` (extend `ThemeConfig.sounds` with `menuClick`, `iconSelect`, `error`, `ding` — the existing `windowOpen`/`windowClose` slots already cover those sounds)

### 1.3 Running Man (Busy Indicator)

**What:** Animated figure that runs in place during loading states. CSS-only animation.

**Component:** `src/themes/sgi-irix/RunningMan.astro`

**Visual:**
- Small (32x32) CSS-drawn stick figure with running animation
- 4-6 frame `@keyframes` cycle: legs alternate, arms pump
- Monochrome (white or green on dark background, dark on light)
- Centered in a small container

**Where it appears:**
- Inside windows: shown briefly (~500ms) when a window first opens (before content renders). The splash screen system (1.12) supersedes this for windows that have splashes.
- Boot sequence: running man appears during the progress bar phase
- Optional: in console window header as a persistent "system active" indicator

**Implementation:**
- Pure CSS animation using `@keyframes` on positioned `<div>` elements (limbs, body, head)
- Component accepts `size` prop (default 32) and `color` prop
- Show/hide via CSS class `.running` / `.stopped`

**Files:**
- Create: `src/themes/sgi-irix/RunningMan.astro`
- Modify: `src/themes/sgi-irix/theme.css` (add running man keyframes)

---

## Tier 2: Interactive Features

### 2.1 Color Scheme Selector

**What:** Live theme repainting. Click a named scheme, entire desktop changes color instantly.

**Schemes:**

| Name | Title Gradient | Desktop BG | Surface | Widget | Text |
|------|---------------|------------|---------|--------|------|
| Indigo (default) | `#6B3FA0 → #3A8A7A` | `#465080 → #8CA9D2` | `#E8E8E8` | `#C0C0C0` | `#222` |
| Desert | `#B8860B → #8B4513` | `#D2B48C → #F5DEB3` | `#F0E8D8` | `#D4C4A0` | `#3E2723` |
| Ocean | `#1565C0 → #00ACC1` | `#0D2137 → #1A4A6E` | `#E0E8F0` | `#A0B8C8` | `#1A237E` |
| Midnight | `#311B92 → #1A237E` | `#0A0A1A → #1A1A3E` | `#D0D0D8` | `#808098` | `#E0E0E0` |
| Rosewood | `#8B1A1A → #6D3A3A` | `#3E1A1A → #5E2A2A` | `#F0E0E0` | `#C0A0A0` | `#3E1A1A` |
| Slate | `#455A64 → #607D8B` | `#37474F → #546E7A` | `#ECEFF1` | `#B0BEC5` | `#263238` |

**CSS Custom Properties (refactor):**
All colors in `theme.css` that currently use hardcoded values become `var(--sgi-*)`:
```
--sgi-primary, --sgi-secondary
--sgi-bg-dark, --sgi-bg-light
--sgi-surface, --sgi-content-bg
--sgi-widget, --sgi-widget-light, --sgi-widget-dark
--sgi-text, --sgi-title-text
--sgi-title-gradient (full gradient value)
--sgi-sky-gradient (full gradient value)
```

**Component:** `src/themes/sgi-irix/SchemeSelector.astro`
- Renders inside a window (registered as `scheme-selector`, available in Toolchest)
- Grid of scheme swatches — each is a small rectangle showing the title gradient + desktop gradient
- Active scheme has purple border
- Click → JS sets all `--sgi-*` properties on `document.documentElement`
- Saves to cookie `toddlebaron-scheme` (30 days)
- On page load: read cookie, apply scheme before first paint using an `<script is:inline>` tag in `<head>` (must be blocking/synchronous, NOT `type="module"`, to prevent FOUC)

**Files:**
- Create: `src/themes/sgi-irix/SchemeSelector.astro`
- Create: `src/themes/sgi-irix/schemes.ts` (scheme definitions as typed objects)
- Modify: `src/themes/sgi-irix/theme.css` (refactor all colors to custom properties; rename `--sgi-purple` → `--sgi-primary`, `--sgi-teal` → `--sgi-secondary` — don't keep both old and new names)
- Modify: `src/layouts/Desktop.astro` (add early scheme application script in `<head>`)
- Modify: `src/pages/index.astro` (register scheme-selector window)

### 2.2 Console Window

**What:** A dedicated window showing scrolling system messages in green-on-black monospace.

**Content source:** `src/data/console-entries.ts` — a typed array of log entries:
```typescript
interface ConsoleEntry {
  date: string;       // "2026-03-15"
  time: string;       // "08:12"
  message: string;    // "toddlebaron.com deployed to production"
  type: "info" | "warn" | "success" | "system";
}
```

Todd maintains this file manually with real activity. Could also pull from blog post dates at build time.

**Visual:**
- Black background (`#0A0A1A`), monospace font
- Color by type: green (#33FF33) info, yellow (#FFD700) warn, cyan (#00E5FF) success, gray (#888) system
- Entries formatted as: `[MM/DD HH:MM] message`
- Auto-scroll to bottom (CSS `flex-direction: column-reverse` or JS scroll)
- Window title: "Console — /dev/console"
- Subtle scanline overlay effect (CSS repeating-linear-gradient, very faint)

**Component:** `src/themes/sgi-irix/Console.astro`
- Renders log entries from imported data
- Registered as window `console`, available in Toolchest
- Auto-opens on boot: add `openWindow("console")` call inside the existing `boot:complete` event handler in Desktop.astro (after `initDesktopIcons()`)
- Default position: bottom-left, 500x200

**Files:**
- Create: `src/themes/sgi-irix/Console.astro`
- Create: `src/data/console-entries.ts`
- Modify: `src/themes/sgi-irix/theme.css` (add console styles)
- Modify: `src/pages/index.astro` (add Console window, register it)

### 2.3 Desktop Backgrounds

**What:** Swappable desktop backgrounds accessible from context menu or a control panel.

**Backgrounds (all pure CSS — no image files):**

| Name | CSS |
|------|-----|
| Sky Gradient (default) | Current `linear-gradient(180deg, var(--sgi-bg-dark), var(--sgi-bg-light))` |
| Granite | `repeating-conic-gradient()` noise pattern in grays |
| Deep Space | Dark gradient with CSS radial-gradient "stars" (tiny white dots) |
| Abstract SGI | `linear-gradient(135deg, #6B3FA0, #E040A0, #FF8040)` |
| Circuit Board | Repeating SVG pattern (inline) of grid lines in dark green |
| Mountain | Layered gradients creating silhouette ridgelines |

**Component:** `src/themes/sgi-irix/BackgroundPicker.astro`
- Grid of thumbnail previews (60x40 each, showing the actual CSS background)
- Click → applies to `.sgi-desktop` element
- Saves to cookie `toddlebaron-bg` (30 days)
- Accessible from: right-click context menu ("Change Background...") and Toolchest

**Integration with Color Schemes:** Background selection is independent of scheme. The sky gradient background updates its colors when scheme changes (uses `var(--sgi-bg-*)`) but other backgrounds are fixed.

**Files:**
- Create: `src/themes/sgi-irix/BackgroundPicker.astro`
- Create: `src/themes/sgi-irix/backgrounds.ts` (background definitions)
- Modify: `src/themes/sgi-irix/theme.css` (add background classes)
- Modify: `src/layouts/Desktop.astro` (add context menu item, cookie load)
- Modify: `src/pages/index.astro` (register background-picker window)

### 2.4 Icon Catalog

**What:** A tabbed window for browsing categorized items with 3D-beveled icons. Replaces the flat Projects page as the rich project/skills browser.

**Content source:** `src/data/catalog.ts` — structured data:
```typescript
interface CatalogCategory {
  id: string;
  label: string;
  items: CatalogItem[];
}
interface CatalogItem {
  icon: string;          // emoji or SVG reference
  label: string;
  description: string;
  url?: string;          // external link
  tags?: string[];
}
```

**Categories:** Development, AI/ML, Infrastructure, Tools (Todd fills in items)

**Visual:**
- Tab bar across top (SGI-style beveled tabs with outset/inset states)
- Active tab has raised appearance, inactive tabs are inset
- Icon grid below: 64x64 icons with gradient backgrounds, beveled borders
- Below each icon: label text (10px, centered)
- Click icon → detail panel appears at bottom of window (title, description, links, tags)
- Selected icon gets purple highlight border

**Component:** `src/themes/sgi-irix/IconCatalog.astro`
- Registered as window `icon-catalog`
- Available in Toolchest and as a desktop icon
- Default size: 600x400

**Files:**
- Create: `src/themes/sgi-irix/IconCatalog.astro`
- Create: `src/data/catalog.ts`
- Modify: `src/themes/sgi-irix/theme.css` (add catalog styles)
- Modify: `src/pages/index.astro` (add IconCatalog window)

### 2.5 Dial Widgets / Confidence Gauges

**What:** SVG circular gauges showing values as needle positions on an arc. Used to display skills and stats.

**Component:** `src/themes/sgi-irix/Gauge.astro`

**Props:**
```typescript
interface Props {
  label: string;
  value: number;       // 0-100
  color?: string;      // defaults to --sgi-primary
  size?: number;       // defaults to 80
}
```

**Visual:**
- Circular arc (270° sweep, open at bottom)
- Tick marks at 0, 25, 50, 75, 100
- Needle from center pointing to value position
- Value text below in small font
- Label text below value
- Arc color matches `color` prop, needle is dark
- Subtle drop shadow on needle

**SVG structure:**
- `<circle>` for outer ring
- `<path>` for arc track (gray) and value arc (colored)
- `<line>` for needle, rotated by value
- `<text>` for label and value

**Usage in content:** Used inside the Resume and About windows. A `GaugeCluster.astro` wrapper component renders a flex row of gauges.

**Content source:** `src/data/skills.ts`:
```typescript
const skills = [
  { label: "TypeScript", value: 95, color: "#3178C6" },
  { label: "React", value: 90, color: "#61DAFB" },
  { label: "Go", value: 75, color: "#00ADD8" },
  // ...
];
```

**Files:**
- Create: `src/themes/sgi-irix/Gauge.astro`
- Create: `src/themes/sgi-irix/GaugeCluster.astro`
- Create: `src/data/skills.ts`
- Modify: `src/themes/sgi-irix/theme.css` (gauge layout styles)
- Modify: `src/pages/index.astro` (embed gauges in resume/about windows)

---

## Tier 3: Showpieces

### 3.1 ButtonFly (Radial Launcher)

**What:** A floating action button that fans out navigation icons in a radial arc on click.

**Position:** Fixed, bottom-right of desktop, 16px above DesksPanel top edge, z-index 1100. DesksPanel layout should reserve ~64px on the right side (after the volume toggle) to avoid overlap with the ButtonFly trigger.

**Trigger button:** 48x48 circle with SGI gradient, beveled border. Icon: four-pointed star or compass rose.

**Fan items (6):**

| Icon | Label | Action |
|------|-------|--------|
| GitHub logo | GitHub | External link |
| LinkedIn logo | LinkedIn | External link |
| Envelope | Email | `mailto:` |
| Pencil | Blog | Open blog window |
| Document | Resume | Open resume window |
| Folder | Projects | Open icon-catalog window |

**Animation:**
- Items start stacked behind trigger button (opacity 0, scale 0)
- On click: items fan out in 180° arc (from left to up) with staggered 50ms delays
- Each item transitions: `transform`, `opacity` over 300ms ease-out
- Items settle at ~80px radius from center
- Reverse animation on close (200ms, all simultaneous)
- Trigger button rotates 45° when open (becomes "X" visually)

**Interaction:**
- Click trigger → open/close fan
- Click item → execute action, close fan
- Click elsewhere → close fan
- Escape → close fan
- Hover item → scale up slightly (1.1), show tooltip label

**Component:** `src/themes/sgi-irix/ButtonFly.astro`

**Files:**
- Create: `src/themes/sgi-irix/ButtonFly.astro`
- Modify: `src/themes/sgi-irix/theme.css` (add buttonfly styles and animations)
- Modify: `src/pages/index.astro` (add ButtonFly component)
- Modify: `src/layouts/Desktop.astro` (add escape handler for buttonfly)

### 3.2 Desks Overview (Virtual Desktop Minimap)

**What:** Replace the current tab-based DesksPanel with a proper virtual desktop system showing miniature previews.

**Desks:**

| Desk | Content |
|------|---------|
| Work | About, Resume, Console |
| Projects | Icon Catalog, File Manager |
| Personal | Blog, Contact, Computing History |
| System | Scheme Selector, Background Picker |

**Visual:**
- Bottom panel still exists but now contains 4 minimap rectangles (~120x70 each)
- Each rectangle shows the desktop background color and tiny colored rectangles representing windows
- Active desk has bright border (scheme primary color) and slightly raised appearance
- Inactive desks are dimmer
- Volume toggle and clock remain at far right

**Behavior:**
- **Replaces existing tab-based DesksPanel.** The current "click tab to open window" interaction is removed. Instead, windows on the active desk are visible and can be opened/minimized/closed normally. To switch visible window sets, click a desk in the minimap.
- Each window gets a `data-desk="work|projects|personal|system"` attribute
- Switching desks: hides all windows, shows only windows belonging to active desk
- Minimized windows on the active desk can be restored via the Toolchest or ButtonFly (the taskbar-tab model is gone)
- Window positions persist per desk
- Minimap updates when windows move/resize: wm.ts dispatches `wm:window-moved` events (add to `startDrag` and `startResize` mousemove handlers, throttled to 200ms). DesksPanel listens and repositions the tiny rectangles proportionally
- Default desk on boot: "Work"

**Implementation:**
- Modify `src/engine/wm.ts`: add `desk` field to `WindowState`, add `switchDesk(deskId)` function
- Modify `DesksPanel.astro`: replace tabs with minimap rendering
- Window visibility filtered by active desk

**Files:**
- Modify: `src/themes/sgi-irix/DesksPanel.astro` (complete rewrite to minimap)
- Modify: `src/engine/wm.ts` (add desk management)
- Modify: `src/themes/sgi-irix/theme.css` (add minimap styles)
- Modify: `src/pages/index.astro` (assign `data-desk` to each window)
- Modify: `src/layouts/Desktop.astro` (wire up desk switching)

### 3.3 File Manager (fm)

**What:** A dual-pane file browser window. Left: folder tree. Right: icon grid. Repurposed as a rich project browser.

**Content source:** `src/data/filesystem.ts`:
```typescript
interface FMFolder {
  id: string;
  label: string;
  icon?: string;
  children?: FMFolder[];
  files?: FMFile[];
}
interface FMFile {
  id: string;
  label: string;
  icon: string;
  description: string;
  date?: string;
  size?: string;        // fun metric: "42 commits", "3.2k stars"
  url?: string;
}
```

**Folder structure (Todd fills in):**
```
/home/todd/
├── Development/
│   ├── Web/
│   ├── AI/
│   └── Open Source/
├── Writing/
│   ├── Blog/
│   └── Talks/
├── Career/
│   ├── Current/
│   └── Archive/
└── Interests/
```

**Visual:**
- **Toolbar:** path breadcrumb, view toggle (icon/list), separator lines
- **Left pane:** 180px wide, inset border, tree with expand/collapse arrows
- **Right pane:** flex-grow, icon grid (icon view) or rows (list view)
- **Detail bar:** bottom strip showing selected file's description
- Icons: 48x48 with beveled borders, folder icons are yellow-gradient, file icons vary by type
- Selected item: purple highlight
- Toolbar buttons: outset beveled, icon-only

**Component:** `src/themes/sgi-irix/FileManager.astro`

**Interaction:**
- Click folder in tree → shows contents in right pane
- Click file → selects, shows detail in bottom bar
- Double-click file → opens URL or sub-window
- Tree expand/collapse with arrow icons

**Files:**
- Create: `src/themes/sgi-irix/FileManager.astro`
- Create: `src/data/filesystem.ts`
- Modify: `src/themes/sgi-irix/theme.css` (add file manager styles)
- Modify: `src/pages/index.astro` (add FileManager window)

### 3.4 App Splash Screens

**What:** Brief animated splash shown when a window first opens in a session.

**Behavior:**
- First time a window opens: show splash for ~1.5s, then crossfade to content
- Subsequent opens (after minimize/close): skip splash, show content immediately
- Track shown splashes in a `Set<string>` in the window manager

**Default splash:** Gradient background (scheme primary → secondary), window title in large centered text (24px, white, bold), thin decorative horizontal line below.

**Custom splashes:** Windows can opt into a custom splash via a data attribute `data-splash-color` or `data-splash-icon`:
- About: portrait silhouette icon
- Blog: pen/paper icon
- Projects/Icon Catalog: grid icon
- File Manager: folder icon
- Console: terminal prompt icon

Icons are simple CSS shapes or inline SVG, not image files.

**Component:** `src/themes/sgi-irix/SplashScreen.astro`
- Renders the splash overlay inside each window
- Absolutely positioned over window content
- CSS transition: opacity 0.5s on fade-out

**Integration:**
- Modify `openWindow()` in wm.ts: before dispatching `wm:window-opened`, check if window ID is in the splash-shown set. If not, dispatch `wm:splash-start` (with windowId in detail), add to set, then dispatch `wm:window-opened` after. If already shown, skip splash and dispatch `wm:window-opened` directly.
- Desktop.astro listens for `wm:splash-start`, shows the splash overlay in the target window, sets 1.5s timeout, then fades out via CSS opacity transition

**Files:**
- Create: `src/themes/sgi-irix/SplashScreen.astro`
- Modify: `src/engine/wm.ts` (add splash tracking set, dispatch splash events)
- Modify: `src/themes/sgi-irix/Window.astro` (add splash container slot)
- Modify: `src/themes/sgi-irix/theme.css` (add splash styles)
- Modify: `src/layouts/Desktop.astro` (add splash event handler)

---

## File Summary

### New files (16):
```
src/themes/sgi-irix/RunningMan.astro
src/themes/sgi-irix/SchemeSelector.astro
src/themes/sgi-irix/Console.astro
src/themes/sgi-irix/BackgroundPicker.astro
src/themes/sgi-irix/IconCatalog.astro
src/themes/sgi-irix/Gauge.astro
src/themes/sgi-irix/GaugeCluster.astro
src/themes/sgi-irix/ButtonFly.astro
src/themes/sgi-irix/FileManager.astro
src/themes/sgi-irix/SplashScreen.astro
src/themes/sgi-irix/schemes.ts
src/themes/sgi-irix/backgrounds.ts
src/data/console-entries.ts
src/data/catalog.ts
src/data/skills.ts
src/data/filesystem.ts
```

### Modified files (8):
```
src/themes/sgi-irix/Window.astro        — window menu button, splash container
src/themes/sgi-irix/DesksPanel.astro     — virtual desktop minimap rewrite
src/themes/sgi-irix/theme.css            — CSS custom properties refactor + all new styles
src/themes/sgi-irix/theme.ts             — sound URLs in theme config
src/engine/wm.ts                         — desk management, splash tracking
src/layouts/Desktop.astro                — event handlers for all new features
src/pages/index.astro                    — register all new windows
src/components/EraPickerOverlay.astro    — minor: scheme awareness
```

### New audio files (6):
```
public/audio/sgi-window-open.mp3
public/audio/sgi-window-close.mp3
public/audio/sgi-menu-click.mp3
public/audio/sgi-icon-select.mp3
public/audio/sgi-error.mp3
public/audio/sgi-ding.mp3
```

## Content Todd Provides

These data files need real content (placeholder structures will be scaffolded):
- `src/data/catalog.ts` — project/skill items by category
- `src/data/console-entries.ts` — recent activity log entries
- `src/data/skills.ts` — skill names and proficiency values
- `src/data/filesystem.ts` — project folder/file hierarchy

## Dependencies

- No new npm packages. Everything is vanilla CSS, TypeScript, SVG, and Astro components.
- Audio files from Internet Archive (public domain).

## Implementation Order

Tier 1 first (Window Menu → Sounds → Running Man), then Tier 2 (Schemes → Console → Backgrounds → Icon Catalog → Gauges), then Tier 3 (ButtonFly → Desks Overview → File Manager → Splashes). Each element is independently functional — no element depends on another except:
- Color Schemes must land before Backgrounds (backgrounds reference scheme variables)
- Running Man should land before Splash Screens (splashes can incorporate running man)
- Desks Overview modifies DesksPanel which other elements reference for window registration
