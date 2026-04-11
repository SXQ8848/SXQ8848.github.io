# Homepage Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip the homepage down to hero + 3 navigation cards (Learning / Life / About), reorganize docs into two top-level categories, and move SkillInventory + SocialLinks into a new /about page.

**Architecture:** Pure frontend refactor. Reorganize `docs/` via `git mv`, introduce a new `HomeCards` component that replaces 6 Home sections in `index.js`, delete the 4 unused section components, add `src/pages/about.js` that reuses SkillInventory and SocialLinks, and remove the Docs link from the navbar.

**Tech Stack:** Docusaurus v2, React, CSS Modules, existing `--sxq-*` theme variables.

**Spec:** `docs/superpowers/specs/2026-04-12-homepage-simplification-design.md`

---

## Task 1: Reorganize docs/ and remove navbar Docs link

**Files:**
- Move: `docs/ai/_category_.json` → `docs/learning/ai/_category_.json`
- Move: `docs/ai/agent-intro.md` → `docs/learning/ai/agent-intro.md`
- Move: `docs/hardware/_category_.json` → `docs/learning/hardware/_category_.json`
- Move: `docs/hardware/schematic-basics.md` → `docs/learning/hardware/schematic-basics.md`
- Move: `docs/tinkering/build-wiki.md` → `docs/learning/build-wiki.md`
- Delete: `docs/tinkering/_category_.json`
- Delete: `docs/intro.md`
- Modify: `docs/learning/_category_.json` (update label)
- Create: `docs/learning/intro.md`
- Create: `docs/life/_category_.json`
- Create: `docs/life/intro.md`
- Modify: `docusaurus.config.js` (remove Docs navbar item)

