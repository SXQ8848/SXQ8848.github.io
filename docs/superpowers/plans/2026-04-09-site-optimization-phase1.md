# SXQ 网站优化第一阶段 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 SXQ 个人 Wiki 首页从单一 Hero 卡片扩展为 7 模块长页滚动布局，MC 游戏风格动效，并重构文档分类。

**Architecture:** 新增 `src/components/Home/` 目录存放首页各模块组件，每个模块一个 `.js` + `.module.css` 文件。共享的滚动动画 hook 和 MC 像素风格 CSS 抽取为公共模块。首页 `index.js` 作为编排层依次渲染各模块。文档分类通过新建目录 + `_category_.json` 实现。

**Tech Stack:** React, CSS Modules, Intersection Observer API, Docusaurus 3.x

---

## File Structure

```
src/
  components/
    Home/
      useScrollReveal.js        ← Intersection Observer hook (共享)
      mc-theme.module.css       ← MC 像素风共享样式（像素边框、脉冲发光等）
      SectionTitle.js           ← Section 标题组件（emoji + 像素风）
      SectionTitle.module.css
      SkillInventory.js         ← 技能物品栏
      SkillInventory.module.css
      ProjectCards.js           ← 项目展示卡片
      ProjectCards.module.css
      StatsAchievement.js       ← 统计成就
      StatsAchievement.module.css
      Timeline.js               ← 个人时间线
      Timeline.module.css
      RecentUpdates.js          ← 最近更新
      RecentUpdates.module.css
      SocialLinks.js            ← 社交链接
      SocialLinks.module.css
  pages/
    index.js                    ← 修改：编排所有模块
    index.module.css            ← 修改：添加长页滚动容器样式
docs/
  intro.md                      ← 修改：重写为知识库导航页
  hardware/
    _category_.json
    schematic-basics.md
  ai/
    _category_.json
    agent-intro.md
  tinkering/
    _category_.json
    build-wiki.md
  learning/
    _category_.json
    getting-started.md
```

---

### Task 1: 共享基础 — useScrollReveal hook + MC 主题样式

**Files:**
- Create: `src/components/Home/useScrollReveal.js`
- Create: `src/components/Home/mc-theme.module.css`
- Create: `src/components/Home/SectionTitle.js`
- Create: `src/components/Home/SectionTitle.module.css`

- [ ] **Step 1: 创建 useScrollReveal hook**

```js
// src/components/Home/useScrollReveal.js
import { useEffect, useRef, useState } from 'react';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}
```

- [ ] **Step 2: 创建 MC 主题共享样式**

```css
/* src/components/Home/mc-theme.module.css */

/* MC 像素边框 — 用 box-shadow 模拟 */
.pixelBorder {
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.15),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3),
    4px 4px 0 rgba(0, 0, 0, 0.4);
  image-rendering: pixelated;
}

/* 像素化渐显动画 */
.pixelRevealHidden {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
  filter: blur(4px);
  transition: opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease;
}

.pixelRevealVisible {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* 像素脉冲发光 */
@keyframes pixelPulse {
  0%, 100% { box-shadow: 0 0 4px rgba(110, 231, 183, 0.4); }
  50% { box-shadow: 0 0 12px rgba(110, 231, 183, 0.8), 0 0 24px rgba(110, 231, 183, 0.3); }
}

.pixelGlow {
  animation: pixelPulse 2s ease-in-out infinite;
}

/* Section 间距 */
.section {
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}
```

- [ ] **Step 3: 创建 SectionTitle 组件**

```js
// src/components/Home/SectionTitle.js
import React from 'react';
import styles from './SectionTitle.module.css';

export default function SectionTitle({ emoji, title }) {
  return (
    <h2 className={styles.sectionTitle}>
      <span className={styles.emoji}>{emoji}</span>
      {title}
    </h2>
  );
}
```

```css
/* src/components/Home/SectionTitle.module.css */
.sectionTitle {
  font-size: 1.4rem;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.emoji {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 6px rgba(110, 231, 183, 0.5));
}
```

