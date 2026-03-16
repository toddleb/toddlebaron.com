---
title: "Building an SGI Desktop in 2026"
date: 2026-03-16
description: "How I recreated the Silicon Graphics Indigo Magic desktop experience in a web browser using Astro 6, CSS, and SVG."
tags: ["engineering", "design", "nostalgia", "sgi"]
---

# Building an SGI Desktop in 2026

## Why SGI?

If you grew up around computers in the 1990s, you probably remember the moment you first saw an SGI workstation. For me, it was an Indigo2 running IRIX 6.5 in a university lab. The machine was purple. The desktop had this gradient sky, floating windows with metallic titlebars, and a little running man animation in the corner. It felt like the future.

Silicon Graphics made the machines that rendered Jurassic Park, Toy Story, and Terminator 2. They built hardware for NASA and the NSA. The IRIX operating system and its "Indigo Magic" desktop environment were the visual identity of an era when workstations were serious tools for serious work — and they looked incredible while doing it.

In 2026, I decided to recreate that experience in a browser. Not a screenshot gallery or a CSS mockup, but a functioning desktop environment you can interact with: draggable windows, a working file manager, color scheme switching, a boot sequence, sound effects, and an interactive console. The whole thing.

## The Stack

The site is built with [Astro 6](https://astro.build), which ships zero JavaScript by default. Every page is static HTML and CSS unless I explicitly opt into client-side scripts. That constraint turned out to be perfect — IRIX's Indigo Magic desktop was all about carefully composed static UI elements with minimal animation.

**CSS custom properties** drive the color scheme system. Seven themes (Indigo, Desert, Ocean, Midnight, Rosewood, Slate) are hot-swappable by changing a dozen CSS variables. The selected scheme persists via a cookie, and an inline `<script>` in the `<head>` applies it before first paint to prevent any flash.

**SVG** handles all the icons. Every desktop icon — the person, the resume document, the CRT monitor, the mailbox — is hand-crafted SVG with gradient fills and metallic highlights. I use unique gradient IDs namespaced per icon set to avoid SVG gradient collisions when multiple icons appear on the same page.

**Web Audio API** provides the sound pack: boot chime, window open/close, icon select, menu click, and shutdown. Audio context initializes lazily on first user interaction to satisfy browser autoplay policies.

## Building a Window Manager in CSS + JS

The heart of the site is `wm.ts` — a ~280-line window manager that handles everything IRIX's 4Dwm did:

- **Z-index stacking**: Each `bringToFront()` increments a global counter. Click a window, it comes to top. Simple but effective.
- **Drag and resize**: `mousedown` on a titlebar starts drag tracking. `mousedown` on the bottom-right resize handle starts resize tracking. Both use document-level `mousemove`/`mouseup` listeners so you can drag outside the window bounds.
- **Virtual desks**: Four desks (Work, Projects, Personal, System) with a minimap panel. Each window is tagged to a desk, and `switchDesk()` toggles visibility.
- **Cascade and tile**: "Cascade All" offsets windows diagonally from (40,40). "Tile All" calculates a grid (1 window = full, 2 = side-by-side, 3 = 2+1, 4+ = grid).

The splash screen effect — where the window title fades in over a purple gradient before revealing content — uses a CSS overlay with `opacity` transitions. No JavaScript animation frames needed.

```typescript
export function bringToFront(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  win.zIndex = ++topZ;
  activeWindowId = id;
  const el = getWindowEl(id);
  if (el) el.style.zIndex = String(win.zIndex);
}
```

## The Details That Matter

**The boot sequence** has three modes: full PROM simulation (scrolling text → logo → progress bar → desktop fade-in), abbreviated (logo + short progress), and instant skip for returning visitors. During the full boot, a screensaver with a floating SGI cube drifts across a starfield — the same screensaver that returns after 90 seconds of inactivity.

**The interactive console** is a real shell emulator. You can `ls`, `cd`, `cat`, `pwd`, and `echo`. `neofetch` shows a fake SGI system spec. `fortune` gives you a random tech quote. `cowsay` works. And if you type `xeyes`, a pair of SVG eyeballs appears on your desktop and follows your cursor — click to dismiss. Type `doom` for a period-accurate IRIX error dialog about insufficient memory.

**Color scheme persistence** uses a cookie read by an inline `<script>` before the CSS loads. This prevents the "flash of wrong theme" problem. Background persistence uses the same pattern.

**The sound pack** includes distinct audio for every interaction: a chime for boot, a soft click for icon selection, a mechanical sound for window open/close. Mute toggle in the toolchest.

## What I Learned

**CSS-only animations are more powerful than you'd think.** The screensaver cube rotation, starfield twinkle, boot fade, window splash — all CSS keyframes and transitions. No `requestAnimationFrame`, no canvas, no animation libraries. The compositor thread handles everything, which means smooth 60fps even on battery.

**SVG gradient ID collisions are real.** When you render multiple SVG icons on the same page, gradient IDs like `fill="url(#gradient)"` need to be unique. I namespace them: `cat-folder` for catalog icons, `fm-folder` for file manager icons, `ss-cube-top` for screensaver. It's tedious but necessary.

**Designing within constraints produces better work.** No npm dependencies. No build step beyond Astro. CSS-only animations. Static deployment. These constraints forced creative solutions — and the result loads in under 500ms on a cold start. Sometimes less is genuinely more.

The whole site is open source. If you're interested in the code, the window manager internals, or how to build metallic SGI gradients in SVG, check out the [repo on GitHub](https://github.com/toddleb/toddlebaron.com).
