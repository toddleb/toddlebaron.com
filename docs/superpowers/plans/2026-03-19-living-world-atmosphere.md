# Living World Atmosphere + Quick Wins — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform toddlebaron.com from a static retro-OS portfolio into a living environment with ambient sounds, weather, time-of-day awareness, clickable albums, and seasonal effects.

**Architecture:** CSS-driven time-of-day system (JS sets `body[data-time]`, CSS does visuals). All audio via Web Audio API synthesis (no files except iTunes previews). Astro MPA = natural cleanup on navigation. Single `isMuted()` gate from `audio.ts` for all sound.

**Tech Stack:** Astro 6, TypeScript, Web Audio API, CSS animations, iTunes Search API (build-time only)

---

## File Structure

### New Files

| File | Responsibility |
|------|----------------|
| `src/engine/time-of-day.ts` | Time period detection + `body[data-time]` + change callbacks |
| `src/engine/ambient.ts` | Orchestrator: starts/stops all ambient systems per era |
| `src/engine/typing-sounds.ts` | Per-era keyboard click synthesis + UI interaction sounds |
| `src/engine/weather.ts` | Rain audio synthesis, thunder, lightning coordination |
| `src/engine/seasonal.ts` | Date-based seasonal overrides (v1: December snow only) |
| `src/data/album-tracks.ts` | Static data: album ID → { artist, track, artworkUrl, previewUrl } |
| `scripts/fetch-itunes-previews.ts` | Dev-time script to populate album-tracks.ts from iTunes API |
| `src/themes/bbs/AlbumPlayer.astro` | Now Playing overlay for album clicks |
| `src/themes/bbs/RainWindow.astro` | Partial window, lower-right corner of room |
| `src/themes/bbs/DeskLamp.astro` | Desk lamp + light cone + dust motes |
| `src/themes/bbs/WallClock.astro` | Analog clock on wall |
| `src/themes/sgi-irix/ClockWidget.astro` | Small analog clock window (wm ID: "clock") |
| `src/components/Snow.astro` | Seasonal snow particles (included conditionally) |

### Modified Files

| File | Changes |
|------|---------|
| `src/engine/audio.ts` | Export `getContext()`, add `audio:mute-changed` event to `toggleMute()` |
| `src/engine/modem-audio.ts` | Accept optional `AudioContext` in `playModemHandshake()` and `playTHXDeepNote()` |
| `src/engine/wm.ts` | Dispatch `wm:drag-start`, `wm:drag-end`, `wm:window-shaded`, `wm:window-unshaded` events |
| `src/themes/bbs/Boot.astro` | Create shared AudioContext on user gesture, pass to modem/THX |
| `src/themes/bbs/Terminal.astro` | Dispatch `bbs:content-rendered` and `bbs:page-change` events |
| `src/themes/bbs/Modem.astro` | Listen for `bbs:content-rendered` / `keydown` for TX/RX LED blinks |
| `src/themes/bbs/theme.css` | Wall color, night mode, window styles, album hover, idle overlay, reduced-motion |
| `src/layouts/BBS.astro` | Include new components, startAmbient, initTimeOfDay, idle timer, data-album attrs |
| `src/themes/sgi-irix/Screensaver.astro` | Refactor into mode system (classic, matrix, deep-space) |
| `src/themes/sgi-irix/Toolchest.astro` | Add Clock entry |
| `src/themes/sgi-irix/theme.css` | Time-of-day background shifts, reduced-motion |
| `src/themes/nextstep/NXDock.astro` | Animated hover icons (CSS-only) |
| `src/themes/nextstep/theme.css` | Night mode, dock pulse, idle overlay, reduced-motion |
| `src/layouts/Desktop.astro` | startAmbient('sgi'), initTimeOfDay() |
| `src/layouts/NXDesktop.astro` | startAmbient('nextstep'), initTimeOfDay() |

---

## Task 1: QW-1 — Fix THX Deep Note Audio

**Files:**
- Modify: `src/engine/modem-audio.ts:8-109` (playModemHandshake), `src/engine/modem-audio.ts:146-197` (playTHXDeepNote)
- Modify: `src/themes/bbs/Boot.astro:286-295` (startAudio function)

- [ ] **Step 1: Modify `playModemHandshake` to accept optional AudioContext**

In `src/engine/modem-audio.ts`, change the function signature and conditionally create/close the context:

```typescript
export async function playModemHandshake(externalCtx?: AudioContext): Promise<void> {
  const ctx = externalCtx || new AudioContext();
  // Resume if browser suspended due to autoplay policy
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return new Promise((resolve) => {
    const now = ctx.currentTime;
    // ... (existing body unchanged) ...

    // Done — total duration ~5.5 seconds
    const totalDuration = screechStart + 3.0 - now;
    setTimeout(() => {
      if (!externalCtx) ctx.close();
      resolve();
    }, totalDuration * 1000);
  });
}
```

- [ ] **Step 2: Modify `playTHXDeepNote` to accept optional AudioContext**

Same pattern:

```typescript
export async function playTHXDeepNote(externalCtx?: AudioContext): Promise<void> {
  const ctx = externalCtx || new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  // ... (existing body unchanged) ...

  return new Promise((resolve) => {
    setTimeout(() => {
      if (!externalCtx) ctx.close();
      resolve();
    }, dur * 1000 + 200);
  });
}
```

- [ ] **Step 3: Create shared AudioContext in Boot.astro**

In `src/themes/bbs/Boot.astro`, modify the `startAudio` function (around line 287) and the `runBootSequence` function to share a context:

For the initial boot (line 286-295), replace:
```typescript
let audioPlaying = false;
function startAudio() {
  if (audioPlaying) return;
  audioPlaying = true;
  playModemHandshake().catch(() => { audioPlaying = false; });
}
```
With:
```typescript
let audioPlaying = false;
let sharedBootCtx: AudioContext | null = null;
function startAudio() {
  if (audioPlaying) return;
  audioPlaying = true;
  sharedBootCtx = new AudioContext();
  playModemHandshake(sharedBootCtx).catch(() => { audioPlaying = false; });
}
```

Then where `playTHXDeepNote()` is called (line 346 and line 224), pass the shared context:
```typescript
playTHXDeepNote(sharedBootCtx || undefined).catch(() => {});
```

In `finishBoot` and `skipAll`, close the shared context:
```typescript
if (sharedBootCtx) { sharedBootCtx.close(); sharedBootCtx = null; }
```

Do the same for `runBootSequence()` — it creates its own local `sharedBootCtx`.

- [ ] **Step 4: Test the boot sequence**

Run: `npm run dev` and visit the BBS page. Verify:
1. Modem handshake audio plays on first visit
2. THX deep note plays during splash screen
3. Skipping boot (click) doesn't throw audio errors
4. Reboot (`!` key) replays both sounds

- [ ] **Step 5: Commit**

```bash
git add src/engine/modem-audio.ts src/themes/bbs/Boot.astro
git commit -m "fix(bbs): share AudioContext between modem handshake and THX deep note"
```

---

## Task 2: QW-2 — Wall Color to Parchment

**Files:**
- Modify: `src/themes/bbs/theme.css:68` (.wall gradient), `src/themes/bbs/theme.css:172-191` (.desk sponge paint)

- [ ] **Step 1: Change upper wall gradient**

In `src/themes/bbs/theme.css`, line 68, replace:
```css
background: linear-gradient(180deg, #3a2040 0%, #452850 40%, #4d2e58 100%);
```
With:
```css
background: linear-gradient(180deg, #3a3528 0%, #454038 40%, #4d4840 100%);
```

- [ ] **Step 2: Change desk sponge-paint colors**

In `src/themes/bbs/theme.css`, line 172, replace:
```css
background-color: #9a85b0;
```
With:
```css
background-color: #d4c8a8;
```

Then replace all the sponge radial gradients (lines 175-190). Replace the purple tones with warm parchment tones:
```css
background-image:
  /* 80s sponge-painted wall — warm parchment tones */
  radial-gradient(ellipse 40px 35px at 15% 20%, rgba(190,175,145,0.5) 0%, transparent 70%),
  radial-gradient(ellipse 55px 40px at 75% 15%, rgba(200,185,155,0.4) 0%, transparent 70%),
  radial-gradient(ellipse 35px 50px at 45% 60%, rgba(175,160,130,0.45) 0%, transparent 70%),
  radial-gradient(ellipse 60px 35px at 85% 70%, rgba(195,180,150,0.4) 0%, transparent 70%),
  radial-gradient(ellipse 45px 55px at 25% 80%, rgba(205,190,160,0.35) 0%, transparent 70%),
  radial-gradient(ellipse 50px 30px at 55% 30%, rgba(170,155,125,0.5) 0%, transparent 70%),
  radial-gradient(ellipse 30px 45px at 10% 50%, rgba(210,195,165,0.3) 0%, transparent 70%),
  radial-gradient(ellipse 55px 45px at 65% 85%, rgba(180,165,135,0.45) 0%, transparent 70%),
  radial-gradient(ellipse 40px 35px at 90% 40%, rgba(200,185,155,0.35) 0%, transparent 70%),
  radial-gradient(ellipse 50px 40px at 35% 10%, rgba(190,175,145,0.4) 0%, transparent 70%),
  /* Second sponge layer — deeper tan */
  radial-gradient(ellipse 45px 50px at 20% 45%, rgba(150,135,105,0.3) 0%, transparent 65%),
  radial-gradient(ellipse 50px 35px at 60% 55%, rgba(155,140,110,0.35) 0%, transparent 65%),
  radial-gradient(ellipse 35px 45px at 80% 25%, rgba(145,130,100,0.3) 0%, transparent 65%),
  radial-gradient(ellipse 55px 40px at 40% 75%, rgba(160,145,115,0.25) 0%, transparent 65%),
  radial-gradient(ellipse 40px 50px at 5% 90%, rgba(150,135,105,0.3) 0%, transparent 65%);
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev` and visit the BBS page. Confirm the wall and desk area now have warm parchment/eggshell tones instead of purple.

