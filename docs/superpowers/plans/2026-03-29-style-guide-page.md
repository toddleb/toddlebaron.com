# Style Guide Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an era-neutral `/style-guide` developer reference page documenting design tokens, typography, and component specimens across all three eras (BBS, SGI IRIX, NeXTSTEP).

**Architecture:** Single static Astro page using a new minimal `Neutral.astro` layout (dark background, no era chrome). All content is build-time HTML/CSS — no client-side JS islands. Color swatches use inline `background-color` with hardcoded hex values extracted from the theme CSS files.

**Tech Stack:** Astro 6 (static), CSS custom properties, no additional dependencies.

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/layouts/Neutral.astro` | Era-neutral layout shell: dark bg, SEOHead, max-width container |
| Create | `src/pages/style-guide.astro` | The style guide page with all 5 sections |

---

### Task 1: Create the Neutral Layout

**Files:**
- Create: `src/layouts/Neutral.astro`

- [ ] **Step 1: Create `src/layouts/Neutral.astro`**

This layout provides a dark, era-neutral shell that imports SEOHead and renders slotted content in a centered container.

```astro
---
// src/layouts/Neutral.astro — Era-neutral layout for dev/reference pages
import SEOHead from "../components/SEOHead.astro";
export interface Props {
  title?: string;
  description?: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <SEOHead title={title} description={description} />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #1a1a1e;
        color: #e0e0e0;
        font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.6;
        min-width: 1440px;
      }
      .neutral-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 48px 32px;
      }
    </style>
  </head>
  <body>
    <div class="neutral-container">
      <slot />
    </div>
  </body>
