# Music Player Redesign — Design Spec

## Overview

Redesign the existing music player in `src/theme/Root.js` from a monolithic inline-styled component into a modular, visually polished player with a 网易云 + 二次元 aesthetic (cherry-pink color scheme, rounded buttons, vinyl disc animation).

## Visual Design

### Color Palette
- Primary: `#ff6b81` (cherry pink)
- Primary dark: `#ff4757` (deep pink)
- Background: `rgba(25, 20, 40, 0.97)` (dark purple-tinted)
- Text: `#fff` (title), `rgba(255, 180, 190, 0.6)` (subtitle)
- Border: `rgba(255, 100, 120, 0.25)`

### Mini Mode (default)
- 72px circular vinyl disc with album cover center
- Conic gradient grooves on disc, rotates when playing (`8s linear infinite`), pauses in place when stopped
- Tone arm: rotates to disc when playing (`25deg`), lifts when paused (`0deg`), smooth CSS transition
- Breathing glow animation around disc (`pulse` keyframe)
- Click to expand

### Expanded Mode
- 250px wide floating panel, `border-radius: 18px`, backdrop blur, gradient background
- "NOW PLAYING" ribbon badge top-right corner
- Layout top-to-bottom:
  1. **Header row**: 48px vinyl disc + song title/artist + playlist button (三横线, decreasing widths) + collapse button
  2. **Progress bar**: 4px track, gradient fill, 12px draggable thumb with pink border and glow
  3. **Time display**: current / duration, 9px tabular-nums
  4. **Control buttons**: mode | prev | play/pause | next | lyrics — all 30x30 rounded-rect (`border-radius: 10px`) with pink-tinted bg/border. Play button: 40px circle, gradient, outer glow ring
  5. **Volume bar**: speaker SVG icon + slider with draggable thumb
  6. **Visualizer**: 10 frequency bars, gradient pink, driven by `requestAnimationFrame`

### Lyrics Display
- `position: fixed`, left edge = player right edge + 16px, `top: 50vh`, `transform: translateY(-50%)`
- 3 lines only: previous (dim) + current (highlighted, `#ff6b81`, glow text-shadow) + next (dim)
- Fade + slide animation on line change
- Toggle on/off via lyrics button

### Icons
- All SVG, no emoji, no icon library
- Consistent stroke style for toggle buttons (mode, lyrics), fill style for transport buttons (prev, play, next)
- Play mode icons: loop (双箭头), single (双箭头+1), random (交叉箭头)
- Playlist button: 3 horizontal lines with decreasing width (14px, 10px, 8px)

### Dragging
- Entire player is draggable (mousedown on panel, exclude buttons/inputs)
- Constrained to viewport bounds
- Lyrics position updates to follow player

## File Structure

```
src/components/MusicPlayer/
  index.js            — Main component: state management, audio element, drag logic, layout switch
  VinylDisc.js        — Vinyl disc + tone arm, props: cover, playing, size, onClick
  PlayerControls.js   — Transport + mode + lyrics toggle buttons, all SVG icons
  ProgressBar.js      — Seekable progress bar with drag support
  VolumeBar.js        — Volume slider with speaker icon
  Playlist.js         — Dropdown song list panel, click-outside-to-close
  Lyrics.js           — 3-line fixed-position lyrics display
  Visualizer.js       — Web Audio API frequency bars
  playlist-data.js    — PLAYLIST array (song metadata + lyrics)
  styles.module.css   — All styles, CSS variables, keyframe animations
```

`src/theme/Root.js` will import `MusicPlayer` from `../components/MusicPlayer` instead of defining it inline. `ParticleBackground` and `CursorEffect` remain in `Root.js`.

## Component Interfaces

### MusicPlayer (index.js)
- Central state: `playing, current, volume, mode, mini, progress, durSec, currSec, lyricIdx, showLyric, showPlaylist, playerLeft`
- Owns `<audio ref={audioRef}>` element
- Passes props down to all child components
- Handles drag logic on the wrapper div