- [ ] **Step 4: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 5: Commit**

```bash
git add src/components/Home/useScrollReveal.js src/components/Home/mc-theme.module.css src/components/Home/SectionTitle.js src/components/Home/SectionTitle.module.css
git commit -m "feat: add shared scroll reveal hook and MC theme styles"
```

---

### Task 2: 技能物品栏（Skill Inventory）

**Files:**
- Create: `src/components/Home/SkillInventory.js`
- Create: `src/components/Home/SkillInventory.module.css`

- [ ] **Step 1: 创建 SkillInventory 组件**

```js
// src/components/Home/SkillInventory.js
import React, { useState } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './SkillInventory.module.css';

const SKILLS = [
  { category: 'hardware', color: '#ef4444', items: [
    { name: '原理图设计', desc: '电路原理图绘制与分析' },
    { name: '电路设计', desc: 'PCB 布局与电路调试' },
    { name: '硬件基础原理', desc: '模拟/数字电路基础' },
  ]},
  { category: 'ai', color: '#a78bfa', items: [
    { name: 'AI Agent', desc: '自主智能体构建与应用' },
    { name: 'AI Skill', desc: 'AI 工具链与技巧' },
    { name: 'Prompt Engineering', desc: '提示词工程' },
  ]},
  { category: 'dev', color: '#3b82f6', items: [
    { name: 'React', desc: '前端 UI 框架' },
    { name: 'JavaScript', desc: 'Web 开发核心语言' },
    { name: 'Web 开发', desc: 'HTML/CSS/全栈基础' },
  ]},
  { category: 'tools', color: '#fbbf24', items: [
    { name: 'Git', desc: '版本控制与协作' },
    { name: 'Claude Code', desc: 'AI 辅助编程工具' },
    { name: 'Docusaurus', desc: '文档网站框架' },
  ]},
];

export default function SkillInventory() {
  const [ref, visible] = useScrollReveal();
  const [tooltip, setTooltip] = useState(null);

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="⛏" title="Skill Inventory" />
      <div className={styles.grid}>
        {SKILLS.map((cat) =>
          cat.items.map((skill, i) => (
            <div
              key={skill.name}
              className={styles.slot}
              style={{
                borderColor: cat.color + '44',
                backgroundColor: cat.color + '18',
                animationDelay: visible ? `${i * 80}ms` : '0ms',
              }}
              onMouseEnter={() => setTooltip(skill)}
              onMouseLeave={() => setTooltip(null)}
            >
              <span className={styles.slotName}>{skill.name}</span>
              {tooltip?.name === skill.name && (
                <div className={styles.tooltip} style={{ borderColor: cat.color + '66' }}>
                  <div className={styles.tooltipTitle} style={{ color: cat.color }}>{skill.name}</div>
                  <div className={styles.tooltipDesc}>{skill.desc}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式**

```css
/* src/components/Home/SkillInventory.module.css */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.slot {
  position: relative;
  padding: 8px 16px;
  border: 2px solid;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
  cursor: default;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.1),
    inset -1px -1px 0 rgba(0, 0, 0, 0.2),
    3px 3px 0 rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
  animation: slotBounce 0.4s ease both;
}

