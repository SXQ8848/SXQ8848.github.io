# Light/Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable Docusaurus light/dark mode switching, add a new day-time background image, and refactor ~100 hardcoded dark-only styles into a semantic CSS variable system so both modes render correctly.

**Architecture:** Introduce `--sxq-*` CSS variables declared in `:root` (light values) and overridden under `html[data-theme='dark']`. Every hardcoded `rgba()` / hex color across `custom.css`, `index.module.css`, `Root.js`, and 8 Home component CSS modules is replaced with a `var(--sxq-*)` reference. Docusaurus toggles `data-theme` on `<html>` natively — no React state needed.

**Tech Stack:** Docusaurus v2 classic preset, CSS custom properties, CSS Modules, WebP background.

**Spec:** `docs/superpowers/specs/2026-04-11-dark-light-mode-design.md`

---

## Notes for the Implementing Engineer

- This is a **style refactor**, not a feature with business logic. There are no unit tests — verification is **manual visual inspection** at the end of each relevant task.
- **Never** use `useColorMode()` from `@docusaurus/theme-common` to branch React rendering by theme. That causes hydration flicker. All theming must go through CSS variables.
- The background image (`to-the-moon.jpg` / `white_mode.webp`) does not cross-fade on `background-image` swap — only the containing layer's `opacity` transitions. Do not try to add image cross-fade; it's out of scope.
- Commit after each task. Keep commits small. If you discover a hardcoded color you didn't expect, fix it in the task that owns that file — don't leave for later.
- "Verify build" means `npm run build` exits 0 with no CSS warnings referencing your changes.
- "Verify visually" means `npm run start`, open `http://localhost:3000`, and check the specific items listed.

---

## File Map

**Modified (15):**
- `docusaurus.config.js` — enable switch + respect system preference
- `src/theme/Root.js` — replace inline bg-image style with CSS module class + prefetch link
- `src/css/custom.css` — add variable block; migrate all hardcoded colors
- `src/pages/index.module.css` — migrate hero hardcoded colors
- `src/components/Home/mc-theme.module.css` — migrate MC pixel shadows
- `src/components/Home/SectionTitle.module.css` — migrate title color
- `src/components/Home/SkillInventory.module.css` — migrate slot/tooltip colors
- `src/components/Home/ProjectCards.module.css` — migrate card colors
- `src/components/Home/StatsAchievement.module.css` — migrate achievement colors
- `src/components/Home/Timeline.module.css` — migrate timeline colors
- `src/components/Home/RecentUpdates.module.css` — migrate list item colors
- `src/components/Home/SocialLinks.module.css` — migrate social button colors

**Created (1):**
- `src/theme/Root.module.css` — background layer class using variables

**Static assets:** `static/img/white_mode.webp` is already in place. No changes.

**NOT touched:**
- Any `.js` file other than `Root.js`. The inline `style={{}}` attributes in `SkillInventory.js` / `Timeline.js` / `StatsAchievement.js` etc. only set per-item accent colors from data props (`skill.color`, `event.color`). Those are intentional palette coding, not theme-dependent.
- `MusicPlayer`, `RainbowTrail` components.
- Prism code highlight themes (Docusaurus handles swap natively).
- MC cursor image.

---

## Task 1: Enable Docusaurus color mode switch

**Files:**
- Modify: `docusaurus.config.js:29-33`

- [ ] **Step 1: Edit the `colorMode` block**

Replace this block:

```js
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
```

With:

```js
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
```

Rationale: `defaultMode: 'dark'` is the fallback when the browser can't report `prefers-color-scheme`. `respectPrefersColorScheme: true` means first-time visitors get the system preference. Once a user clicks the toggle, their choice is saved to `localStorage` and overrides everything.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0. Warnings from other parts of the project are fine; there must be no error about `colorMode`.

- [ ] **Step 3: Verify visually**

Run: `npm run start` then open `http://localhost:3000`.