- [ ] **Step 1: Create new subdirectories under docs/learning/**

```bash
cd "D:/my_wiki/my_wiki/SXQ8848.github.io-main"
mkdir -p docs/learning/ai docs/learning/hardware docs/life
```

- [ ] **Step 2: Git move ai/ contents into docs/learning/ai/**

```bash
git mv docs/ai/_category_.json docs/learning/ai/_category_.json
git mv docs/ai/agent-intro.md docs/learning/ai/agent-intro.md
```

- [ ] **Step 3: Git move hardware/ contents into docs/learning/hardware/**

```bash
git mv docs/hardware/_category_.json docs/learning/hardware/_category_.json
git mv docs/hardware/schematic-basics.md docs/learning/hardware/schematic-basics.md
```

- [ ] **Step 4: Git move tinkering/build-wiki.md into docs/learning/**

```bash
git mv docs/tinkering/build-wiki.md docs/learning/build-wiki.md
```

- [ ] **Step 5: Delete the now-orphaned tinkering category file and docs/intro.md**

```bash
git rm docs/tinkering/_category_.json docs/intro.md
rmdir docs/ai docs/hardware docs/tinkering 2>/dev/null || true
```

- [ ] **Step 6: Replace `docs/learning/_category_.json` contents**

Write this exact content to `docs/learning/_category_.json`:

```json
{
  "label": "学习 & 积累",
  "position": 1,
  "collapsible": true,
  "collapsed": false,
  "link": {
    "type": "doc",
    "id": "learning/intro"
  }
}
```

- [ ] **Step 7: Create `docs/learning/intro.md`**

Write this exact content:

```markdown
---
title: 学习 & 积累
slug: /learning/intro
---

# 学习 & 积累

记录学习过程中的笔记、教程和心得。

## 分类

### 🤖 [AI 使用技巧](/docs/learning/ai/agent-intro)
AI Agent、Skill、Prompt Engineering 等 AI 工具使用技巧。

### ⚡ [硬件原理](/docs/learning/hardware/schematic-basics)
原理图设计、电路设计、硬件基础原理。

### 🔨 [搭建这个 Wiki](/docs/learning/build-wiki)
用 Docusaurus + AI 搭建个人知识库的过程记录。

### 📚 [入门笔记](/docs/learning/getting-started)
学习路线、资源整理、其他学习笔记。
```

- [ ] **Step 8: Create `docs/life/_category_.json`**

Write this exact content:

```json
{
  "label": "生活 & 折腾",
  "position": 2,
  "collapsible": true,
  "collapsed": false,
  "link": {
    "type": "doc",
    "id": "life/intro"
  }
}
```

- [ ] **Step 9: Create `docs/life/intro.md`**

Write this exact content:

```markdown
---
title: 生活 & 折腾
slug: /life/intro
---

# 生活 & 折腾

日常、DIY、折腾。

> 🚧 内容建设中。
```

- [ ] **Step 10: Update `docusaurus.config.js` to remove Docs navbar link**

In `docusaurus.config.js`, replace this block:

```js
      items: [
        { to: '/docs/intro', label: 'Docs', position: 'left' },
        { href: 'https://github.com/SXQ8848/SXQ8848.github.io', label: 'GitHub', position: 'right' },
      ],
```

with:

```js
      items: [
        { href: 'https://github.com/SXQ8848/SXQ8848.github.io', label: 'GitHub', position: 'right' },
      ],
```

- [ ] **Step 11: Clean build to verify**

```bash
rm -rf build .docusaurus
npm run build
```

Expected: build succeeds. Warnings about `onBrokenMarkdownLinks` deprecation are pre-existing and fine. There should be no "broken link" warnings pointing to `/docs/intro`, `/docs/ai/*`, `/docs/hardware/*`, or `/docs/tinkering/*`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "refactor(docs): reorganize into learning/ + life/ top-level categories"
```

---

## Task 2: Create HomeCards component

**Files:**
- Create: `src/components/Home/HomeCards.js`
- Create: `src/components/Home/HomeCards.module.css`

- [ ] **Step 1: Create `src/components/Home/HomeCards.module.css`**

Write this exact content:

```css
.section {
  padding: 2rem 1.5rem 4rem;
  max-width: 900px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background: var(--sxq-card-bg);
  backdrop-filter: blur(8px);
  border: 2px solid var(--sxq-card-border);
  border-radius: 12px;
  text-decoration: none !important;
  border-bottom: 2px solid var(--sxq-card-border) !important;
  box-shadow:
    inset 2px 2px 0 var(--sxq-mc-inset-light),
    inset -2px -2px 0 var(--sxq-mc-inset-dark),
    4px 4px 0 var(--sxq-mc-drop-shadow-strong);
  transition: var(--sxq-theme-transition), transform 0.2s ease, border-color 0.2s ease;
  animation: cardIn 0.6s ease both;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(110, 231, 183, 0.4) !important;
}

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.15s; }
.card:nth-child(3) { animation-delay: 0.25s; }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cardIcon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  animation: cardIconPulse 2s ease-in-out infinite;
}

@keyframes cardIconPulse {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(110, 231, 183, 0.4)); }
  50%      { filter: drop-shadow(0 0 12px rgba(110, 231, 183, 0.8)); }
}

.cardTitle {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 0.25rem;
  background: linear-gradient(135deg, #6ee7b7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cardSubtitle {
  font-size: 0.9rem;
  color: var(--sxq-text-muted);
  margin: 0 0 0.75rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.cardDesc {
  font-size: 0.85rem;
  color: var(--sxq-text-subtle);
  margin: 0;
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .cardIcon {
    animation: none;
  }
}

@media screen and (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .section {
    padding: 1.5rem 1rem 3rem;
  }
}
```

- [ ] **Step 2: Create `src/components/Home/HomeCards.js`**

Write this exact content:

```jsx
import React from 'react';
import styles from './HomeCards.module.css';

const CARDS = [
  {
    icon: '📖',
    title: '学习 & 积累',
    subtitle: 'Learning & Knowledge',
    desc: '知识 · 笔记 · 教程',
    href: '/docs/learning/intro',
  },
  {
    icon: '☕',
    title: '生活 & 折腾',
    subtitle: 'Life & Tinkering',
    desc: '日常 · DIY · 折腾',
    href: '/docs/life/intro',
  },
  {
    icon: '✨',
    title: '关于',
    subtitle: 'About',
    desc: '关于我和这个站',
    href: '/about',
  },
];

export default function HomeCards() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {CARDS.map((card) => (
          <a key={card.href} href={card.href} className={styles.card}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardSubtitle}>{card.subtitle}</p>
            <p className={styles.cardDesc}>{card.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build to verify no syntax errors**

```bash
npm run build
```

Expected: exits 0. The component compiles even though nothing imports it yet.

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/HomeCards.js src/components/Home/HomeCards.module.css
git commit -m "feat(home): add HomeCards 3-entry navigation component"
```

---

## Task 3: Simplify `src/pages/index.js`

**Files:**
- Modify: `src/pages/index.js`

- [ ] **Step 1: Replace `src/pages/index.js` entirely**

Write this exact content:

```jsx
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';
import HomeCards from '../components/Home/HomeCards';

function Typewriter({ texts, speed = 80, pause = 2000 }) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[idx];
    let timer;
    if (!deleting && charIdx < text.length) {
      timer = setTimeout(() => setCharIdx(charIdx + 1), speed);
    } else if (!deleting && charIdx === text.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }
    setDisplay(text.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return (
    <span className={styles.typewriter}>
      {display}
      <span className={styles.cursor}>|</span>
    </span>
  );
}

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className={styles.particles}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left + '%',
            animationDelay: p.delay + 's',
            animationDuration: p.duration + 's',
            width: p.size + 'px',
            height: p.size + 'px',
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const avatarUrl = useBaseUrl('/img/avatar.jpg');
  return (
    <Layout title="Home">
      <main>
        <section className={styles.hero}>
          <Particles />
          <div className={styles.heroCard}>
            <img
              src={avatarUrl}
              alt="SXQ"
              className={styles.avatar}
              style={{
                display: 'block',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <h1 className={styles.title}>SXQ</h1>
            <div className={styles.subtitle}>
              <Typewriter
                texts={[
                  '硬件原理探索者',
                  'AI 工具玩家',
                  '日常折腾爱好者',
                  'Building cool things',
                ]}
              />
            </div>
            <p className={styles.description}>
              一个关于硬件、AI、编程和日常折腾的个人知识库。
            </p>
          </div>
        </section>

        <HomeCards />
      </main>
    </Layout>
  );
}
```

- [ ] **Step 2: Remove orphaned `.actions`, `.btnPrimary`, `.btnGhost` rules from `src/pages/index.module.css`**

Open `src/pages/index.module.css`. Find the block that starts with `/* ---- Buttons ---- */` and includes `.actions`, `.btnPrimary`, `.btnPrimary:hover`, `.btnGhost`, `.btnGhost:hover`. Delete that entire block (approximately lines 155–196).

The block to delete looks like:

```css
/* ---- Buttons ---- */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

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

.btnPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(110, 231, 183, 0.35);
}

.btnGhost {
  padding: 0.65rem 1.8rem;
  border-radius: 12px;
  background: var(--sxq-card-bg);
  border: 1px solid var(--sxq-card-border);
  color: var(--sxq-text-body) !important;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  transition: transform 0.2s, background 0.2s, color 0.3s ease, border-color 0.3s ease;
}

.btnGhost:hover {
  transform: translateY(-2px);
  background: var(--sxq-card-bg-strong);
}
```

Leave everything else in `index.module.css` (hero, particles, avatar, title, subtitle, typewriter, description, mobile media query) unchanged.

- [ ] **Step 3: Also shrink `.description` margin-bottom since there's nothing below it in the card**

In `src/pages/index.module.css`, find:

```css
.description {
  font-size: 0.95rem;
  color: var(--sxq-text-subtle);
  line-height: 1.6;
  margin-bottom: 2rem;
}
```

Replace with:

```css
.description {
  font-size: 0.95rem;
  color: var(--sxq-text-subtle);
  line-height: 1.6;
  margin-bottom: 0;
}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: exits 0. Browser the site manually with `npm run start` if desired.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.js src/pages/index.module.css
git commit -m "refactor(home): replace 6 sections with HomeCards + remove hero buttons"
```

---

## Task 4: Delete unused Home section components

**Files:**
- Delete: `src/components/Home/ProjectCards.js`
- Delete: `src/components/Home/ProjectCards.module.css`
- Delete: `src/components/Home/StatsAchievement.js`
- Delete: `src/components/Home/StatsAchievement.module.css`
- Delete: `src/components/Home/Timeline.js`
- Delete: `src/components/Home/Timeline.module.css`
- Delete: `src/components/Home/RecentUpdates.js`
- Delete: `src/components/Home/RecentUpdates.module.css`

- [ ] **Step 1: Verify nothing imports these components**

```bash
grep -rn "ProjectCards\|StatsAchievement\|Timeline\|RecentUpdates" src/
```

Expected: no matches. (If any match is found, investigate before deleting.)

- [ ] **Step 2: Delete the 8 files**

```bash
git rm src/components/Home/ProjectCards.js src/components/Home/ProjectCards.module.css
git rm src/components/Home/StatsAchievement.js src/components/Home/StatsAchievement.module.css
git rm src/components/Home/Timeline.js src/components/Home/Timeline.module.css
git rm src/components/Home/RecentUpdates.js src/components/Home/RecentUpdates.module.css
```

- [ ] **Step 3: Clean build to verify**

```bash
rm -rf build .docusaurus
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(home): delete unused section components (Projects/Stats/Timeline/Updates)"
```

---

## Task 5: Create `/about` page

**Files:**
- Create: `src/pages/about.js`
- Create: `src/pages/about.module.css`

- [ ] **Step 1: Create `src/pages/about.module.css`**

Write this exact content:

```css
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.intro {
  text-align: center;
  margin-bottom: 3rem;
}

