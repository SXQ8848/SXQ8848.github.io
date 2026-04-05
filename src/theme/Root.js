// src/theme/Root.js
import React, { useEffect, useRef, useState, useCallback } from 'react';

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

// ==================== 音乐播放器 ====================
const MODES = ['loop', 'single', 'random'];
const MODE_ICONS = { loop: '🔁', single: '🔂', random: '🔀' };
const MODE_LABELS = { loop: '列表循环', single: '单曲循环', random: '随机播放' };
const PLAYER_W = 220;
const MINI_SIZE = 48;

// ⬇️ 在这里填写你的歌单、封面和歌词
const PLAYLIST = [
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

function MusicPlayer() {
  const audioRef = useRef(null);
  const wrapRef  = useRef(null);
  const dragRef  = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  const [playing, setPlaying]     = useState(false);
  const [volume, setVolume]       = useState(0.6);
  const [current, setCurrent]     = useState(0);
  const [modeIdx, setModeIdx]     = useState(0);
  const [mini, setMini]           = useState(false);
  const [progress, setProgress]   = useState(0);
  const [durSec, setDurSec]       = useState(0);
  const [currSec, setCurrSec]     = useState(0);
  const [lyricIdx, setLyricIdx]   = useState(0);
  const [showLyric, setShowLyric] = useState(true);
  const [playerLeft, setPlayerLeft] = useState(24); // 播放器当前 left px

  const song = PLAYLIST[current];
  const mode = MODES[modeIdx];

  // 时间格式化（防 NaN / Infinity）
  const fmt = (s) => {
    if (!s || !isFinite(s) || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  // ---- 拖拽 ----
  const onDragStart = useCallback((e) => {
    if (['BUTTON', 'INPUT', 'IMG'].includes(e.target.tagName)) return;
    e.preventDefault();
    const wrap = wrapRef.current;
    const rect = wrap.getBoundingClientRect();
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top };
    const onMove = (ev) => {
      if (!dragRef.current.dragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth  - rect.width,  dragRef.current.origX + ev.clientX - dragRef.current.startX));
      const newY = Math.max(0, Math.min(window.innerHeight - rect.height, dragRef.current.origY + ev.clientY - dragRef.current.startY));
      wrap.style.left   = newX + 'px';
      wrap.style.top    = newY + 'px';
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

  // ---- 播放控制 ----
  const playSong = useCallback((idx) => {
    setCurrent(idx); setLyricIdx(0); setProgress(0); setCurrSec(0);
    setTimeout(() => { audioRef.current?.play().catch(() => {}); setPlaying(true); }, 50);
  }, []);

  const toggle = () => {
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const prevSong = () => playSong((current - 1 + PLAYLIST.length) % PLAYLIST.length);
  const nextSong = useCallback(() => {
    const idx = mode === 'random' ? Math.floor(Math.random() * PLAYLIST.length)
              : mode === 'single' ? current
              : (current + 1) % PLAYLIST.length;
    playSong(idx);
  }, [mode, current, playSong]);

  // ---- 进度 & 歌词同步 ----
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
      for (let i = 0; i < lyr.length; i++) { if (t >= lyr[i].time) li = i; }
      setLyricIdx(li);
    };
    const onMeta = () => { if (isFinite(audio.duration)) setDurSec(audio.duration); };
    const onEnded = () => nextSong();
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [song, nextSong]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - rect.left) / rect.width) * (audioRef.current?.duration || 0);
    if (audioRef.current && isFinite(t)) audioRef.current.currentTime = t;
  };

  const currentLyric = song.lyrics?.[lyricIdx]?.text || '';
  // 歌词 left = 播放器左边缘 + 播放器实际宽度 + 16px 间距
  const lyricLeft = playerLeft + (mini ? MINI_SIZE : PLAYER_W) + 16;

  const btn = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--ifm-font-color-base,#fff)', fontSize: '13px',
    padding: '3px 5px', borderRadius: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const coverBase = {
    borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
    border: '2px solid var(--ifm-color-primary,#7c6ef5)',
    background: 'rgba(124,110,245,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: playing ? 'coverSpin 8s linear infinite' : 'none',
    boxShadow: playing ? '0 0 12px rgba(124,110,245,0.55)' : 'none',
    transition: 'box-shadow 0.3s',
  };

  return (
    <>
      <style>{`
        @keyframes coverSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes lyricIn   { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* 歌词：紧贴播放器右侧，屏幕垂直居中 */}
      {showLyric && playing && currentLyric && (
        <div key={currentLyric} style={{
          position: 'fixed',
          left: lyricLeft + 'px',
          top: '50vh',
          transform: 'translateY(-50%)',
          zIndex: 9998,
          pointerEvents: 'none',
          animation: 'lyricIn 0.35s ease',
          maxWidth: '320px',
        }}>
          <span style={{
            fontSize: '16px', fontWeight: 500, lineHeight: 1.8,
            color: 'var(--ifm-color-primary,#b8adff)',
            textShadow: '0 0 18px rgba(124,110,245,0.7), 0 2px 6px rgba(0,0,0,0.4)',
            letterSpacing: '0.03em', whiteSpace: 'nowrap',
          }}>
            {currentLyric}
          </span>
        </div>
      )}

      {/* 播放器 */}
      <div ref={wrapRef} onMouseDown={onDragStart} style={{
        position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999,
        userSelect: 'none', cursor: 'grab', fontFamily: 'inherit',
      }}>
        <audio ref={audioRef} src={song.src} />

        {/* 迷你：旋转封面 */}
        {mini ? (
          <div
            style={{ ...coverBase, width: MINI_SIZE, height: MINI_SIZE, cursor: 'pointer' }}
            onClick={() => setMini(false)}
            title="展开播放器"
          >
            {song.cover
              ? <img src={song.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ fontSize: '20px' }}>♪</span>}
          </div>
        ) : (
          /* 展开 */
          <div style={{
            background: 'var(--ifm-background-surface-color,rgba(18,18,30,0.93))',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--ifm-color-primary,#7c6ef5)',
            borderRadius: '14px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
            width: PLAYER_W + 'px',
            padding: '10px 12px 8px',
          }}>
            {/* 封面 + 歌名 + 收起 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ ...coverBase, width: 42, height: 42 }}>
                {song.cover
                  ? <img src={song.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <span style={{ fontSize: '18px' }}>♪</span>}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ifm-font-color-base,#fff)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {song.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(180,170,255,0.7)', marginTop: '1px' }}>
                  {song.artist}
                </div>
              </div>
              <button style={{ ...btn, fontSize: '15px', opacity: 0.5 }} onClick={() => setMini(true)} title="收起">—</button>
            </div>

            {/* 进度条 */}
            <div onClick={seekTo} style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer', margin: '4px 0 2px' }}>
              <div style={{ height: '100%', borderRadius: '2px', background: 'var(--ifm-color-primary,#7c6ef5)', width: `${progress}%`, transition: 'width 0.2s linear' }} />
            </div>

            {/* 时间 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(180,170,255,0.55)', margin: '2px 0 8px' }}>
              <span>{fmt(currSec)}</span>
              <span>{fmt(durSec)}</span>
            </div>

            {/* 控制栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <button style={btn} onClick={() => setModeIdx(i => (i + 1) % MODES.length)} title={MODE_LABELS[mode]}>
                {MODE_ICONS[mode]}
              </button>
              <button style={btn} onClick={prevSong}>⏮</button>
              <button onClick={toggle} style={{
                background: 'var(--ifm-color-primary,#7c6ef5)',
                borderRadius: '50%', width: '28px', height: '28px',
                border: 'none', cursor: 'pointer', fontSize: '12px',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {playing ? '⏸' : '▶'}
              </button>
              <button style={btn} onClick={nextSong}>⏭</button>
              <button style={{ ...btn, opacity: showLyric ? 1 : 0.3 }} onClick={() => setShowLyric(s => !s)} title="歌词">词</button>
            </div>

            {/* 音量 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '11px', color: 'rgba(180,170,255,0.55)' }}>
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </span>
              <input type="range" min="0" max="1" step="0.02" value={volume}
                style={{ flex: 1, accentColor: 'var(--ifm-color-primary,#7c6ef5)', height: '2px' }}
                onChange={e => setVolume(+e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
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
