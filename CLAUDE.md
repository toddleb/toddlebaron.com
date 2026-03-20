# toddlebaron.com

Personal portfolio site — retro OS theme with three eras: BBS, SGI IRIX, NeXTSTEP.

## Tech Stack

- **Framework:** Astro 6 (static output, MPA)
- **Node version:** 22+ required (`nvm use 22`)
- **Build:** `npm run build` → outputs to `dist/`
- **Dev:** `npm run dev`

## Deployment

**Host: Cloudflare Pages** (project: `toddlebaron-com`)

Deploy command:
```bash
npm run build && wrangler pages deploy dist --project-name toddlebaron-com
```

- No git provider configured — deploys are manual via `wrangler`
- Production domains: `toddlebaron.com`, `www.toddlebaron.com`, `toddlebaron-com.pages.dev`
- Always build before deploying (Astro static output to `dist/`)

**DO NOT deploy via Vercel.** The Vercel GitHub integration may still be connected but toddlebaron.com is served from Cloudflare Pages. Vercel deploys to `toddlebaron.vercel.app` are unused.

## Project Structure

- `src/themes/bbs/` — BBS era (CRT terminal, modem boot, desk scene)
- `src/themes/sgi-irix/` — SGI IRIX era (window manager, screensavers, toolchest)
- `src/themes/nextstep/` — NeXTSTEP era (dock, shelf, menu bar)
- `src/engine/` — Shared engine modules (audio, wm, time-of-day, ambient, typing sounds, weather, seasonal)
- `src/layouts/` — Per-era layout wrappers (BBS.astro, Desktop.astro, NXDesktop.astro)
- `src/data/` — Static data (album tracks, playlist)
- `scripts/` — Dev-time utilities (iTunes preview fetcher)

## Key Patterns

- **Web Audio API synthesis** — all sounds via oscillators/noise, no audio files except iTunes 30-sec previews
- **Custom event bus** — `audio:mute-changed`, `bbs:content-rendered`, `wm:drag-start/end`, `wm:window-shaded/unshaded`, `boot:complete`
- **Time-of-day** — `body[data-time]` attribute drives CSS; JS checks every 60s
- **MPA architecture** — no client-side routing; each page is a full reload, so "leaks" from event listeners are non-issues
- **`prefers-reduced-motion`** — all animations have reduced-motion overrides