Expected: The site looks **broken in light mode** — that's correct, we haven't refactored styles yet. What you must see:
- A new sun/moon toggle icon in the top-right navbar.
- Clicking it switches `<html data-theme="...">` between `light` and `dark` (check DevTools).
- In dark mode, the site looks exactly like before.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add docusaurus.config.js
git commit -m "feat(theme): enable color mode switch and respect system preference"
```

---

## Task 2: Add the CSS variable system

**Files:**
- Modify: `src/css/custom.css:7-25` (replace the existing `:root` and `html[data-theme='dark']` blocks)

- [ ] **Step 1: Replace the existing theme-color blocks**

In `src/css/custom.css`, find the existing blocks at lines 7–25:

```css
/* ---- Theme Colors (dark mode) ---- */
:root {
  --ifm-color-primary: #6ee7b7;
  --ifm-color-primary-dark: #4ae0a6;
  --ifm-color-primary-darker: #38dc9b;
  --ifm-color-primary-darkest: #21c483;
  --ifm-color-primary-light: #92eec8;
  --ifm-color-primary-lighter: #a4f1d3;
  --ifm-color-primary-lightest: #c8f7e4;
  --ifm-code-font-size: 95%;
  --ifm-font-family-base: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

html[data-theme='dark'] {
  --ifm-background-color: transparent;
  --ifm-background-surface-color: rgba(15, 15, 30, 0.5);
  --ifm-font-color-base: #e2e8f0;
  --ifm-heading-color: #f1f5f9;
}
```

Replace them with the expanded version below. Keep the Infima primary variables unchanged (the accent is theme-independent), and add the full `--sxq-*` system on top:

```css
/* ---- Infima primary (shared across both themes) ---- */
:root {
  --ifm-color-primary: #6ee7b7;
  --ifm-color-primary-dark: #4ae0a6;
  --ifm-color-primary-darker: #38dc9b;
  --ifm-color-primary-darkest: #21c483;
  --ifm-color-primary-light: #92eec8;
  --ifm-color-primary-lighter: #a4f1d3;
  --ifm-color-primary-lightest: #c8f7e4;
  --ifm-code-font-size: 95%;
  --ifm-font-family-base: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --ifm-background-color: transparent;

  /* ===== SXQ semantic theme variables — LIGHT MODE values ===== */

  /* Accent (shared) */
  --sxq-accent: #6ee7b7;
  --sxq-accent-2: #3b82f6;

  /* Background image layer */
  --sxq-bg-image: url('/img/white_mode.webp');
  --sxq-bg-opacity: 0.55;

  /* Glass cards */
  --sxq-card-bg: rgba(255, 255, 255, 0.55);
  --sxq-card-bg-strong: rgba(255, 255, 255, 0.75);
  --sxq-card-border: rgba(15, 23, 42, 0.08);
  --sxq-card-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
  --sxq-glass-blur: blur(16px);

  /* Text */
  --sxq-text-primary: #0f172a;
  --sxq-text-body: #1e293b;
  --sxq-text-muted: rgba(15, 23, 42, 0.55);
  --sxq-text-subtle: rgba(15, 23, 42, 0.35);

  /* Navbar / footer */
  --sxq-nav-bg: rgba(255, 255, 255, 0.6);
  --sxq-nav-border: rgba(15, 23, 42, 0.06);

  /* Minecraft pixel-art shadows (used by mc-theme, slot, card, achievement, social) */
  --sxq-mc-inset-light: rgba(255, 255, 255, 0.9);
  --sxq-mc-inset-dark: rgba(15, 23, 42, 0.12);
  --sxq-mc-drop-shadow: rgba(15, 23, 42, 0.15);
  --sxq-mc-drop-shadow-strong: rgba(15, 23, 42, 0.2);

  /* Popups / tooltips (near-opaque) */
  --sxq-tooltip-bg: rgba(255, 255, 255, 0.95);
  --sxq-tooltip-text: rgba(15, 23, 42, 0.7);

  /* Particles, scrollbar, selection */
  --sxq-particle-color: rgba(15, 23, 42, 0.25);
  --sxq-scrollbar-thumb: rgba(110, 231, 183, 0.45);
  --sxq-scrollbar-thumb-hover: rgba(110, 231, 183, 0.65);
  --sxq-selection-bg: rgba(110, 231, 183, 0.35);
  --sxq-selection-text: #0f172a;

  /* Hover tints */
  --sxq-hover-tint: rgba(110, 231, 183, 0.1);

  /* Theme transition */
  --sxq-theme-transition: background-color 0.3s ease,
                          border-color 0.3s ease,
                          color 0.3s ease,
                          box-shadow 0.3s ease;

  /* Infima font color fallback */
  --ifm-font-color-base: var(--sxq-text-body);
  --ifm-heading-color: var(--sxq-text-primary);
  --ifm-background-surface-color: var(--sxq-card-bg);
}

/* ===== DARK MODE overrides ===== */
html[data-theme='dark'] {
  --sxq-bg-image: url('/img/to-the-moon.jpg');
  --sxq-bg-opacity: 0.7;

  --sxq-card-bg: rgba(15, 15, 30, 0.45);
  --sxq-card-bg-strong: rgba(15, 15, 30, 0.6);
  --sxq-card-border: rgba(255, 255, 255, 0.05);
  --sxq-card-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);

  --sxq-text-primary: #f1f5f9;
  --sxq-text-body: #e2e8f0;
  --sxq-text-muted: rgba(255, 255, 255, 0.55);
  --sxq-text-subtle: rgba(255, 255, 255, 0.35);

  --sxq-nav-bg: rgba(10, 10, 25, 0.4);
  --sxq-nav-border: rgba(255, 255, 255, 0.04);

  --sxq-mc-inset-light: rgba(255, 255, 255, 0.15);
  --sxq-mc-inset-dark: rgba(0, 0, 0, 0.3);
  --sxq-mc-drop-shadow: rgba(0, 0, 0, 0.3);
  --sxq-mc-drop-shadow-strong: rgba(0, 0, 0, 0.4);

  --sxq-tooltip-bg: rgba(15, 10, 30, 0.95);
  --sxq-tooltip-text: rgba(255, 255, 255, 0.7);

  --sxq-particle-color: rgba(255, 255, 255, 0.3);
  --sxq-scrollbar-thumb: rgba(110, 231, 183, 0.2);
  --sxq-scrollbar-thumb-hover: rgba(110, 231, 183, 0.35);
  --sxq-selection-bg: rgba(110, 231, 183, 0.3);
  --sxq-selection-text: #fff;

  --sxq-hover-tint: rgba(110, 231, 183, 0.08);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0. The site is still visually broken in light mode (consumers not yet refactored), but this task only adds definitions.

- [ ] **Step 3: Commit**

```bash
git add src/css/custom.css
git commit -m "feat(theme): add --sxq-* CSS variable system for light/dark"
```

---

## Task 3: Migrate `custom.css` consumer rules to variables

**Files:**
- Modify: `src/css/custom.css:27-228` (everything after the variable block)

- [ ] **Step 1: Apply the replacements below**

Each row is a search-and-replace. Be literal with whitespace. There are a few structural changes noted at the bottom.

**Navbar & Footer:**

```css
/* Navbar — was:
   background: rgba(10, 10, 25, 0.4) !important;
   border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
*/
.navbar {
  backdrop-filter: blur(16px);
  background: var(--sxq-nav-bg) !important;
  border-bottom: 1px solid var(--sxq-nav-border) !important;
  box-shadow: 0 4px 20px var(--sxq-mc-drop-shadow) !important;
  transition: var(--sxq-theme-transition);
}

/* Footer — was:
   background: rgba(10, 10, 25, 0.5) !important;
   border-top: 1px solid rgba(255, 255, 255, 0.04) !important;
*/
.footer--dark {
  backdrop-filter: blur(16px);
  background: var(--sxq-nav-bg) !important;
  border-top: 1px solid var(--sxq-nav-border) !important;
  box-shadow: none !important;
}

.footer__copyright {
  color: var(--sxq-text-subtle);
  font-size: 0.85rem;
}
```

**Article card:**

```css
article {
  background: var(--sxq-card-bg);
  backdrop-filter: var(--sxq-glass-blur);
  border: 1px solid var(--sxq-card-border);
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: var(--sxq-card-shadow);
  transition: var(--sxq-theme-transition);
}
```

**Sidebar menu:**

```css
nav.menu {
  background: var(--sxq-card-bg);
  backdrop-filter: var(--sxq-glass-blur);
  border-radius: 12px;
  border: 1px solid var(--sxq-card-border);
  padding: 0.5rem;
  transition: var(--sxq-theme-transition);
}

.menu__link {
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.menu__link:hover {
  background: var(--sxq-hover-tint);
  color: var(--sxq-accent);
}

.menu__link--active {
  background: var(--sxq-hover-tint) !important;
  color: var(--sxq-accent) !important;
  font-weight: 600;
}
```

**Scrollbar:**

```css
::-webkit-scrollbar-thumb {
  background: var(--sxq-scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--sxq-scrollbar-thumb-hover);
}
```

**Links inside main wrapper:**

```css
.main-wrapper a:not(.btnPrimary):not(.btnGhost):not(.navbar__link):not(.menu__link):not(.pagination-nav__link) {
  color: var(--sxq-accent);
  text-decoration: none;
  border-bottom: 1px solid rgba(110, 231, 183, 0.2);
  transition: border-color 0.2s;
}

.main-wrapper a:not(.btnPrimary):not(.btnGhost):not(.navbar__link):not(.menu__link):not(.pagination-nav__link):hover {
  border-bottom-color: var(--sxq-accent);
}
```

**Pagination nav:**

```css
.pagination-nav__link {
  background: var(--sxq-card-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--sxq-card-border);
  border-radius: 12px;
  transition: transform 0.2s, border-color 0.2s, background-color 0.3s ease;
}

.pagination-nav__link:hover {
  transform: translateY(-2px);
  border-color: rgba(110, 231, 183, 0.25);
}
```

**Code block `pre`:**

```css
pre {
  background: var(--sxq-card-bg-strong) !important;
  backdrop-filter: blur(8px);
  border: 1px solid var(--sxq-card-border);
  border-radius: 12px !important;
}
```

**Tables:**

```css
table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--sxq-card-border);
}

th {
  background: var(--sxq-hover-tint) !important;
}

tr:nth-child(even) td {
  background: var(--sxq-hover-tint);
}
```

**Blockquote:**

```css
blockquote {
  border-left: 3px solid var(--sxq-accent);
  background: var(--sxq-hover-tint);
  border-radius: 0 8px 8px 0;
}
```

**Selection — replace the old rule with two explicit ones:**

```css
::selection {
  background: var(--sxq-selection-bg);
  color: var(--sxq-selection-text);
}
```

**Add global theme transition at the bottom of the file:**

```css
/* ---- Theme transition ---- */
html, body, .navbar, .footer--dark, article, nav.menu,
.pagination-nav__link, pre, table, blockquote {
  transition: var(--sxq-theme-transition);
}
```

**Keep unchanged:**
- `.docusaurus-highlight-code-line` (uses accent, fine)
- `#__docusaurus` positioning
- `* { cursor: url(...) }` MC cursor
- `.navbar`, `.main-wrapper`, `.footer`, `body`, `html { background: transparent !important; }` — critical, do not remove
- `.navbar__title` gradient (theme-independent)
- `.navbar__link:hover { color: #6ee7b7 !important; }` — accent, fine
- `.main-wrapper { border: none !important; box-shadow: none !important; }`
- `.theme-doc-markdown, [class*='docMainContainer'] { background: transparent !important; }`
- `.theme-doc-sidebar-container { background: transparent !important; }`

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0 with no new warnings.

- [ ] **Step 3: Verify visually**

Run: `npm run start`.

- In **dark mode**, open `/docs/intro`. Navbar, sidebar, article body, code block, blockquote, table, pagination should look **identical to before** (regression check).
- Click the toggle to **light mode** on `/docs/intro`. The navbar/sidebar/article card should now be semi-transparent white; text should be dark slate. The home page `/` hero card will still look broken — that's the next task.
- Toggle back and forth. Transitions should be smooth, no layout jump.

- [ ] **Step 4: Commit**

```bash
git add src/css/custom.css
git commit -m "refactor(theme): migrate custom.css consumers to CSS variables"
```

---

## Task 4: Migrate `Root.js` background layer

**Files:**
- Create: `src/theme/Root.module.css`
- Modify: `src/theme/Root.js`

- [ ] **Step 1: Create `src/theme/Root.module.css`**

```css
.bgLayer {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: var(--sxq-bg-image);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: var(--sxq-bg-opacity);
  pointer-events: none;
  transition: opacity 0.4s ease;
}
```

- [ ] **Step 2: Rewrite `src/theme/Root.js`**

Full replacement:

```jsx
// src/theme/Root.js
import React from 'react';
import Head from '@docusaurus/Head';
import MusicPlayer from '../components/MusicPlayer';
import RainbowTrail from '../components/RainbowTrail';
import styles from './Root.module.css';

// ==================== 根组件 ====================
export default function Root({ children }) {
  return (
    <>
      {/* Prefetch the other theme's background so toggle is instant */}
      <Head>
        <link rel="prefetch" as="image" href="/img/to-the-moon.jpg" />
        <link rel="prefetch" as="image" href="/img/white_mode.webp" />
      </Head>

      {/* 背景层 — 跟随 data-theme 切换图片与透明度 */}
      <div className={styles.bgLayer} />

      <RainbowTrail />
      <MusicPlayer />
      {children}
    </>
  );
}
```

Note: `@docusaurus/Head` injects into `<head>` without affecting SSR hydration. Both `<link rel="prefetch">` entries fire in parallel; the browser downloads both but only paints the active one.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exits 0. The `@docusaurus/Head` import is already available in the Docusaurus runtime — no package install needed.

- [ ] **Step 4: Verify visually**

Run: `npm run start`, open `/`.

- Dark mode: background is the moon image (identical to before).
- Toggle to light mode: background swaps to `white_mode.webp` (Venti with clouds). Opacity should fade smoothly.
- DevTools → Network → filter "img": both `to-the-moon.jpg` and `white_mode.webp` should appear as `prefetch`.
- Toggle back and forth a few times. No flash of missing image.

- [ ] **Step 5: Commit**

```bash
git add src/theme/Root.js src/theme/Root.module.css
git commit -m "refactor(theme): move background layer to CSS module with theme-aware image"
```

---

## Task 5: Migrate `index.module.css` (homepage hero)

**Files:**
- Modify: `src/pages/index.module.css`

- [ ] **Step 1: Apply the replacements below**

**Particle (line 24):**

```css
.particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: var(--sxq-particle-color);
  animation: float linear infinite;
}
```

**Hero card (lines 46-61):**

```css
.heroCard {
  background: var(--sxq-card-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--sxq-card-border);
  border-radius: 24px;
  padding: 3rem 3.5rem;
  max-width: 540px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow:
    var(--sxq-card-shadow),
    inset 0 1px 0 var(--sxq-mc-inset-light);
  animation: cardIn 0.8s ease-out;
  transition: var(--sxq-theme-transition);
}
```

**Avatar (lines 75-95): leave unchanged.** The accent-colored border and glow are intentionally theme-independent.

**Text styles (lines 97-152):**

```css
.greeting {
  font-size: 1rem;
  color: var(--sxq-text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
```

```css
.subtitle {
  font-size: 1.15rem;
  color: var(--sxq-text-muted);
  min-height: 1.6em;
  margin-bottom: 1rem;
}

.typewriter {
  color: var(--sxq-text-body);
}
```

```css
.description {
  font-size: 0.95rem;
  color: var(--sxq-text-subtle);
  line-height: 1.6;
  margin-bottom: 2rem;
}
```

**Buttons (lines 162-194):**

```css
.btnPrimary {
  padding: 0.65rem 1.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #6ee7b7, #3b82f6);
  color: #0f0f1e !important;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none !important;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(110, 231, 183, 0.25);
}
```

(`.btnPrimary` unchanged — gradient is theme-independent.)

```css
.btnGhost {
  padding: 0.65rem 1.8rem;
  border-radius: 12px;
  background: var(--sxq-card-bg);
  border: 1px solid var(--sxq-card-border);
  color: var(--sxq-text-body) !important;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  transition: transform 0.2s, background 0.2s;
}

.btnGhost:hover {
  transform: translateY(-2px);
  background: var(--sxq-card-bg-strong);
}
```

**Title gradient (lines 107-118): leave unchanged.** Multicolor text gradient works on both backgrounds.

**Cursor blink (lines 136-140):** unchanged (accent color).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Verify visually**

Run: `npm run start`, open `/`.

- **Light mode:** Hero card is a frosted-white glass panel on the Venti background. "SXQ" gradient title is visible. Typewriter subtitle and description are dark slate and readable. Avatar has its green-glow ring. "Explore Docs" primary button is the original gradient. "GitHub" ghost button is a light glass button with dark text.
- **Dark mode:** Identical to before.
- Toggle: smooth.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.module.css
git commit -m "refactor(theme): migrate homepage hero to CSS variables"
```

---

## Task 6: Migrate `mc-theme.module.css` + `SectionTitle.module.css`

**Files:**
- Modify: `src/components/Home/mc-theme.module.css`
- Modify: `src/components/Home/SectionTitle.module.css`

- [ ] **Step 1: Replace `mc-theme.module.css` lines 1-7**

```css
.pixelBorder {
  box-shadow:
    inset 2px 2px 0 var(--sxq-mc-inset-light),
    inset -2px -2px 0 var(--sxq-mc-inset-dark),
    4px 4px 0 var(--sxq-mc-drop-shadow-strong);
  image-rendering: pixelated;
}
```

(The `@keyframes pixelPulse` at lines 22-25 stays unchanged — uses accent rgba which is theme-safe.)

- [ ] **Step 2: Replace `SectionTitle.module.css` lines 1-11**

```css
.sectionTitle {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--sxq-text-primary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: var(--sxq-theme-transition);
}
```

(`.emoji` drop-shadow uses accent, leave unchanged.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Verify visually**

Run: `npm run start`, open `/`, scroll past the hero.

- All section titles ("⛏ Skill Inventory", "🎮 Projects", etc.) are readable in both modes.
- In light mode, titles are dark slate; in dark mode, off-white.

- [ ] **Step 5: Commit**

```bash
git add src/components/Home/mc-theme.module.css src/components/Home/SectionTitle.module.css
git commit -m "refactor(theme): migrate mc-theme and SectionTitle to CSS variables"
```

---

## Task 7: Migrate `SkillInventory.module.css` + `ProjectCards.module.css`

**Files:**
- Modify: `src/components/Home/SkillInventory.module.css`
- Modify: `src/components/Home/ProjectCards.module.css`

- [ ] **Step 1: Replace `SkillInventory.module.css` `.slot` block (lines 8-24)**

```css
.slot {
  position: relative;
  padding: 8px 16px;
  border: 2px solid;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sxq-text-body);
  cursor: default;
  box-shadow:
    inset 1px 1px 0 var(--sxq-mc-inset-light),
    inset -1px -1px 0 var(--sxq-mc-inset-dark),
    3px 3px 0 var(--sxq-mc-drop-shadow);
  transition: transform 0.15s, color 0.3s;
  animation: slotBounce 0.4s ease both;
}
```

**Note:** The `border` color is set per-item via `borderColor: skill.color + '44'` in `SkillInventory.js:47`, and `backgroundColor: skill.color + '18'` line 48. Those are data-driven and stay. We only migrated the text color and the inset pixel shadow.

- [ ] **Step 2: Replace `SkillInventory.module.css` `.tooltip` block (lines 40-56)**

```css
.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--sxq-tooltip-bg);
  border: 2px solid;
  border-radius: 4px;
  padding: 8px 12px;
  min-width: 160px;
  z-index: 100;
  box-shadow:
    inset 1px 1px 0 var(--sxq-mc-inset-light),
    inset -1px -1px 0 var(--sxq-mc-inset-dark),
    4px 4px 0 var(--sxq-mc-drop-shadow-strong);
  pointer-events: none;
}
```

- [ ] **Step 3: Replace `SkillInventory.module.css` `.tooltipDesc` (lines 64-68)**

```css
.tooltipDesc {
  font-size: 0.75rem;
  color: var(--sxq-tooltip-text);
  font-family: 'Courier New', monospace;
}
```

(`.tooltipTitle` color comes from inline `skill.color`, leave JS untouched.)

- [ ] **Step 4: Replace `ProjectCards.module.css` `.card` block (lines 7-19)**

```css
.card {
  position: relative;
  background: var(--sxq-card-bg);
  backdrop-filter: blur(8px);
  border: 2px solid var(--sxq-card-border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.15s ease, background-color 0.3s ease, border-color 0.3s ease;
  box-shadow:
    inset 2px 2px 0 var(--sxq-mc-inset-light),
    inset -2px -2px 0 var(--sxq-mc-inset-dark),
    4px 4px 0 var(--sxq-mc-drop-shadow-strong);
}
```

- [ ] **Step 5: Replace `ProjectCards.module.css` `.cardTitle` and `.cardDesc` (lines 35-47)**

```css
.cardTitle {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--sxq-text-primary);
  margin: 0 0 0.5rem;
  transition: color 0.3s ease;
}