### VinylDisc
```
Props: { cover: string, playing: boolean, size: number, onClick?: function }
```
- `animation-play-state: paused/running` to freeze rotation angle
- Tone arm angle via CSS transition

### PlayerControls
```
Props: {
  playing: boolean, mode: 'loop'|'single'|'random', showLyric: boolean,
  onToggle, onPrev, onNext, onModeChange, onLyricToggle
}
```

### ProgressBar
```
Props: { progress: number, currentTime: number, duration: number, onSeek: (ratio: number) => void }
```
- Click and drag both call `onSeek` with a 0-1 ratio

### VolumeBar
```
Props: { volume: number, onVolumeChange: (value: number) => void }
```

### Playlist
```
Props: { songs: Array, current: number, visible: boolean, onSelect: (index) => void, onClose: () => void }
```
- Absolute positioned dropdown
- Click outside triggers `onClose`

### Lyrics
```
Props: { lyrics: Array, lyricIdx: number, visible: boolean, playerLeft: number, playerWidth: number }
```

### Visualizer
```
Props: { audioRef: RefObject, playing: boolean }
```
- Creates `AudioContext` + `AnalyserNode` on first play
- Connects to `audioRef.current` via `createMediaElementSource` (once)
- 10 bars, height driven by `getByteFrequencyData`
- Stops animation loop when `playing` is false

## Data

### playlist-data.js
```js
export const PLAYLIST = [
  {
    title: '枫',
    artist: '周杰伦',
    src: '/music/feng.mp3',
    cover: '/music/cover_feng.jpg',
    lyrics: [
      { time: 18.96, text: '乌云在我们心里搁下一块阴影' },
      // ... existing lyrics
    ],
  },
  {
    title: '园游会',
    artist: '周杰伦',
    src: '/music/youyuanhui.mp3',
    cover: '/music/cover_youyuanhui.jpg',
    lyrics: [
      { time: 32.35, text: '琥珀色黄昏像糖在很美的远方' },
      // ... existing lyrics
    ],
  },
];
```

## Persistence (localStorage)

- Key: `"music-player-state"`
- Stored fields: `{ current: number, volume: number, mode: string, currentTime: number }`
- Write: throttled every 3 seconds on `timeupdate`, immediate on song change
- Read: on component mount, used to initialize state
- On restore: set song and seek to saved `currentTime`, but do NOT auto-play (browser autoplay policy)

## styles.module.css Key Sections

```css
/* CSS variables */
.player { --player-primary: #ff6b81; --player-primary-dark: #ff4757; }

/* Keyframes */
@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes pulse { 0%,100% { opacity: 0.5; transform: scale(1) } 50% { opacity: 1; transform: scale(1.05) } }
@keyframes lyricFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }

/* Shared button style */
.controlBtn { width: 30px; height: 30px; border-radius: 10px; background: rgba(255,100,120,0.06); border: 1px solid rgba(255,100,120,0.12); }
.controlBtn:hover { background: rgba(255,100,120,0.12); }

/* Play button */
.playBtn { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(145deg, #ff6b81, #ff4757); box-shadow: 0 4px 16px rgba(255,71,87,0.45), 0 0 0 3px rgba(255,100,120,0.15); }
```

## Implementation Approach

Incremental refactor — extract one component at a time from `Root.js`, verify the site still works after each step:

1. Create `playlist-data.js`, move `PLAYLIST` array out of `Root.js`
2. Create `styles.module.css` with all styles, replace inline styles in existing code
3. Extract `VinylDisc` component
4. Extract `PlayerControls` with new SVG icons
5. Extract `ProgressBar` with drag support
6. Extract `VolumeBar`
7. Extract `Playlist` dropdown
8. Extract `Lyrics` (3-line mode)
9. Add `Visualizer` (new feature)
10. Add localStorage persistence (new feature)
11. Wire everything in `MusicPlayer/index.js`, update `Root.js` import

## Out of Scope

- Adding new songs (user can do this by editing `playlist-data.js`)
- Mobile touch drag support (current site is desktop-focused)
- External lyrics file loading (lyrics stay hardcoded in data file)
- Changes to `ParticleBackground` or `CursorEffect`