- [ ] **Step 4: Commit**

```bash
git add src/themes/bbs/theme.css
git commit -m "style(bbs): change wall color from violet to warm parchment"
```

---

## Task 3: QW-3a — Album Data and iTunes Fetch Script

**Files:**
- Create: `src/data/album-tracks.ts`
- Create: `scripts/fetch-itunes-previews.ts`

- [ ] **Step 1: Create the static album data file with placeholder URLs**

```typescript
// src/data/album-tracks.ts
// Static album data — preview URLs populated by scripts/fetch-itunes-previews.ts

export interface AlbumTrack {
  artist: string;
  track: string;
  album: string;
  artworkUrl: string;
  previewUrl: string;
}

export const albumTracks: Record<string, AlbumTrack> = {
  "chicago-17": {
    artist: "Chicago",
    track: "Stay the Night",
    album: "Chicago 17",
    artworkUrl: "",
    previewUrl: "",
  },
  "papa-roach-paramour": {
    artist: "Papa Roach",
    track: "Forever",
    album: "The Paramour Sessions",
    artworkUrl: "",
    previewUrl: "",
  },
  "linkin-park-hybrid-theory": {
    artist: "Linkin Park",
    track: "In the End",
    album: "Hybrid Theory",
    artworkUrl: "",
    previewUrl: "",
  },
  "shinedown": {
    artist: "Shinedown",
    track: "Simple Man",
    album: "The Sound of Madness",
    artworkUrl: "",
    previewUrl: "",
  },
  "halestorm": {
    artist: "Halestorm",
    track: "It's Not You",
    album: "Halestorm",
    artworkUrl: "",
    previewUrl: "",
  },
  "silversun-pickups": {
    artist: "Silversun Pickups",
    track: "Panic Switch",
    album: "Swoon",
    artworkUrl: "",
    previewUrl: "",
  },
  "evanescence": {
    artist: "Evanescence",
    track: "Better Without You",
    album: "The Bitter Truth",
    artworkUrl: "",
    previewUrl: "",
  },
  "godsmack": {
    artist: "Godsmack",
    track: "Lighting Up the Sky",
    album: "Lighting Up the Sky",
    artworkUrl: "",
    previewUrl: "",
  },
  "fair-to-midland": {
    artist: "Fair to Midland",
    track: "Dance of the Manatee",
    album: "Fables from a Mayfly: The Diary of Poe",
    artworkUrl: "",
    previewUrl: "",
  },
  "breaking-benjamin": {
    artist: "Breaking Benjamin",
    track: "The Diary of Jane",
    album: "Phobia",
    artworkUrl: "",
    previewUrl: "",
  },
};
```

- [ ] **Step 2: Create the iTunes fetch script** (create `scripts/` directory first: `mkdir -p scripts`)

```typescript
// scripts/fetch-itunes-previews.ts
// Run: npx tsx scripts/fetch-itunes-previews.ts
// Queries iTunes Search API and updates src/data/album-tracks.ts with preview URLs

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface iTunesResult {
  trackName: string;
  artistName: string;
  previewUrl: string;
  artworkUrl100: string;
}

interface iTunesResponse {
  resultCount: number;
  results: iTunesResult[];
}

const searches = [
  { id: "chicago-17", query: "Chicago Stay the Night", artist: "Chicago" },
  { id: "papa-roach-paramour", query: "Papa Roach Forever", artist: "Papa Roach" },
  { id: "linkin-park-hybrid-theory", query: "Linkin Park In the End", artist: "Linkin Park" },
  { id: "shinedown", query: "Shinedown Simple Man", artist: "Shinedown" },
  { id: "halestorm", query: "Halestorm It's Not You", artist: "Halestorm" },
  { id: "silversun-pickups", query: "Silversun Pickups Panic Switch", artist: "Silversun Pickups" },
  { id: "evanescence", query: "Evanescence Better Without You", artist: "Evanescence" },
  { id: "godsmack", query: "Godsmack Lighting Up the Sky", artist: "Godsmack" },
  { id: "fair-to-midland", query: "Fair to Midland Dance of the Manatee", artist: "Fair to Midland" },
  { id: "breaking-benjamin", query: "Breaking Benjamin Diary of Jane", artist: "Breaking Benjamin" },
];

async function fetchPreview(query: string, artist: string): Promise<{ previewUrl: string; artworkUrl: string } | null> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`;
  const res = await fetch(url);
  const data: iTunesResponse = await res.json();

  // Find best match by artist name
  const match = data.results.find((r) =>
    r.artistName.toLowerCase().includes(artist.toLowerCase()) && r.previewUrl
  );

  if (match) {
    return { previewUrl: match.previewUrl, artworkUrl: match.artworkUrl100 };
  }
  return null;
}

async function main() {
  const dataPath = join(import.meta.dirname || __dirname, "../src/data/album-tracks.ts");
  let content = readFileSync(dataPath, "utf-8");

  for (const search of searches) {
    console.log(`Fetching: ${search.query}...`);
    const result = await fetchPreview(search.query, search.artist);

    if (result) {
      // Replace the empty artworkUrl and previewUrl for this album
      // Use regex to find the block for this album ID and update URLs
      const blockRegex = new RegExp(
        `("${search.id}":\\s*\\{[^}]*artworkUrl:\\s*)"[^"]*"([^}]*previewUrl:\\s*)"[^"]*"`,
        "s"
      );
      content = content.replace(blockRegex, `$1"${result.artworkUrl}"$2"${result.previewUrl}"`);
      console.log(`  ✓ Found: ${result.previewUrl.substring(0, 60)}...`);
    } else {
      console.log(`  ✗ No match found`);
    }

    // Rate limit: 200ms between requests
    await new Promise((r) => setTimeout(r, 200));
  }

  writeFileSync(dataPath, content);
  console.log("\nDone! Updated src/data/album-tracks.ts");
}

main().catch(console.error);
```

- [ ] **Step 3: Run the fetch script**

Run: `npx tsx scripts/fetch-itunes-previews.ts`

Verify that `src/data/album-tracks.ts` now has populated `previewUrl` and `artworkUrl` fields. If any are still empty, manually search iTunes and hardcode them.

- [ ] **Step 4: Commit**

```bash
git add src/data/album-tracks.ts scripts/fetch-itunes-previews.ts
git commit -m "feat(bbs): add album track data and iTunes preview fetch script"
```

---

## Task 4: QW-3b — Album Player Component and Integration

**Files:**
- Create: `src/themes/bbs/AlbumPlayer.astro`
- Modify: `src/layouts/BBS.astro:27-36` (add data-album attributes)
- Modify: `src/themes/bbs/theme.css` (add album hover + player styles)

- [ ] **Step 1: Add `data-album` attributes to BBS.astro shelf elements**

In `src/layouts/BBS.astro`, add `data-album` to each `.album-cover` div (lines 27-36). The order matches the spec's album table:

```html
<div class="album-cover" data-album="chicago-17"><img src="/albums/chicago.jpg" alt="Chicago 17" /></div>
<div class="album-cover" data-album="papa-roach-paramour"><img src="/albums/papa-roach.jpg" alt="Papa Roach - The Paramour Sessions" /></div>
<div class="album-cover" data-album="silversun-pickups"><img src="/albums/silversun-pickups.jpeg" alt="Silversun Pickups - Physical Thrills" /></div>
<div class="album-cover" data-album="linkin-park-hybrid-theory"><img src="/albums/linkin-park.jpg" alt="Linkin Park - Hybrid Theory" /></div>
<div class="album-cover" data-album="shinedown"><img src="/albums/shinedown.jpg" alt="Shinedown - The Sound of Madness" /></div>
<div class="album-cover" data-album="halestorm"><img src="/albums/halestorm.png" alt="Halestorm" /></div>
<div class="album-cover" data-album="evanescence"><img src="/albums/evanescence.png" alt="Evanescence - The Bitter Truth" /></div>
<div class="album-cover" data-album="godsmack"><img src="/albums/godsmack.png" alt="Godsmack - Lighting Up the Sky" /></div>
<div class="album-cover" data-album="fair-to-midland"><img src="/albums/fair-to-midland.jpg" alt="Fair to Midland - Fables from a Mayfly" /></div>
<div class="album-cover" data-album="breaking-benjamin"><img src="/albums/breaking-benjamin.jpg" alt="Breaking Benjamin - Phobia" /></div>
```

- [ ] **Step 2: Create AlbumPlayer.astro**

```astro
---
// src/themes/bbs/AlbumPlayer.astro — Now Playing overlay
---

<div id="album-player" class="album-player" style="display:none">
  <img id="album-player-art" class="album-player-art" src="" alt="" />
  <div class="album-player-info">
    <div id="album-player-track" class="album-player-track"></div>
    <div id="album-player-artist" class="album-player-artist"></div>
  </div>
  <button id="album-player-toggle" class="album-player-toggle">▶</button>
  <div class="album-player-progress">
    <div id="album-player-bar" class="album-player-bar"></div>
  </div>
</div>

