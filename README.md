# toddlebaron.com

Personal portfolio site with a retro OS theme spanning three computing eras: BBS, SGI IRIX, and NeXTSTEP.

## Tech Stack

- **Framework:** Astro 6 (static output, MPA)
- **3D:** Three.js (desk scene)
- **Audio:** Web Audio API synthesis (no audio files except iTunes previews)
- **Node:** 22+ (pinned in `.nvmrc`)

## Setup

```bash
nvm use           # picks up .nvmrc → Node 22
npm install
npm run dev       # http://localhost:4321
```

## Scripts

| Command           | Action                                    |
| :---------------- | :---------------------------------------- |
| `npm run dev`     | Start dev server at `localhost:4321`      |
| `npm run build`   | Build production site to `./dist/`        |
| `npm run preview` | Preview production build locally          |
| `npm run check`   | Run Astro type/content checks             |

## Deploy

**Host: Cloudflare Pages** (project: `toddlebaron-com`)

```bash
npm run build && wrangler pages deploy dist --project-name toddlebaron-com
```

Production domains: `toddlebaron.com`, `www.toddlebaron.com`

### Rollback

Cloudflare Pages keeps previous deployments. To rollback:

1. Go to Cloudflare Dashboard > Pages > `toddlebaron-com` > Deployments
2. Find the last known-good deployment
3. Click the three-dot menu > "Rollback to this deployment"

Or redeploy a previous commit:

```bash
git checkout <known-good-sha>
npm run build && wrangler pages deploy dist --project-name toddlebaron-com
git checkout main
```

### Smoke Test

After deploy, verify:

1. `https://toddlebaron.com` loads (BBS boot sequence plays)
2. Terminal renders and accepts input
3. Album player loads track previews
4. 3D desk scene renders (Three.js)
5. Rain window animates

## Project Structure

```
src/
├── themes/
│   ├── bbs/          # BBS era (CRT terminal, modem boot, desk scene)
│   ├── sgi-irix/     # SGI IRIX era (window manager, screensavers)
│   └── nextstep/     # NeXTSTEP era (dock, shelf, menu bar)
├── engine/           # Shared modules (audio, wm, time-of-day, weather)
├── layouts/          # Per-era layout wrappers
├── components/       # Shared components (SEOHead, etc.)
├── data/             # Static data (albums, playlist)
└── pages/            # Routes
```
