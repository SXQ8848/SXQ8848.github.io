# Music Player Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the monolithic MusicPlayer in `Root.js` into modular components with 网易云 + 二次元 aesthetic, SVG icons, vinyl disc animation, 3-line lyrics, audio visualizer, and localStorage persistence.

**Architecture:** Incremental extraction — move one piece at a time from `Root.js` into `src/components/MusicPlayer/`, verify the site works after each task. State stays centralized in the main `MusicPlayer/index.js`; child components are pure presentational via props.

**Tech Stack:** React 18, CSS Modules, Web Audio API (for visualizer), Docusaurus 3.9

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/MusicPlayer/playlist-data.js` | Create | PLAYLIST array with song metadata + lyrics |
| `src/components/MusicPlayer/styles.module.css` | Create | All styles, CSS variables, keyframes |
| `src/components/MusicPlayer/VinylDisc.js` | Create | Rotating vinyl disc + tone arm |
| `src/components/MusicPlayer/PlayerControls.js` | Create | SVG transport/mode/lyrics buttons |
| `src/components/MusicPlayer/ProgressBar.js` | Create | Seekable progress bar with drag |
| `src/components/MusicPlayer/VolumeBar.js` | Create | Volume slider with speaker icon |
| `src/components/MusicPlayer/Playlist.js` | Create | Dropdown song list panel |
| `src/components/MusicPlayer/Lyrics.js` | Create | 3-line fixed-position lyrics |
| `src/components/MusicPlayer/Visualizer.js` | Create | Web Audio API frequency bars |
| `src/components/MusicPlayer/index.js` | Create | Main component: state, audio, drag, layout |
| `src/theme/Root.js` | Modify | Remove old MusicPlayer, import new one |

---

### Task 1: Create playlist-data.js

**Files:**
- Create: `src/components/MusicPlayer/playlist-data.js`

- [ ] **Step 1: Create the directory and data file**

```js
// src/components/MusicPlayer/playlist-data.js
export const PLAYLIST = [
  {
    title: '枫',
    artist: '周杰伦',
    src: '/music/feng.mp3',
    cover: '/music/cover_feng.jpg',
    lyrics: [
      { time: 18.96,  text: '乌云在我们心里搁下一块阴影' },
      { time: 26.02,  text: '我聆听沉寂已久的心情' },
      { time: 31.95,  text: '清晰透明就像美丽的风景' },
      { time: 39.79,  text: '总在回忆里才看的清' },
      { time: 47.15,  text: '被伤透的心能不能够继续爱我' },
      { time: 54.23,  text: '我用力牵起没温度的双手' },
      { time: 60.75,  text: '过往温柔已经被时间上锁' },
      { time: 68.07,  text: '只剩挥散不去的难过' },
      { time: 75.6,   text: '缓缓飘落的枫叶像思念' },
      { time: 80.91,  text: '我点燃烛火温暖岁末的秋天' },
      { time: 88.02,  text: '极光掠夺天边' },
      { time: 91.54,  text: '北风掠过想你的容颜' },
      { time: 95.98,  text: '我把爱烧成了落叶' },
      { time: 99.58,  text: '却换不回熟悉的那张脸' },
      { time: 104.06, text: '缓缓飘落的枫叶像思念' },
      { time: 109.42, text: '为何挽回要赶在冬天来之前' },
      { time: 116.84, text: '爱你穿越时间' },
      { time: 120.01, text: '两行来自秋末的眼泪' },
      { time: 124.48, text: '让爱渗透了地面' },
      { time: 128.12, text: '我要的只是你在我身边' },
      { time: 146.84, text: '被伤透的心能不能够继续爱我' },
      { time: 153.83, text: '我用力牵起没温度的双手' },
      { time: 160.16, text: '过往温柔已经被时间上锁' },
      { time: 167.77, text: '只剩挥散不去的难过' },
      { time: 174.77, text: '在山腰间飘逸的红雨随着北风凋零' },
      { time: 185.1,  text: '我轻轻摇曳风铃' },
      { time: 189.12, text: '想唤醒被遗弃的爱情' },
      { time: 195.78, text: '雪花已铺满了地' },
      { time: 199.39, text: '深怕窗外枫叶已结成冰' },
      { time: 203.81, text: '缓缓飘落的枫叶像思念' },
      { time: 209.14, text: '我点燃烛火温暖岁末的秋天' },
      { time: 216.21, text: '极光掠夺天边' },
      { time: 219.71, text: '北风掠过想你的容颜' },
      { time: 224.16, text: '我把爱烧成了落叶' },
      { time: 227.89, text: '却换不回熟悉的那张脸' },
      { time: 232.24, text: '缓缓飘落的枫叶像思念' },
      { time: 237.6,  text: '为何挽回要赶在冬天来之前' },
      { time: 244.71, text: '爱你穿越时间' },
      { time: 248.22, text: '两行来自秋末的眼泪' },
      { time: 258.64, text: '让爱渗透了地面' },
      { time: 262.19, text: '我要的只是你在我身边' },
    ],
  },
  {
    title: '园游会',
    artist: '周杰伦',
    src: '/music/youyuanhui.mp3',
    cover: '/music/cover_youyuanhui.jpg',
    lyrics: [
      { time: 32.35,  text: '琥珀色黄昏像糖在很美的远方' },
      { time: 36.42,  text: '你的脸没有化妆我却疯狂爱上' },
      { time: 40.33,  text: '思念跟影子在傍晚一起被拉长' },
      { time: 44.24,  text: '我手中那张入场券陪我数羊' },
      { time: 48.05,  text: '薄荷色草地芬芳像风没有形状' },
      { time: 52.11,  text: '我却能够牢记你的气质跟脸庞' },
      { time: 55.97,  text: '冷空气跟琉璃在清晨很有透明感' },
      { time: 59.98,  text: '像我的喜欢 被你看穿' },
      { time: 63.48,  text: '摊位上一朵艳阳' },
      { time: 66.48,  text: '我悄悄出现你身旁' },
      { time: 71.2,   text: '你慌乱的模样' },
      { time: 73.13,  text: '我微笑安静欣赏' },
      { time: 78.06,  text: '我顶着大太阳' },
      { time: 80.14,  text: '只想为你撑伞' },
      { time: 82.12,  text: '你靠在我肩膀' },
      { time: 84.0,   text: '深呼吸怕遗忘' },
      { time: 86.03,  text: '因为捞鱼的蠢游戏我们开始交谈' },
      { time: 89.94,  text: '多希望话题不断园游会永不打烊' },
      { time: 93.85,  text: '气球在我手上' },
      { time: 95.88,  text: '我牵着你瞎逛' },
      { time: 97.81,  text: '有话想对你讲' },
      { time: 99.74,  text: '你眼睛却装忙' },
      { time: 101.73, text: '鸡蛋糕跟你嘴角果酱我都想要尝' },
      { time: 105.68, text: '园游会影片在播放' },
      { time: 107.92, text: '这个世界约好一起逛' },
      { time: 126.88, text: '琥珀色黄昏像糖在很美的远方' },
      { time: 130.84, text: '你的脸没有化妆我却疯狂爱上' },
      { time: 134.75, text: '思念跟影子在傍晚一起被拉长' },
      { time: 138.67, text: '我手中那张入场券陪我数羊' },
      { time: 142.58, text: '薄荷色草地芬芳像风没有形状' },
      { time: 146.54, text: '我却能够牢记你的气质跟脸庞' },
      { time: 150.45, text: '冷空气跟琉璃在清晨很有透明感' },
      { time: 154.36, text: '像我的喜欢 被你看穿' },
      { time: 157.98, text: '摊位上一朵艳阳' },
      { time: 160.98, text: '我悄悄出现你身旁' },
      { time: 165.6,  text: '你慌乱的模样' },
      { time: 167.58, text: '我微笑安静欣赏' },
      { time: 172.56, text: '我顶着大太阳' },
      { time: 174.54, text: '只想为你撑伞' },
      { time: 176.52, text: '你靠在我肩膀' },
      { time: 178.45, text: '深呼吸怕遗忘' },
      { time: 180.38, text: '因为捞鱼的蠢游戏我们开始交谈' },
      { time: 184.34, text: '多希望话题不断园游会永不打烊' },
      { time: 188.25, text: '气球在我手上' },
      { time: 190.24, text: '我牵着你瞎逛' },
      { time: 192.22, text: '有话想对你讲' },
      { time: 194.15, text: '你眼睛却装忙' },
      { time: 196.18, text: '鸡蛋糕跟你嘴角果酱我都想要尝' },
      { time: 200.14, text: '园游会影片在播放' },
      { time: 202.33, text: '这个世界约好一起逛' },
    ],
  },
];
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`
Expected: Build completes successfully (new file is not imported yet, so no impact)

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/playlist-data.js
git commit -m "feat(player): extract playlist data to separate module"
```