@keyframes slotBounce {
  0% { opacity: 0; transform: scale(0.5) translateY(20px); }
  60% { transform: scale(1.08) translateY(-4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.slot:hover {
  transform: translateY(-2px);
}

.slotName {
  white-space: nowrap;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 10, 30, 0.95);
  border: 2px solid;
  border-radius: 4px;
  padding: 8px 12px;
  min-width: 160px;
  z-index: 100;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.08),
    inset -1px -1px 0 rgba(0, 0, 0, 0.2),
    4px 4px 0 rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.tooltipTitle {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.tooltipDesc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Courier New', monospace;
}

@media screen and (max-width: 600px) {
  .slot {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
}
```

- [ ] **Step 3: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/SkillInventory.js src/components/Home/SkillInventory.module.css
git commit -m "feat: add MC-style skill inventory component"
```

---

### Task 3: 项目展示卡片（Project Cards）

**Files:**
- Create: `src/components/Home/ProjectCards.js`
- Create: `src/components/Home/ProjectCards.module.css`

- [ ] **Step 1: 创建 ProjectCards 组件（含 3D tilt + 光泽扫过）**

```js
// src/components/Home/ProjectCards.js
import React, { useRef, useCallback } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './ProjectCards.module.css';

const PROJECTS = [
  {
    name: 'SXQ Wiki',
    desc: '个人知识库网站，记录学习笔记、技术积累与日常折腾',
    tags: ['Docusaurus', 'React', 'GitHub Pages'],
    url: 'https://github.com/SXQ8848/SXQ8848.github.io',
  },
  {
    name: '更多项目',
    desc: '持续探索中...',
    tags: ['Coming Soon'],
    url: null,
  },
];

function TiltCard({ children }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const onMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div ref={cardRef} className={styles.card} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={glowRef} className={styles.cardGlow} />
      {children}
    </div>
  );
}

export default function ProjectCards() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="🏗" title="Projects" />
      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <TiltCard key={p.name}>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{p.name}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              {p.url && (
                <a href={p.url} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
                  查看项目 →
                </a>
              )}
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式**

```css
/* src/components/Home/ProjectCards.module.css */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.card {
  position: relative;
  background: rgba(15, 15, 30, 0.4);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.15s ease;
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.06),
    inset -2px -2px 0 rgba(0, 0, 0, 0.15),
    4px 4px 0 rgba(0, 0, 0, 0.3);
}

.cardGlow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  transition: background 0.2s;
}

.cardBody {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
}

.cardTitle {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.5rem;
}

.cardDesc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
  margin: 0 0 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1rem;
}

.tag {
  font-size: 0.72rem;
  font-family: 'Courier New', monospace;
  padding: 2px 8px;
  border: 1px solid rgba(110, 231, 183, 0.25);
  border-radius: 3px;
  color: #6ee7b7;
  background: rgba(110, 231, 183, 0.08);
}

.cardLink {
  font-size: 0.85rem;
  color: #6ee7b7 !important;
  text-decoration: none !important;
  border-bottom: none !important;
  font-weight: 600;
  transition: opacity 0.2s;
}

.cardLink:hover {
  opacity: 0.8;
}

