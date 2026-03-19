# Living World Atmosphere + Quick Wins — Design Spec

**Date:** 2026-03-19
**Status:** Draft
**Scope:** Ambient atmosphere system across all three eras, plus quick wins (THX fix, wall color, clickable albums)

---

## Overview

Transform toddlebaron.com from a static retro-OS portfolio into a **living, breathing environment** that responds to user interaction, time of day, and season. The BBS room gains a rain-streaked window, desk lamp, and wall clock. All eras gain typing sounds, ambient hum, and time-aware behavior. The site becomes a place visitors want to linger in.

This spec also covers three quick wins: fixing the THX deep note audio, changing the BBS wall color to parchment, and making the album shelf clickable with music playback.

---

## Future Phases (Out of Scope)

These are planned but not part of this spec:

- **Phase 2:** BBS text adventure
- **Phase 3:** Cross-era achievement/discovery system
- **Phase 4:** Plan 9 from Bell Labs — 4th era theme

---

## Quick Wins

### QW-1: Fix THX Deep Note Not Playing

**Problem:** `playTHXDeepNote()` in `src/engine/modem-audio.ts` creates a fresh `AudioContext` each time. By the time it's called (after WOPR speech, deep into the boot sequence), the browser may block the new context because the original user gesture is "stale."

**Fix:** Modify `playTHXDeepNote()` and `playModemHandshake()` to accept an optional `AudioContext` parameter. When provided, use it instead of creating a new one.

In `Boot.astro`, the existing user-gesture listeners (`click`, `keydown`, `touchstart`) already call `startAudio()`. Extend `startAudio()` to create a shared `AudioContext` that is passed to both `playModemHandshake(sharedCtx)` and later to `playTHXDeepNote(sharedCtx)`.

**Important:** Do NOT use `getContext()` from `audio.ts` for this. The `audio.ts` module manages file-based audio playback (`.mp3` files). The `modem-audio.ts` module does real-time oscillator synthesis, which has different lifecycle needs (its context gets closed after playback). Keep these two audio systems separate — they serve different purposes. The shared context here is only shared between modem handshake and THX within a single boot sequence.

**Files changed:**
- `src/engine/modem-audio.ts` — `playTHXDeepNote(ctx?: AudioContext)` and `playModemHandshake(ctx?: AudioContext)` accept optional context; skip `ctx.close()` if context was passed in (caller manages lifecycle)
- `src/themes/bbs/Boot.astro` — create shared `AudioContext` on user gesture, pass to both functions, close after boot completes

### QW-2: Wall Color — Parchment / Dark Eggshell

**Current:** Lower wall (`.desk-surface` area background) uses sponge-painted violet tones. Base color `#9a85b0` with purple/violet radial gradients.

**Change:** Shift to warm parchment tones:
- Base: `#d4c8a8` (parchment) or `#c8bda0` (dark eggshell)
- Sponge gradients shift from `rgba(140,110,170,...)` purple tones to cream/tan/khaki: `rgba(190,175,145,...)`, `rgba(175,160,130,...)`, `rgba(200,185,155,...)`
- Upper wall gradient shifts from `#3a2040 → #4d2e58` (purple) to something that complements parchment — perhaps `#3a3528 → #4d4838` (warm dark olive/brown)

**Files changed:**
- `src/themes/bbs/theme.css` — `.wall` background gradient, `.desk-surface` background-color and radial gradients

### QW-3: Clickable Album Shelf — Music Playback

**Approach:** Use the iTunes Search API (free, no auth) to get 30-second preview URLs.

**Build-time data strategy:** `src/data/album-tracks.ts` is a **static data file** with hardcoded preview URLs. During development, we run a one-time build script (`scripts/fetch-itunes-previews.ts`) that queries the iTunes Search API and writes the results into `album-tracks.ts`. The deployed site never calls iTunes at runtime. If a preview URL goes stale, re-run the script. Fallback: if a URL 404s at runtime, the player shows the "Now Playing" overlay without audio (graceful degradation, no crash).

