# Window Scene, Plant Stand & Album Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add animated daytime sky content to the rain window, a wooden plant stand, and fix two incorrect album names.

**Architecture:** Pure CSS additions to existing Astro components. New HTML elements inside `RainWindow.astro` for clouds/birds/airplane. CSS animations and visibility rules in `theme.css`. Data corrections in `album-tracks.ts`.

**Tech Stack:** Astro 6, CSS animations, CSS pseudo-elements

**Spec:** `docs/superpowers/specs/2026-03-20-window-scene-plant-stand-album-fixes-design.md`

---

### Task 1: Add cloud HTML elements to RainWindow

**Files:**
- Modify: `src/themes/bbs/RainWindow.astro`

- [ ] **Step 1: Add cloud divs inside `.rain-window-glass`, between `.rain-window-outside` and `.rain-streaks`**

In `src/themes/bbs/RainWindow.astro`, insert after line 15 (`<div class="rain-window-outside"></div>`) and before line 16 (`<div class="rain-streaks">`):

```html
<!-- Daytime sky elements -->
<div class="sky-clouds">
  <div class="cloud cloud-back"></div>
  <div class="cloud cloud-mid"></div>
  <div class="cloud cloud-front"></div>
</div>
<div class="sky-birds">
  <div class="bird"></div>
  <div class="bird"></div>
  <div class="bird"></div>
</div>
<div class="sky-airplane"></div>
```

- [ ] **Step 2: Verify no syntax errors**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npx astro check 2>&1 | head -20`
Expected: No errors in RainWindow.astro

- [ ] **Step 3: Commit**

```bash
git add src/themes/bbs/RainWindow.astro
git commit -m "feat(bbs): add cloud, bird, airplane elements to rain window"
```

---

### Task 2: Add cloud CSS animations

**Files:**
- Modify: `src/themes/bbs/theme.css` (insert after line 1721, before `/* ─── Desk Lamp ─── */`)

- [ ] **Step 1: Add base cloud styles and keyframes**

Insert the following CSS after line 1721 (the `prefers-reduced-motion: reduce` block for rain) and before `/* ─── Desk Lamp ─── */` at line 1723:

```css
/* ─── Daytime Sky Elements ─── */
.sky-clouds,
.sky-birds,
.sky-airplane {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 2s ease;
}

/* Show during daytime, hide at night/dawn/evening */
body[data-time="morning"] .sky-clouds,
body[data-time="morning"] .sky-birds,
body[data-time="morning"] .sky-airplane,
body[data-time="afternoon"] .sky-clouds,
body[data-time="afternoon"] .sky-birds,
body[data-time="afternoon"] .sky-airplane {
  opacity: 1;
}

/* Hide when rain is active (afternoon rain days) */
.rain-active .sky-clouds,
.rain-active .sky-birds,
.rain-active .sky-airplane {
  opacity: 0;
}

/* Explicit z-index on existing layers for stacking clarity */
.rain-streaks { z-index: 4; }
.rain-window-reflection { z-index: 6; }

/* ── Clouds ── */
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  filter: blur(2px);
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud-back {
  width: 60px;
  height: 20px;
  top: 15%;
  opacity: 0.4;
  z-index: 1;
}

.cloud-back::before {
  width: 30px;
  height: 25px;
  top: -12px;
  left: 10px;
}

.cloud-back::after {
  width: 24px;
  height: 18px;
  top: -8px;
  left: 30px;
}

.cloud-mid {
  width: 50px;
  height: 16px;
  top: 25%;
  opacity: 0.6;
  z-index: 2;
}

.cloud-mid::before {
  width: 25px;
  height: 20px;
  top: -10px;
  left: 8px;
}

.cloud-mid::after {
  width: 20px;
  height: 15px;
  top: -7px;
  left: 24px;
}

.cloud-front {
  width: 45px;
  height: 14px;
  top: 10%;
  opacity: 0.8;
  z-index: 2;
}

.cloud-front::before {
  width: 22px;
  height: 18px;
  top: -10px;
  left: 6px;
}

.cloud-front::after {
  width: 18px;
  height: 14px;
  top: -6px;
  left: 20px;
}

@keyframes cloud-drift {
  0% { transform: translateX(320px); }
  100% { transform: translateX(-120px); }
}

