# SGI IRIX Phase 2 Enhancements — Design Spec

**Date:** 2026-03-15
**Project:** toddlebaron.com — SGI IRIX Indigo Magic Desktop Simulation
**Stack:** Astro 6, TypeScript, CSS, SVG, Web Audio API
**Deployment:** Cloudflare Pages

## Goal

Add 8 features that deepen interactivity and shareability: an interactive console shell, an SGI MediaMail contact form, a flying logo screensaver/boot animation, easter eggs, cascade/tile window management, OG social preview, draggable desktop icons, and a blog post.

## Constraints

- Static site only — no server-side runtime (Cloudflare Pages)
- Zero new npm dependencies
- All animations CSS-only (transforms + opacity) for battery efficiency
- Must build cleanly with Astro 6: `/opt/homebrew/Cellar/node/23.11.0/bin/node node_modules/.bin/astro build`

---

## Feature 1: Interactive Console

### What It Does

Replaces the static log-output Console window with a working shell. Visitors type commands and see responses in a terminal emulator styled to match the existing console.

### Command Set

| Command | Output |
|---------|--------|
| `help` | List available commands |
| `ls [dir]` | List directory contents (uses filesystem.ts tree) |
| `cd <dir>` | Change working directory |
| `pwd` | Print working directory |
| `cat <file>` | Print file description/contents from filesystem.ts |
| `whoami` | `todd` |
| `clear` | Clear console output |
| `echo <text>` | Print text |
| `neofetch` | SGI system info with ASCII art logo |
| `fortune` | Random tech/programming quote |
| `cowsay <text>` | ASCII cow says the given text |
| `xeyes` | **Easter egg:** spawns floating eyes that follow cursor |
| `doom` | **Easter egg:** IRIX Motif error dialog |

### Shell Architecture

- New file `src/engine/shell.ts` — command parser, cwd state, command handler registry. Returns string output for each command. For side effects (xeyes, doom), dispatches CustomEvents on `document`: `shell:xeyes-spawn`, `shell:xeyes-kill`, `shell:doom-dialog`. This keeps the engine pure and testable.
- Reuses `src/data/filesystem.ts` — same folder/file tree the File Manager uses
- New file `src/data/fortunes.ts` — array of 20-30 tech/programming quotes
- Console.astro gets an `<input>` at the bottom for command entry. The initial output area is blank except for a welcome line ("IRIX 6.5 console — type 'help' for commands"). `console-entries.ts` is no longer imported — the static log is fully replaced by the interactive shell. The RunningMan component is preserved in the console header.
- Output is a scrollable div of previous commands + responses
- Prompt format: `todd@indigo:~$ ` with colored segments (cyan user, purple path)

### Easter Egg: xeyes

- Typing `xeyes` in the console spawns an absolutely-positioned div on the desktop (outside any window)
- Contains two SVG eyeballs with pupils
- `mousemove` listener calculates angle from each eye center to cursor, rotates pupil position accordingly
- Clicking the eyes or typing `killall xeyes` in the console removes them
- Eyes have an IRIX-style window title bar "xeyes" with close button

### Easter Egg: doom

- Typing `doom` or `quake` shows a modal dialog styled as an IRIX Motif error box
- Gray background, beveled border, warning icon
- Text: `"Error: Insufficient memory to launch DOOM\nRequired: 8MB RAM\nAvailable: 512KB\n\nConsider upgrading your Indigo2."`
- Single "OK" button dismisses the dialog
- Plays the `error` sound effect

### Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/engine/shell.ts` | Command parser, handler registry, cwd state |
| Create | `src/data/fortunes.ts` | Quote array |
| Modify | `src/themes/sgi-irix/Console.astro` | Add input field, wire to shell, scrollable output |
| Modify | `src/layouts/Desktop.astro` | xeyes mousemove handler, doom dialog handler |
| Modify | `src/themes/sgi-irix/theme.css` | Interactive console styles, xeyes styles, doom dialog styles |

---

## Feature 2: SGI MediaMail — Contact Form