**Album → track mapping:**

| Album | Track | data-album ID |
|-------|-------|--------------|
| Chicago 17 | Stay the Night | `chicago-17` |
| Papa Roach — Paramour Sessions | Forever | `papa-roach-paramour` |
| Linkin Park — Hybrid Theory | In The End | `linkin-park-hybrid-theory` |
| Shinedown | Simple Man | `shinedown` |
| Halestorm (self-titled) | It's Not You | `halestorm` |
| Silversun Pickups | Panic Switch | `silversun-pickups` |
| Evanescence | Better Without You | `evanescence` |
| Godsmack | Lighting Up the Sky | `godsmack` |
| Fair to Midland | Dance of the Manatee | `fair-to-midland` |
| Breaking Benjamin | Diary of Jane | `breaking-benjamin` |

Each album element in `BBS.astro` / the shelf component gets a `data-album="<id>"` attribute matching the IDs above. The existing `.album-shelf .album` elements (identified by their `alt` text or positional order) each receive the corresponding `data-album` attribute.

**Runtime behavior:**
1. Click album → small "Now Playing" overlay appears at the bottom of the monitor screen (inside `.hw-screen-content`, position: fixed to bottom)
2. Overlay shows: album art (from iTunes `artworkUrl100`, hardcoded in data file), track name, artist, play/pause button, progress bar (thin line showing playback position)
3. Audio plays via `HTMLAudioElement` pointing at the hardcoded `previewUrl`
4. Click another album → **crossfade**: new track fades in from 0 to full volume over 500ms while old track fades out over 500ms (linear volume ramp via `HTMLAudioElement.volume` updated every 50ms by `setInterval`)
5. Click playing album again → pause/resume toggle
6. Respects existing mute toggle from `audio.ts` — checks `isMuted()` before starting playback; listens for mute toggle changes

**Files:**
- `src/data/album-tracks.ts` (NEW) — static data: album ID → { artist, track, artworkUrl, previewUrl }
- `scripts/fetch-itunes-previews.ts` (NEW) — one-time dev script to populate album-tracks.ts from iTunes API
- `src/themes/bbs/AlbumPlayer.astro` (NEW) — Now Playing overlay component
- `src/themes/bbs/theme.css` (MODIFY) — shelf album hover states (cursor pointer, slight scale on hover), Now Playing overlay styles
- `src/layouts/BBS.astro` (MODIFY) — include AlbumPlayer component, add `data-album` attributes to shelf elements

---

## Sensory Layer — All Eras

### S-1: Typing Sounds Engine

**New module:** `src/engine/typing-sounds.ts`

Synthesizes mechanical keyboard click sounds using Web Audio API. No audio files needed. Uses `getContext()` from `audio.ts` for the AudioContext (since these are short-lived one-shot sounds, same as the file-based sounds).

**Per-era profiles:**
- **BBS:** IBM Model M — clicky, pronounced. Two-phase sound: key-down (sharp click, ~2ms burst at 4kHz) + key-up (softer thock, ~1.5ms at 2.5kHz, 30ms after down).
- **SGI:** SGI Granite keyboard — softer membrane. Single muted thump (~1.5ms at 1.5kHz, lower volume).
- **NeXTSTEP:** Cherry MX — crisp short click. Single clean click (~1.5ms at 3.5kHz, medium volume).

**Variation:** Each keystroke randomizes pitch ±15% and timing ±5ms to prevent robotic repetition.

**Integration points:**
- **BBS:** The BBS terminal uses document-level `keydown` for menu navigation (single character shortcuts like A, B, H, M, R, G). Attach typing sounds to the same `keydown` listener on `document`, but only fire when the BBS main content is visible (not during boot). Filter to printable keys only (no Shift, Ctrl, etc.).
- **SGI Console:** The console has an `<input>` element for command entry (`.sgi-console-input`). Attach `keydown` listener directly to that input.
- **NX Terminal:** Same pattern — attach to the NXTerminal's input element.
- **Generic:** Any element with `data-typing-sound="bbs|sgi|nextstep"` attribute gets a `keydown` listener attached.