.cardDesc {
  font-size: 0.85rem;
  color: var(--sxq-text-muted);
  line-height: 1.5;
  margin: 0 0 1rem;
  transition: color 0.3s ease;
}
```

(`.tag`, `.cardLink`, `.tags` use accent and stay unchanged.)

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 7: Verify visually**

Run: `npm run start`, open `/`, scroll to Skill Inventory + Projects.

- **Light mode:**
  - Skill slots: text dark, pixel border highlight is subtle white, shadow side dark.
  - Hover on a skill: tooltip popup is a near-opaque white card with dark description text, colored title from the skill's palette.
  - Project cards: semi-transparent white panel, title dark slate, description medium slate, accent green tags.
- **Dark mode:** looks identical to before.

- [ ] **Step 8: Commit**

```bash
git add src/components/Home/SkillInventory.module.css src/components/Home/ProjectCards.module.css
git commit -m "refactor(theme): migrate SkillInventory and ProjectCards to CSS variables"
```

---

## Task 8: Migrate `StatsAchievement.module.css` + `Timeline.module.css`

**Files:**
- Modify: `src/components/Home/StatsAchievement.module.css`
- Modify: `src/components/Home/Timeline.module.css`

- [ ] **Step 1: Replace `StatsAchievement.module.css` `.achievement` (lines 8-22)**

```css
.achievement {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--sxq-card-bg);
  border: 2px solid rgba(110, 231, 183, 0.15);
  border-radius: 6px;
  padding: 12px 20px;
  min-width: 200px;
  box-shadow:
    inset 2px 2px 0 var(--sxq-mc-inset-light),
    inset -2px -2px 0 var(--sxq-mc-inset-dark),
    4px 4px 0 var(--sxq-mc-drop-shadow-strong);
  animation: achievementPop 0.5s ease both;
  transition: var(--sxq-theme-transition);
}
```

(Accent border `rgba(110, 231, 183, 0.15)` stays — accent works both modes.)

- [ ] **Step 2: Replace `StatsAchievement.module.css` `.achievementTitle` and `.achievementLabel` (lines 40-59)**

```css
.achievementTitle {
  font-size: 0.65rem;
  color: var(--sxq-text-subtle);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

.achievementValue {
  font-size: 2rem;
  font-weight: 800;
  font-family: 'Courier New', monospace;
  line-height: 1.1;
}

.achievementLabel {
  font-size: 0.8rem;
  color: var(--sxq-text-muted);
  margin-top: 2px;
}
```

(`.achievementValue` color comes from inline `stat.color`, unchanged.)

- [ ] **Step 3: Replace `Timeline.module.css` `.content` + `.text` (lines 43-65)**

```css
.content {
  display: flex;
  align-items: baseline;
  gap: 12px;
  background: var(--sxq-card-bg);
  border: 1px solid var(--sxq-card-border);
  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 3px 3px 0 var(--sxq-mc-drop-shadow);
  transition: var(--sxq-theme-transition);
}

.year {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: 800;
  flex-shrink: 0;
}

.text {
  font-size: 0.9rem;
  color: var(--sxq-text-muted);
}
```

(`.timeline::before` uses accent rgba, leave unchanged. `.dot` border `rgba(0, 0, 0, 0.3)` — leave; it's a pixel-art outline that works both modes because the dot is highly saturated per-item accent.)

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Verify visually**

Run: `npm run start`, open `/`, scroll to Stats + Timeline.

- **Light mode:**
  - Achievement cards: light glass, "TITLE" label in light slate, the large number keeps its per-stat color, label text medium slate.
  - Timeline entries: light glass cards, year in per-item color, text in medium slate. Vertical green rail still visible.
- **Dark mode:** identical to before.

- [ ] **Step 6: Commit**

```bash
git add src/components/Home/StatsAchievement.module.css src/components/Home/Timeline.module.css
git commit -m "refactor(theme): migrate StatsAchievement and Timeline to CSS variables"
```

---

## Task 9: Migrate `RecentUpdates.module.css` + `SocialLinks.module.css`

**Files:**
- Modify: `src/components/Home/RecentUpdates.module.css`
- Modify: `src/components/Home/SocialLinks.module.css`

- [ ] **Step 1: Replace `RecentUpdates.module.css` `.item` + `.item:hover` (lines 7-30)**

```css
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--sxq-card-bg);
  border: 1px solid var(--sxq-card-border);
  border-radius: 6px;
  text-decoration: none !important;
  border-bottom: none !important;
  transition: background 0.2s, transform 0.15s, border-color 0.3s ease;
  box-shadow: 3px 3px 0 var(--sxq-mc-drop-shadow);
  animation: updateSlide 0.4s ease both;
}