### What It Does

A compose-only mail window styled after IRIX MediaMail, launched from a "Contact Me" desktop icon. Replaces the current contact content page as the primary contact method.

### UI Layout

- **Toolbar:** Send button, Clear button (Motif-style gradient buttons)
- **Header fields:**
  - To: `hello@toddlebaron.com` (read-only, pre-filled)
  - From: visitor's email (required, editable)
  - Subject: editable, placeholder "Hello from your website!"
- **Body:** Textarea for message
- **Status bar:** Shows state: "Ready", "Sending...", "Message sent!", or error

### Send Mechanism

- v1: `mailto:` link fallback — constructs a `mailto:hello@toddlebaron.com` URL with subject and body, opens in default mail client
- The Send button constructs the mailto link and triggers `window.location.href`
- Status bar shows "Opening your mail client..." on send
- Plays `ding` sound on send

### Desktop Icon

- Replace the existing `contact` SVG in `icons.ts` with a MediaMail icon: blue mailbox with envelope, `@` symbol, metallic shelf
- Icon label remains "Contact Me" (from the content collection `contact.md` title)
- Window ID stays `contact` — this preserves the existing deskMap assignment (`contact: "personal"`) and icon registration
- Opens a Window containing the MediaMail component

### Contact Content Page

- The existing contact content page remains in the content collection (provides the desktop icon entry)
- In `index.astro`, add a special case for `windowId === "contact"` (same pattern as `resume` with GaugeCluster): render `<MediaMail />` instead of or alongside `<Content />`
- Contact info (email, LinkedIn, GitHub) moves into a small footer section inside the MediaMail compose window

### Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/themes/sgi-irix/MediaMail.astro` | Compose form component |
| Modify | `src/themes/sgi-irix/icons.ts` | Add MediaMail SVG icon keyed as `contact` |
| Modify | `src/pages/index.astro` | Replace contact Window content with MediaMail component |
| Modify | `src/layouts/Desktop.astro` | Form submit handler, mailto construction |

---

## Feature 3: Flying SGI Logo — Boot + Screensaver

### What It Does

A 3D SGI cube floats across a dark starfield. It plays during the boot sequence dark phase and returns as a screensaver after 90 seconds of inactivity.

### Boot Integration

1. **Page load:** Dark screen shows starfield + floating SGI cube
2. **Boot text starts:** Cube fades to 30% opacity, drifts to a corner
3. **Boot complete:** Cube + starfield dissolve out (0.5s CSS fade)

The `Screensaver.astro` component is statically included in `Boot.astro`. It renders into the DOM on page load (correct for boot phase). Boot.astro's existing phase-callback JS adds/removes a `.screensaver-active` CSS class to control visibility. The component is hidden by default (`opacity: 0; pointer-events: none`) and only visible when `.screensaver-active` is present on a parent.

### Screensaver Behavior

1. **Idle timer:** After 90 seconds of no mouse/keyboard input, screensaver activates
2. **Activation:** Full-screen dark overlay (z-index above all windows) fades in. JS adds `.screensaver-active` class to the screensaver container, which triggers the CSS transition.
3. **Deactivation:** Any mouse movement, click, or keypress removes `.screensaver-active` (0.3s fade out)
4. **Timer reset:** Idle timer reset is added to the existing `keydown`/`mousemove`/`click` handlers in `Desktop.astro` — not a new listener, but an addition to the existing ones

### SGI Cube