**Mute:** Checks `isMuted()` from `audio.ts` before each sound. Does NOT maintain separate mute state.

### S-2: CRT Hum (BBS Only)

60Hz sine wave + 120Hz harmonic (2nd harmonic of mains frequency). Very low volume (gain ~0.02). Starts after `boot:complete` event. Uses `getContext()` from `audio.ts`. Creates persistent `OscillatorNode`s that run continuously. Fades in over 2 seconds (`gain.linearRampToValueAtTime`).

Stops when `stopAmbient()` is called (page unload or theme switch — see S-5).

### S-3: Workstation Fan Hum (SGI Only)

Bandpass-filtered white noise centered at ~400Hz, Q=2. Gain ~0.015. Starts after boot completes (SGI layout dispatches `boot:complete`). Uses `getContext()` from `audio.ts`. Simulates the famously loud SGI Indigo2 fans — but tastefully quiet.

### S-4: UI Interaction Sounds

All synthesized via Web Audio using `getContext()` from `audio.ts`, no files. Short bursts (<50ms). Each is a function in `src/engine/typing-sounds.ts` (or a separate `src/engine/ui-sounds.ts` if the file gets large):

**SGI:**
- Window drag start: soft click (800Hz, 3ms). Hook: `wm:drag-start` custom event.
- Window drop/snap: thud (200Hz, 8ms). Hook: `wm:drag-end` custom event.
- File manager folder open: paper rustle (noise burst, 5ms, bandpass 2-4kHz). Hook: click on `.fm-folder` elements.
- Context menu open: soft pop (600Hz, 2ms). Hook: `contextmenu` event on desktop.

**NeXTSTEP:**
- Shelf button click: crisp click (1.2kHz, 2ms). Hook: click on `.nx-shelf-btn` elements.
- Dock bounce: spring sound (400Hz→200Hz sweep, 50ms). Hook: `wm:window-opened` custom event.
- Window shade: swoosh (noise sweep high→low, 80ms). Hook: `wm:window-shaded` custom event.
- Window unshade: swoosh (noise sweep low→high, 80ms). Hook: `wm:window-unshaded` custom event.

**BBS:**
- Menu selection: beep (1kHz, 15ms). Hook: click on `.bbs-menu-item` elements.
- Page transition: HDD chatter (rapid noise bursts, 200ms total). Hook: `bbs:page-change` custom event dispatched by Terminal.astro when switching content sections.

**Note:** Some of these custom events (`wm:drag-start`, `wm:drag-end`, `wm:window-shaded`, `bbs:page-change`) do not currently exist in the codebase. They must be added to the respective modules (`wm.ts`, `Terminal.astro`) as part of this work.

### S-5: Ambient Orchestrator

**New module:** `src/engine/ambient.ts`

Coordinates all ambient sounds for the current era. Single source of truth for starting/stopping the ambient sound system.

```typescript
import { isMuted } from './audio';

// Starts all ambient sounds for the given era
// Creates oscillators, attaches listeners, starts hum/fan
export function startAmbient(era: 'bbs' | 'sgi' | 'nextstep'): void;

// Stops all ambient sounds — disconnects oscillators, removes listeners
// Called on page unload (window 'beforeunload' event)
export function stopAmbient(): void;
```

**Mute integration:** Does NOT maintain separate mute state. All sound-producing functions check `isMuted()` from `audio.ts` before producing audio. When `audio.ts`'s `toggleMute()` is called, ambient sounds are already gated because they check `isMuted()` on each sound trigger. For continuous sounds (CRT hum, fan), the orchestrator listens for a `audio:mute-changed` custom event (must be added to `audio.ts`'s `toggleMute()`) and sets gain to 0 when muted.