@keyframes updateSlide {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

.item:hover {
  background: var(--sxq-hover-tint);
  transform: translateX(4px);
}
```

- [ ] **Step 2: Replace `RecentUpdates.module.css` `.title` + `.date` (lines 43-55)**

```css
.title {
  flex: 1;
  font-size: 0.9rem;
  color: var(--sxq-text-body) !important;
  font-weight: 500;
}

.date {
  font-size: 0.75rem;
  color: var(--sxq-text-subtle);
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
}
```

(`.category` border and color are set inline via `categoryColor` in `RecentUpdates.js:28` — unchanged.)

- [ ] **Step 3: Replace `SocialLinks.module.css` `.item` + `.item:hover` (lines 12-40)**

```css
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: var(--sxq-card-bg);
  border: 2px solid var(--sxq-card-border);
  border-radius: 6px;
  text-decoration: none !important;
  border-bottom: none !important;
  color: var(--sxq-text-body) !important;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.3s, background-color 0.3s ease, color 0.3s ease;
  box-shadow:
    inset 2px 2px 0 var(--sxq-mc-inset-light),
    inset -2px -2px 0 var(--sxq-mc-inset-dark),
    3px 3px 0 var(--sxq-mc-drop-shadow-strong);
}

.item:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 2px 2px 0 var(--sxq-mc-inset-light),
    inset -2px -2px 0 var(--sxq-mc-inset-dark),
    3px 3px 0 var(--sxq-mc-drop-shadow-strong),
    0 0 16px var(--glow-color, rgba(110, 231, 183, 0.4));
}
```

- [ ] **Step 4: Replace `SocialLinks.module.css` `.popup` (lines 50-65)**

```css
.popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--sxq-tooltip-bg);
  border: 2px solid;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 0.8rem;
  color: var(--sxq-tooltip-text);
  font-family: 'Courier New', monospace;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 4px 4px 0 var(--sxq-mc-drop-shadow-strong);
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 6: Verify visually**

