# 日夜双主题模式 — 设计文档

**日期：** 2026-04-11
**状态：** 已批准，待实现
**作者：** SXQ + Claude（brainstorming session）

## 背景 & 目标

站点当前强制锁定在 dark 模式（`docusaurus.config.js` 中 `disableSwitch: true` + `defaultMode: 'dark'`），且 `custom.css` / `index.module.css` / 11 个 Home 组件的 CSS Module 里大量硬编码了深色背景专用的玻璃拟态样式（`rgba(15,15,30,0.45)` 卡片、`rgba(255,255,255,0.06)` 边框、`rgba(255,255,255,*)` 文字等），共计 100+ 处。

**目标：**

- 启用 Docusaurus 内置的 light/dark 切换，首次访问跟随系统偏好
- 新增一张日间背景图 `white_mode.webp`，与现有的 `to-the-moon.jpg` 形成风格统一的昼/夜氛围
- 通过语义化 CSS 变量系统重构所有硬编码颜色，让两种模式下整站显示正常、文字可读、视觉一致
- 保持现有品牌主色（薄荷绿 `#6ee7b7`）在两模式下统一

**非目标：**

- 不做第三主题（如护眼黄）
- 不做按时段自动切换
- 不为 MusicPlayer 悬浮控件做主题适配
- 不重构 Home 组件的布局或动画
- 不压缩/优化已有的 `to-the-moon.jpg`

## 整体架构

四层改动：

1. **配置层** — `docusaurus.config.js` 启用切换器 + 跟随系统偏好
2. **变量层** — `src/css/custom.css` 顶部新建一套 `--sxq-*` 语义变量；`:root` 为白天值，`html[data-theme='dark']` 覆盖为夜间值
3. **消费层** — 15 个 CSS 文件把硬编码的 `rgba(...)` 批量替换为 `var(--sxq-xxx)`
4. **背景图层** — `src/theme/Root.js` 把内联的背景图抽成 CSS 类，通过 `var(--sxq-bg-image)` 切换两张图

**数据流：**

```
用户点击切换器 → Docusaurus 在 <html> 上设置 data-theme
              → CSS 变量自动重新解析
              → 所有引用 var(--sxq-xxx) 的规则即时更新
              → transition 过渡 0.3s
```

**不动的部分：** React 组件逻辑、Home 组件的结构和动画、MusicPlayer、RainbowTrail、Prism 代码高亮（Docusaurus 已内置双主题）、MC 光标图。

## CSS 变量清单

所有硬编码颜色最终都会映射到以下语义变量，声明于 `src/css/custom.css` 顶部：

```css
:root {
  /* ===== 主色（两模式共用，保持品牌统一） ===== */
  --sxq-accent: #6ee7b7;          /* 薄荷绿 */
  --sxq-accent-2: #3b82f6;        /* 渐变副色 */

  /* ===== 背景图 ===== */
  --sxq-bg-image: url('/img/white_mode.webp');
  --sxq-bg-opacity: 0.85;  /* 最终值：调试中从 0.55 → 0.7 → 0.85，背景图需要更饱满 */

  /* ===== 玻璃卡片 ===== */
  --sxq-card-bg: rgba(255, 255, 255, 0.55);
  --sxq-card-bg-strong: rgba(255, 255, 255, 0.75);
  --sxq-card-border: rgba(15, 23, 42, 0.08);
  --sxq-card-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
  --sxq-glass-blur: blur(16px);

  /* ===== 文字 ===== */
  --sxq-text-primary: #0f172a;
  --sxq-text-body: #1e293b;
  --sxq-text-muted: rgba(15, 23, 42, 0.55);
  --sxq-text-subtle: rgba(15, 23, 42, 0.35);

  /* ===== 导航栏/页脚 =====
     最终方案：navbar 和 footer 改为 background: transparent / border: none / backdrop-filter: none，
     通过 text-shadow 保证文字在背景图上可读。原计划中的 --sxq-nav-bg / --sxq-nav-border 已删除（死变量）。 */

  /* ===== 粒子 & 滚动条 ===== */
  --sxq-particle-color: rgba(15, 23, 42, 0.25);
  --sxq-scrollbar-thumb: rgba(110, 231, 183, 0.35);

  /* ===== 过渡 ===== */
  --sxq-theme-transition: background-color 0.3s ease,
                          border-color 0.3s ease,
                          color 0.3s ease;
}

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

  --sxq-particle-color: rgba(255, 255, 255, 0.3);
  --sxq-scrollbar-thumb: rgba(110, 231, 183, 0.2);
}
```

**设计要点：**

- **主色不随主题变** — 薄荷绿在两种背景下都好看（呼应夜间月光 + 白天 Venti 的绿帽子），保持品牌一致性
- **文字用 slate-900 系 `#0f172a`** — 不用纯黑，白底对比度足够又不刺眼
- **白天边框用深色低透明** `rgba(15,23,42,0.08)` 和浅玻璃卡片搭配出淡描边
- **`--sxq-bg-opacity` 白天降到 0.55** — 白天图整体更亮，过高会让卡片文字糊掉；夜间保留 0.7

## 文件改动清单

**修改：15 个文件 · 新建：1 个文件 · 删除：0**

### 配置与根（2 个）