**Cleanup:** Since this is an Astro MPA (multi-page app), each page navigation is a full page reload. No explicit teardown is needed for theme switching — the page reload destroys all JS state. The `beforeunload` listener is a safety net for AudioContext cleanup.

**Called from:** Each era's layout component (`BBS.astro`, `Desktop.astro`, `NXDesktop.astro`) calls `startAmbient('era-id')` after boot completes (listening for `boot:complete` custom event, or directly in a `<script>` tag after the boot check).

---

## Environmental Layer

### E-1: Rain Window (BBS)

**New component:** `src/themes/bbs/RainWindow.astro`

A partial window visible in the lower-right corner of the BBS room. Shows only the bottom-right quadrant of a window frame — wooden sash, glass pane, hint of windowsill.

**Visual structure:**
- Window frame: dark wood grain (CSS gradient, ~120×160px visible area)
- Glass pane: semi-transparent with reflection sheen
- Rain streaks: 15-20 CSS-animated vertical lines, varying speed (1.5-3s), opacity, and width
- Each streak is a thin gradient line that slides down the glass and disappears

**Weather conditions (driven by time-of-day engine):**
- **Night (8pm-5am):** Always raining. Dark blue/black outside the glass. Occasional lightning (CSS flash on wall, 0.2s, random 30-90s interval via JS `setTimeout`). Thunder sound (low oscillator, 100Hz, 300ms, timed 1-3s after flash).
- **Dawn (5-7am) / Evening (5-8pm):** Orange/pink gradient visible through glass. Light drizzle (8 streaks, slower animation 3-5s).
- **Afternoon (12-5pm):** Warm light through glass. Rain determined by session seed (see below).
- **Morning (7am-12pm):** Clear, warm light. No rain.

**Rain persistence:** Whether it rains during `afternoon` is determined by a session-stable random seed: `Math.floor(Date.now() / 86400000)` (changes daily, not per page load). This means rain state is consistent for an entire day but varies day to day. Stored as a CSS class on the window element: `.rain-active` or `.rain-clear`.

**Rain audio:** `src/engine/weather.ts`:
- Base rain: bandpass-filtered white noise (center 3kHz, Q=1), very low volume (gain 0.01)
- Drip accents: short noise bursts (5ms, bandpass 5-8kHz) at random intervals (2-8s via `setTimeout` chain)
- Volume level is a constant per weather condition (heavy rain = 0.015, drizzle = 0.008), NOT dynamically linked to CSS streak count. The number of streaks per condition is fixed by the CSS, so volume is set per condition.
- Thunder: 100Hz oscillator, 300ms duration, gain 0.04. Timed 1-3s after lightning CSS flash.

**Placement:** Inside `.desk` container, positioned `absolute` to lower-right (`right: 0; bottom: 0`). Z-index below desk items (Yoo-hoo, B-wing) but above wall background.

### E-2: Desk Lamp (BBS)

**New component:** `src/themes/bbs/DeskLamp.astro`

CSS desk lamp on the left side of the desk surface.

**Visual:**
- Lamp body: simple geometric shape (trapezoid shade + thin stem + base), dark metal, ~60px wide
- Light cone: radial gradient from warm amber `rgba(255,220,150,0.3)` spreading downward and outward
- Subtle flicker: CSS animation oscillating opacity between 0.97 and 1.0 using `steps()` timing with multiple keyframes at irregular intervals to feel organic

**Time-of-day behavior:**
- **Night/Evening:** Lamp ON. Primary light source. Room ambient darkens via `body[data-time="night"] .wall` CSS rule adding a dark overlay. Monitor glow + lamp = only illumination.
- **Day/Morning:** Lamp OFF (`opacity: 0; pointer-events: none`). Natural light from window is primary.
- Transition: CSS `transition: opacity 2s ease` for gentle on/off when time period changes.