Run: `npm run start`, open `/`, scroll to the bottom (Recent Updates + Social Links).

- **Light mode:**
  - Recent updates list: light glass rows, dark slate titles, muted dates, hover tint greenish.
  - Social links: light pixel-art buttons with dark text, hover shows per-item glow, popups are near-opaque white with dark description.
- **Dark mode:** identical to before.

- [ ] **Step 7: Commit**

```bash
git add src/components/Home/RecentUpdates.module.css src/components/Home/SocialLinks.module.css
git commit -m "refactor(theme): migrate RecentUpdates and SocialLinks to CSS variables"
```

---

## Task 10: Full verification pass

No file changes. This is the checkpoint where you walk the entire spec test plan and fix any issue you find in the file that owns it (then amend or add a small fix commit).

- [ ] **Step 1: Clean build**

```bash
rm -rf build .docusaurus
npm run build
```

Expected: exits 0 with no warnings in files we modified.

- [ ] **Step 2: Start dev server**

```bash
npm run start
```

Open `http://localhost:3000`.

- [ ] **Step 3: Light-mode visual walkthrough**

Set `<html data-theme="light">` via the navbar toggle. Check each of the following and confirm they render correctly:

- [ ] Homepage hero: avatar, gradient title, typewriter, description, "Explore Docs" + "GitHub" buttons
- [ ] Particles floating upward (should now be faint dark dots on blue sky, not invisible)
- [ ] Skill Inventory section title + slot grid + hover tooltip
- [ ] Project Cards grid: title, description, tags, link
- [ ] Stats Achievement bar: icons, title label, value numbers, label text
- [ ] Timeline: rail, dots, year, text
- [ ] Recent Updates list: item rows, category badges, titles, dates, hover
- [ ] Social Links: buttons, hover glow, popup
- [ ] Navbar: title gradient, nav links, toggle button
- [ ] `/docs/intro`: sidebar menu, article card, headings, paragraphs, links, code block, inline code, blockquote, table, pagination nav
- [ ] Footer: copyright text
- [ ] Scrollbar thumb color

