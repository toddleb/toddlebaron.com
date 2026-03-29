# Cassette Tape Shelf & Object Sizing

**Date:** 2026-03-29
**Status:** Draft
**Scope:** Replace CD album covers with cassette tape spines, resize all desk objects proportionally

---

## 1. Cassette Tape Spines

### Problem
The album shelf shows 10 square album cover images (140x140px) styled as CD jewel cases. The BBS era is "Est. 1984" — CDs weren't mainstream. The correct physical format is cassette tapes.

### Solution
Replace album cover images with pure CSS cassette spine labels. On a real shelf, you see only the narrow spine of each cassette case, with the band name printed vertically in the album's color scheme. This is how cassette J-cards worked — the cover art wrapped around the case, and the spine showed the artist name.

### Spine Design
- Width: ~16px per spine
- Height: ~90px (realistic cassette case height)
- Background: dominant color from the album's artwork
- Text: artist name, rotated 90° (reading bottom-to-top, as is convention)
- Font: 9px monospace, uppercase
- Slight 3D perspective tilt to match the shelf angle
- Stacked horizontally, touching, like real tapes on a shelf
- Subtle inner shadow for depth between adjacent spines
- Clicking a spine triggers the same `data-album` event as before

### Spine Colors (per album)
| Album ID | Artist | Spine Color | Reasoning |
|----------|--------|-------------|-----------|
| chicago-17 | Chicago | #1a5276 | Blue tones from Chicago 17 cover |
| papa-roach-paramour | Papa Roach | #8B0000 | Dark red from Paramour Sessions |
| silversun-pickups | Silversun Pickups | #2c1810 | Dark brown from Physical Thrills |
| linkin-park-hybrid-theory | Linkin Park | #4a6741 | Muted green from soldier figure |
| shinedown | Shinedown | #1a1a2e | Dark navy from Leave a Whisper |
| halestorm | Halestorm | #8B4513 | Brown tones from debut album |
| evanescence | Evanescence | #2d1f3d | Deep purple from Bitter Truth |
| godsmack | Godsmack | #b8860b | Gold from Lighting Up the Sky |
| fair-to-midland | Fair to Midland | #4a1a1a | Dark red from Fables cover |
| breaking-benjamin | Breaking Benjamin | #1a1a1a | Black from Phobia cover |

### Data Change
Add `spineColor` field to `AlbumTrack` interface in `src/data/album-tracks.ts`.

---

## 2. Object Sizing

### Problem
Desk objects are not proportional to each other or the desk scene. The monitor is the visual anchor — everything should scale relative to it.

### Size Changes
| Object | Current Size | New Size | CSS Property |
|--------|-------------|----------|--------------|
| Plant | 380px height | 230px | `.desk-plant img { height }` |
| Plant stand | 80px wide, 18px tall | 50px wide, 12px tall | `.desk-plant::before` |
| Yoo-hoo | 195px height | 90px | `.desk-yoohoo img { height }` |
| B-wing | 180px height | 120px | `.shelf-model img { height }` |
| B-wing shadow | 60px wide | 40px wide | `.shelf-model::after { width }` |
| Lamp shade | 360px wide | 240px wide | `.lamp-shade { width }` |

### Lamp Scaling
The lamp needs proportional scaling too — check all lamp sub-elements (shade, neck, base) and scale them ~65% of current.

### Computer Stack Width
The hardware stack (`.hw-stack`) is currently `80vw / max-width: 1100px`. Reduce to `max-width: 900px` to make the computer stack less wide and better proportioned.

---

## 3. Files Changed

| Action | File | Change |
|--------|------|--------|
| Modify | `src/data/album-tracks.ts` | Add `spineColor` to interface and each album entry |
| Modify | `src/layouts/BBS.astro` | Replace album cover `<img>` divs with cassette spine divs |
| Modify | `src/themes/bbs/theme.css` | New `.cassette-spine` styles, remove `.album-cover` img styles, resize objects |