**Dust motes:** 10-15 small circles (`<div>` elements), 2-4px diameter, warm amber color, `opacity: 0.3-0.6`. Each on a unique CSS animation: slow drift (`translateX` wobble ±10px + `translateY` downward 60px), duration 8-15s, infinite loop. Contained within the light cone area using `clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)` on a parent div (trapezoid shape approximating the cone). This polygon creates a downward-widening trapezoid. Motes that exit the bottom simply restart at top due to infinite animation loop.

### E-3: Wall Clock (BBS)

**New component:** `src/themes/bbs/WallClock.astro`

Small analog clock on the wall, to the right of the album shelf or above the desk area.

**Visual:** ~50px diameter. Dark frame (2px solid `#333`), cream face (`#f5f0e0`), simple tick marks at 12/3/6/9. Three hands: hour (short, thick), minute (long, medium), second (long, thin, red).

**Behavior:** Reads visitor's local time. Second hand animated via CSS `animation: spin 60s linear infinite` with `transform-origin: center bottom`. Hour/minute hands set by JS on mount via inline `style="transform: rotate(Xdeg)"`. Updated every 60s via `setInterval` to keep hour/minute hands accurate.

### E-4: Modem LED Activity (BBS)

Modify existing `Modem.astro` component. Add two small LED indicators (4px circles) labeled TX (red) and RX (green) below the existing modem body.

**Event integration:**
- **RX blink (green):** Listen for `bbs:content-rendered` custom event. This event must be dispatched by `Terminal.astro` whenever it renders new content into the screen area (menu display, page content change, etc.). On event: RX LED CSS class `led-blink` added, which animates `opacity: 0→1→0` over 200ms, then auto-removes.
- **TX blink (red):** Listen for `keydown` on `document` (same scope as BBS menu input). On keypress: TX LED does the same blink animation.

Both events are gated by boot completion (no LED activity during boot sequence).

### E-5: SGI Screensaver Modes

The existing `Screensaver.astro` already combines a starfield AND the SGI cube in a single view. Refactor into a mode system:

1. **SGI Cube + Starfield** (existing combined view, mode "classic")
2. **Matrix Rain:** Green characters falling in columns. CSS-only implementation: 20 columns of `<span>` elements with staggered `animation-delay`, each cycling through random characters via CSS `content` property changes (JS sets random chars on mount, CSS handles the fall animation). Varying speed (2-6s) and brightness (opacity 0.3-1.0).
3. **Deep Space:** Slow-moving nebula gradients (CSS radial gradients with `hue-rotate` animation) + more/larger stars. Peaceful, no motion besides gentle color shift.

**Dropped: Pipes screensaver.** The canvas-based procedural pipe generation algorithm is disproportionately complex for this spec. It can be added as a follow-up ticket if desired.

**Mode selection:** On each screensaver trigger, JS picks a random mode that differs from the last one (stored in `sessionStorage`). Each mode is a `<div>` inside the screensaver container; only the active one gets `display: block`.

### E-6: SGI Clock Widget

**New component:** `src/themes/sgi-irix/ClockWidget.astro`

A small draggable window registered with `wm.ts`:
- **Window ID:** `clock`
- **Title:** `Clock`
- **Default position:** `{ x: 20, y: 60 }` (top-left area, out of the way)
- **Default size:** `{ width: 130, height: 150 }`
- **Z-index:** Managed by `wm.ts` like all other windows
- **Toolchest entry:** Added to the "System" section of the Toolchest with a clock icon
- **Closable:** Yes (close button removes from desktop, re-open via Toolchest)
- **Auto-open:** If `localStorage.getItem('sgi-clock-open') === '1'`, auto-opens on boot. State saved on open/close.

**Visual:** SGI Indigo Magic window chrome (same as all other SGI windows). Interior: analog clock face, same design as BBS WallClock but styled to match SGI aesthetic (dark face, lighter hands).

### E-7: NeXTSTEP Animated Dock Icons

Modify `src/themes/nextstep/NXDock.astro`:

- **Godzilla:** On hover, a small flame animation (CSS `background: radial-gradient(...)` with `hue-rotate` animation + `scale(1.05)` pulse) appears above the icon
- **Fractals:** Icon cycles through 3-4 fractal pattern backgrounds via CSS `background-position` animation on a sprite strip (10s loop, infinite)
- **Music:** Icon shows a spinning disc/record (`animation: spin 4s linear infinite` on a nested `<div>` with a record background)
- **Recycler:** On hover, lid opens slightly (`translateY(-3px)` on a pseudo-element representing the lid)

All CSS-only, no JS overhead. Animations only active on `:hover` (except Fractals which always cycles slowly).

### E-8: NeXTSTEP Lab Ambience

Very faint ambient sound. Filtered white noise (bandpass center 600Hz, Q=3, gain 0.008). Represents distant lab equipment. Starts after boot via `startAmbient('nextstep')`. Uses `getContext()` from `audio.ts`.

---

## Time-Aware Living World

### T-1: Time-of-Day Engine

**New module:** `src/engine/time-of-day.ts`

```typescript
export type TimePeriod = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

/** Returns current time period based on visitor's local time */
export function getTimePeriod(): TimePeriod;

/** Returns time period for a given Date (useful for testing) */
export function getTimePeriodAt(date: Date): TimePeriod;

/** Calls callback when period changes. Checks every 60s. Returns unsubscribe function. */
export function onPeriodChange(callback: (period: TimePeriod) => void): () => void;

/** Sets body[data-time] attribute and fires initial callback */
export function initTimeOfDay(): void;
```

Periods:
- `dawn`: 5:00–7:00
- `morning`: 7:00–12:00
- `afternoon`: 12:00–17:00
- `evening`: 17:00–20:00
- `night`: 20:00–5:00

`initTimeOfDay()` sets `document.body.dataset.time = getTimePeriod()` immediately, starts the 60-second interval, and updates the attribute on each check. All CSS time-of-day rules key off `body[data-time="night"]` etc. — no JS needed for visual changes beyond setting the attribute.

### T-2: Per-Era Time Response

All visual changes are CSS rules keyed on `body[data-time="..."]`:

**BBS:**
- `body[data-time="night"] .wall` — darker overlay via `::after` pseudo-element with `background: rgba(0,0,0,0.3)`
- `body[data-time="night"] .hw-monitor` — increased `box-shadow` spread for CRT glow
- Rain window and desk lamp respond via their own `data-time` CSS rules (see E-1, E-2)

**SGI:**
- `body[data-time="night"] .sgi-desktop` — background gradient shifts to deeper indigo
- `body[data-time="morning"] .sgi-desktop` — lighter top gradient
- Status bar: JS reads time period and sets a text content span to "☀️" or "🌙"
- `body[data-time="night"]` — screensaver idle timeout reduced from 90s to 60s (JS reads `data-time` when setting timeout)

**NeXTSTEP:**
- `body[data-time="night"] .nx-dock` — `opacity: 0.85`
- `body[data-time="night"] .nx-shelf-btn` — `box-shadow: 0 0 8px rgba(255,200,100,0.15)`

### T-3: Idle Behaviors

**BBS (2 minutes):**
New idle timer in `src/layouts/BBS.astro`. Listens for `mousemove`, `keydown`, `click`, `touchstart` on `document`. After 120s of no events: adds CSS class `.idle-active` to body. CSS rule: `.idle-active .hw-screen-content::after` creates a dark overlay with centered "NO CARRIER DETECTED" text (blinking via `animation: blink 2s step-end infinite`). Any input event removes the class and resets the timer.

**SGI (90 seconds, existing):**
Already triggers screensaver. Enhancement: when triggering, pick random mode from E-5 pool.

**NeXTSTEP (2 minutes):**
Same timer pattern as BBS. `.idle-active .nx-desktop::after` dark overlay. `.idle-active .nx-dock-tile` gets `animation: pulse 3s ease-in-out infinite` oscillating `opacity: 0.4→0.7`. Any input removes `.idle-active`.

### T-4: Seasonal Touches

**New module:** `src/engine/seasonal.ts`