<script>
  import { albumTracks } from "../../data/album-tracks";
  import { isMuted } from "../../engine/audio";

  const playerEl = document.getElementById("album-player")!;
  const artEl = document.getElementById("album-player-art") as HTMLImageElement;
  const trackEl = document.getElementById("album-player-track")!;
  const artistEl = document.getElementById("album-player-artist")!;
  const toggleBtn = document.getElementById("album-player-toggle")!;
  const barEl = document.getElementById("album-player-bar")!;

  let currentAudio: HTMLAudioElement | null = null;
  let currentAlbumId: string | null = null;
  let crossfadeInterval: ReturnType<typeof setInterval> | null = null;

  function showPlayer(albumId: string): void {
    const data = albumTracks[albumId];
    if (!data) return;

    artEl.src = data.artworkUrl || "";
    artEl.alt = data.album;
    trackEl.textContent = data.track;
    artistEl.textContent = `${data.artist} — ${data.album}`;
    playerEl.style.display = "flex";
  }

  function playTrack(albumId: string): void {
    const data = albumTracks[albumId];
    if (!data || !data.previewUrl) {
      showPlayer(albumId);
      return;
    }

    if (currentAlbumId === albumId && currentAudio) {
      // Toggle pause/play
      if (currentAudio.paused) {
        if (!isMuted()) currentAudio.play();
        toggleBtn.textContent = "⏸";
      } else {
        currentAudio.pause();
        toggleBtn.textContent = "▶";
      }
      return;
    }

    // Crossfade: fade out old, fade in new
    const oldAudio = currentAudio;
    if (oldAudio && crossfadeInterval) clearInterval(crossfadeInterval);

    if (oldAudio) {
      const fadeOut = setInterval(() => {
        if (oldAudio.volume > 0.05) {
          oldAudio.volume = Math.max(0, oldAudio.volume - 0.05);
        } else {
          clearInterval(fadeOut);
          oldAudio.pause();
          oldAudio.src = "";
        }
      }, 50);
    }

    const newAudio = new Audio(data.previewUrl);
    newAudio.volume = 0;
    currentAudio = newAudio;
    currentAlbumId = albumId;

    showPlayer(albumId);

    if (!isMuted()) {
      newAudio.play().catch(() => {});
      // Fade in
      crossfadeInterval = setInterval(() => {
        if (newAudio.volume < 0.95) {
          newAudio.volume = Math.min(1, newAudio.volume + 0.05);
        } else {
          newAudio.volume = 1;
          if (crossfadeInterval) clearInterval(crossfadeInterval);
          crossfadeInterval = null;
        }
      }, 50);
    }

    toggleBtn.textContent = "⏸";

    // Progress bar
    newAudio.addEventListener("timeupdate", () => {
      if (newAudio.duration) {
        barEl.style.width = `${(newAudio.currentTime / newAudio.duration) * 100}%`;
      }
    });

    newAudio.addEventListener("ended", () => {
      toggleBtn.textContent = "▶";
      barEl.style.width = "0%";
    });
  }

  // Listen for album clicks
  document.querySelectorAll<HTMLElement>("[data-album]").forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      const albumId = el.dataset.album;
      if (albumId) playTrack(albumId);
    });
  });

  // Toggle button
  toggleBtn.addEventListener("click", () => {
    if (currentAudio) {
      if (currentAudio.paused) {
        if (!isMuted()) currentAudio.play();
        toggleBtn.textContent = "⏸";
      } else {
        currentAudio.pause();
        toggleBtn.textContent = "▶";
      }
    }
  });

  // Respect mute
  document.addEventListener("audio:mute-changed", () => {
    if (currentAudio && !currentAudio.paused && isMuted()) {
      currentAudio.pause();
      toggleBtn.textContent = "▶";
    }
  });
</script>
```

- [ ] **Step 3: Add AlbumPlayer styles to theme.css**

Append to `src/themes/bbs/theme.css`:

```css
/* ─── Album Player (Now Playing overlay) ─── */
.album-player {
  position: absolute;
  bottom: 28px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(10, 0, 8, 0.92);
  border: 1px solid var(--tf-purple-deep);
  border-radius: 4px;
  z-index: 50;
  font-family: var(--bbs-font);
}

.album-player-art {
  width: 36px;
  height: 36px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}

.album-player-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.album-player-track {
  font-size: 12px;
  color: var(--tf-orange-bright);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-player-artist {
  font-size: 10px;
  color: var(--ansi-bright-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-player-toggle {
  background: none;
  border: 1px solid var(--tf-purple);
  color: var(--tf-purple-bright);
  font-size: 14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-player-toggle:hover {
  background: rgba(123, 47, 190, 0.2);
}

.album-player-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(123, 47, 190, 0.2);
}

.album-player-bar {
  height: 100%;
  width: 0%;
  background: var(--tf-orange);
  transition: width 0.2s linear;
}

.album-cover[data-album] {
  cursor: pointer;
}
```

- [ ] **Step 4: Include AlbumPlayer in BBS.astro**

In `src/layouts/BBS.astro`, add the import and include the component inside `.hw-screen-content`:

At the top (imports):
```astro
import AlbumPlayer from "../themes/bbs/AlbumPlayer.astro";
```

Inside `.hw-screen-content` (after `<slot />`):
```html
<AlbumPlayer />
```

- [ ] **Step 5: Test album playback**

Run: `npm run dev`. Click an album on the shelf. Verify:
1. Now Playing overlay appears at bottom of monitor
2. Audio plays (if preview URL is valid)
3. Clicking a different album crossfades
4. Clicking same album toggles pause/play
5. Progress bar updates

- [ ] **Step 6: Commit**

```bash
git add src/themes/bbs/AlbumPlayer.astro src/layouts/BBS.astro src/themes/bbs/theme.css
git commit -m "feat(bbs): clickable album shelf with Now Playing overlay and iTunes previews"
```

---

## Task 5: Core Infrastructure — audio.ts Changes

**Files:**
- Modify: `src/engine/audio.ts`

- [ ] **Step 1: Export `getContext()` and add `audio:mute-changed` event**

In `src/engine/audio.ts`, change `getContext` from private to exported, and add event dispatch to `toggleMute`:

```typescript
export function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}
```

Update `toggleMute`:
```typescript
export function toggleMute(): boolean {
  muted = !muted;
  document.dispatchEvent(new CustomEvent("audio:mute-changed", { detail: { muted } }));
  return muted;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/engine/audio.ts
git commit -m "feat(audio): export getContext and dispatch audio:mute-changed event"
```

---

## Task 6: Core Infrastructure — Time-of-Day Engine

**Files:**
- Create: `src/engine/time-of-day.ts`

- [ ] **Step 1: Create the time-of-day module**

```typescript
// src/engine/time-of-day.ts

export type TimePeriod = "dawn" | "morning" | "afternoon" | "evening" | "night";

export function getTimePeriodAt(date: Date): TimePeriod {
  const h = date.getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

export function getTimePeriod(): TimePeriod {
  return getTimePeriodAt(new Date());
}

export function onPeriodChange(callback: (period: TimePeriod) => void): () => void {
  let current = getTimePeriod();
  const interval = setInterval(() => {
    const next = getTimePeriod();
    if (next !== current) {
      current = next;
      callback(next);
    }
  }, 60_000);
  return () => clearInterval(interval);
}

export function initTimeOfDay(): void {
  const period = getTimePeriod();
  document.body.dataset.time = period;
  onPeriodChange((p) => {
    document.body.dataset.time = p;
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/engine/time-of-day.ts
git commit -m "feat(engine): add time-of-day engine with period detection and body[data-time]"
```

---

## Task 7: Core Infrastructure — Ambient Orchestrator

**Files:**
- Create: `src/engine/ambient.ts`

- [ ] **Step 1: Create the ambient orchestrator**

```typescript
// src/engine/ambient.ts
import { getContext, isMuted } from "./audio";

type Era = "bbs" | "sgi" | "nextstep";

let activeNodes: AudioNode[] = [];
let activeGains: GainNode[] = [];
let targetGains: number[] = []; // stores original target gain per node for mute/unmute

function createHum(freq: number, gain: number): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(isMuted() ? 0 : gain, ctx.currentTime + 2);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  activeNodes.push(osc);
  activeGains.push(g);
  targetGains.push(gain);
}

function createFilteredNoise(centerFreq: number, q: number, gain: number): void {
  const ctx = getContext();
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = centerFreq;
  bp.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(isMuted() ? 0 : gain, ctx.currentTime + 2);
  source.connect(bp).connect(g).connect(ctx.destination);
  source.start();
  activeNodes.push(source);
  activeGains.push(g);
  targetGains.push(gain);
}

export function startAmbient(era: Era): void {
  try {
    switch (era) {
      case "bbs":
        // CRT hum: 60Hz + 120Hz harmonic
        createHum(60, 0.02);
        createHum(120, 0.01);
        break;
      case "sgi":
        // Workstation fan: filtered white noise
        createFilteredNoise(400, 2, 0.015);
        break;
      case "nextstep":
        // Lab equipment: filtered white noise
        createFilteredNoise(600, 3, 0.008);
        break;
    }
  } catch {
    // Audio is non-critical
  }

  // Mute integration for continuous sounds
  document.addEventListener("audio:mute-changed", () => {
    for (let i = 0; i < activeGains.length; i++) {
      try {
        const ctx = getContext();
        const g = activeGains[i];
        const target = isMuted() ? 0 : targetGains[i];
        g.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.3);
      } catch {
        // Audio node may have been garbage collected
      }
    }
  });
}

export function stopAmbient(): void {
  for (const node of activeNodes) {
    try {
      if (node instanceof OscillatorNode) node.stop();
      if (node instanceof AudioBufferSourceNode) node.stop();
      node.disconnect();
    } catch {
      // Already stopped
    }
  }
  activeNodes = [];
  activeGains = [];
  targetGains = [];
}

// Safety net for page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", stopAmbient);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/engine/ambient.ts
git commit -m "feat(engine): add ambient orchestrator for per-era background sounds"
```

---

## Task 8: Core Infrastructure — wm.ts Event Dispatch

**Files:**
- Modify: `src/engine/wm.ts:121-149` (startDrag/onDragEnd)

- [ ] **Step 1: Add drag events to wm.ts**

In `src/engine/wm.ts`, at the end of `startDrag` (after line 133), add:
```typescript
document.dispatchEvent(new CustomEvent("wm:drag-start", { detail: { id } }));
```

In `onDragEnd` (line 145), before the cleanup:
```typescript
if (dragState) {
  document.dispatchEvent(new CustomEvent("wm:drag-end", { detail: { id: dragState.windowId } }));
}
```

- [ ] **Step 2: Add shade/unshade events**

NXDesktop.astro handles shade via `windowEl.classList.toggle("shaded")` (line 137). The wm.ts doesn't have shade functions, but we need the events. Add a `shadeWindow` export to `wm.ts`:

```typescript
export function shadeWindow(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  win.shaded = !win.shaded;
  const el = getWindowEl(id);
  if (el) el.classList.toggle("shaded", win.shaded);
  const eventName = win.shaded ? "wm:window-shaded" : "wm:window-unshaded";
  document.dispatchEvent(new CustomEvent(eventName, { detail: { id } }));
}
```

Then update NXDesktop.astro's dblclick handler (line 130-140) to call `shadeWindow(id)` instead of directly toggling the class.

- [ ] **Step 3: Commit**

```bash
git add src/engine/wm.ts src/layouts/NXDesktop.astro
git commit -m "feat(wm): dispatch drag-start, drag-end, window-shaded, window-unshaded events"
```

---

## Task 9: Core Infrastructure — Terminal Event Dispatch

**Files:**
- Modify: `src/themes/bbs/Terminal.astro:98-107` (showScreen function)

- [ ] **Step 1: Add `bbs:page-change` and `bbs:content-rendered` events**

In `src/themes/bbs/Terminal.astro`, in the `showScreen` function (line 98), after `target.classList.add("bbs-active")`:

```typescript
document.dispatchEvent(new CustomEvent("bbs:page-change", { detail: { screen: id } }));
document.dispatchEvent(new CustomEvent("bbs:content-rendered"));
```

- [ ] **Step 2: Commit**

```bash
git add src/themes/bbs/Terminal.astro
git commit -m "feat(bbs): dispatch bbs:page-change and bbs:content-rendered events from Terminal"
```

---

## Task 10: Sensory Layer — Typing Sounds and UI Sounds

**Files:**
- Create: `src/engine/typing-sounds.ts`

- [ ] **Step 1: Create the typing sounds module**

```typescript
// src/engine/typing-sounds.ts
import { getContext, isMuted } from "./audio";

type Era = "bbs" | "sgi" | "nextstep";

function playClick(freq: number, duration: number, volume: number): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = freq * (0.85 + Math.random() * 0.3); // ±15% pitch
    const g = ctx.createGain();
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(g).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000 + 0.01);
  } catch {
    // Audio non-critical
  }
}

export function playNoiseBurst(centerFreq: number, duration: number, volume: number): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const bufSize = Math.ceil(ctx.sampleRate * (duration / 1000 + 0.01));
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = centerFreq;
    bp.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    source.connect(bp).connect(g).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + duration / 1000 + 0.01);
  } catch {
    // Audio non-critical
  }
}