| 文件 | 改动 |
|---|---|
| `docusaurus.config.js` | `disableSwitch: true → false`；`respectPrefersColorScheme: false → true`；`defaultMode: 'dark'` 保留作为兜底 |
| `src/theme/Root.js` | 背景图内联 style 改成 `className={styles.bgLayer}`；引入 `Root.module.css`；加一行 `<link rel="prefetch">` 预取另一张背景图 |

### 新建（1 个）

**`src/theme/Root.module.css`**

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

### 全局样式（2 个）

**`src/css/custom.css`** — 改动最大

- 顶部插入完整变量声明块（见上节）
- `html[data-theme='dark']` 清空旧硬编码值，改为覆盖变量
- 替换 navbar / footer / article / sidebar / menu / pre / table / blockquote / pagination / scrollbar 等所有规则中的硬编码 `rgba()` 为 `var(--sxq-xxx)`
- `body, html { transition: var(--sxq-theme-transition); }` 添加全局过渡
- `::selection` 分别定义 light/dark 覆盖
- `* { cursor: url('/img/cursor_sword.png') 4 2, auto !important; }` 保留
- 透明背景规则 `background: transparent !important` 保留

**`src/pages/index.module.css`**

- `.heroCard` 的 bg/border/shadow → 变量
- `.greeting` / `.subtitle` / `.typewriter` / `.description` 文字色 → 变量
- `.btnGhost` 的 bg/border/color → 变量
- `.btnPrimary` 渐变和 `.avatar` 光晕保留（来自 accent，两模式皆宜）
- `.particle` 的 `background` → `var(--sxq-particle-color)`
- `.title` 多彩渐变保留不变

### Home 组件 CSS（9 个）

按相同模式逐个替换颜色/背景/边框，不动布局和动画：

| 文件 | 主要替换点 |
|---|---|
| `mc-theme.module.css` | Minecraft 像素按钮 `inset` 阴影两模式分别取值 |
| `SectionTitle.module.css` | 标题文字、装饰色 → `--sxq-text-primary` / `--sxq-accent` |
| `SkillInventory.module.css` | 卡片 bg/border、技能标签背景 |
| `ProjectCards.module.css` | 卡片 bg/border/hover、文字 |
| `StatsAchievement.module.css` | 数字色、卡片背景 |
| `Timeline.module.css` | 时间线轴线、节点、卡片 |
| `RecentUpdates.module.css` | 列表项 bg、日期色 |
| `SocialLinks.module.css` | 社交图标圆形按钮 bg/border/hover |

### 组件 JS 内联样式（最多 3 个）

`ProjectCards.js` / `SkillInventory.js` / `Timeline.js` 若有内联样式中硬编码颜色，抽回对应 CSS module 用变量。

### 静态资源

- `static/img/white_mode.webp` — 已放好（110 KB）
- `static/img/to-the-moon.jpg` — 保留不动

## 边界情况处理

1. **SSR FOUC 闪烁** — Docusaurus 内置同步脚本在 React 水合前设置 `data-theme`，方案全走 CSS 变量，天然规避；**不能**在 React 组件内用 `useColorMode()` 动态决定颜色。
2. **背景图切换闪烁** — 浏览器对 `background-image` URL 无原生过渡。通过 `.bgLayer` 的 `opacity` 渐变缓解，图片硬切但视觉不突兀。
3. **背景图预加载** — `Root.js` 加 `<link rel="prefetch" href="另一张图">`，切换时不白屏。
4. **Prism 代码高亮** — 已内置双主题（`lightCodeTheme` / `darkCodeTheme`），无需改动。
5. **`.footer--dark` 类名** — 保留 `footer.style: 'dark'`，CSS 里把 `.footer--dark` 规则改成变量，类名虽误导但无害。
6. **MC 光标** — 两模式共用，不动。
7. **`::selection` 选中色** — 白天 / 夜间分别定义。
8. **滚动条颜色** — 用 `--sxq-scrollbar-thumb` 变量。
9. **粒子动画** — 用 `--sxq-particle-color` 变量，白天用深色半透明。
10. **RainbowTrail 鼠标拖尾** — 多彩渐变两模式都醒目，不动。

## 测试方式

纯样式改动，无业务逻辑，不写单元测试。手动验证清单：

### 构建验证
1. `npm run build` 成功，无 CSS 警告
2. `npm run start` 本地启动正常

### 视觉验证（每项在白天 + 夜间各一遍）
3. 首页 hero：头像、标题渐变、typewriter、描述、两个按钮显示正常可读
4. 首页六个 section：SkillInventory / ProjectCards / StatsAchievement / Timeline / RecentUpdates / SocialLinks 卡片、文字、悬停正常
5. `/docs/intro`：侧边栏菜单、article 卡片、标题、链接、代码块、引用、表格、分页
6. navbar 切换器按钮可见可点
7. footer 版权文字可读
8. 滚动条颜色匹配主题

### 交互验证
9. 点击切换器：立即切换，过渡流畅，无布局跳动
10. 刷新：记住上次选择
11. 清除 localStorage 首次访问：跟随系统深浅色偏好
12. 修改系统深浅色偏好后刷新：主题跟随
13. 切换时背景图 opacity 渐变，不是硬切

### 对比度验证
14. 白天模式：文字在 `white_mode.webp` 深蓝区域和云朵白色区域都清晰可读
15. 夜间模式：文字清晰可读（回归，不能比改动前差）

### 移动端验证
16. DevTools iPhone/Android 视口，两主题各检查首页和文档页
17. 切换器在移动端 navbar 可见可点