**V1 scope: December snow only.** The seasonal engine and one season ships in this spec. Additional seasons (Halloween, April Fools, birthday) are follow-up tickets to avoid scope creep. The engine is designed to support them, but only December is implemented now.

```typescript
export interface SeasonalOverride {
  cssClass?: string;           // added to <body>
  particleEffect?: 'snow';     // v1: only snow
  bootMessageOverride?: string; // prepended to boot ASCII
}

/** Returns active seasonal override or null */
export function getSeasonalOverride(): SeasonalOverride | null;
```

**December 1-31:**
- `getSeasonalOverride()` returns `{ cssClass: 'seasonal-winter', particleEffect: 'snow' }`
- Snow particles: 30 CSS-animated circles (`<div>` with `border-radius: 50%`, white, 2-5px), absolute positioned, drifting downward with slight horizontal wobble. Each on unique `animation-duration: 6-15s`, `animation-delay: 0-10s`, random horizontal start position. Applied via a shared `Snow.astro` component included in all layouts when `particleEffect === 'snow'`.
- BBS greeting includes "❄️ Happy Holidays from T-NET BBS" prepended to first boot line.

**Future seasons (out of v1 scope, documented for reference):**
- October: spooky boot ASCII, midnight scheme, jack-o-lantern icon
- April 1: CSS `transform: rotate(180deg)` on main content (chosen over theme swap — simpler, more obviously a joke)
- Todd's birthday (date TBD): confetti particles + special fortune

---

## Performance & Accessibility

### Performance Budget

- **CSS animations:** All rain, dust, snow, and clock animations use `transform` and `opacity` only (GPU-composited, no layout thrash). Total animated element count: ~60 max (20 rain streaks + 15 dust motes + 30 snow particles). Each is a simple `<div>` with no children.
- **Web Audio:** Maximum 4 simultaneous persistent oscillator nodes (CRT hum: 2 oscillators, fan: 1 noise source, lab: 1 noise source). One-shot sounds (typing, UI clicks) create and auto-release nodes.
- **Timers:** 2 active `setInterval`s max (time-of-day check: 60s, clock update: 60s). Idle timer uses event listener + single `setTimeout`, not an interval.

### Graceful Degradation

- **`prefers-reduced-motion: reduce`:** All CSS animations are wrapped in `@media (prefers-reduced-motion: no-preference) { ... }`. When reduced motion is preferred: rain streaks are static (just vertical lines, no animation), dust motes are hidden, snow is hidden, clock second hand is hidden (minute hand only, updated every 60s). Screensavers show a static version of the selected mode.
- **Low-end devices:** No canvas rendering (Pipes screensaver was dropped for this reason). All animations are CSS-only with GPU-composited properties. Audio synthesis is lightweight (oscillators, not convolution).
- **Audio failure:** All audio is wrapped in try/catch. If `AudioContext` creation fails, ambient features silently degrade to visual-only. `isMuted()` is the gate, and the mute default is `true` — sounds only play after user explicitly unmutes or clicks.

---

## Architecture

### New Files

```
src/engine/
├── typing-sounds.ts    — Per-era keyboard click synthesis (uses audio.ts context)
├── time-of-day.ts      — Time period detection + change callbacks + body[data-time]
├── ambient.ts          — Orchestrator: starts/stops all ambient systems per era
├── seasonal.ts         — Date-based seasonal overrides (v1: December snow only)
└── weather.ts          — Rain audio synthesis, thunder, lightning

src/themes/bbs/
├── RainWindow.astro    — Partial window, lower-right corner of room
├── DeskLamp.astro      — Desk lamp + light cone + dust motes
├── WallClock.astro     — Analog clock on wall
└── AlbumPlayer.astro   — Now Playing overlay for album clicks

src/themes/sgi-irix/
└── ClockWidget.astro   — Small analog clock window (wm ID: "clock")

src/components/
└── Snow.astro          — Seasonal snow particles (included conditionally)

src/data/
└── album-tracks.ts     — Static data: album ID → { artist, track, artworkUrl, previewUrl }

scripts/
└── fetch-itunes-previews.ts — Dev-time script to populate album-tracks.ts
```