@media screen and (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/ProjectCards.js src/components/Home/ProjectCards.module.css
git commit -m "feat: add project cards with 3D tilt and glow effect"
```

---

### Task 4: 统计成就（Stats Achievement）

**Files:**
- Create: `src/components/Home/StatsAchievement.js`
- Create: `src/components/Home/StatsAchievement.module.css`

- [ ] **Step 1: 创建 StatsAchievement 组件（含 count-up 弹性动画）**

```js
// src/components/Home/StatsAchievement.js
import React, { useEffect, useState } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './StatsAchievement.module.css';

const STATS = [
  { label: '文档篇数', value: 12, suffix: '', color: '#6ee7b7' },
  { label: '项目数', value: 3, suffix: '', color: '#3b82f6' },
  { label: '折腾次数', value: null, display: '∞', color: '#a78bfa' },
];

function CountUp({ target, visible, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible || target === null) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Overshoot easing: goes past target then settles
      const ease = progress < 0.8
        ? (progress / 0.8) * 1.15
        : 1.15 - 0.15 * ((progress - 0.8) / 0.2);
      const val = Math.round(Math.min(ease, 1.15) * target);
      setCount(Math.min(val, target + Math.round(target * 0.15)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);

  return <span>{count}</span>;
}

export default function StatsAchievement() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="📊" title="Achievement" />
      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.achievement}
            style={{ animationDelay: visible ? `${i * 150}ms` : '0ms' }}
          >
            <div className={styles.achievementIcon}>🏆</div>
            <div className={styles.achievementContent}>
              <div className={styles.achievementTitle}>成就已解锁！</div>
              <div className={styles.achievementValue} style={{ color: stat.color }}>
                {stat.value !== null ? (
                  <><CountUp target={stat.value} visible={visible} />{stat.suffix}</>
                ) : (
                  stat.display
                )}
              </div>
              <div className={styles.achievementLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式**

```css
/* src/components/Home/StatsAchievement.module.css */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: center;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 15, 30, 0.5);
  border: 2px solid rgba(110, 231, 183, 0.15);
  border-radius: 6px;
  padding: 12px 20px;
  min-width: 200px;
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.05),
    inset -2px -2px 0 rgba(0, 0, 0, 0.15),
    4px 4px 0 rgba(0, 0, 0, 0.3);
  animation: achievementPop 0.5s ease both;
}

@keyframes achievementPop {
  0% { opacity: 0; transform: translateX(-20px) scale(0.9); }
  60% { transform: translateX(4px) scale(1.02); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

.achievementIcon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.achievementContent {
  display: flex;
  flex-direction: column;
}

.achievementTitle {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
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
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

@media screen and (max-width: 600px) {
  .grid {
    flex-direction: column;
    align-items: stretch;
  }
  .achievement {
    min-width: auto;
  }
}
```

- [ ] **Step 3: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/StatsAchievement.js src/components/Home/StatsAchievement.module.css
git commit -m "feat: add MC achievement-style stats with count-up animation"
```

---

### Task 5: 个人时间线（Timeline）

**Files:**
- Create: `src/components/Home/Timeline.js`
- Create: `src/components/Home/Timeline.module.css`

- [ ] **Step 1: 创建 Timeline 组件**

```js
// src/components/Home/Timeline.js
import React from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './Timeline.module.css';

const EVENTS = [
  { year: '2026', text: '搭建个人 Wiki 网站', color: '#6ee7b7' },
  { year: '2025', text: '开始学习 AI Agent', color: '#3b82f6' },
  { year: '2024', text: '深入硬件原理学习', color: '#a78bfa' },
  { year: '更早', text: '编程与硬件启蒙', color: '#fbbf24' },
];

function TimelineItem({ event, index, visible }) {
  return (
    <div
      className={styles.item}
      style={{
        animationDelay: visible ? `${index * 200}ms` : '0ms',
      }}
    >
      <div className={styles.dot} style={{ backgroundColor: event.color, boxShadow: `0 0 8px ${event.color}88, 0 0 20px ${event.color}33` }} />
      <div className={styles.content}>
        <span className={styles.year} style={{ color: event.color }}>{event.year}</span>
        <span className={styles.text}>{event.text}</span>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="📜" title="Timeline" />
      <div className={styles.timeline}>
        {EVENTS.map((event, i) => (
          <TimelineItem key={event.year} event={event} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式**

```css
/* src/components/Home/Timeline.module.css */
.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(110, 231, 183, 0.15);
}

.item {
  position: relative;
  margin-bottom: 2rem;
  animation: timelineSlide 0.5s ease both;
}

@keyframes timelineSlide {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.dot {
  position: absolute;
  left: -28px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  animation: pixelPulseDot 2s ease-in-out infinite;
}

@keyframes pixelPulseDot {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.content {
  display: flex;
  align-items: baseline;
  gap: 12px;
  background: rgba(15, 15, 30, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
}

.year {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: 800;
  flex-shrink: 0;
}

.text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

@media screen and (max-width: 600px) {
  .content {
    flex-direction: column;
    gap: 4px;
  }
}
```

- [ ] **Step 3: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/Timeline.js src/components/Home/Timeline.module.css
git commit -m "feat: add timeline component with pixel pulse animation"
```

---

### Task 6: 最近更新（Recent Updates）

**Files:**
- Create: `src/components/Home/RecentUpdates.js`
- Create: `src/components/Home/RecentUpdates.module.css`

- [ ] **Step 1: 创建 RecentUpdates 组件**

```js
// src/components/Home/RecentUpdates.js
import React from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './RecentUpdates.module.css';

const UPDATES = [
  { title: '原理图设计入门', category: '硬件', categoryColor: '#ef4444', date: '2026-04-09', url: '/docs/hardware/schematic-basics' },
  { title: 'AI Agent 入门', category: 'AI', categoryColor: '#a78bfa', date: '2026-04-09', url: '/docs/ai/agent-intro' },
  { title: 'AI 建站记录', category: '折腾', categoryColor: '#fbbf24', date: '2026-04-09', url: '/docs/tinkering/build-wiki' },
  { title: '学习路线', category: '学习', categoryColor: '#3b82f6', date: '2026-04-09', url: '/docs/learning/getting-started' },
];

export default function RecentUpdates() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="📰" title="Recent Updates" />
      <div className={styles.list}>
        {UPDATES.map((item, i) => (
          <a
            key={item.title}
            href={item.url}
            className={styles.item}
            style={{ animationDelay: visible ? `${i * 100}ms` : '0ms' }}
          >
            <span className={styles.category} style={{ color: item.categoryColor, borderColor: item.categoryColor + '44' }}>
              {item.category}
            </span>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.date}>{item.date}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式**

```css
/* src/components/Home/RecentUpdates.module.css */
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(15, 15, 30, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  text-decoration: none !important;
  border-bottom: none !important;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
  animation: updateSlide 0.4s ease both;
}

@keyframes updateSlide {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

.item:hover {
  background: rgba(110, 231, 183, 0.06);
  transform: translateX(4px);
}

.category {
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  padding: 2px 8px;
  border: 1px solid;
  border-radius: 3px;
  flex-shrink: 0;
  text-transform: uppercase;
}

.title {
  flex: 1;
  font-size: 0.9rem;
  color: #e2e8f0 !important;
  font-weight: 500;
}

.date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
}

@media screen and (max-width: 600px) {
  .item {
    flex-wrap: wrap;
    gap: 6px;
  }
  .date {
    width: 100%;
  }
}
```

- [ ] **Step 3: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/RecentUpdates.js src/components/Home/RecentUpdates.module.css
git commit -m "feat: add recent updates list component"
```

---

### Task 7: 社交链接（Social Links）

**Files:**
- Create: `src/components/Home/SocialLinks.js`
- Create: `src/components/Home/SocialLinks.module.css`

- [ ] **Step 1: 创建 SocialLinks 组件**

```js
// src/components/Home/SocialLinks.js
import React, { useState } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './SocialLinks.module.css';

const LINKS = [
  {
    name: 'GitHub',
    icon: '🐙',
    url: 'https://github.com/SXQ8848',
    color: '#e2e8f0',
    action: 'link',
  },
  {
    name: 'QQ',
    icon: '💬',
    info: 'QQ 号：（待补充）',
    color: '#3b82f6',
    action: 'popup',
  },
  {
    name: '微信',
    icon: '📱',
    info: '微信号：（待补充）',
    color: '#22c55e',
    action: 'popup',
  },
];

export default function SocialLinks() {
  const [ref, visible] = useScrollReveal();
  const [popup, setPopup] = useState(null);

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="🔗" title="Find Me" />
      <div className={styles.grid}>
        {LINKS.map((link, i) => (
          <div key={link.name} className={styles.itemWrap}>
            {link.action === 'link' ? (
              <a
                href={link.url}
                className={styles.item}
                style={{ '--glow-color': link.color }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.name}>{link.name}</span>
              </a>
            ) : (
              <button
                className={styles.item}
                style={{ '--glow-color': link.color }}
                onClick={() => setPopup(popup === link.name ? null : link.name)}
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.name}>{link.name}</span>
              </button>
            )}
            {popup === link.name && (
              <div className={styles.popup} style={{ borderColor: link.color + '44' }}>
                {link.info}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式**

```css
/* src/components/Home/SocialLinks.module.css */
.grid {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.itemWrap {
  position: relative;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(15, 15, 30, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  text-decoration: none !important;
  border-bottom: none !important;
  color: #e2e8f0 !important;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.15s, box-shadow 0.3s;
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.05),
    inset -2px -2px 0 rgba(0, 0, 0, 0.15),
    3px 3px 0 rgba(0, 0, 0, 0.3);
}

.item:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.05),
    inset -2px -2px 0 rgba(0, 0, 0, 0.15),
    3px 3px 0 rgba(0, 0, 0, 0.3),
    0 0 16px var(--glow-color, rgba(110, 231, 183, 0.4));
}

.icon {
  font-size: 1.3rem;
}

.name {
  font-family: 'Courier New', monospace;
}

.popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 10, 30, 0.95);
  border: 2px solid;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 3: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/SocialLinks.js src/components/Home/SocialLinks.module.css
git commit -m "feat: add social links with hover glow and popup"
```

---

### Task 8: 编排首页 — 整合所有模块

**Files:**
- Modify: `src/pages/index.js`
- Modify: `src/pages/index.module.css`

- [ ] **Step 1: 更新 index.js — 引入所有模块**

替换 `src/pages/index.js` 全部内容为：

```js
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import SkillInventory from '../components/Home/SkillInventory';
import ProjectCards from '../components/Home/ProjectCards';
import StatsAchievement from '../components/Home/StatsAchievement';
import Timeline from '../components/Home/Timeline';
import RecentUpdates from '../components/Home/RecentUpdates';
import SocialLinks from '../components/Home/SocialLinks';

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
  return (
    <Layout title="Home">
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <Particles />
          <div className={styles.heroCard}>
            <div className={styles.greeting}>Hello, I'm</div>
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
            <div className={styles.actions}>
              <a href="/docs/intro" className={styles.btnPrimary}>
                Explore Docs
              </a>
              <a
                href="https://github.com/SXQ8848"
                className={styles.btnGhost}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Scrolling Sections */}
        <SkillInventory />
        <ProjectCards />
        <StatsAchievement />
        <Timeline />
        <RecentUpdates />
        <SocialLinks />
      </main>
    </Layout>
  );
}
```

- [ ] **Step 2: 更新 index.module.css — 保留 hero 样式，无需大改**

现有 `index.module.css` 已有完整的 hero 样式。只需确认 hero section 不会溢出影响下方模块。在文件末尾追加：

```css
/* ---- Scroll sections spacing ---- */
@media screen and (max-width: 600px) {
  .hero {
    min-height: 80vh;
  }
}
```

- [ ] **Step 3: 更新打字机文案**

已在 Step 1 的 index.js 中完成：将打字机文案从英文改为 `['硬件原理探索者', 'AI 工具玩家', '日常折腾爱好者', 'Building cool things']`。描述文字改为 `一个关于硬件、AI、编程和日常折腾的个人知识库。`

- [ ] **Step 4: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -3`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.js src/pages/index.module.css
git commit -m "feat: integrate all homepage modules into long-scroll layout"
```

---

### Task 9: 文档分类重构

**Files:**
- Delete: `docs/tutorial-basics/` (entire directory)
- Delete: `docs/tutorial-extras/` (entire directory)
- Modify: `docs/intro.md`
- Create: `docs/hardware/_category_.json`
- Create: `docs/hardware/schematic-basics.md`
- Create: `docs/ai/_category_.json`
- Create: `docs/ai/agent-intro.md`
- Create: `docs/tinkering/_category_.json`
- Create: `docs/tinkering/build-wiki.md`
- Create: `docs/learning/_category_.json`
- Create: `docs/learning/getting-started.md`
- Modify: `sidebars.js`

- [ ] **Step 1: 删除默认教程目录**

```bash
rm -rf docs/tutorial-basics docs/tutorial-extras
```

- [ ] **Step 2: 创建 hardware 分类**

`docs/hardware/_category_.json`:
```json
{
  "label": "硬件原理",
  "position": 1,
  "collapsible": true,
  "collapsed": false
}
```

`docs/hardware/schematic-basics.md`:
```markdown
---
title: 原理图设计入门
sidebar_position: 1
---

# 原理图设计入门

> 本文档待补充内容。

## 概述

原理图是电路设计的第一步，它描述了电路的逻辑连接关系。

## 待补充

- 原理图基本符号
- 常用 EDA 工具介绍
- 第一个原理图绘制
```

- [ ] **Step 3: 创建 ai 分类**

`docs/ai/_category_.json`:
```json
{
  "label": "AI 使用技巧",
  "position": 2,
  "collapsible": true,
  "collapsed": false
}
```

`docs/ai/agent-intro.md`:
```markdown
---
title: AI Agent 入门
sidebar_position: 1
---

# AI Agent 入门

> 本文档待补充内容。

## 什么是 AI Agent

AI Agent 是能够自主执行任务的智能体，通过工具调用和推理能力完成复杂操作。

## 待补充

- Agent 基本概念
- 常用 Agent 框架
- 实践案例
```

- [ ] **Step 4: 创建 tinkering 分类**

`docs/tinkering/_category_.json`:
```json
{
  "label": "日常折腾",
  "position": 3,
  "collapsible": true,
  "collapsed": false
}
```

`docs/tinkering/build-wiki.md`:
```markdown
---
title: AI 建站记录
sidebar_position: 1
---

# AI 建站记录

> 记录使用 AI 从零搭建个人 Wiki 网站的全过程。

## 技术栈

- **框架**：Docusaurus 3.x
- **部署**：GitHub Pages
- **AI 工具**：Claude Code

## 待补充

- 建站动机与选型
- 搭建过程
- 遇到的问题与解决
```

- [ ] **Step 5: 创建 learning 分类**

`docs/learning/_category_.json`:
```json
{
  "label": "学习笔记",
  "position": 4,
  "collapsible": true,
  "collapsed": false
}
```

`docs/learning/getting-started.md`:
```markdown
---
title: 学习路线
sidebar_position: 1
---

# 学习路线

> 本文档待补充内容。

## 当前学习方向

- **硬件原理**：原理图设计、电路设计、硬件基础
- **AI 技术**：Agent、Skill、Prompt Engineering
- **Web 开发**：React、Docusaurus、前端基础

## 待补充

- 学习资源整理
- 学习计划
```

- [ ] **Step 6: 重写 intro.md**

```markdown
---
title: 欢迎
slug: /intro
---

# SXQ 知识库

欢迎来到我的个人知识库！这里记录我在学习和探索过程中的笔记与心得。

## 📂 内容分类

### ⚡ [硬件原理](/docs/hardware/schematic-basics)
原理图设计、电路设计、硬件基础原理。

### 🤖 [AI 使用技巧](/docs/ai/agent-intro)
AI Agent、Skill、Prompt Engineering 等 AI 工具使用技巧。

### 🔧 [日常折腾](/docs/tinkering/build-wiki)
AI 建站、旅游记录、美食制作等生活折腾记录。

### 📚 [学习笔记](/docs/learning/getting-started)
学习路线、资源整理、其他学习笔记。
```

- [ ] **Step 7: 更新 sidebars.js — 使用自动生成**

```js
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'autogenerated',
      dirName: '.',
    },
  ],
};

module.exports = sidebars;
```

注意：`autogenerated` 会自动扫描 docs 目录，配合 `_category_.json` 和文档的 `sidebar_position` 生成侧边栏。`intro` 手动置顶。

- [ ] **Step 8: 验证构建通过**

Run: `npx docusaurus build 2>&1 | tail -5`
Expected: `[SUCCESS] Generated static files in "build".` 无 broken link 错误。

- [ ] **Step 9: Commit**

```bash
git add -A docs/ sidebars.js
git commit -m "feat: restructure docs into hardware/ai/tinkering/learning categories"
```

---

### Task 10: 最终验证与推送

- [ ] **Step 1: 完整构建验证**

Run: `npx docusaurus build 2>&1 | tail -5`
Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 2: 本地预览检查**

Run: `npx docusaurus serve --port 3001`
检查：
- 首页 Hero → 技能 → 项目 → 统计 → 时间线 → 最近更新 → 社交链接 全部展示
- 滚动动画触发正常
- 3D 倾斜卡片正常
- 文档侧边栏显示新分类
- 无控制台错误

- [ ] **Step 3: Push 到 GitHub**

```bash
git push origin main
```
