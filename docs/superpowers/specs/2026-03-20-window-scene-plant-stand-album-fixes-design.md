# Window Scene, Plant Stand & Album Data Fixes

**Date:** 2026-03-20
**Status:** Approved

## Summary

Three improvements to the 2D BBS desk scene:

1. Add animated sky content (clouds, birds, airplane) inside the rain window during daytime
2. Add a CSS wooden stand beneath the desk plant to cover the awkward pot bottom
3. Fix two incorrect album names in the album track data

## 1. Window Scene — Animated CSS Layers

### Problem

The rain window currently shows a flat gradient sky during daytime with no visual interest. Only rain streaks animate, and only at night/evening.

### Solution

Add layered CSS elements inside `.rain-window-glass`, behind the existing rain streaks, visible during morning and afternoon.

### Layers (back to front)

1. **Sky gradient** — existing, time-of-day aware (no change)
2. **Clouds** — 3 `div` elements with `border-radius: 50%` and `box-shadow` to form fluffy shapes. Each drifts horizontally at different speeds for parallax depth:
   - Back cloud: ~60s animation duration, lower opacity
   - Mid cloud: ~40s duration
   - Front cloud: ~25s duration, higher opacity
   - Wrap-around via CSS keyframe that translates from right to left
3. **Birds** — 2-3 small V-shaped CSS elements (two rotated lines forming a checkmark silhouette). Fly across the window on staggered animations (8-20s delay intervals). Small and subtle — silhouettes only.
4. **Airplane** — Single small silhouette (CSS shapes or tiny inline SVG). Crosses the window on a ~45-90s animation cycle. Slight diagonal path (bottom-left to upper-right). Optional faint contrail (thin white line that fades via opacity).
5. **Rain streaks** — existing layer, stays on top (no change)

### Z-Index Layering

New elements must slot between the existing layers inside `.rain-window-glass`:

| Layer | Z-Index | Notes |
|-------|---------|-------|
| `.rain-window-outside` (sky gradient) | default | Background |
| Clouds | 1-2 | Back cloud z-1, mid/front z-2 |
| Birds / Airplane | 3 | Above clouds |
| `.rain-window-glass::before/::after` (crossbars) | 5 | Existing, unchanged |
| `.rain-streaks` | 4 | Existing, unchanged |

### Starting Positions

Cloud and bird animations use CSS-only staggered `animation-delay` values (no frontmatter randomization needed). Each cloud gets a different delay to avoid synchronized starts at page load. Birds use `nth-child`-based delays.

### Visibility Rules

- **Morning/afternoon**: clouds, birds, airplane visible; no rain
- **Night/evening/dawn**: rain takes over; clouds, birds, airplane hidden via `opacity: 0` keyed off `body[data-time]`
- **`.rain-active` override**: when `.rain-active` is set on the window (afternoon rain days), clouds/birds/airplane are also hidden — `.rain-active .cloud, .rain-active .bird, .rain-active .airplane { opacity: 0 }`
- **`prefers-reduced-motion`**: all animations paused, show static clouds only

### Files Modified

- `src/themes/bbs/RainWindow.astro` — add cloud, bird, airplane HTML elements inside `.rain-window-glass`
- `src/themes/bbs/theme.css` — add keyframe animations, time-of-day visibility rules, reduced-motion overrides

## 2. Plant Stand

### Problem

The plant PNG's pot bottom is visible and looks awkward — it appears tilted or incomplete at the base.

### Solution

Add a CSS-drawn wooden stand beneath `.desk-plant` that covers the pot bottom.

### Implementation

- Use a `::before` pseudo-element on `.desk-plant`
- Style as a small wooden platform matching desk wood tone (~`#4a3020` range)
- Dimensions: ~80px wide x ~20px tall
- `position: absolute; bottom: 0` to anchor at container base
- `z-index: 1` so it renders above the `<img>` element (which has no z-index)
- `box-shadow` for depth, slight `border-radius` on top edges
- Top bevel highlight for 3D effect

### Files Modified

- `src/themes/bbs/theme.css` — add `.desk-plant::before` styles

## 3. Album Data Fixes

### Problem

Two album names are incorrect in the track data.

### Corrections

| Entry | Current (Wrong) | Correct |
|-------|----------------|---------|
| Shinedown — "Simple Man" | `"The Sound of Madness"` | `"Leave a Whisper"` |
| Fair to Midland — "Dance of the Manatee" | `"Fables from a Mayfly: The Diary of Poe"` | `"Fables from a Mayfly: What I Tell You Three Times Is True"` |

### Post-Fix Verification

Re-run `npx tsx scripts/fetch-itunes-previews.ts` to verify preview URLs still resolve (they are keyed by artist+track, not album name, so they should be unaffected).

### Files Modified

- `src/data/album-tracks.ts` — correct two `album` field values

## Approach

Pure CSS for all visual changes. No new dependencies, no new image assets, no JavaScript additions. Follows existing patterns (time-of-day CSS, `prefers-reduced-motion` overrides, BBS aesthetic).

## Files Changed (Complete List)

1. `src/themes/bbs/RainWindow.astro` — cloud, bird, airplane elements
2. `src/themes/bbs/theme.css` — animations, plant stand, visibility rules
3. `src/data/album-tracks.ts` — two album name corrections