- Isometric 3D cube rendered as SVG with three visible faces
- Colors: later-era SGI — cyan (#3BB8D0) top, orange (#E8891E) left, purple (#7B52AE) right
- CSS animation: slow drift across the screen using `translateX`/`translateY`, bouncing off edges (DVD logo style)
- Rotation: subtle CSS `rotate3d` animation on a 12-second loop
- Total animation cycle ~30 seconds before repeating the path

### Starfield

- 40-60 small dots (`<div>`) with randomized positions via inline styles
- Subtle twinkle: staggered CSS opacity animation (0.3-1.0)
- Static positions — no movement, just twinkle

### Performance

- All CSS transforms + opacity — runs on compositor thread
- Screensaver overlay uses `will-change: opacity` for smooth fade
- No canvas, no JS animation loops, no requestAnimationFrame

### Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/themes/sgi-irix/Screensaver.astro` | SVG cube, starfield dots, CSS keyframe animations |
| Modify | `src/themes/sgi-irix/Boot.astro` | Mount Screensaver during dark phase, fade on boot-complete |
| Modify | `src/layouts/Desktop.astro` | Idle timer (90s), screensaver show/hide, input listeners |
| Modify | `src/themes/sgi-irix/theme.css` | Screensaver keyframes, overlay styles, cube animation |

---

## Feature 4: Cascade / Tile Window Management

### What It Does

Adds "Cascade All" and "Tile All" items to the existing per-window dropdown menu (the menu that already has Minimize/Maximize/Close). In 4Dwm, each window's title bar menu included layout operations — this is period-accurate. These items are also added to the desktop right-click context menu for convenience.

### Cascade Behavior

- Collects all currently visible (non-minimized) windows on the active desk using filter: `!win.minimized && (win.desk === getActiveDesk() || !win.desk)`
- Un-maximizes any maximized windows first (sets `win.maximized = false`)
- Repositions them starting at (40, 40) with each subsequent window offset by (+30, +30)
- Restores default width/height (500x400) for each window
- Brings them all to sequential z-indexes

### Tile Behavior

- Collects all visible windows on the active desk
- Calculates grid: viewport divided into equal cells
  - 1 window: full screen
  - 2: side-by-side (50% width each)
  - 3: 2 top + 1 bottom (full width)
  - 4: 2x2 grid
  - 5-6: 3x2 grid
- Applies position + size to each window
- Leaves 32px top margin for toolchest

### Files

| Action | File | Changes |
|--------|------|---------|
| Modify | `src/engine/wm.ts` | Add `cascadeAll()` and `tileAll()` functions |
| Modify | `src/layouts/Desktop.astro` | Wire "Cascade All" / "Tile All" menu clicks |

---

## Feature 5: OG Social Preview Image

### What It Does

Adds Open Graph meta tags so the site renders a beautiful preview card when shared on LinkedIn, Twitter/X, Hacker News, etc.

### Approach

- Create `src/pages/og-preview.astro` — a standalone 1200x630 page that renders a desktop composition
- Manually screenshot it and save as `public/og-image.png`
- Add Twitter card meta tags to `src/components/SEOHead.astro` (which already has `og:title`, `og:description`, `og:type`, `og:url`, and `og:image` — the `og:image` already points to `/og-image.png`, so the main work is adding the Twitter-specific tags and ensuring the PNG file exists)

### Composition

- Background: SGI sky gradient
- Center: SGI logo (sgi text in later-era colors)
- Subtitle: "toddlebaron.com"
- Tagline: "An SGI IRIX desktop experience in the browser"
- Decorative: 2-3 small window mockups at edges suggesting the desktop environment

### Meta Tags

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Todd LeBaron" />
<meta property="og:description" content="An SGI IRIX desktop experience in the browser" />
<meta property="og:image" content="https://toddlebaron.com/og-image.png" />
<meta property="og:url" content="https://toddlebaron.com" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Todd LeBaron" />
<meta name="twitter:description" content="An SGI IRIX desktop experience in the browser" />
<meta name="twitter:image" content="https://toddlebaron.com/og-image.png" />
```

### Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/pages/og-preview.astro` | 1200x630 preview composition page |
| Create | `public/og-image.png` | Screenshot of og-preview (manual step) |
| Modify | `src/components/SEOHead.astro` | Add Twitter card meta tags (og:image already exists) |

---

## Feature 6: Draggable Desktop Icons

### What It Does

Desktop icons can be repositioned by click+drag. Positions snap to an invisible grid and persist to localStorage.

### Interaction Model

- **Single click:** Select icon (existing behavior — highlight)
- **Double click:** Open window (existing behavior)
- **Click + drag (>5px threshold):** Reposition icon
  - The 5px threshold prevents accidental drags on normal clicks

### Grid Snap

- Icons snap to a 80px grid (width) x 90px grid (height) to maintain clean alignment
- Grid accounts for icon size (48px image + label)
- If a target cell is occupied, icon snaps to nearest empty cell

### Visual Feedback

- During drag: icon opacity drops to 0.6, gains a drop shadow
- Ghost outline (dashed border) shows the target snap position
- On drop: icon animates to final position (0.15s ease)

### Persistence

- On drop, all icon positions are saved to `localStorage` key `sgi-icon-positions`
- Format: `Record<string, { col: number; row: number }>` where the string key is the `windowId` (consistent with all other icon/window keying in the system)
- On page load, saved positions are restored; new/unknown icons get auto-placed in first available cell
- If localStorage is empty, icons default to vertical column layout (current behavior)

### Files

| Action | File | Changes |
|--------|------|---------|
| Modify | `src/themes/sgi-irix/Desktop.astro` | Icon container switches to relative positioning, icons get absolute positioning |
| Modify | `src/engine/desktop.ts` | Add mousedown handler with 5px drag threshold; integrate with existing click/dblclick handling |
| Modify | `src/layouts/Desktop.astro` | Grid snap logic, localStorage read/write, icon position restore on load |
| Modify | `src/themes/sgi-irix/theme.css` | Drag state styles, ghost outline, snap animation |

---

## Feature 7: Blog Post — "Building an SGI Desktop in 2026"

### What It Does

A ~1200-word blog post covering the technical build of the site, aimed at HN/dev Twitter.

### Outline

1. **Why SGI?** (~200 words) — The Indigo2 as a dream machine. What IRIX meant to a generation of developers. Why recreate it in 2026.
2. **The Stack** (~250 words) — Astro 6 for zero-JS static output. CSS custom properties for live theming. SVG for icons. Web Audio for sound.
3. **Building a Window Manager in CSS+JS** (~300 words) — How wm.ts works: z-index stacking, drag/resize with mouse events, virtual desks, splash screens.
4. **The Details That Matter** (~250 words) — Boot sequence timing. Metallic gradient recipes. Color scheme switching with cookie persistence. The sound pack.
5. **What I Learned** (~200 words) — CSS-only animations are more powerful than expected. SVG gradient ID namespacing. The power of designing within constraints.

### Tone

Technical but personal. First person. "Here's a cool thing I built and why." Code snippets where they illustrate a point. No filler.

### Files

| Action | File | Changes |
|--------|------|---------|
| Create | `src/content/blog/building-sgi-desktop.md` | Full blog post with frontmatter |

---

## Dependency Map

```
Screensaver ──→ Boot.astro integration ──→ Idle timer in Desktop.astro
Interactive Console ──→ Easter eggs (xeyes, doom) use console commands
MediaMail ──→ Replaces contact window (icon swap)
Cascade/Tile ──→ Extends wm.ts + existing menu
OG Image ──→ Independent (meta tags + static PNG)
Draggable Icons ──→ Independent (Desktop.astro + localStorage)
Blog Post ──→ Independent (content collection)
```

### Suggested Build Order

1. **Interactive Console + Easter Eggs** — most complex, high wow factor
2. **Screensaver** — boot + idle integration
3. **MediaMail** — contact form replacement
4. **Cascade/Tile** — small wm.ts addition
5. **Draggable Icons** — Desktop.astro changes
6. **OG Image** — meta tags + screenshot
7. **Blog Post** — content only, no code dependencies

---

## What's Not In Scope

- Server-side email delivery (mailto: is sufficient for v1)
- Edge snapping / half-screen tiling (not period-accurate)
- Konami code or other keyboard easter eggs beyond console commands
- Canvas-based screensaver (CSS-only is sufficient)
- Dynamic OG image generation (static PNG works everywhere)