- [ ] **Step 4: Dark-mode regression walkthrough**

Toggle to dark. The entire site must look **identical to pre-refactor dark mode**. Any visual regression = a variable value is wrong for dark or a rule was migrated incorrectly. Fix in the file that owns the broken element.

- [ ] **Step 5: Interaction tests**

- [ ] Toggle light ↔ dark 10 times in a row — no flicker, no layout jump, transitions are smooth.
- [ ] DevTools → Application → Local Storage → clear `theme` key → set OS preference to light → reload → site loads in light. Repeat with OS dark.
- [ ] DevTools → Network → filter img → confirm both `to-the-moon.jpg` and `white_mode.webp` are fetched with initiator `(prefetch)`.
- [ ] Refresh page in light mode → site reloads in light (persisted).

- [ ] **Step 6: Mobile viewport**

DevTools → Toggle device toolbar → iPhone 12 Pro.

- [ ] Home page renders correctly in both themes.
- [ ] `/docs/intro` renders correctly in both themes.
- [ ] Navbar toggle is visible and tappable.

- [ ] **Step 7: Contrast check (white_mode.webp hotspots)**

In light mode on the homepage, resize the window so the hero card sits over:
- (a) the deep blue sky region (upper-right of bg)
- (b) Venti's dark hair / hat area
- (c) the white cloud region