const profiles: Record<Era, () => void> = {
  bbs: () => {
    // IBM Model M — two-phase: click + thock
    playClick(4000, 2, 0.08);
    setTimeout(() => playClick(2500, 1.5, 0.04), 30 + Math.random() * 5);
  },
  sgi: () => {
    // SGI Granite — soft membrane thump
    playClick(1500, 1.5, 0.04);
  },
  nextstep: () => {
    // Cherry MX — crisp click
    playClick(3500, 1.5, 0.06);
  },
};

export function initTypingSounds(era: Era): void {
  // For BBS, this should only be called after boot:complete (caller's responsibility)
  // This ensures typing sounds don't fire during boot sequence
  const handler = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      // Only for SGI/NX input elements
      if (era !== "bbs") profiles[era]();
      return;
    }
    // BBS: document-level, printable keys only (only fires when BBS main content visible)
    if (era === "bbs" && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      profiles[era]();
    }
  };
  document.addEventListener("keydown", handler);
}

// ─── UI Interaction Sounds ───

export function playMenuBeep(): void {
  playClick(1000, 15, 0.06);
}

export function playHDDChatter(): void {
  if (isMuted()) return;
  // Rapid noise bursts simulating HDD seek
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playNoiseBurst(3000, 10, 0.03), i * 40);
  }
}

export function playSoftClick(): void {
  playClick(800, 3, 0.04);
}

export function playThud(): void {
  playClick(200, 8, 0.05);
}

export function playShelfClick(): void {
  playClick(1200, 2, 0.05);
}

export function playSwoosh(rising: boolean): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const bufSize = Math.ceil(ctx.sampleRate * 0.1);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(rising ? 400 : 2000, ctx.currentTime);
    bp.frequency.linearRampToValueAtTime(rising ? 2000 : 400, ctx.currentTime + 0.08);
    bp.Q.value = 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    source.connect(bp).connect(g).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.1);
  } catch {
    // Audio non-critical
  }
}

export function playSpringBounce(): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Audio non-critical
  }
}
```

- [ ] **Step 2: Wire up UI sound event listeners in each era's layout**

This wiring happens in later tasks when we integrate into each layout. For now, the module is ready.

- [ ] **Step 3: Commit**

```bash
git add src/engine/typing-sounds.ts
git commit -m "feat(engine): add typing sounds and UI interaction sound synthesis"
```

---

## Task 11: BBS Environmental — Rain Window

**Files:**
- Create: `src/themes/bbs/RainWindow.astro`
- Create: `src/engine/weather.ts`
- Modify: `src/themes/bbs/theme.css` (rain + window styles)

- [ ] **Step 1: Create weather.ts**

```typescript
// src/engine/weather.ts
import { getContext, isMuted } from "./audio";

let rainSource: AudioBufferSourceNode | null = null;
let rainGain: GainNode | null = null;
let dripTimeout: ReturnType<typeof setTimeout> | null = null;

export function startRain(intensity: "heavy" | "drizzle"): void {
  if (rainSource) return; // already running
  try {
    const ctx = getContext();
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    rainSource = ctx.createBufferSource();
    rainSource.buffer = buf;
    rainSource.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3000;
    bp.Q.value = 1;
    rainGain = ctx.createGain();
    const vol = intensity === "heavy" ? 0.015 : 0.008;
    rainGain.gain.value = isMuted() ? 0 : vol;
    rainSource.connect(bp).connect(rainGain).connect(ctx.destination);
    rainSource.start();
    scheduleDrip();
  } catch {
    // Audio non-critical
  }

  document.addEventListener("audio:mute-changed", handleMuteChange);
}

function handleMuteChange(): void {
  if (rainGain) {
    rainGain.gain.value = isMuted() ? 0 : 0.015;
  }
}

function scheduleDrip(): void {
  const delay = 2000 + Math.random() * 6000;
  dripTimeout = setTimeout(() => {
    if (!isMuted()) {
      try {
        const ctx = getContext();
        const bufSize = Math.ceil(ctx.sampleRate * 0.01);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 5000 + Math.random() * 3000;
        bp.Q.value = 3;
        const g = ctx.createGain();
        g.gain.value = 0.02;
        src.connect(bp).connect(g).connect(ctx.destination);
        src.start();
        src.stop(ctx.currentTime + 0.01);
      } catch { /* non-critical */ }
    }
    scheduleDrip();
  }, delay);
}

export function stopRain(): void {
  if (rainSource) {
    try { rainSource.stop(); rainSource.disconnect(); } catch {}
    rainSource = null;
  }
  if (rainGain) {
    try { rainGain.disconnect(); } catch {}
    rainGain = null;
  }
  if (dripTimeout) {
    clearTimeout(dripTimeout);
    dripTimeout = null;
  }
  document.removeEventListener("audio:mute-changed", handleMuteChange);
}

export function playThunder(): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 100;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch { /* non-critical */ }
}
```

- [ ] **Step 2: Create RainWindow.astro**

```astro
---
// src/themes/bbs/RainWindow.astro — Partial window, lower-right corner
const streaks = Array.from({ length: 18 }, (_, i) => ({
  left: 5 + Math.random() * 90,
  duration: 1.5 + Math.random() * 1.5,
  delay: Math.random() * 3,
  opacity: 0.3 + Math.random() * 0.4,
  width: 1 + Math.random(),
}));
---

<div class="rain-window" id="rain-window">
  <div class="rain-window-frame">
    <div class="rain-window-glass">
      <div class="rain-window-outside"></div>
      <div class="rain-streaks">
        {streaks.map((s) => (
          <div
            class="rain-streak"
            style={`left:${s.left}%;animation-duration:${s.duration}s;animation-delay:${s.delay}s;opacity:${s.opacity};width:${s.width}px`}
          />
        ))}
      </div>
      <div class="rain-window-reflection"></div>
    </div>
    <div class="rain-window-sill"></div>
  </div>
</div>

<script>
  import { getTimePeriod } from "../../engine/time-of-day";
  import { startRain, stopRain, playThunder } from "../../engine/weather";

  function updateWeather(): void {
    const period = getTimePeriod();
    const windowEl = document.getElementById("rain-window");
    if (!windowEl) return;

    // Daily rain seed for afternoon
    const daySeed = Math.floor(Date.now() / 86400000);
    const afternoonRain = (daySeed % 3) === 0; // ~33% chance

    const shouldRain = period === "night" || period === "evening" || period === "dawn" ||
      (period === "afternoon" && afternoonRain);

    if (shouldRain) {
      windowEl.classList.add("rain-active");
      windowEl.classList.remove("rain-clear");
      const intensity = period === "night" ? "heavy" : "drizzle";
      startRain(intensity);

      // Lightning at night
      if (period === "night") {
        scheduleFlash();
      }
    } else {
      windowEl.classList.remove("rain-active");
      windowEl.classList.add("rain-clear");
      stopRain();
    }
  }

  let flashTimeout: ReturnType<typeof setTimeout> | null = null;
  function scheduleFlash(): void {
    const delay = 30000 + Math.random() * 60000;
    flashTimeout = setTimeout(() => {
      const windowEl = document.getElementById("rain-window");
      if (windowEl?.classList.contains("rain-active")) {
        windowEl.classList.add("lightning-flash");
        setTimeout(() => windowEl?.classList.remove("lightning-flash"), 200);
        // Thunder 1-3s after flash
        setTimeout(() => playThunder(), 1000 + Math.random() * 2000);
        scheduleFlash();
      }
    }, delay);
  }

  document.addEventListener("boot:complete", updateWeather);