---

### Task 2: Create styles.module.css

**Files:**
- Create: `src/components/MusicPlayer/styles.module.css`

- [ ] **Step 1: Create the stylesheet**

```css
/* src/components/MusicPlayer/styles.module.css */

/* ---- CSS Variables ---- */
.player {
  --player-primary: #ff6b81;
  --player-primary-dark: #ff4757;
  --player-bg: rgba(25, 20, 40, 0.97);
  --player-border: rgba(255, 100, 120, 0.25);
  --player-text: #fff;
  --player-text-sub: rgba(255, 180, 190, 0.6);
  --player-text-dim: rgba(255, 180, 190, 0.35);
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 9999;
  user-select: none;
  cursor: grab;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ---- Keyframes ---- */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes lyricFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes barBounce {
  0% { height: 4px; }
  100% { height: 18px; }
}

/* ---- Vinyl Disc ---- */
.vinylWrap {
  position: relative;
  flex-shrink: 0;
}

.vinylGlow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 100, 120, 0.2) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
}

.vinyl {
  border-radius: 50%;
  background: conic-gradient(from 0deg, #1a1a1a 0%, #2a2a2a 25%, #1a1a1a 50%, #2a2a2a 75%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 8s linear infinite;
  animation-play-state: paused;
  border: 1.5px solid rgba(255, 100, 120, 0.2);
  box-shadow: 0 0 24px rgba(255, 100, 120, 0.25);
}

.vinylPlaying {
  animation-play-state: running;
}

.vinylCenter {
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b81, #ff4757);
  border: 2px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.vinylCoverImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.toneArm {
  position: absolute;
  width: 3px;
  background: linear-gradient(to bottom, #ffc0cb, #999);
  border-radius: 2px;
  transform-origin: top center;
  transition: transform 0.4s ease;
}

.toneArmDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc0cb, #ff6b81);
  position: absolute;
  top: -4px;
  left: -2.5px;
  box-shadow: 0 0 6px rgba(255, 100, 120, 0.4);
}

/* ---- Expanded Panel ---- */
.panel {
  width: 250px;
  background: linear-gradient(160deg, rgba(25, 20, 40, 0.97), rgba(35, 25, 50, 0.97));
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--player-border);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: visible;
}

.nowPlaying {
  position: absolute;
  top: -1px;
  right: 16px;
  background: linear-gradient(135deg, #ff6b81, #ff4757);
  color: #fff;
  font-size: 8px;
  padding: 2px 8px 3px;
  border-radius: 0 0 6px 6px;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  margin-top: 6px;
}

.songInfo {
  flex: 1;
  overflow: hidden;
}

.songTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--player-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
}

.songArtist {
  font-size: 11px;
  color: var(--player-text-sub);
  margin-top: 2px;
}

/* ---- Icon Buttons (shared) ---- */
.iconBtn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 100, 120, 0.08);
  border: 1px solid rgba(255, 100, 120, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.iconBtn:hover {
  background: rgba(255, 100, 120, 0.18);
}

/* ---- Control Buttons ---- */
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 4px;
}

.controlBtn {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(255, 100, 120, 0.06);
  border: 1px solid rgba(255, 100, 120, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.controlBtn:hover {
  background: rgba(255, 100, 120, 0.15);
}

.playBtn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ff6b81, #ff4757);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 4px 16px rgba(255, 71, 87, 0.45), 0 0 0 3px rgba(255, 100, 120, 0.15);
  transition: transform 0.15s, box-shadow 0.15s;
}

.playBtn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(255, 71, 87, 0.55), 0 0 0 4px rgba(255, 100, 120, 0.2);
}

/* ---- Progress Bar ---- */
.progressWrap {
  margin: 8px 0 4px;
  cursor: pointer;
}

.progressTrack {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  position: relative;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b81, #ff4757);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(255, 100, 120, 0.3);
  transition: width 0.15s linear;
}

.progressThumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: -4px;
  box-shadow: 0 0 8px rgba(255, 100, 120, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 2px solid #ff6b81;
  transform: translateX(-50%);
  transition: transform 0.1s;
}

.progressThumb:hover {
  transform: translateX(-50%) scale(1.2);
}

.timeRow {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--player-text-dim);
  margin-bottom: 12px;
  font-variant-numeric: tabular-nums;
}

/* ---- Volume Bar ---- */
.volumeWrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px 6px;
  border-top: 1px solid rgba(255, 100, 120, 0.08);
}

.volumeTrack {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}

.volumeFill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b81, #ff4757);
  border-radius: 3px;
  box-shadow: 0 0 6px rgba(255, 100, 120, 0.25);
}

.volumeThumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: -3.5px;
  box-shadow: 0 0 6px rgba(255, 100, 120, 0.4);
  border: 1.5px solid #ff6b81;
  transform: translateX(-50%);
}

/* ---- Playlist Dropdown ---- */
.playlistDrop {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 8px;
  width: 220px;
  background: rgba(20, 20, 35, 0.97);
  border: 1px solid rgba(255, 100, 120, 0.2);
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.playlistTitle {
  padding: 4px 12px;
  font-size: 10px;
  color: var(--player-text-dim);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 4px;
}

.playlistItem {
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.playlistItem:hover {
  background: rgba(255, 100, 120, 0.08);
}

.playlistItemActive {
  background: rgba(255, 100, 120, 0.1);
  border-left: 2px solid var(--player-primary);
}

.playlistItemIcon {
  font-size: 11px;
  color: #666;
}

.playlistItemIconActive {
  color: var(--player-primary);
}

.playlistItemTitle {
  font-size: 12px;
  color: #aaa;
}

.playlistItemTitleActive {
  color: var(--player-text);
}

.playlistItemArtist {
  font-size: 10px;
  color: var(--player-text-dim);
}

/* ---- Lyrics ---- */
.lyricsWrap {
  position: fixed;
  top: 50vh;
  transform: translateY(-50%);
  z-index: 9998;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.lyricLine {
  font-size: 12px;
  color: var(--player-text-dim);
  transition: all 0.35s ease;
  white-space: nowrap;
}

.lyricLineCurrent {
  font-size: 15px;
  color: var(--player-primary);
  font-weight: 600;
  text-shadow: 0 0 12px rgba(255, 100, 120, 0.5);
  animation: lyricFade 0.35s ease;
}

/* ---- Visualizer ---- */
.visualizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  height: 22px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 100, 120, 0.08);
}

.vizBar {
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(to top, #ff6b81, #ff8fa3);
  transition: height 0.05s linear;
  min-height: 2px;
}

/* ---- Collapse button ---- */
.collapseBtn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 180, 190, 0.4);
  font-size: 13px;
  padding: 0;
  transition: background 0.2s;
}

.collapseBtn:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* ---- Hamburger (playlist toggle) ---- */
.hamburgerLine {
  background: rgba(255, 180, 190, 0.6);
  border-radius: 1px;
  height: 1.5px;
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`
Expected: Build completes (CSS not imported yet)

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/styles.module.css
git commit -m "feat(player): add CSS Modules stylesheet with 二次元 theme"
```

---

### Task 3: Create VinylDisc component

**Files:**
- Create: `src/components/MusicPlayer/VinylDisc.js`

- [ ] **Step 1: Create the component**

```js
// src/components/MusicPlayer/VinylDisc.js
import React from 'react';
import styles from './styles.module.css';