@media (prefers-reduced-motion: no-preference) {
  .cloud-back {
    animation: cloud-drift 60s linear infinite;
    animation-delay: -20s;
  }

  .cloud-mid {
    animation: cloud-drift 40s linear infinite;
    animation-delay: -10s;
  }

  .cloud-front {
    animation: cloud-drift 25s linear infinite;
    animation-delay: -5s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cloud-back { left: 60%; }
  .cloud-mid { left: 30%; }
  .cloud-front { left: 70%; }
}
```

- [ ] **Step 2: Verify the dev server renders clouds during daytime**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run dev`
Open `http://localhost:4321/` — set system time to afternoon or temporarily force `data-time="morning"` in DevTools. Confirm 3 clouds drift across the window.

- [ ] **Step 3: Commit**

```bash
git add src/themes/bbs/theme.css
git commit -m "feat(bbs): add cloud drift animations to rain window"
```

---

### Task 3: Add bird CSS animations

**Files:**
- Modify: `src/themes/bbs/theme.css` (append after cloud CSS from Task 2)

- [ ] **Step 1: Add bird styles and keyframes**

Insert immediately after the cloud `prefers-reduced-motion: reduce` block:

```css
/* ── Birds ── */
.bird {
  position: absolute;
  width: 8px;
  height: 3px;
  top: 20%;
  z-index: 3;
}

.bird::before,
.bird::after {
  content: '';
  position: absolute;
  width: 5px;
  height: 2px;
  background: rgba(30, 30, 30, 0.7);
  border-radius: 50% 50% 0 0;
  top: 0;
}

.bird::before {
  left: 0;
  transform: rotate(-30deg);
}

.bird::after {
  right: 0;
  transform: rotate(30deg);
}

.bird:nth-child(1) { top: 18%; }
.bird:nth-child(2) { top: 22%; }
.bird:nth-child(3) { top: 15%; }

@keyframes bird-fly {
  0% { transform: translateX(320px) translateY(0); }
  25% { transform: translateX(240px) translateY(-8px); }
  50% { transform: translateX(160px) translateY(4px); }
  75% { transform: translateX(80px) translateY(-6px); }
  100% { transform: translateX(-30px) translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  .bird:nth-child(1) {
    animation: bird-fly 12s linear infinite;
    animation-delay: 0s;
  }

  .bird:nth-child(2) {
    animation: bird-fly 14s linear infinite;
    animation-delay: -5s;
  }

  .bird:nth-child(3) {
    animation: bird-fly 10s linear infinite;
    animation-delay: -8s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sky-birds { display: none; }
}
```

- [ ] **Step 2: Verify birds fly across the window in the browser**

Check `http://localhost:4321/` — confirm 3 small V-shaped silhouettes fly across at different speeds.

- [ ] **Step 3: Commit**

```bash
git add src/themes/bbs/theme.css
git commit -m "feat(bbs): add bird fly-across animations to rain window"
```

---

### Task 4: Add airplane CSS animation

**Files:**
- Modify: `src/themes/bbs/theme.css` (append after bird CSS from Task 3)

- [ ] **Step 1: Add airplane styles and keyframes**

Insert immediately after the bird `prefers-reduced-motion: reduce` block:

```css
/* ── Airplane ── */
.sky-airplane {
  z-index: 3;
}

.sky-airplane::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 3px;
  background: rgba(60, 60, 60, 0.6);
  border-radius: 3px 1px 1px 3px;
  top: 30%;
  left: 0;
}

/* Contrail — offset behind the fuselage */
.sky-airplane::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4));
  top: calc(30% + 1px);
  left: -38px;
}

@keyframes airplane-cross {
  0% {
    transform: translateX(-50px) translateY(30px);
    opacity: 0;
  }
  5% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateX(350px) translateY(-40px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .sky-airplane::before,
  .sky-airplane::after {
    animation: airplane-cross 60s linear infinite;
    animation-delay: -15s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sky-airplane { display: none; }
}
```

- [ ] **Step 2: Verify airplane crosses window diagonally in the browser**

Check `http://localhost:4321/` — confirm a small silhouette with faint contrail crosses bottom-left to upper-right.

- [ ] **Step 3: Commit**

```bash
git add src/themes/bbs/theme.css
git commit -m "feat(bbs): add airplane fly-across animation to rain window"
```

---

### Task 5: Add plant stand CSS

**Files:**
- Modify: `src/themes/bbs/theme.css` (insert after `.desk-plant img` block, around line 1885)

- [ ] **Step 1: Add `.desk-plant::before` stand styles**

Insert after line 1891 (`opacity: 1; }`) and before `/* ─── Wall Clock ─── */`:

```css
/* Plant stand (covers pot bottom) */
.desk-plant::before {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 18px;
  background: linear-gradient(180deg, #5a3d2e, #4a3020, #3a2418);
  border-radius: 3px 3px 1px 1px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 2px 4px rgba(0,0,0,0.4);
  z-index: 1;
}
```

- [ ] **Step 2: Verify stand appears under the plant during daytime**

Check `http://localhost:4321/` during morning/afternoon — confirm a small wooden platform sits under the plant pot, covering the bottom.

- [ ] **Step 3: Commit**

```bash
git add src/themes/bbs/theme.css
git commit -m "feat(bbs): add wooden stand under desk plant"
```

---

### Task 6: Fix album data

**Files:**
- Modify: `src/data/album-tracks.ts` (lines 37 and 72)

- [ ] **Step 1: Fix Shinedown album name**

In `src/data/album-tracks.ts`, line 37, change:
```typescript
album: "The Sound of Madness",
```
to:
```typescript
album: "Leave a Whisper",
```

- [ ] **Step 2: Fix Fair to Midland album name**

In `src/data/album-tracks.ts`, line 72, change:
```typescript
album: "Fables from a Mayfly: The Diary of Poe",
```
to:
```typescript
album: "Fables from a Mayfly: What I Tell You Three Times Is True",
```

- [ ] **Step 3: Verify build passes**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run build 2>&1 | tail -5`
Expected: Build completes with no errors.

- [ ] **Step 4: Verify iTunes preview URLs still resolve**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npx tsx scripts/fetch-itunes-previews.ts`
Expected: Script completes without errors. Preview URLs should be unchanged (they're keyed by artist+track, not album name).

- [ ] **Step 5: Commit**

```bash
git add src/data/album-tracks.ts
git commit -m "fix(data): correct album names for Shinedown and Fair to Midland"
```

---

### Task 7: Final visual check and deploy

- [ ] **Step 1: Start dev server and verify all changes together**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run dev`

Check at `http://localhost:4321/`:
- During daytime: clouds drift, birds fly, airplane crosses in rain window
- During night/rain: only rain streaks visible, sky elements hidden
- Plant has wooden stand underneath covering pot bottom
- Album player shows "Leave a Whisper" for Shinedown and correct Fair to Midland album name

- [ ] **Step 2: Build and deploy**

```bash
source ~/.nvm/nvm.sh && nvm use 22 && npm run build && wrangler pages deploy dist --project-name toddlebaron-com
```

- [ ] **Step 3: Final commit if any tweaks were needed**

```bash
git add -A
git commit -m "feat(bbs): window sky scene, plant stand, album data fixes"
```