### Modified Files

```
src/engine/modem-audio.ts     — Accept shared AudioContext in THX + handshake
src/engine/audio.ts           — Export getContext(); add audio:mute-changed event to toggleMute()
src/engine/wm.ts              — Dispatch wm:drag-start, wm:drag-end, wm:window-shaded, wm:window-unshaded events
src/themes/bbs/Boot.astro     — Share AudioContext across modem/THX calls
src/themes/bbs/Terminal.astro — Dispatch bbs:content-rendered and bbs:page-change events
src/themes/bbs/Modem.astro    — TX/RX LED indicators
src/themes/bbs/theme.css      — Wall color, night mode, window styles, album hover, idle overlay, reduced-motion
src/layouts/BBS.astro         — Include new components, startAmbient('bbs'), initTimeOfDay(), idle timer
src/themes/sgi-irix/Screensaver.astro — Refactor into mode system (classic, matrix, deep-space)
src/themes/sgi-irix/Toolchest.astro   — Add Clock entry to System section
src/themes/sgi-irix/theme.css — Time-of-day background shifts, reduced-motion
src/themes/nextstep/NXDock.astro — Animated hover icons (CSS-only)
src/themes/nextstep/theme.css — Night mode, dock pulse, idle overlay, reduced-motion
src/layouts/Desktop.astro     — startAmbient('sgi'), initTimeOfDay()
src/layouts/NXDesktop.astro   — startAmbient('nextstep'), initTimeOfDay()
```

### Key Design Decisions

1. **All sounds use `getContext()` from `audio.ts`** — single AudioContext for all sound (except BBS boot sequence modem/THX, which uses a separate short-lived context). This prevents the "too many AudioContexts" browser limit.
2. **Mute is centralized in `audio.ts`** — no duplicate mute state. `ambient.ts` and `typing-sounds.ts` check `isMuted()`. Continuous sounds listen for `audio:mute-changed` custom event.
3. **Time-of-day is CSS-driven** — JS sets `body[data-time]`, CSS does all visual changes. This means time transitions are smooth (CSS transitions) and new time-responsive styles can be added without JS changes.
4. **Astro MPA = natural cleanup** — page navigation reloads everything. No complex teardown needed for theme switching. `beforeunload` is a safety net.
5. **Rain is CSS-only** — no canvas, no JS animation loop. Just CSS keyframe animations on thin gradient divs.
6. **iTunes data is static** — hardcoded in a `.ts` file, populated by a dev script. No runtime API calls. Stale URLs degrade gracefully.
7. **Seasonal is engine + one season** — framework supports multiple seasons but only December ships in v1 to control scope.
8. **Reduced motion respected** — all animations behind `prefers-reduced-motion` media query. Static fallbacks provided.

---

## Implementation Order

1. Quick wins (QW-1, QW-2, QW-3) — ship immediately
2. Core infrastructure (S-5 ambient orchestrator, T-1 time-of-day engine, audio.ts changes)
3. Sensory layer (S-1 through S-4) — typing sounds + ambient hum + UI sounds
4. BBS environmental (E-1 through E-4) — rain window, lamp, clock, modem LEDs
5. SGI/NX environmental (E-5 through E-8) — screensavers, clock widget, dock animations
6. Time-of-day integration (T-2) — per-era CSS rules
7. Idle behaviors (T-3) — screen dim + NO CARRIER
8. Seasonal (T-4) — December snow

---

## Open Items

- ~~Silversun Pickups track~~ — confirmed: "Panic Switch"
- **Todd's birthday date** — needed for future seasonal trigger (not blocking v1)
- **Album track verification** — run `scripts/fetch-itunes-previews.ts` to confirm all 10 tracks return valid preview URLs. Fallback: manually find and hardcode any missing URLs.