export default function VinylDisc({ cover, playing, size, onClick }) {
  const centerSize = Math.round(size * 0.5);
  const armHeight = Math.round(size * 0.36);

  return (
    <div
      className={styles.vinylWrap}
      style={{ width: size, height: size }}
      onClick={onClick}
      title={onClick ? '展开播放器' : undefined}
    >
      {/* Breathing glow */}
      <div className={styles.vinylGlow} />

      {/* Disc */}
      <div
        className={`${styles.vinyl} ${playing ? styles.vinylPlaying : ''}`}
        style={{ width: size, height: size }}
      >
        <div className={styles.vinylCenter} style={{ width: centerSize, height: centerSize }}>
          {cover ? (
            <img src={cover} alt="cover" className={styles.vinylCoverImg} />
          ) : (
            <span style={{ fontSize: Math.round(size * 0.2), color: '#fff' }}>♪</span>
          )}
        </div>
      </div>

      {/* Tone arm */}
      <div
        className={styles.toneArm}
        style={{
          height: armHeight,
          top: -Math.round(size * 0.08),
          right: -Math.round(size * 0.14),
          transform: playing ? 'rotate(25deg)' : 'rotate(0deg)',
        }}
      >
        <div className={styles.toneArmDot} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/VinylDisc.js
git commit -m "feat(player): add VinylDisc component with tone arm"
```

---

### Task 4: Create PlayerControls component

**Files:**
- Create: `src/components/MusicPlayer/PlayerControls.js`

- [ ] **Step 1: Create the component with SVG icons**

```js
// src/components/MusicPlayer/PlayerControls.js
import React from 'react';
import styles from './styles.module.css';

const MODE_LABELS = { loop: '列表循环', single: '单曲循环', random: '随机播放' };

function ModeIcon({ mode }) {
  if (mode === 'loop') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    );
  }
  if (mode === 'single') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        <text x="10" y="15" fontSize="8" fill="rgba(255,180,190,0.7)" stroke="none" fontWeight="bold">1</text>
      </svg>
    );
  }
  // random
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