In all three positions, text must remain readable. If contrast fails in any region, increase `--sxq-card-bg` opacity in Task 2's variable block (e.g. `0.55 → 0.7`) and rebuild.

- [ ] **Step 8: Final commit (if fixes were made)**

If Steps 3-7 surfaced fixes, commit them:

```bash
git add -u
git commit -m "fix(theme): address issues found in verification pass"
```

If no fixes needed, skip the commit.

- [ ] **Step 9: Final log**

```bash
git log --oneline -12
```

Expected: ~9-10 commits starting with "feat(theme): enable color mode switch" and ending with the verification fixes (if any).

---

## Post-Implementation Notes

- **If a user reports unreadable text in light mode on a specific area you didn't test:** that area's CSS module has a color not yet mapped to a variable. Grep for `rgba(255, 255, 255` and `#e2e8f0` / `#f1f5f9` / `rgba(15, 15, 30` inside `src/` — any hit is a miss from this refactor.
- **If the navbar toggle stops appearing:** `disableSwitch` got reverted in `docusaurus.config.js`.
- **If background doesn't swap:** `Root.module.css` wasn't imported or the `var(--sxq-bg-image)` is shadowed by a more specific rule.
- **Do not** add a `useColorMode()` React branch anywhere. If a future component needs theme-aware rendering, extend the variable system instead.