.avatar {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 3px solid rgba(110, 231, 183, 0.3);
  box-shadow:
    0 0 20px rgba(110, 231, 183, 0.2),
    0 0 40px rgba(110, 231, 183, 0.1);
}

.title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #6ee7b7, #3b82f6, #a78bfa);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: aboutTitleShift 4s ease infinite;
}

@keyframes aboutTitleShift {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

.bio {
  font-size: 0.95rem;
  color: var(--sxq-text-body);
  line-height: 1.7;
  margin: 0;
  transition: var(--sxq-theme-transition);
}
```

- [ ] **Step 2: Create `src/pages/about.js`**

Write this exact content:

```jsx
import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './about.module.css';
import SkillInventory from '../components/Home/SkillInventory';
import SocialLinks from '../components/Home/SocialLinks';

export default function About() {
  const avatarUrl = useBaseUrl('/img/avatar.jpg');
  return (
    <Layout title="About">
      <main className={styles.container}>
        <section className={styles.intro}>
          <img src={avatarUrl} alt="SXQ" className={styles.avatar} />
          <h1 className={styles.title}>关于 SXQ</h1>
          <p className={styles.bio}>
            硬件原理探索者 · AI 工具玩家 · 日常折腾爱好者。
            这里是我的个人知识库，记录学习、折腾和生活。
          </p>
        </section>

        <SkillInventory />
        <SocialLinks />
      </main>
    </Layout>
  );
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: exits 0. The new `/about` route should appear in the build output list.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.js src/pages/about.module.css
git commit -m "feat(pages): add /about page with SkillInventory and SocialLinks"
```

---

## Task 6: Final verification pass

No file changes unless an issue is found. This is the checkpoint where you walk the spec test plan and fix any issue in the file that owns it.

- [ ] **Step 1: Clean build**

```bash
rm -rf build .docusaurus
npm run build
```

Expected: exits 0 with no broken-link warnings referencing `docs/intro`, `docs/ai/*`, `docs/hardware/*`, or `docs/tinkering/*`.

- [ ] **Step 2: Start dev server**

```bash
npm run start
```

Open `http://localhost:3000`.

- [ ] **Step 3: Homepage visual walkthrough (both light and dark)**

- [ ] Hero: avatar, SXQ gradient title, typewriter cycling through 4 texts, description line
- [ ] Two buttons (Explore Docs / GitHub) are **gone**
- [ ] Below hero: 3 cards side-by-side on desktop
- [ ] Each card has: pulsing icon (📖 / ☕ / ✨), gradient title, monospace English subtitle, gray description
- [ ] Hover a card: lifts up 4px, border turns green
- [ ] Click card 1 → navigates to `/docs/learning/intro`
- [ ] Click card 2 → navigates to `/docs/life/intro`
- [ ] Click card 3 → navigates to `/about`

- [ ] **Step 4: Learning docs walkthrough**

- [ ] `/docs/learning/intro` renders with the 4 inline section links
- [ ] Sidebar shows `学习 & 积累` group containing: `intro`, `入门笔记` (getting-started), `build-wiki`, `AI 使用技巧` (ai subcategory), `硬件原理` (hardware subcategory)
- [ ] Clicking each doc in sidebar opens correctly, content renders
- [ ] Prev/next pagination at bottom of each doc works

- [ ] **Step 5: Life docs walkthrough**

- [ ] `/docs/life/intro` renders with "内容建设中" placeholder
- [ ] Sidebar shows `生活 & 折腾` group containing only `intro`

- [ ] **Step 6: /about walkthrough**

- [ ] 80px round avatar at top
- [ ] Multi-color gradient title "关于 SXQ" animating
- [ ] Bio paragraph
- [ ] SkillInventory grid with all existing skill slots, hover tooltip works
- [ ] SocialLinks icon buttons with hover glow and popup

- [ ] **Step 7: Theme toggle**

- [ ] Toggle light ↔ dark on home, /about, and a doc page
- [ ] No layout jumps, all text readable in both modes
- [ ] HomeCards, /about hero, SkillInventory, SocialLinks all themed correctly

- [ ] **Step 8: Mobile viewport**

DevTools → Toggle device toolbar → iPhone 12 Pro.

- [ ] Home: 3 cards stack into a single column below hero
- [ ] /about: avatar + bio + skill inventory + social links stack cleanly
- [ ] Sidebar on docs pages is accessible via hamburger menu

- [ ] **Step 9: Navbar sanity check**

- [ ] Navbar has only "SXQ HOME" title (left) and "GitHub" link (right)
- [ ] No "Docs" link

- [ ] **Step 10: Code cleanup grep**

```bash
grep -rn "ProjectCards\|StatsAchievement\|RecentUpdates" src/ docusaurus.config.js sidebars.js
```

Expected: no matches.

```bash
grep -rn "from '../components/Home/Timeline'" src/
```

Expected: no matches. (Plain word `Timeline` might appear as a CSS `transition: Timeline` or keyframe name — the scoped grep avoids false positives.)

```bash
grep -rn "docs/intro\|docs/ai/\|docs/hardware/\|docs/tinkering/" src/ docusaurus.config.js sidebars.js 2>/dev/null
```

Expected: no matches pointing to old doc routes.

- [ ] **Step 11: Final commit (only if verification surfaced fixes)**

If Steps 3-10 surfaced any fixes:

```bash
git add -u
git commit -m "fix(home): address issues found in verification pass"
```

Otherwise skip this step.

- [ ] **Step 12: Push**

```bash
git push
```