export default function PlayerControls({ playing, mode, showLyric, onToggle, onPrev, onNext, onModeChange, onLyricToggle }) {
  return (
    <div className={styles.controls}>
      {/* Play mode */}
      <button className={styles.controlBtn} onClick={onModeChange} title={MODE_LABELS[mode]}>
        <ModeIcon mode={mode} />
      </button>

      {/* Previous */}
      <button className={styles.controlBtn} onClick={onPrev}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,210,215,0.85)">
          <rect x="3" y="6" width="2.5" height="12" rx="1" />
          <polygon points="21 6 9 12 21 18" />
        </svg>
      </button>

      {/* Play / Pause */}
      <button className={styles.playBtn} onClick={onToggle}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <polygon points="7 3 21 12 7 21" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button className={styles.controlBtn} onClick={onNext}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,210,215,0.85)">
          <rect x="18.5" y="6" width="2.5" height="12" rx="1" />
          <polygon points="3 6 15 12 3 18" />
        </svg>
      </button>

      {/* Lyrics toggle */}
      <button
        className={styles.controlBtn}
        onClick={onLyricToggle}
        title="歌词"
        style={{ opacity: showLyric ? 1 : 0.4 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.7)" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="16" y2="12" />
          <line x1="4" y1="17" x2="12" y2="17" />
        </svg>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/PlayerControls.js
git commit -m "feat(player): add PlayerControls with SVG icons"
```

---

### Task 5: Create ProgressBar component

**Files:**
- Create: `src/components/MusicPlayer/ProgressBar.js`

- [ ] **Step 1: Create the component with drag support**

```js
// src/components/MusicPlayer/ProgressBar.js
import React, { useCallback, useRef } from 'react';
import styles from './styles.module.css';

function fmt(s) {
  if (!s || !isFinite(s) || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function ProgressBar({ progress, currentTime, duration, onSeek }) {
  const trackRef = useRef(null);

  const calcRatio = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = (e) => {
    onSeek(calcRatio(e.clientX));
  };

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSeek(calcRatio(e.clientX));
    const onMove = (ev) => onSeek(calcRatio(ev.clientX));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [calcRatio, onSeek]);

  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack} ref={trackRef} onClick={handleClick}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        <div
          className={styles.progressThumb}
          style={{ left: `${progress}%` }}
          onMouseDown={handleDragStart}
        />
      </div>
      <div className={styles.timeRow}>
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/ProgressBar.js
git commit -m "feat(player): add ProgressBar with drag-to-seek"
```

---

### Task 6: Create VolumeBar component

**Files:**
- Create: `src/components/MusicPlayer/VolumeBar.js`

- [ ] **Step 1: Create the component**

```js
// src/components/MusicPlayer/VolumeBar.js
import React, { useCallback, useRef } from 'react';
import styles from './styles.module.css';

function SpeakerIcon({ volume }) {
  if (volume === 0) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.45)" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19" fill="rgba(255,180,190,0.15)" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.45)" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19" fill="rgba(255,180,190,0.15)" />
      {volume >= 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export default function VolumeBar({ volume, onVolumeChange }) {
  const trackRef = useRef(null);

  const calcVolume = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = (e) => {
    onVolumeChange(calcVolume(e.clientX));
  };

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onVolumeChange(calcVolume(e.clientX));
    const onMove = (ev) => onVolumeChange(calcVolume(ev.clientX));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [calcVolume, onVolumeChange]);

  const pct = Math.round(volume * 100);

  return (
    <div className={styles.volumeWrap}>
      <SpeakerIcon volume={volume} />
      <div className={styles.volumeTrack} ref={trackRef} onClick={handleClick}>
        <div className={styles.volumeFill} style={{ width: `${pct}%` }} />
        <div
          className={styles.volumeThumb}
          style={{ left: `${pct}%` }}
          onMouseDown={handleDragStart}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/VolumeBar.js
git commit -m "feat(player): add VolumeBar with drag support"
```

---

### Task 7: Create Playlist component

**Files:**
- Create: `src/components/MusicPlayer/Playlist.js`

- [ ] **Step 1: Create the component with click-outside-to-close**

```js
// src/components/MusicPlayer/Playlist.js
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function Playlist({ songs, current, visible, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.playlistDrop} ref={ref}>
      <div className={styles.playlistTitle}>播放列表</div>
      {songs.map((song, i) => {
        const active = i === current;
        return (
          <div
            key={i}
            className={`${styles.playlistItem} ${active ? styles.playlistItemActive : ''}`}
            onClick={() => onSelect(i)}
          >
            <span className={active ? styles.playlistItemIconActive : styles.playlistItemIcon}>♪</span>
            <div>
              <div className={active ? styles.playlistItemTitleActive : styles.playlistItemTitle}>
                {song.title}
              </div>
              <div className={styles.playlistItemArtist}>{song.artist}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/Playlist.js
git commit -m "feat(player): add Playlist dropdown with click-outside-to-close"
```

---

### Task 8: Create Lyrics component

**Files:**
- Create: `src/components/MusicPlayer/Lyrics.js`

- [ ] **Step 1: Create the 3-line lyrics component**

```js
// src/components/MusicPlayer/Lyrics.js
import React from 'react';
import styles from './styles.module.css';

export default function Lyrics({ lyrics, lyricIdx, visible, playerLeft, playerWidth }) {
  if (!visible || !lyrics || lyrics.length === 0) return null;

  const prev = lyrics[lyricIdx - 1]?.text || '';
  const curr = lyrics[lyricIdx]?.text || '';
  const next = lyrics[lyricIdx + 1]?.text || '';

  if (!curr) return null;

  const left = playerLeft + playerWidth + 16;

  return (
    <div className={styles.lyricsWrap} style={{ left: left + 'px' }} key={lyricIdx}>
      {prev && <span className={styles.lyricLine}>{prev}</span>}
      <span className={styles.lyricLineCurrent}>{curr}</span>
      {next && <span className={styles.lyricLine}>{next}</span>}
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/Lyrics.js
git commit -m "feat(player): add 3-line Lyrics component"
```

---

### Task 9: Create Visualizer component

**Files:**
- Create: `src/components/MusicPlayer/Visualizer.js`

- [ ] **Step 1: Create the Web Audio API visualizer**

```js
// src/components/MusicPlayer/Visualizer.js
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

const BAR_COUNT = 10;

export default function Visualizer({ audioRef, playing }) {
  const ctxRef = useRef(null);      // AudioContext
  const analyserRef = useRef(null);  // AnalyserNode
  const sourceRef = useRef(null);    // MediaElementSourceNode
  const rafRef = useRef(null);
  const [bars, setBars] = useState(new Array(BAR_COUNT).fill(2));

  // Initialize AudioContext and connect to audio element (once)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;

    const initAudio = () => {
      if (ctxRef.current) return;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    };

    audio.addEventListener('play', initAudio, { once: true });
    return () => audio.removeEventListener('play', initAudio);
  }, [audioRef]);

  // Animation loop
  useEffect(() => {
    if (!playing || !analyserRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBars(new Array(BAR_COUNT).fill(2));
      return;
    }

    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / BAR_COUNT);
      const newBars = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        const val = data[i * step] || 0;
        newBars.push(Math.max(2, (val / 255) * 20));
      }
      setBars(newBars);
      rafRef.current = requestAnimationFrame(tick);
    };

    // Resume context if suspended (browser policy)
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().then(tick);
    } else {
      tick();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  return (
    <div className={styles.visualizer}>
      {bars.map((h, i) => (
        <div key={i} className={styles.vizBar} style={{ height: h + 'px' }} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/Visualizer.js
git commit -m "feat(player): add Visualizer with Web Audio API"
```

---

### Task 10: Create MusicPlayer index.js (main component)

**Files:**
- Create: `src/components/MusicPlayer/index.js`

- [ ] **Step 1: Create the main component that wires everything together**

```js
// src/components/MusicPlayer/index.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PLAYLIST } from './playlist-data';
import VinylDisc from './VinylDisc';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeBar from './VolumeBar';
import Playlist from './Playlist';
import Lyrics from './Lyrics';
import Visualizer from './Visualizer';
import styles from './styles.module.css';

const MODES = ['loop', 'single', 'random'];
const PLAYER_W = 250;
const MINI_SIZE = 72;
const STORAGE_KEY = 'music-player-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const wrapRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const saveTimerRef = useRef(0);

  // Load persisted state
  const saved = useRef(loadState()).current;

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(saved?.volume ?? 0.6);
  const [current, setCurrent] = useState(saved?.current ?? 0);
  const [modeIdx, setModeIdx] = useState(
    saved?.mode ? MODES.indexOf(saved.mode) : 0
  );
  const [mini, setMini] = useState(true);
  const [progress, setProgress] = useState(0);
  const [durSec, setDurSec] = useState(0);
  const [currSec, setCurrSec] = useState(0);
  const [lyricIdx, setLyricIdx] = useState(0);
  const [showLyric, setShowLyric] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(24);

  const song = PLAYLIST[current];
  const mode = MODES[modeIdx];

  // ---- Restore saved currentTime on first load ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !saved?.currentTime) return;
    const onLoaded = () => {
      if (isFinite(saved.currentTime) && saved.currentTime > 0) {
        audio.currentTime = saved.currentTime;
      }
    };
    audio.addEventListener('loadedmetadata', onLoaded, { once: true });
    return () => audio.removeEventListener('loadedmetadata', onLoaded);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Drag ----
  const onDragStart = useCallback((e) => {
    if (['BUTTON', 'INPUT', 'IMG', 'svg', 'path', 'line', 'polyline', 'polygon', 'rect', 'text', 'circle'].includes(e.target.tagName)) return;
    e.preventDefault();
    const wrap = wrapRef.current;
    const rect = wrap.getBoundingClientRect();
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top };
    const onMove = (ev) => {
      if (!dragRef.current.dragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - rect.width, dragRef.current.origX + ev.clientX - dragRef.current.startX));
      const newY = Math.max(0, Math.min(window.innerHeight - rect.height, dragRef.current.origY + ev.clientY - dragRef.current.startY));
      wrap.style.left = newX + 'px';
      wrap.style.top = newY + 'px';
      wrap.style.bottom = 'auto';
      setPlayerLeft(newX);
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  // ---- Playback ----
  const playSong = useCallback((idx) => {
    setCurrent(idx);
    setLyricIdx(0);
    setProgress(0);
    setCurrSec(0);
    saveState({ current: idx, volume, mode, currentTime: 0 });
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
      setPlaying(true);
    }, 50);
  }, [volume, mode]);

  const toggle = () => {
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const prevSong = () => playSong((current - 1 + PLAYLIST.length) % PLAYLIST.length);

  const nextSong = useCallback(() => {
    const idx = mode === 'random'
      ? Math.floor(Math.random() * PLAYLIST.length)
      : mode === 'single'
        ? current
        : (current + 1) % PLAYLIST.length;
    playSong(idx);
  }, [mode, current, playSong]);

  const cycleMode = () => setModeIdx((i) => (i + 1) % MODES.length);

  // ---- Progress & lyric sync ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      const t = audio.currentTime || 0;
      const d = isFinite(audio.duration) ? audio.duration : 0;
      setCurrSec(t);
      setDurSec(d);
      setProgress(d > 0 ? (t / d) * 100 : 0);

      const lyr = song.lyrics || [];
      let li = 0;
      for (let i = 0; i < lyr.length; i++) {
        if (t >= lyr[i].time) li = i;
      }
      setLyricIdx(li);

      // Throttled save: every 3 seconds
      const now = Date.now();
      if (now - saveTimerRef.current > 3000) {
        saveTimerRef.current = now;
        saveState({ current, volume, mode, currentTime: t });
      }
    };

    const onMeta = () => {
      if (isFinite(audio.duration)) setDurSec(audio.duration);
    };

    const onEnded = () => nextSong();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [song, nextSong, current, volume, mode]);

  // ---- Volume sync ----
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ---- Seek ----
  const onSeek = (ratio) => {
    const t = ratio * (audioRef.current?.duration || 0);
    if (audioRef.current && isFinite(t)) audioRef.current.currentTime = t;
  };

  // ---- Volume change (also persist) ----
  const onVolumeChange = (val) => {
    setVolume(val);
    saveState({ current, volume: val, mode, currentTime: audioRef.current?.currentTime || 0 });
  };

  const playerWidth = mini ? MINI_SIZE : PLAYER_W;

  return (
    <>
      {/* Lyrics */}
      <Lyrics
        lyrics={song.lyrics}
        lyricIdx={lyricIdx}
        visible={showLyric && playing}
        playerLeft={playerLeft}
        playerWidth={playerWidth}
      />

      {/* Player */}
      <div
        ref={wrapRef}
        onMouseDown={onDragStart}
        className={styles.player}
      >
        <audio ref={audioRef} src={song.src} />

        {mini ? (
          /* ---- Mini mode: vinyl disc ---- */
          <VinylDisc
            cover={song.cover}
            playing={playing}
            size={MINI_SIZE}
            onClick={() => setMini(false)}
          />
        ) : (
          /* ---- Expanded mode ---- */
          <div className={styles.panel}>
            <div className={styles.nowPlaying}>NOW PLAYING</div>

            {/* Header: disc + title + playlist + collapse */}
            <div className={styles.header}>
              <VinylDisc cover={song.cover} playing={playing} size={48} />
              <div className={styles.songInfo}>
                <div className={styles.songTitle}>{song.title}</div>
                <div className={styles.songArtist}>{song.artist}</div>
              </div>

              {/* Playlist hamburger */}
              <button
                className={styles.iconBtn}
                onClick={() => setShowPlaylist((s) => !s)}
                title="歌单"
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5px' }}>
                  <div className={styles.hamburgerLine} style={{ width: 12 }} />
                  <div className={styles.hamburgerLine} style={{ width: 10 }} />
                  <div className={styles.hamburgerLine} style={{ width: 8 }} />
                </div>
              </button>

              {/* Collapse */}
              <button className={styles.collapseBtn} onClick={() => setMini(true)} title="收起">
                —
              </button>
            </div>

            {/* Playlist dropdown */}
            <Playlist
              songs={PLAYLIST}
              current={current}
              visible={showPlaylist}
              onSelect={(i) => { playSong(i); setShowPlaylist(false); }}
              onClose={() => setShowPlaylist(false)}
            />

            {/* Progress */}
            <ProgressBar
              progress={progress}
              currentTime={currSec}
              duration={durSec}
              onSeek={onSeek}
            />

            {/* Controls */}
            <PlayerControls
              playing={playing}
              mode={mode}
              showLyric={showLyric}
              onToggle={toggle}
              onPrev={prevSong}
              onNext={nextSong}
              onModeChange={cycleMode}
              onLyricToggle={() => setShowLyric((s) => !s)}
            />

            {/* Volume */}
            <VolumeBar volume={volume} onVolumeChange={onVolumeChange} />

            {/* Visualizer */}
            <Visualizer audioRef={audioRef} playing={playing} />
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify site builds**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/MusicPlayer/index.js
git commit -m "feat(player): add main MusicPlayer component wiring all subcomponents"
```

---

### Task 11: Update Root.js to use new MusicPlayer

**Files:**
- Modify: `src/theme/Root.js`

- [ ] **Step 1: Replace the old MusicPlayer with the new import**

Remove everything from line 85 (`// ==================== 音乐播放器 ====================`) through line 450 (end of old `MusicPlayer` function). Replace the inline `MusicPlayer` with the new import.

The new `Root.js` should be:

```js
// src/theme/Root.js
import React, { useEffect } from 'react';
import MusicPlayer from '../components/MusicPlayer';

// ==================== 粒子背景 ====================
function ParticleBackground() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;`;
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [], mouse = { x: innerWidth / 2, y: innerHeight / 2 }, raf;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; initParticles(); };
    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx + (mouse.x - p.x) * 0.0002;
        p.y += p.vy + (mouse.y - p.y) * 0.0002;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150,130,255,0.65)'; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,110,245,${(1 - d / 110) * 0.35})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const onMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);
    resize(); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('resize', resize); canvas.remove(); };
  }, []);
  return null;
}

// ==================== 自定义光标 ====================
function CursorEffect() {
  useEffect(() => {
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    const onMove = e => {
      dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
      const trail = document.createElement('div');
      const hue = 250 + Math.random() * 40;
      trail.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;background:hsl(${hue},80%,70%);pointer-events:none;transform:translate(-50%,-50%);z-index:99997;transition:opacity 0.5s,transform 0.5s;`;
      document.body.appendChild(trail);
      requestAnimationFrame(() => { trail.style.opacity = '0'; trail.style.transform = 'translate(-50%,-50%) scale(0)'; });
      setTimeout(() => trail.remove(), 550);
    };
    const onDown = () => { dot.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.transform = 'translate(-50%,-50%) scale(0.5)'; dot.style.background = '#e86cd8'; };
    const onUp = () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; dot.style.background = '#7c6ef5'; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mousedown', onDown); document.removeEventListener('mouseup', onUp); dot.remove(); ring.remove(); };
  }, []);
  return null;
}

// ==================== 根组件 ====================
export default function Root({ children }) {
  return (
    <>
      <ParticleBackground />
      <CursorEffect />
      <MusicPlayer />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Verify site runs in dev mode**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus start --port 3333 &`

Open `http://localhost:3333` and verify:
- Player shows as a 72px vinyl disc in bottom-left
- Click disc → panel expands with song info, progress bar, controls, volume, visualizer
- Play/pause, prev/next, mode switching all work
- Progress bar drag works
- Volume bar drag works
- Lyrics appear to the right of the player when playing
- Playlist dropdown opens/closes on hamburger click
- Dragging the player works
- Collapse button returns to mini disc mode
- Refresh the page → saved song/volume/progress restore correctly (no auto-play)

- [ ] **Step 3: Verify production build**

Run: `cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build 2>&1 | tail -5`
Expected: Build completes successfully

- [ ] **Step 4: Commit**

```bash
git add src/theme/Root.js
git commit -m "refactor(player): replace inline MusicPlayer with modular component

Remove ~370 lines of inline MusicPlayer code from Root.js and replace
with import from src/components/MusicPlayer/. All functionality preserved
with new 二次元 aesthetic, SVG icons, vinyl disc animation, 3-line lyrics,
audio visualizer, and localStorage persistence."
```

---

### Task 12: Final cleanup and verification

- [ ] **Step 1: Verify no leftover unused code**

Check that `Root.js` no longer references any of: `useState`, `useRef`, `useCallback`, `PLAYLIST`, `MODES`, `MODE_ICONS`, `MODE_LABELS`, `PLAYER_W`, `MINI_SIZE`.

Run: `grep -n "PLAYLIST\|MODE_ICONS\|MODE_LABELS\|MINI_SIZE\|PLAYER_W" src/theme/Root.js`
Expected: No matches

- [ ] **Step 2: Run a full production build and serve**

```bash
cd D:/my_wiki/my_wiki/SXQ8848.github.io-main && npx docusaurus build && npx docusaurus serve --port 3334
```

Open `http://localhost:3334` and run through the same verification checklist from Task 11 Step 2.

- [ ] **Step 3: Commit if any cleanup was needed**

Only commit if changes were made in this step. If everything was clean, skip.
