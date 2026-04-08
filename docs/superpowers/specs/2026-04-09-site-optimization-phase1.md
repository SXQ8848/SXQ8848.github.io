# SXQ 网站优化 — 第一阶段设计规格

## 概述

对 SXQ 个人 Wiki 网站进行全面优化，采用平衡推进策略，第一阶段聚焦：首页丰富化 + MC 游戏风格动效 + 文档分类重构。

**设计决策：**
- 布局：长页滚动，每个模块独立展示
- 动效：MC 游戏风格（像素化渐显、物品栏标签、成就解锁式统计）
- 内容方向：学习技术积累 + AI 技巧 + 日常折腾记录

---

## 1. 首页长页滚动布局

首页从当前的单一 Hero 卡片扩展为 7 个模块，从上到下依次为：

### 1.1 Hero 区域（保留现有）
- 保留：打字机效果、浮动粒子、玻璃卡片
- 调整：打字机文案更新为与硬件/AI/折腾相关的短语
- 保留："Explore Docs" 和 "GitHub" 按钮

### 1.2 技能物品栏（Skill Inventory）
- MC 物品栏风格的技能标签展示
- 分类：
  - **硬件**：原理图设计、电路设计、硬件基础原理
  - **AI**：AI Agent、AI Skill、Prompt Engineering
  - **开发**：React、JavaScript、Web 开发
  - **工具**：Git、Claude Code、其他常用工具
- 每个标签带像素风边框，不同分类不同颜色
- 悬停显示"物品描述"（tooltip，类似 MC 物品悬浮信息）
- 动画：stagger 弹跳进入

### 1.3 项目展示卡片（Projects）
- 2-4 个项目卡片，玻璃拟态风格
- 每张卡片包含：项目名、简介、技术栈标签
- 初始项目：SXQ Wiki（本站）、其他后续添加
- 交互：3D tilt 跟随鼠标 + 光泽扫过效果
- 动画：从侧面滑入

### 1.4 统计数字（Stats — 成就解锁风格）
- MC "成就解锁" 通知风格展示
- 数据项：
  - 文档篇数（从 docs 目录动态计算或手动设置）
  - 项目数量
  - 折腾次数（∞ 或趣味数字）
- 数字从 0 滚动到目标值，带 overshoot 弹性效果
- 像素风数字字体

### 1.5 个人时间线（Timeline）
- 垂直时间线，左侧排列
- 节点带像素化脉冲发光效果
- 初始内容（占位，用户后续补充）：
  - 2026 — 搭建个人 Wiki 网站
  - 2025 — 开始学习 AI Agent
  - 更早 — 硬件学习入门
- 动画：像素化渐显，滚动时逐个出现

### 1.6 最近更新（Recent Updates）
- 展示最近更新的 3-5 篇文档
- 每条显示：标题、分类标签、更新时间
- 数据来源：手动维护列表（Docusaurus 无原生最近更新 API，动态读取过于复杂）
- 链接到对应文档页

### 1.7 社交链接（Find Me）
- 图标 + 文字链接
- 项目：GitHub、QQ、微信
- QQ/微信：点击显示二维码或号码（不直接外链）
- 悬停发光效果

---

## 2. 文档分类重构

删除默认的 `tutorial-basics/` 和 `tutorial-extras/` 目录，替换为：

```
docs/
  ├── intro.md              ← 知识库首页（重写）
  ├── hardware/             ← 硬件原理
  │   ├── _category_.json
  │   └── schematic-basics.md   ← 占位：原理图设计入门
  ├── ai/                   ← AI 使用技巧
  │   ├── _category_.json
  │   └── agent-intro.md        ← 占位：AI Agent 入门
  ├── tinkering/            ← 日常折腾
  │   ├── _category_.json
  │   └── build-wiki.md         ← 占位：AI 建站记录
  └── learning/             ← 其他学习笔记
      ├── _category_.json
      └── getting-started.md    ← 占位：学习路线
```

每个分类目录包含 `_category_.json` 配置文件和至少一个占位文档。`intro.md` 重写为知识库导航页，介绍各分类内容。

---

## 3. MC 游戏风格动效

### 3.1 全局效果（已有，保留）
- 钻石剑自定义光标
- 彩虹鼠标拖尾（canvas）
- 背景图 70% 透明度
- 音乐播放器

### 3.2 新增动效
- **滚动进入动画**：所有模块使用 Intersection Observer，进入视口时像素化渐显
- **Section 标题**：带 MC 风格 emoji 前缀（⛏🏗📊📜📰🔗）
- **技能标签**：像素风边框，stagger 弹跳动画，悬停 tooltip
- **项目卡片**：3D tilt 跟随鼠标（纯 CSS/JS，不引入库），光泽扫过
- **统计数字**：成就解锁通知框样式，数字 count-up 带弹性
- **时间线节点**：像素化脉冲发光

### 3.3 性能考量
- 滚动动画使用 Intersection Observer（不监听 scroll 事件）
- 3D tilt 使用 transform（GPU 加速）
- 像素化效果使用 CSS（`image-rendering: pixelated`、box-shadow 模拟像素边框）
- 不引入额外动画库

---

## 4. 技术实现约束

- **不引入新依赖**：所有动效使用原生 CSS + React hooks 实现
- **保持现有结构**：不改变 Root.js、MusicPlayer 等已有组件
- **文件组织**：新模块放在 `src/components/Home/` 下，首页 `index.js` 引用
- **CSS Modules**：所有新组件使用 `.module.css` 保持样式隔离
- **移动端**：基本响应式（后续阶段专门优化）

---

## 5. 后续阶段（本次不实现）

- 第二阶段：文档内容填充 + 音乐播放器升级
- 第三阶段：移动端适配 + 性能/SEO 优化