</script>
```

- [ ] **Step 3: Add rain window CSS to theme.css**

Append to `src/themes/bbs/theme.css`:

```css
/* ─── Rain Window ─── */
.rain-window {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 120px;
  height: 160px;
  z-index: 2;
  pointer-events: none;
}

.rain-window-frame {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3a2a1a, #2e2010);
  border: 2px solid #4a3a2a;
  border-radius: 2px 0 0 0;
  padding: 4px;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
}

.rain-window-glass {
  width: 100%;
  height: calc(100% - 8px);
  position: relative;
  overflow: hidden;
  border-radius: 1px;
}

.rain-window-outside {
  position: absolute;
  inset: 0;
  transition: background 2s ease;
}

body[data-time="night"] .rain-window-outside {
  background: linear-gradient(180deg, #0a0a1a, #0d0d2a);
}

body[data-time="dawn"] .rain-window-outside,
body[data-time="evening"] .rain-window-outside {
  background: linear-gradient(180deg, #4a2040, #8a4020, #d4a040);
}

body[data-time="morning"] .rain-window-outside,
body[data-time="afternoon"] .rain-window-outside {
  background: linear-gradient(180deg, #6a8aa0, #8ab0c8, #c0d8e8);
}

.rain-window-reflection {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%);
  pointer-events: none;
}

.rain-window-sill {
  height: 8px;
  background: linear-gradient(180deg, #4a3a2a, #3a2a1a);
  border-top: 1px solid #5a4a3a;
}

/* Rain streaks */
.rain-streaks {
  position: absolute;
  inset: 0;
}

.rain-streak {
  position: absolute;
  top: -20px;
  height: 20px;
  background: linear-gradient(180deg, transparent, rgba(180,200,220,0.6));
  border-radius: 0 0 1px 1px;
}

.rain-clear .rain-streaks { display: none; }

.lightning-flash .rain-window-glass {
  background: rgba(255,255,255,0.3);
}

@media (prefers-reduced-motion: no-preference) {
  .rain-active .rain-streak {
    animation: rain-fall linear infinite;
  }
}

@keyframes rain-fall {
  0% { transform: translateY(-20px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(180px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .rain-streak {
    animation: none !important;
    top: 30%;
    height: 30px;
    opacity: 0.3;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/engine/weather.ts src/themes/bbs/RainWindow.astro src/themes/bbs/theme.css
git commit -m "feat(bbs): add rain window with weather audio and lightning effects"
```

---

## Task 12: BBS Environmental — Desk Lamp and Wall Clock

**Files:**
- Create: `src/themes/bbs/DeskLamp.astro`
- Create: `src/themes/bbs/WallClock.astro`
- Modify: `src/themes/bbs/theme.css` (lamp + clock + night mode styles)

- [ ] **Step 1: Create DeskLamp.astro**

```astro
---
// src/themes/bbs/DeskLamp.astro — Desk lamp with light cone and dust motes
const motes = Array.from({ length: 12 }, (_, i) => ({
  x: 20 + Math.random() * 60,
  size: 2 + Math.random() * 2,
  duration: 8 + Math.random() * 7,
  delay: Math.random() * 10,
  opacity: 0.3 + Math.random() * 0.3,
}));
---

<div class="desk-lamp">
  <div class="lamp-shade"></div>
  <div class="lamp-stem"></div>
  <div class="lamp-base"></div>
  <div class="lamp-light-cone">
    <div class="lamp-dust-motes">
      {motes.map((m) => (
        <div
          class="dust-mote"
          style={`left:${m.x}%;width:${m.size}px;height:${m.size}px;animation-duration:${m.duration}s;animation-delay:${m.delay}s;opacity:${m.opacity}`}
        />
      ))}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create WallClock.astro**

```astro
---
// src/themes/bbs/WallClock.astro — Analog clock showing real visitor time
---

<div class="wall-clock" id="wall-clock">
  <div class="clock-face">
    <div class="clock-mark clock-mark-12"></div>
    <div class="clock-mark clock-mark-3"></div>
    <div class="clock-mark clock-mark-6"></div>
    <div class="clock-mark clock-mark-9"></div>
    <div class="clock-hand clock-hand-hour" id="clock-hour"></div>
    <div class="clock-hand clock-hand-minute" id="clock-minute"></div>
    <div class="clock-hand clock-hand-second" id="clock-second"></div>
    <div class="clock-center"></div>
  </div>
</div>

<script>
  function updateClock(): void {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const hourDeg = h * 30 + m * 0.5;
    const minDeg = m * 6;
    const hourEl = document.getElementById("clock-hour");
    const minEl = document.getElementById("clock-minute");
    if (hourEl) hourEl.style.transform = `rotate(${hourDeg}deg)`;
    if (minEl) minEl.style.transform = `rotate(${minDeg}deg)`;

    // Set initial rotation for CSS-animated second hand
    const secEl = document.getElementById("clock-second");
    if (secEl) {
      const s = now.getSeconds();
      secEl.style.transform = `rotate(${s * 6}deg)`;
    }
  }
  updateClock();
  // Only update hour/minute hands every 60s (second hand animated via CSS)
  setInterval(updateClock, 60_000);
</script>
```

- [ ] **Step 3: Add lamp, clock, and night-mode CSS**

Append to `src/themes/bbs/theme.css`:

```css
/* ─── Desk Lamp ─── */
.desk-lamp {
  position: absolute;
  left: 5%;
  bottom: 0;
  z-index: 4;
  transition: opacity 2s ease;
}

body[data-time="morning"] .desk-lamp,
body[data-time="afternoon"] .desk-lamp {
  opacity: 0;
  pointer-events: none;
}

.lamp-shade {
  width: 50px;
  height: 24px;
  background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
  border-radius: 50% 50% 0 0;
  border: 1px solid #444;
  margin: 0 auto;
}

.lamp-stem {
  width: 4px;
  height: 50px;
  background: #333;
  margin: 0 auto;
}

.lamp-base {
  width: 40px;
  height: 6px;
  background: linear-gradient(180deg, #3a3a3a, #222);
  border-radius: 2px;
  margin: 0 auto;
}

.lamp-light-cone {
  position: absolute;
  top: 24px;
  left: -20px;
  width: 90px;
  height: 120px;
  background: radial-gradient(ellipse at top, rgba(255,220,150,0.25) 0%, rgba(255,200,120,0.1) 40%, transparent 70%);
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .lamp-light-cone {
    animation: lamp-flicker 4s steps(8) infinite;
  }
}

@keyframes lamp-flicker {
  0%, 100% { opacity: 1; }
  25% { opacity: 0.97; }
  50% { opacity: 1; }
  75% { opacity: 0.98; }
}

.lamp-dust-motes {
  position: absolute;
  inset: 0;
}

.dust-mote {
  position: absolute;
  top: 0;
  border-radius: 50%;
  background: rgba(255,220,150,0.6);
}

@media (prefers-reduced-motion: no-preference) {
  .dust-mote {
    animation: mote-drift linear infinite;
  }
}

@keyframes mote-drift {
  0% { transform: translate(0, 0); opacity: 0; }
  10% { opacity: 0.5; }
  50% { transform: translate(10px, 60px); opacity: 0.3; }
  90% { opacity: 0; }
  100% { transform: translate(-5px, 120px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .dust-mote { display: none; }
}

/* ─── Wall Clock ─── */
.wall-clock {
  position: absolute;
  top: 10px;
  right: 10%;
  z-index: 3;
}

.clock-face {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f5f0e0;
  border: 2px solid #333;
  position: relative;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}

.clock-mark {
  position: absolute;
  background: #333;
}

.clock-mark-12 { top: 3px; left: 50%; width: 2px; height: 6px; transform: translateX(-50%); }
.clock-mark-3 { top: 50%; right: 3px; width: 6px; height: 2px; transform: translateY(-50%); }
.clock-mark-6 { bottom: 3px; left: 50%; width: 2px; height: 6px; transform: translateX(-50%); }
.clock-mark-9 { top: 50%; left: 3px; width: 6px; height: 2px; transform: translateY(-50%); }

.clock-hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 1px;
}

.clock-hand-hour { width: 3px; height: 14px; background: #222; margin-left: -1.5px; }
.clock-hand-minute { width: 2px; height: 18px; background: #333; margin-left: -1px; }
.clock-hand-second { width: 1px; height: 20px; background: #cc3333; margin-left: -0.5px; animation: clock-second-sweep 60s steps(60) infinite; }

@media (prefers-reduced-motion: no-preference) {
  @keyframes clock-second-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
}

.clock-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #333;
  transform: translate(-50%, -50%);
}

@media (prefers-reduced-motion: reduce) {
  .clock-hand-second { display: none; }
}

/* ─── Night Mode ─── */
body[data-time="night"] .wall::after,
body[data-time="evening"] .wall::after {
  box-shadow: 0 3px 6px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3);
}

body[data-time="night"] .desk::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  pointer-events: none;
  z-index: 1;
  transition: opacity 2s ease;
}

body[data-time="night"] .hw-monitor::before {
  width: 140%;
  height: 70%;
  opacity: 1;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/themes/bbs/DeskLamp.astro src/themes/bbs/WallClock.astro src/themes/bbs/theme.css
git commit -m "feat(bbs): add desk lamp with dust motes, wall clock, and night mode"
```

---

## Task 13: BBS Environmental — Modem LED Activity

**Files:**
- Modify: `src/themes/bbs/Modem.astro:230-238` (click listener)

- [ ] **Step 1: Add event-driven LED blink to Modem.astro**

Replace the generic click listener (lines 231-238) with event-based listeners. After the boot LED choreography block, add:

```typescript
// Event-driven TX/RX blinks (after boot)
document.addEventListener("boot:complete", () => {
  // RX blink on content rendered
  document.addEventListener("bbs:content-rendered", () => {
    setLed("rd", "on blink");
    setTimeout(() => setLed("rd", "on blink-slow"), 300);
  });

  // TX blink on keypress
  document.addEventListener("keydown", () => {
    setLed("sd", "on blink");
    setTimeout(() => setLed("sd", "on blink-slow"), 300);
  });
});
```

Remove the old generic click listener (lines 231-238).

- [ ] **Step 2: Commit**

```bash
git add src/themes/bbs/Modem.astro
git commit -m "feat(bbs): modem TX/RX LEDs blink on content render and keypress"
```

---

## Task 14: BBS Layout Integration

**Files:**
- Modify: `src/layouts/BBS.astro`

- [ ] **Step 1: Import and include all new components**

Add imports to `src/layouts/BBS.astro`:
```astro
import RainWindow from "../themes/bbs/RainWindow.astro";
import DeskLamp from "../themes/bbs/DeskLamp.astro";
import WallClock from "../themes/bbs/WallClock.astro";
import AlbumPlayer from "../themes/bbs/AlbumPlayer.astro";
```

Add to the `.wall` section (after album shelf):
```html
<WallClock />
```

Add inside `.desk` (before `.hw-stack`):
```html
<DeskLamp />
<RainWindow />
```

Add inside `.hw-screen-content` (after `<slot />`):
```html
<AlbumPlayer />
```

- [ ] **Step 2: Add ambient, time-of-day, and typing sounds initialization**

Add a `<script>` block (or append to existing):
```html
<script>
  import { initTimeOfDay } from "../engine/time-of-day";
  import { startAmbient } from "../engine/ambient";
  import { initTypingSounds, playMenuBeep, playHDDChatter } from "../engine/typing-sounds";
  import { initAudio } from "../engine/audio";

  initAudio();
  initTimeOfDay();

  document.addEventListener("boot:complete", () => {
    startAmbient("bbs");
    initTypingSounds("bbs");

    // UI sounds: menu beep
    document.querySelectorAll(".bbs-menu-item").forEach((el) => {
      el.addEventListener("click", playMenuBeep);
    });

    // UI sounds: HDD chatter on page change
    document.addEventListener("bbs:page-change", playHDDChatter);

    // Idle timer (2 minutes)
    let idleTimer: ReturnType<typeof setTimeout>;
    function resetIdle() {
      document.body.classList.remove("idle-active");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => document.body.classList.add("idle-active"), 120_000);
    }
    resetIdle();
    document.addEventListener("mousemove", resetIdle);
    document.addEventListener("keydown", resetIdle);
    document.addEventListener("click", resetIdle);
    document.addEventListener("touchstart", resetIdle);
  });
</script>
```

- [ ] **Step 3: Add idle overlay CSS**

Append to `src/themes/bbs/theme.css`:

```css
/* ─── Idle Overlay ─── */
.idle-active .hw-screen-content::after {
  content: "NO CARRIER DETECTED";
  position: absolute;
  inset: 0;
  background: rgba(10, 0, 8, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tf-orange);
  font-family: var(--bbs-font);
  font-size: 18px;
  letter-spacing: 3px;
  z-index: 60;
  animation: bbs-cursor-blink 2s step-end infinite;
}
```

- [ ] **Step 4: Test BBS integration**

Run: `npm run dev`. Verify:
1. Wall clock shows correct time with ticking second hand
2. Desk lamp visible at night/evening, hidden during day
3. Rain window shows in lower-right, weather changes with time
4. CRT hum starts after boot
5. Typing sounds on keypress
6. Menu click beep and HDD chatter on page change
7. 2-minute idle shows "NO CARRIER DETECTED"

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BBS.astro src/themes/bbs/theme.css
git commit -m "feat(bbs): integrate all atmosphere components — lamp, clock, rain, sounds, idle"
```

---

## Task 15: SGI Environmental — Screensaver Modes and Clock Widget

**Files:**
- Modify: `src/themes/sgi-irix/Screensaver.astro`
- Create: `src/themes/sgi-irix/ClockWidget.astro`
- Modify: `src/themes/sgi-irix/Toolchest.astro:31` (add clock entry)

- [ ] **Step 1: Refactor Screensaver.astro into mode system**

Replace the content of `src/themes/sgi-irix/Screensaver.astro`. Keep the existing starfield+cube as "classic" mode, add "matrix" and "deep-space" modes:

```astro
---
// src/themes/sgi-irix/Screensaver.astro — Multi-mode screensaver
const stars = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() > 0.7 ? 2 : 1,
  opacity: 0.3 + Math.random() * 0.5,
  delay: Math.random() * 4,
}));

const matrixColumns = Array.from({ length: 20 }, (_, i) => ({
  left: i * 5,
  speed: 2 + Math.random() * 4,
  delay: Math.random() * 3,
  opacity: 0.3 + Math.random() * 0.7,
}));

const deepStars = Array.from({ length: 80 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  opacity: 0.2 + Math.random() * 0.6,
  delay: Math.random() * 5,
}));
---

<div class="sgi-screensaver" id="screensaver">
  <!-- Classic mode (existing) -->
  <div class="sgi-ss-mode" id="ss-classic">
    <div class="sgi-ss-starfield">
      {stars.map((s) => (
        <div
          class="sgi-ss-star"
          style={`left:${s.x}%;top:${s.y}%;width:${s.size}px;height:${s.size}px;opacity:${s.opacity};animation-delay:${s.delay}s`}
        />
      ))}
    </div>
    <div class="sgi-ss-cube-container">
      <svg class="sgi-ss-cube" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ss-cube-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#5BC8DC"/><stop offset="100%" stop-color="#3A9AB0"/>
          </linearGradient>
          <linearGradient id="ss-cube-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E8891E"/><stop offset="100%" stop-color="#C06E10"/>
          </linearGradient>
          <linearGradient id="ss-cube-right" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9B6CC8"/><stop offset="100%" stop-color="#7B52AE"/>
          </linearGradient>
        </defs>
        <polygon points="60,15 105,38 60,55 15,38" fill="url(#ss-cube-top)" opacity="0.9"/>
        <polygon points="15,38 60,55 60,100 15,78" fill="url(#ss-cube-left)" opacity="0.9"/>
        <polygon points="105,38 60,55 60,100 105,78" fill="url(#ss-cube-right)" opacity="0.9"/>
        <line x1="60" y1="15" x2="15" y2="38" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
        <line x1="60" y1="15" x2="105" y2="38" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
        <line x1="15" y1="38" x2="60" y2="55" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
        <line x1="60" y1="55" x2="60" y2="100" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>
      </svg>
      <div class="sgi-ss-glow"></div>
    </div>
  </div>

  <!-- Matrix Rain mode -->
  <div class="sgi-ss-mode" id="ss-matrix" style="display:none">
    <div class="sgi-ss-matrix-rain">
      {matrixColumns.map((c) => (
        <div
          class="sgi-ss-matrix-col"
          style={`left:${c.left}%;animation-duration:${c.speed}s;animation-delay:${c.delay}s;opacity:${c.opacity}`}
        />
      ))}
    </div>
  </div>

  <!-- Deep Space mode -->
  <div class="sgi-ss-mode" id="ss-deep-space" style="display:none">
    <div class="sgi-ss-nebula"></div>
    <div class="sgi-ss-deep-stars">
      {deepStars.map((s) => (
        <div
          class="sgi-ss-star"
          style={`left:${s.x}%;top:${s.y}%;width:${s.size}px;height:${s.size}px;opacity:${s.opacity};animation-delay:${s.delay}s`}
        />
      ))}
    </div>
  </div>
</div>

<script>
  const modes = ["ss-classic", "ss-matrix", "ss-deep-space"];
  let lastMode = sessionStorage.getItem("sgi-ss-last") || "";

  function pickMode(): string {
    const available = modes.filter((m) => m !== lastMode);
    return available[Math.floor(Math.random() * available.length)];
  }

  // Set random characters for matrix columns
  document.querySelectorAll(".sgi-ss-matrix-col").forEach((col) => {
    const chars = Array.from({ length: 20 }, () =>
      String.fromCharCode(0x30A0 + Math.random() * 96)
    ).join("\n");
    (col as HTMLElement).textContent = chars;
  });

  // On screensaver activation, pick a mode
  const observer = new MutationObserver(() => {
    const desktop = document.getElementById("desktop");
    if (desktop?.classList.contains("screensaver-active")) {
      const mode = pickMode();
      lastMode = mode;
      sessionStorage.setItem("sgi-ss-last", mode);
      modes.forEach((m) => {
        const el = document.getElementById(m);
        if (el) el.style.display = m === mode ? "block" : "none";
      });
    }
  });

  const desktop = document.getElementById("desktop");
  if (desktop) observer.observe(desktop, { attributes: true, attributeFilter: ["class"] });
</script>
```

- [ ] **Step 2: Create ClockWidget.astro**

```astro
---
// src/themes/sgi-irix/ClockWidget.astro — Small analog clock window
---

<div
  class="sgi-window sgi-clock-widget"
  data-window-id="clock"
  style="display:none;left:20px;top:60px;width:130px;height:150px"
>
  <div class="sgi-window-titlebar" data-drag-handle="clock">
    <span class="sgi-window-title">Clock</span>
    <div class="sgi-window-btns">
      <span class="sgi-window-btn" data-action="close" data-target="clock">×</span>
    </div>
  </div>
  <div class="sgi-window-body" style="display:flex;align-items:center;justify-content:center;padding:8px;">
    <div class="sgi-clock-face" id="sgi-clock-face">
      <div class="sgi-clock-mark sgi-clock-mark-12"></div>
      <div class="sgi-clock-mark sgi-clock-mark-3"></div>
      <div class="sgi-clock-mark sgi-clock-mark-6"></div>
      <div class="sgi-clock-mark sgi-clock-mark-9"></div>
      <div class="sgi-clock-hand sgi-clock-hand-hour" id="sgi-clock-hour"></div>
      <div class="sgi-clock-hand sgi-clock-hand-minute" id="sgi-clock-minute"></div>
      <div class="sgi-clock-hand sgi-clock-hand-second" id="sgi-clock-second"></div>
      <div class="sgi-clock-center"></div>
    </div>
  </div>
</div>

<script>
  import { registerWindow, openWindow, closeWindow } from "../../engine/wm";

  registerWindow("clock", "Clock", { x: 20, y: 60, width: 130, height: 150 });

  // Auto-open if user had it open last time
  if (localStorage.getItem("sgi-clock-open") === "1") {
    document.addEventListener("boot:complete", () => openWindow("clock"));
  }

  // Save state on open/close
  document.addEventListener("wm:window-opened", ((e: CustomEvent) => {
    if (e.detail?.id === "clock") localStorage.setItem("sgi-clock-open", "1");
  }) as EventListener);

  document.addEventListener("wm:window-closed", ((e: CustomEvent) => {
    if (e.detail?.id === "clock") localStorage.setItem("sgi-clock-open", "0");
  }) as EventListener);

  // Clock animation
  function updateSGIClock(): void {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    const hourEl = document.getElementById("sgi-clock-hour");
    const minEl = document.getElementById("sgi-clock-minute");
    const secEl = document.getElementById("sgi-clock-second");
    if (hourEl) hourEl.style.transform = `rotate(${h * 30 + m * 0.5}deg)`;
    if (minEl) minEl.style.transform = `rotate(${m * 6}deg)`;
    if (secEl) secEl.style.transform = `rotate(${s * 6}deg)`;
  }
  updateSGIClock();
  setInterval(updateSGIClock, 1000);
</script>
```

- [ ] **Step 3: Add Clock to Toolchest.astro**

In `src/themes/sgi-irix/Toolchest.astro`, before the divider (line 31), add:
```html
<div class="sgi-toolchest-item" data-menu-open="clock" role="menuitem" tabindex="0" aria-haspopup="true">
  <span>Clock</span>
</div>
```

- [ ] **Step 4: Include ClockWidget in the SGI pages**

Add the import and component to both `src/pages/sgi.astro` and `src/pages/[...slug].astro` (which both use SGI layout):

In each file, add among the other SGI component imports:
```astro
import ClockWidget from "../themes/sgi-irix/ClockWidget.astro";
```

Then add `<ClockWidget />` inside the `<SGIDesktop>` slot, alongside the other `<Window>` components.

- [ ] **Step 5: Add SGI clock CSS and screensaver mode CSS**

Append to `src/themes/sgi-irix/theme.css`:

```css
/* ─── SGI Clock Widget ─── */
.sgi-clock-face {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #e8e0d0;
  border: 2px solid #666;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.sgi-clock-mark { position: absolute; background: #444; }
.sgi-clock-mark-12 { top: 4px; left: 50%; width: 2px; height: 8px; transform: translateX(-50%); }
.sgi-clock-mark-3 { top: 50%; right: 4px; width: 8px; height: 2px; transform: translateY(-50%); }
.sgi-clock-mark-6 { bottom: 4px; left: 50%; width: 2px; height: 8px; transform: translateX(-50%); }
.sgi-clock-mark-9 { top: 50%; left: 4px; width: 8px; height: 2px; transform: translateY(-50%); }

.sgi-clock-hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 1px;
}

.sgi-clock-hand-hour { width: 3px; height: 22px; background: #333; margin-left: -1.5px; }
.sgi-clock-hand-minute { width: 2px; height: 30px; background: #444; margin-left: -1px; }
.sgi-clock-hand-second { width: 1px; height: 32px; background: #cc3333; margin-left: -0.5px; }

.sgi-clock-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #444;
  transform: translate(-50%, -50%);
}

@media (prefers-reduced-motion: reduce) {
  .sgi-clock-hand-second { display: none; }
}

/* ─── Screensaver Modes ─── */
.sgi-ss-mode {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Matrix Rain */
.sgi-ss-matrix-rain {
  position: absolute;
  inset: 0;
  background: #000;
}

.sgi-ss-matrix-col {
  position: absolute;
  top: -100%;
  width: 4%;
  color: #0f0;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.2;
  white-space: pre-line;
  text-shadow: 0 0 4px #0f0;
}

@media (prefers-reduced-motion: no-preference) {
  .sgi-ss-matrix-col {
    animation: matrix-fall linear infinite;
  }
}

@keyframes matrix-fall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}

/* Deep Space */
.sgi-ss-nebula {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 40%, rgba(60,20,80,0.6), transparent 60%),
              radial-gradient(ellipse at 70% 60%, rgba(20,40,80,0.4), transparent 50%);
}

@media (prefers-reduced-motion: no-preference) {
  .sgi-ss-nebula {
    animation: nebula-shift 30s ease-in-out infinite alternate;
  }
}

@keyframes nebula-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(40deg); }
}

.sgi-ss-deep-stars {
  position: absolute;
  inset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .sgi-ss-matrix-col { animation: none !important; }
  .sgi-ss-nebula { animation: none !important; }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/themes/sgi-irix/Screensaver.astro src/themes/sgi-irix/ClockWidget.astro src/themes/sgi-irix/Toolchest.astro src/themes/sgi-irix/theme.css
git commit -m "feat(sgi): multi-mode screensaver (classic, matrix, deep space) and clock widget"
```

---

## Task 16: SGI/NX Integration — Ambient + Time-of-Day

**Files:**
- Modify: `src/layouts/Desktop.astro` (add ambient + time-of-day)
- Modify: `src/layouts/NXDesktop.astro` (add ambient + time-of-day)
- Modify: `src/themes/sgi-irix/theme.css` (time-of-day CSS rules)
- Modify: `src/themes/nextstep/theme.css` (time-of-day + idle CSS rules)

- [ ] **Step 1: Add ambient + time-of-day to Desktop.astro**

In `src/layouts/Desktop.astro`, inside the `boot:complete` event handler (line 71), add:
```typescript
import { initTimeOfDay } from "../engine/time-of-day";
import { startAmbient } from "../engine/ambient";
import { initTypingSounds, playSoftClick, playThud, playNoiseBurst } from "../engine/typing-sounds";

// Inside boot:complete handler:
initTimeOfDay();
startAmbient("sgi");
initTypingSounds("sgi");

// Wire drag sounds
document.addEventListener("wm:drag-start", () => playSoftClick());
document.addEventListener("wm:drag-end", () => playThud());

// Wire folder open and context menu sounds
document.querySelectorAll(".fm-folder").forEach((el) => {
  el.addEventListener("click", () => playNoiseBurst(2000, 8, 0.03));
});
document.addEventListener("contextmenu", () => playSoftClick());

// Status bar time indicator (sun/moon)
const statusTimeSpan = document.createElement("span");
statusTimeSpan.className = "sgi-status-time-icon";
statusTimeSpan.style.cssText = "margin-left:8px;font-size:12px;";
const statusBar = document.querySelector(".sgi-status-bar-right, .sgi-toolchest");
if (statusBar) statusBar.appendChild(statusTimeSpan);

import { getTimePeriod, onPeriodChange } from "../engine/time-of-day";

function updateTimeIcon() {
  const p = getTimePeriod();
  statusTimeSpan.textContent = (p === "night" || p === "evening") ? "🌙" : "☀️";
}
updateTimeIcon();
onPeriodChange(updateTimeIcon);
```

Also modify the existing screensaver idle timer in Desktop.astro (lines 452-476). Change the hardcoded 90s timeout to be time-aware:

```typescript
// Replace the fixed 90000ms timeout with:
function getSSTimeout(): number {
  const p = getTimePeriod();
  return (p === "night" || p === "evening") ? 60_000 : 90_000;
}
// Use getSSTimeout() where the screensaver setTimeout is called
// Also hook into onPeriodChange to re-arm the timer with the new duration
```

- [ ] **Step 2: Add ambient + time-of-day to NXDesktop.astro**

Similarly in `src/layouts/NXDesktop.astro`, add imports and initialization after the existing window setup:
```typescript
import { initTimeOfDay } from "../engine/time-of-day";
import { startAmbient } from "../engine/ambient";
import { initTypingSounds, playShelfClick, playSpringBounce, playSwoosh } from "../engine/typing-sounds";

initTimeOfDay();
startAmbient("nextstep");
initTypingSounds("nextstep");

// NX UI sounds
document.querySelectorAll(".nx-shelf-btn, .nx-shelf-item").forEach((el) => {
  el.addEventListener("click", () => playShelfClick());
});
document.addEventListener("wm:window-opened", () => playSpringBounce());
document.addEventListener("wm:window-shaded", () => playSwoosh(false));
document.addEventListener("wm:window-unshaded", () => playSwoosh(true));

// NX idle timer (2 minutes)
let nxIdleTimer: ReturnType<typeof setTimeout>;
function resetNXIdle() {
  document.body.classList.remove("idle-active");
  clearTimeout(nxIdleTimer);
  nxIdleTimer = setTimeout(() => document.body.classList.add("idle-active"), 120_000);
}
resetNXIdle();
document.addEventListener("mousemove", resetNXIdle);
document.addEventListener("keydown", resetNXIdle);
document.addEventListener("click", resetNXIdle);
```

- [ ] **Step 3: Add SGI time-of-day CSS**

Append to `src/themes/sgi-irix/theme.css`:
```css
/* ─── Time-of-Day ─── */
body[data-time="night"] .sgi-desktop {
  filter: brightness(0.85);
}

body[data-time="morning"] .sgi-desktop {
  filter: brightness(1.05);
}
```

- [ ] **Step 4: Add NX time-of-day + idle CSS**

Append to `src/themes/nextstep/theme.css`:
```css
/* ─── Time-of-Day ─── */
body[data-time="night"] .nx-dock { opacity: 0.85; }
body[data-time="night"] .nx-shelf-btn { box-shadow: 0 0 8px rgba(255,200,100,0.15); }

/* ─── Idle ─── */
.idle-active .nx-desktop::after {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9000;
}

.idle-active .nx-dock-tile {
  animation: nx-idle-pulse 3s ease-in-out infinite;
}

@keyframes nx-idle-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Desktop.astro src/layouts/NXDesktop.astro src/themes/sgi-irix/theme.css src/themes/nextstep/theme.css
git commit -m "feat(sgi,nx): integrate ambient sounds, time-of-day, and idle behavior"
```

---

## Task 17: NX Environmental — Animated Dock Icons

**Files:**
- Modify: `src/themes/nextstep/NXDock.astro`
- Modify: `src/themes/nextstep/theme.css`

- [ ] **Step 1: Read NXDock.astro to find the icon structure**

Read the current file to understand the dock tile structure.

- [ ] **Step 2: Add CSS-only hover animations**

Append to `src/themes/nextstep/theme.css`:
```css
/* ─── Dock Icon Animations ─── */
.nx-dock-tile[data-window="godzilla"]:hover .nx-dock-icon::after {
  content: '🔥';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  animation: fire-flicker 0.3s ease infinite alternate;
}

@keyframes fire-flicker {
  0% { transform: translateX(-50%) scale(1); }
  100% { transform: translateX(-50%) scale(1.15); filter: hue-rotate(10deg); }
}

.nx-dock-tile[data-window="recycler"]:hover .nx-dock-icon {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Fractals icon — always-on slow hue cycle */
.nx-dock-tile[data-window="fractals"] .nx-dock-icon {
  animation: fractals-cycle 8s linear infinite;
}

@keyframes fractals-cycle {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* Music icon — spinning disc on hover */
.nx-dock-tile[data-window="music"]:hover .nx-dock-icon::after {
  content: '💿';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  animation: spin-disc 2s linear infinite;
}

@keyframes spin-disc {
  0% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .nx-dock-tile[data-window="fractals"] .nx-dock-icon { animation: none !important; }
  .nx-dock-tile[data-window="music"]:hover .nx-dock-icon::after { animation: none !important; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/themes/nextstep/NXDock.astro src/themes/nextstep/theme.css
git commit -m "feat(nx): add animated dock icon hover effects"
```

---

## Task 18: Seasonal — December Snow

**Files:**
- Create: `src/engine/seasonal.ts`
- Create: `src/components/Snow.astro`
- Modify: `src/layouts/BBS.astro`, `src/layouts/Desktop.astro`, `src/layouts/NXDesktop.astro` (conditionally include Snow)

- [ ] **Step 1: Create seasonal.ts**

```typescript
// src/engine/seasonal.ts

export interface SeasonalOverride {
  cssClass?: string;
  particleEffect?: "snow";
  bootMessageOverride?: string;
}

export function getSeasonalOverride(): SeasonalOverride | null {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed

  // December (month 11)
  if (month === 11) {
    return {
      cssClass: "seasonal-winter",
      particleEffect: "snow",
      bootMessageOverride: "❄ Happy Holidays from T-NET BBS ❄",
    };
  }

  return null;
}
```

- [ ] **Step 2: Create Snow.astro**

```astro
---
// src/components/Snow.astro — Seasonal snow particles
const flakes = Array.from({ length: 30 }, () => ({
  left: Math.random() * 100,
  size: 2 + Math.random() * 3,
  duration: 6 + Math.random() * 9,
  delay: Math.random() * 10,
  drift: -10 + Math.random() * 20,
}));
---

<div class="snow-container" id="snow-container">
  {flakes.map((f) => (
    <div
      class="snowflake"
      style={`left:${f.left}%;width:${f.size}px;height:${f.size}px;animation-duration:${f.duration}s;animation-delay:${f.delay}s;--drift:${f.drift}px`}
    />
  ))}
</div>

<style>
  .snow-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .snowflake {
    position: absolute;
    top: -10px;
    border-radius: 50%;
    background: white;
    opacity: 0.8;
  }

  @media (prefers-reduced-motion: no-preference) {
    .snowflake {
      animation: snowfall linear infinite;
    }
  }

  @keyframes snowfall {
    0% { transform: translateY(-10px) translateX(0); opacity: 0; }
    10% { opacity: 0.8; }
    100% { transform: translateY(100vh) translateX(var(--drift, 0px)); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .snow-container { display: none; }
  }
</style>

<script>
  import { getSeasonalOverride } from "../engine/seasonal";
  const override = getSeasonalOverride();
  if (!override?.particleEffect) {
    document.getElementById("snow-container")?.remove();
  }
  if (override?.cssClass) {
    document.body.classList.add(override.cssClass);
  }
</script>
```

- [ ] **Step 3: Wire seasonal boot message into Boot.astro**

In `src/themes/bbs/Boot.astro`, at the beginning of the boot text output (where the BBS welcome message is printed), add:

```typescript
import { getSeasonalOverride } from "../../engine/seasonal";
const seasonal = getSeasonalOverride();
if (seasonal?.bootMessageOverride) {
  // Prepend seasonal greeting to the first boot line
  typeText(seasonal.bootMessageOverride + "\r\n");
}
```

- [ ] **Step 4: Include Snow.astro in all layouts**

Add `import Snow from "../components/Snow.astro"` and `<Snow />` to:
- `src/layouts/BBS.astro` (inside `<body>`, before closing `</body>`)
- `src/layouts/Desktop.astro` (inside `<body>`)
- `src/layouts/NXDesktop.astro` (inside `<body>`)

- [ ] **Step 5: Commit**

```bash
git add src/engine/seasonal.ts src/components/Snow.astro src/layouts/BBS.astro src/layouts/Desktop.astro src/layouts/NXDesktop.astro
git commit -m "feat(seasonal): add December snow particles across all eras"
```

---

## Task 19: Reduced Motion Audit

**Files:**
- Modify: `src/themes/bbs/theme.css`
- Modify: `src/themes/sgi-irix/theme.css`
- Modify: `src/themes/nextstep/theme.css`

- [ ] **Step 1: Audit all CSS animations**

Search all theme CSS files for `animation:` rules and ensure each is wrapped in `@media (prefers-reduced-motion: no-preference)` or has a `@media (prefers-reduced-motion: reduce)` override that disables it.

Key animations to check:
- `crt-flicker`, `crt-glow` — should be static in reduced motion
- `rainbow-shift` — should stop
- `splash-glow` — should stop
- All new animations (rain, dust, snow, clock, screensaver, dock pulse)

- [ ] **Step 2: Add missing reduced-motion overrides**

```css
@media (prefers-reduced-motion: reduce) {
  .hw-screen::after,
  .hw-monitor::before,
  .bbs-splash-logo,
  .hw-brand-label { animation: none !important; }

  .sgi-ss-star { animation: none !important; }
  .sgi-ss-cube-container { animation: none !important; }
  .sgi-ss-matrix-col { animation: none !important; }

  .nx-dock-tile { animation: none !important; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/themes/bbs/theme.css src/themes/sgi-irix/theme.css src/themes/nextstep/theme.css
git commit -m "a11y: ensure all animations respect prefers-reduced-motion"
```

---

## Task 20: Final Integration Test

- [ ] **Step 1: Test BBS era**

Run: `npm run dev`, navigate to BBS page. Verify:
- Boot sequence plays modem + THX audio
- Wall is warm parchment color
- Albums are clickable, play music with crossfade
- Rain window visible at night, appropriate weather
- Desk lamp on at night, off during day with dust motes
- Wall clock shows correct time
- CRT hum audible when unmuted
- Typing sounds on keypress
- Menu beep and HDD chatter on navigation
- Modem LEDs blink on content/keypress
- 2-min idle shows "NO CARRIER DETECTED"

- [ ] **Step 2: Test SGI era**

Navigate to SGI page. Verify:
- Fan hum audible when unmuted
- Typing sounds in console
- Screensaver triggers after 90s, picks random mode
- Clock widget opens from Toolchest
- Window drag/drop sounds
- Time-of-day background shift at night

- [ ] **Step 3: Test NeXTSTEP era**

Navigate to NX page. Verify:
- Lab ambience audible when unmuted
- Typing sounds in terminal
- Shelf click and dock bounce sounds
- Window shade swoosh
- Night mode dims dock
- 2-min idle with dock pulse

- [ ] **Step 4: Test December seasonal**

Temporarily modify `getSeasonalOverride()` to return snow regardless of month. Verify snow particles appear across all eras. Revert change.

- [ ] **Step 5: Test reduced motion**

Enable `prefers-reduced-motion: reduce` in browser dev tools. Verify:
- No rain animation (static streaks)
- No dust motes
- No snow
- Clock second hand hidden
- Screensaver shows static mode

- [ ] **Step 6: Build check**

Run: `npm run build`

Verify no TypeScript errors and successful build output.

- [ ] **Step 7: Commit any fixes**

```bash
git add -u
git commit -m "fix: address integration issues found during living world atmosphere testing"
```