</html>
```

- [ ] **Step 2: Verify build passes**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run build`
Expected: Build completes with no errors (layout isn't used by any page yet, so no new output).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Neutral.astro
git commit -m "feat: add era-neutral layout for dev/reference pages"
```

---

### Task 2: Create Style Guide Page — Era Overview Section

**Files:**
- Create: `src/pages/style-guide.astro`

- [ ] **Step 1: Create `src/pages/style-guide.astro` with page header and era overview**

```astro
---
// src/pages/style-guide.astro — Design system reference
import Neutral from "../layouts/Neutral.astro";
---

<Neutral title="Style Guide" description="Design system reference for toddlebaron.com">

<style>
  /* ── Page header ── */
  .sg-breadcrumb {
    font-size: 13px;
    color: #888;
    margin-bottom: 8px;
    font-family: "Cascadia Mono", "IBM Plex Mono", monospace;
  }
  .sg-breadcrumb a { color: #6aafee; text-decoration: none; }
  .sg-breadcrumb a:hover { text-decoration: underline; }
  h1.sg-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 32px;
  }

  /* ── Section headings ── */
  h2.sg-section {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #888;
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
    margin: 48px 0 24px;
  }

  /* ── Era overview grid ── */
  .era-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .era-card {
    background: #252528;
    border: 1px solid #333;
    padding: 20px;
  }
  .era-card h3 {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
  }
  .era-card dt {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888;
    margin-top: 10px;
  }
  .era-card dd {
    margin: 2px 0 0;
    font-size: 14px;
    color: #ccc;
  }
  .era-card .era-font-sample {
    margin-top: 8px;
    padding: 8px 10px;
    background: #1a1a1e;
    border: 1px solid #333;
    font-size: 14px;
  }

  /* ── Color swatches ── */
  .sg-palette-label {
    font-size: 14px;
    font-weight: 600;
    color: #ccc;
    margin: 24px 0 12px;
  }
  .sg-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .sg-swatch {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #252528;
    border: 1px solid #333;
    padding: 6px 10px;
    min-width: 260px;
  }
  .sg-swatch-color {
    width: 28px;
    height: 28px;
    border: 1px solid #555;
    flex-shrink: 0;
  }
  .sg-swatch-name {
    font-family: "Cascadia Mono", "IBM Plex Mono", monospace;
    font-size: 12px;
    color: #aaa;
  }
  .sg-swatch-hex {
    font-family: "Cascadia Mono", "IBM Plex Mono", monospace;
    font-size: 12px;
    color: #666;
    margin-left: auto;
  }

  /* ── SGI scheme rows ── */
  .sg-scheme-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .sg-scheme-name {
    width: 80px;
    font-family: "Cascadia Mono", "IBM Plex Mono", monospace;
    font-size: 12px;
    color: #aaa;
    flex-shrink: 0;
  }
  .sg-scheme-chip {
    width: 40px;
    height: 24px;
    border: 1px solid #555;
  }

  /* ── Typography specimens ── */
  .sg-type-specimen {
    background: #252528;
    border: 1px solid #333;
    padding: 20px;
    margin-bottom: 16px;
  }
  .sg-type-specimen h3 {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 12px;
  }
  .sg-type-meta {
    font-family: "Cascadia Mono", "IBM Plex Mono", monospace;
    font-size: 11px;
    color: #666;
    margin-bottom: 8px;
  }

  /* ── Component specimens ── */
  .sg-specimen {
    background: #252528;
    border: 1px solid #333;
    padding: 20px;
    margin-bottom: 16px;
  }
  .sg-specimen h3 {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 16px;
  }
  .sg-specimen-box {
    padding: 16px;
    border: 1px solid #444;
  }

  /* ── Engine modules ── */
  .sg-modules {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .sg-module {
    background: #252528;
    border: 1px solid #333;
    padding: 12px 16px;
  }
  .sg-module-name {
    font-family: "Cascadia Mono", "IBM Plex Mono", monospace;
    font-size: 13px;
    color: #6aafee;
  }
  .sg-module-desc {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
  }
</style>

<!-- Header -->
<div class="sg-breadcrumb">
  <a href="/">toddlebaron.com</a> / style guide
</div>
<h1 class="sg-title">Design System Reference</h1>

<!-- ═══ 1. Era Overview ═══ -->
<h2 class="sg-section">Era Overview</h2>
<div class="era-grid">
  <div class="era-card">
    <h3>BBS</h3>
    <dl>
      <dt>Aesthetic</dt>
      <dd>CRT terminal, purple/orange palette</dd>
      <dt>Route</dt>
      <dd><code>/</code></dd>
      <dt>Font</dt>
      <dd>Cascadia Mono</dd>
    </dl>
    <div class="era-font-sample" style="font-family: 'Cascadia Mono', 'IBM Plex Mono', monospace; color: #B366FF; background: #0a0a0a;">
      T-NET BBS · Est. 1984
    </div>
  </div>
  <div class="era-card">
    <h3>SGI IRIX</h3>
    <dl>
      <dt>Aesthetic</dt>
      <dd>Window manager, Indigo workstation</dd>
      <dt>Route</dt>
      <dd><code>/sgi</code></dd>
      <dt>Font</dt>
      <dd>Helvetica Neue</dd>
    </dl>
    <div class="era-font-sample" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; background: #E8E8E8;">
      Silicon Graphics · IRIX 6.5
    </div>
  </div>
  <div class="era-card">
    <h3>NeXTSTEP</h3>
    <dl>
      <dt>Aesthetic</dt>
      <dd>Sharp geometry, dark chrome</dd>
      <dt>Route</dt>
      <dd><code>/nextstep</code></dd>
      <dt>Font</dt>
      <dd>Inter</dd>
    </dl>
    <div class="era-font-sample" style="font-family: 'Inter', 'Helvetica Neue', sans-serif; color: #e0e0e0; background: #2a2a2e;">
      NeXTSTEP · Interface Builder
    </div>
  </div>
</div>

<!-- ═══ 2. Color Tokens ═══ -->
<h2 class="sg-section">Color Tokens</h2>

<!-- BBS palette -->
<div class="sg-palette-label">BBS — Brand</div>
<div class="sg-swatches">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#4A1A7A"></div><span class="sg-swatch-name">--tf-purple-deep</span><span class="sg-swatch-hex">#4A1A7A</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#7B2FBE"></div><span class="sg-swatch-name">--tf-purple</span><span class="sg-swatch-hex">#7B2FBE</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#B366FF"></div><span class="sg-swatch-name">--tf-purple-bright</span><span class="sg-swatch-hex">#B366FF</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FF6B00"></div><span class="sg-swatch-name">--tf-orange</span><span class="sg-swatch-hex">#FF6B00</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FF9933"></div><span class="sg-swatch-name">--tf-orange-bright</span><span class="sg-swatch-hex">#FF9933</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FFAA00"></div><span class="sg-swatch-name">--tf-gold</span><span class="sg-swatch-hex">#FFAA00</span></div>
</div>

<div class="sg-palette-label">BBS — ANSI Colors</div>
<div class="sg-swatches">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#000000"></div><span class="sg-swatch-name">--ansi-black</span><span class="sg-swatch-hex">#000000</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#CC3333"></div><span class="sg-swatch-name">--ansi-red</span><span class="sg-swatch-hex">#CC3333</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#33AA66"></div><span class="sg-swatch-name">--ansi-green</span><span class="sg-swatch-hex">#33AA66</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FFAA00"></div><span class="sg-swatch-name">--ansi-yellow</span><span class="sg-swatch-hex">#FFAA00</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#5555CC"></div><span class="sg-swatch-name">--ansi-blue</span><span class="sg-swatch-hex">#5555CC</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#7B2FBE"></div><span class="sg-swatch-name">--ansi-magenta</span><span class="sg-swatch-hex">#7B2FBE</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#B366FF"></div><span class="sg-swatch-name">--ansi-cyan</span><span class="sg-swatch-hex">#B366FF</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#BBBBBB"></div><span class="sg-swatch-name">--ansi-white</span><span class="sg-swatch-hex">#BBBBBB</span></div>
</div>
<div class="sg-swatches" style="margin-top: 8px;">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#666666"></div><span class="sg-swatch-name">--ansi-bright-black</span><span class="sg-swatch-hex">#666666</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FF5555"></div><span class="sg-swatch-name">--ansi-bright-red</span><span class="sg-swatch-hex">#FF5555</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#55DD88"></div><span class="sg-swatch-name">--ansi-bright-green</span><span class="sg-swatch-hex">#55DD88</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FF9933"></div><span class="sg-swatch-name">--ansi-bright-yellow</span><span class="sg-swatch-hex">#FF9933</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#7788FF"></div><span class="sg-swatch-name">--ansi-bright-blue</span><span class="sg-swatch-hex">#7788FF</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#B366FF"></div><span class="sg-swatch-name">--ansi-bright-magenta</span><span class="sg-swatch-hex">#B366FF</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#DD99FF"></div><span class="sg-swatch-name">--ansi-bright-cyan</span><span class="sg-swatch-hex">#DD99FF</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#FFFFFF"></div><span class="sg-swatch-name">--ansi-bright-white</span><span class="sg-swatch-hex">#FFFFFF</span></div>
</div>

<!-- SGI IRIX palette -->
<div class="sg-palette-label">SGI IRIX — Default (Indigo)</div>
<div class="sg-swatches">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#6B3FA0"></div><span class="sg-swatch-name">--sgi-primary</span><span class="sg-swatch-hex">#6B3FA0</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#3A8A7A"></div><span class="sg-swatch-name">--sgi-secondary</span><span class="sg-swatch-hex">#3A8A7A</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#465080"></div><span class="sg-swatch-name">--sgi-sky-dark</span><span class="sg-swatch-hex">#465080</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#8CA9D2"></div><span class="sg-swatch-name">--sgi-sky-light</span><span class="sg-swatch-hex">#8CA9D2</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#C0C0C0"></div><span class="sg-swatch-name">--sgi-widget</span><span class="sg-swatch-hex">#C0C0C0</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#E0E0E0"></div><span class="sg-swatch-name">--sgi-widget-light</span><span class="sg-swatch-hex">#E0E0E0</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#888888"></div><span class="sg-swatch-name">--sgi-widget-dark</span><span class="sg-swatch-hex">#888888</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#E8E8E8"></div><span class="sg-swatch-name">--sgi-surface</span><span class="sg-swatch-hex">#E8E8E8</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#F5F5F0"></div><span class="sg-swatch-name">--sgi-content-bg</span><span class="sg-swatch-hex">#F5F5F0</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#222222"></div><span class="sg-swatch-name">--sgi-text</span><span class="sg-swatch-hex">#222222</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#666666"></div><span class="sg-swatch-name">--sgi-text-muted</span><span class="sg-swatch-hex">#666666</span></div>
</div>

<div class="sg-palette-label">SGI IRIX — Color Schemes</div>
<div class="sg-scheme-row"><span class="sg-scheme-name">indigo</span><div class="sg-scheme-chip" style="background:#6B3FA0"></div><div class="sg-scheme-chip" style="background:#3A8A7A"></div><div class="sg-scheme-chip" style="background:#C0C0C0"></div><div class="sg-scheme-chip" style="background:#E8E8E8"></div></div>
<div class="sg-scheme-row"><span class="sg-scheme-name">desert</span><div class="sg-scheme-chip" style="background:#B8860B"></div><div class="sg-scheme-chip" style="background:#8B4513"></div><div class="sg-scheme-chip" style="background:#D4C4A0"></div><div class="sg-scheme-chip" style="background:#F0E8D8"></div></div>
<div class="sg-scheme-row"><span class="sg-scheme-name">ocean</span><div class="sg-scheme-chip" style="background:#1565C0"></div><div class="sg-scheme-chip" style="background:#00ACC1"></div><div class="sg-scheme-chip" style="background:#A0B8C8"></div><div class="sg-scheme-chip" style="background:#E0E8F0"></div></div>
<div class="sg-scheme-row"><span class="sg-scheme-name">midnight</span><div class="sg-scheme-chip" style="background:#311B92"></div><div class="sg-scheme-chip" style="background:#1A237E"></div><div class="sg-scheme-chip" style="background:#808098"></div><div class="sg-scheme-chip" style="background:#D0D0D8"></div></div>
<div class="sg-scheme-row"><span class="sg-scheme-name">rosewood</span><div class="sg-scheme-chip" style="background:#8B1A1A"></div><div class="sg-scheme-chip" style="background:#6D3A3A"></div><div class="sg-scheme-chip" style="background:#C0A0A0"></div><div class="sg-scheme-chip" style="background:#F0E0E0"></div></div>
<div class="sg-scheme-row"><span class="sg-scheme-name">slate</span><div class="sg-scheme-chip" style="background:#455A64"></div><div class="sg-scheme-chip" style="background:#607D8B"></div><div class="sg-scheme-chip" style="background:#B0BEC5"></div><div class="sg-scheme-chip" style="background:#ECEFF1"></div></div>

<!-- NeXTSTEP palette -->
<div class="sg-palette-label">NeXTSTEP — Chrome & Surface</div>
<div class="sg-swatches">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#4a4a50"></div><span class="sg-swatch-name">--nx-chrome-hi</span><span class="sg-swatch-hex">#4a4a50</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#3a3a40"></div><span class="sg-swatch-name">--nx-chrome-mid</span><span class="sg-swatch-hex">#3a3a40</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#2a2a2e"></div><span class="sg-swatch-name">--nx-chrome-lo</span><span class="sg-swatch-hex">#2a2a2e</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#333338"></div><span class="sg-swatch-name">--nx-surface</span><span class="sg-swatch-hex">#333338</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#555555"></div><span class="sg-swatch-name">--nx-border</span><span class="sg-swatch-hex">#555555</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#1a1a1e"></div><span class="sg-swatch-name">--nx-border-dark</span><span class="sg-swatch-hex">#1a1a1e</span></div>
</div>

<div class="sg-palette-label">NeXTSTEP — Accents</div>
<div class="sg-swatches">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#6aafee"></div><span class="sg-swatch-name">--nx-accent-blue</span><span class="sg-swatch-hex">#6aafee</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#6aee6a"></div><span class="sg-swatch-name">--nx-accent-green</span><span class="sg-swatch-hex">#6aee6a</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#ccaa44"></div><span class="sg-swatch-name">--nx-accent-amber</span><span class="sg-swatch-hex">#ccaa44</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#cc4444"></div><span class="sg-swatch-name">--nx-accent-red</span><span class="sg-swatch-hex">#cc4444</span></div>
</div>

<div class="sg-palette-label">NeXTSTEP — Text</div>
<div class="sg-swatches">
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#e0e0e0"></div><span class="sg-swatch-name">--nx-text-primary</span><span class="sg-swatch-hex">#e0e0e0</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#999999"></div><span class="sg-swatch-name">--nx-text-secondary</span><span class="sg-swatch-hex">#999999</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#666666"></div><span class="sg-swatch-name">--nx-text-muted</span><span class="sg-swatch-hex">#666666</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#1a1a1e"></div><span class="sg-swatch-name">--nx-terminal-bg</span><span class="sg-swatch-hex">#1a1a1e</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#00aa00"></div><span class="sg-swatch-name">--nx-terminal-green</span><span class="sg-swatch-hex">#00aa00</span></div>
  <div class="sg-swatch"><div class="sg-swatch-color" style="background:#6aafee"></div><span class="sg-swatch-name">--nx-terminal-prompt</span><span class="sg-swatch-hex">#6aafee</span></div>
</div>

<!-- ═══ 3. Typography ═══ -->
<h2 class="sg-section">Typography</h2>

<div class="sg-type-specimen">
  <h3>BBS — Cascadia Mono</h3>
  <div class="sg-type-meta">font-family: "Cascadia Mono", "IBM Plex Mono", "Consolas", "Courier New", monospace · 20px default</div>
  <div style="font-family: 'Cascadia Mono', 'IBM Plex Mono', monospace; background: #0a0a0a; padding: 16px; color: #B366FF;">
    <div style="font-size: 20px;">The quick brown fox jumps over the lazy dog (20px body)</div>
    <div style="font-size: 16px; color: #FF9933; margin-top: 8px;">ANSI bright yellow — status text (16px)</div>
    <div style="font-size: 14px; color: #666; margin-top: 8px;">Muted terminal text (14px)</div>
  </div>
</div>

<div class="sg-type-specimen">
  <h3>SGI IRIX — Helvetica Neue</h3>
  <div class="sg-type-meta">font-family: "Helvetica Neue", Helvetica, Arial, sans-serif</div>
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #E8E8E8; padding: 16px; color: #222;">
    <div style="font-size: 14px; font-weight: bold; background: linear-gradient(180deg, #6B3FA0, #4A6FA0, #3A8A7A); color: #fff; padding: 4px 8px; margin-bottom: 8px;">Window Title Bar (14px bold)</div>
    <div style="font-size: 14px;">Body text in content window (14px)</div>
    <div style="font-size: 12px; color: #666; margin-top: 8px;">Muted secondary text (12px)</div>
  </div>
</div>

<div class="sg-type-specimen">
  <h3>NeXTSTEP — Inter</h3>
  <div class="sg-type-meta">font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif</div>
  <div style="font-family: 'Inter', 'Helvetica Neue', sans-serif; background: #2a2a2e; padding: 16px; color: #e0e0e0;">
    <div style="font-size: 20px; font-weight: 700; border-bottom: 1px solid #555; padding-bottom: 6px;">Heading 1 (20px bold)</div>
    <div style="font-size: 16px; font-weight: 600; color: #e0e0e0; margin-top: 12px;">Heading 2 (16px semibold)</div>
    <div style="font-size: 14px; line-height: 1.55; margin-top: 8px;">Body text in window content area (14px)</div>
    <div style="font-size: 14px; color: #999; margin-top: 8px;">Secondary text (14px)</div>
  </div>
</div>

<!-- ═══ 4. Component Specimens ═══ -->
<h2 class="sg-section">Component Specimens</h2>

<div class="sg-specimen">
  <h3>BBS — Terminal & Menu</h3>
  <div class="sg-specimen-box" style="background: #0a0a0a; font-family: 'Cascadia Mono', 'IBM Plex Mono', monospace; font-size: 16px; line-height: 1.5;">
    <div style="color: #FF9933;">╔══════════════════════════════════════╗</div>
    <div style="color: #FF9933;">║ <span style="color: #B366FF;">T-NET BBS</span> · Main Menu              ║</div>
    <div style="color: #FF9933;">╚══════════════════════════════════════╝</div>
    <div style="margin-top: 8px;">
      <span style="color: #FFAA00;">[A]</span> <span style="color: #BBBBBB;">About the SysOp</span>
    </div>
    <div>
      <span style="color: #FFAA00;">[R]</span> <span style="color: #BBBBBB;">Resume / Experience</span>
    </div>
    <div>
      <span style="color: #FFAA00;">[P]</span> <span style="color: #BBBBBB;">Projects & Code</span>
    </div>
    <div style="margin-top: 12px; color: #666;">
      <span style="color: #B366FF;">14400</span> BAUD · ANSI · V.42bis
    </div>
  </div>
</div>

<div class="sg-specimen">
  <h3>SGI IRIX — Window Chrome</h3>
  <div class="sg-specimen-box" style="background: #C0C0C0; font-family: 'Helvetica Neue', Helvetica, sans-serif; border: 2px outset #E0E0E0; padding: 0;">
    <!-- Title bar -->
    <div style="background: linear-gradient(90deg, #6B3FA0, #4A6FA0, #3A8A7A); padding: 4px 8px; display: flex; align-items: center; gap: 6px;">
      <div style="width: 14px; height: 14px; background: #E0E0E0; border: 1px outset #fff;"></div>
      <span style="color: #fff; font-size: 13px; font-weight: bold; flex: 1;">About — /home/todd</span>
      <div style="width: 14px; height: 14px; background: #E0E0E0; border: 1px outset #fff;"></div>
    </div>
    <!-- Content -->
    <div style="padding: 12px; background: #F5F5F0; border: 2px inset #888; margin: 4px; font-size: 14px; color: #222;">
      Window content area with inset border styling.
    </div>
  </div>
</div>

<div class="sg-specimen">
  <h3>NeXTSTEP — Window Chrome</h3>
  <div class="sg-specimen-box" style="background: #333338; font-family: 'Inter', sans-serif; border: 1px solid #555; padding: 0;">
    <!-- Title bar -->
    <div style="background: linear-gradient(180deg, #4a4a50, #3a3a40); padding: 6px 10px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #1a1a1e;">
      <div style="width: 12px; height: 12px; background: #cc4444; border: 1px solid #1a1a1e;"></div>
      <div style="width: 12px; height: 12px; background: #ccaa44; border: 1px solid #1a1a1e;"></div>
      <div style="width: 12px; height: 12px; background: #4a8a4a; border: 1px solid #1a1a1e;"></div>
      <span style="color: #e0e0e0; font-size: 13px; font-weight: 600; flex: 1; text-align: center;">Terminal</span>
    </div>
    <!-- Content -->
    <div style="padding: 12px; font-size: 14px; color: #e0e0e0;">
      <div style="font-family: monospace; color: #00aa00;">
        <span style="color: #6aafee;">todd@next:~$</span> ls -la
      </div>
    </div>
  </div>
</div>

<!-- ═══ 5. Engine Modules ═══ -->
<h2 class="sg-section">Shared Engine Modules</h2>

<div class="sg-modules">
  <div class="sg-module">
    <div class="sg-module-name">audio.ts</div>
    <div class="sg-module-desc">Web Audio API synth engine — all sounds via oscillators/noise</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">modem-audio.ts</div>
    <div class="sg-module-desc">Modem handshake sound synthesis</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">time-of-day.ts</div>
    <div class="sg-module-desc">Sets body[data-time] attribute, checks every 60s</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">ambient.ts</div>
    <div class="sg-module-desc">Background ambiance per era (rain, wind, hum)</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">typing-sounds.ts</div>
    <div class="sg-module-desc">Keyboard clicks, menu beeps, HDD chatter</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">weather.ts</div>
    <div class="sg-module-desc">Rain intensity and weather audio system</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">seasonal.ts</div>
    <div class="sg-module-desc">Seasonal decorations (snow, etc.)</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">wm.ts</div>
    <div class="sg-module-desc">Window manager — drag, resize, focus, shade</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">desktop.ts</div>
    <div class="sg-module-desc">Desktop icon grid and selection</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">shell.ts</div>
    <div class="sg-module-desc">Terminal shell emulator with command parsing</div>
  </div>
  <div class="sg-module">
    <div class="sg-module-name">era-switcher.ts</div>
    <div class="sg-module-desc">Navigation between BBS / SGI / NeXTSTEP eras</div>
  </div>
</div>

</Neutral>
```

- [ ] **Step 2: Verify build passes and page renders**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run build`
Expected: Build completes with 14 pages (was 13), including `/style-guide/index.html`.

- [ ] **Step 3: Verify page looks correct**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run preview`
Visit: `http://localhost:4321/style-guide`
Expected: Dark page with era overview cards, color swatches, typography specimens, component specimens, and engine module grid.

- [ ] **Step 4: Commit**

```bash
git add src/pages/style-guide.astro
git commit -m "feat: add /style-guide developer reference page"
```

---

### Task 3: Production Hardening Commit

This task commits all the production hardening changes that were applied during the brainstorming session.

**Files (already modified):**
- `.nvmrc` (new)
- `package.json` (modified — check script, new deps)
- `package-lock.json` (modified)
- `README.md` (replaced)
- `src/components/SEOHead.astro` (canonical + og:url fix, viewport lock)
- `src/layouts/NXDesktop.astro` (viewport lock)
- `src/themes/bbs/theme.css` (min-width: 1440px)
- `src/themes/sgi-irix/theme.css` (min-width: 1440px)
- `src/themes/nextstep/theme.css` (min-width: 1440px)

- [ ] **Step 1: Stage and commit production hardening files**

```bash
git add .nvmrc package.json package-lock.json README.md \
  src/components/SEOHead.astro src/layouts/NXDesktop.astro \
  src/themes/bbs/theme.css src/themes/sgi-irix/theme.css \
  src/themes/nextstep/theme.css
git commit -m "fix: production hardening — .nvmrc, check script, README, SEO, viewport lock"
```

- [ ] **Step 2: Verify clean build**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npm run build`
Expected: Build completes successfully.
