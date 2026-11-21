import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './styles.module.css';

const STORAGE_KEY = 'sxq-whale-pet-v1';
const EDGE = 12;
const MESSAGES = [
  '今天也一起学一点吧～',
  '电路再复杂，也能一块一块读懂。',
  '卡住了？先画图，再拆成小步骤。',
  '滴！给认真学习的你一朵小浪花。',
  '专注很棒，偶尔也记得看看远方。',
];

function petSize(width, minimized) {
  return minimized ? 48 : width <= 600 ? 96 : 128;
}

function bounds(viewport, minimized) {
  const size = petSize(viewport.width, minimized);
  return {
    minX: EDGE,
    minY: Math.min(76, Math.max(EDGE, viewport.height - size - EDGE)),
    maxX: Math.max(EDGE, viewport.width - size - EDGE),
    maxY: Math.max(EDGE, viewport.height - size - EDGE),
  };
}

function constrain(point, viewport, minimized) {
  const box = bounds(viewport, minimized);
  return {
    x: Math.max(box.minX, Math.min(box.maxX, point.x)),
    y: Math.max(box.minY, Math.min(box.maxY, point.y)),
  };
}

// Original chibi illustration inspired by DeepSeek's blue whale.
function Whale({ still = false }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`${styles.whale} ${still ? styles.still : ''}`} viewBox="0 0 160 140" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#80d8ff" />
          <stop offset="0.48" stopColor="#527fff" />
          <stop offset="1" stopColor="#354bdb" />
        </linearGradient>
        <linearGradient id={`${id}-belly`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#d4edff" />
        </linearGradient>
      </defs>
      <ellipse className={styles.shadow} cx="78" cy="133" rx="42" ry="4" fill="#244caf" opacity="0.17" />
      <g className={styles.swimmer}>
        <g className={styles.tail}>
          <path d="M108 88C124 83 132 72 129 61C118 61 110 53 109 43C121 40 130 46 133 52C137 43 147 40 156 44C155 56 146 64 139 64C144 81 133 99 114 102Z" fill={`url(#${id}-blue)`} stroke="#3459c9" strokeWidth="2" strokeLinejoin="round" />
          <path d="M133 54L136 64" fill="none" stroke="#b5e7ff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="M117 72C127 96 113 119 85 124C56 131 22 118 16 96C8 70 25 46 50 40C79 32 108 46 117 72Z" fill={`url(#${id}-blue)`} stroke="#3459c9" strokeWidth="2" />
        <path d="M20 98C37 108 56 104 71 105C91 106 108 100 119 90C119 107 104 120 85 124C55 130 29 118 20 98Z" fill={`url(#${id}-belly)`} />
        <path d="M31 60C40 49 56 45 68 46" fill="none" stroke="#d7f5ff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <path className={styles.fin} d="M83 103C88 104 99 111 95 118C91 124 78 117 75 109" fill="#527dff" stroke="#3459c9" strokeWidth="2" strokeLinecap="round" />
        <g className={styles.eyes}>
          <ellipse cx="43" cy="84" rx="7" ry="9" fill="#17295e" />
          <ellipse cx="85" cy="81" rx="7" ry="9" fill="#17295e" />
          <circle cx="41" cy="81" r="2.6" fill="white" />
          <circle cx="83" cy="78" r="2.6" fill="white" />
          <circle cx="46" cy="87" r="1.2" fill="#97d8ff" />
          <circle cx="88" cy="84" r="1.2" fill="#97d8ff" />
        </g>
        <ellipse cx="29" cy="96" rx="8" ry="4.5" fill="#ffb3d0" opacity="0.85" />
        <ellipse cx="100" cy="92" rx="8" ry="4.5" fill="#ffb3d0" opacity="0.85" />
        <path d="M56 96Q64 105 73 94" fill="none" stroke="#20396d" strokeWidth="2.8" strokeLinecap="round" />
        <g className={styles.splash} fill="#8cdcff" stroke="#fff" strokeWidth="1.4">
          <path d="M66 29C58 24 58 16 62 13C69 14 71 22 66 29Z" />
          <path d="M73 30C73 21 79 17 83 20C83 26 79 30 73 30Z" />
          <circle cx="55" cy="29" r="2.4" />
        </g>
      </g>
    </svg>
  );
}

export default function WhalePet() {
  const [ready, setReady] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState(null);
  const [happy, setHappy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const messageIndex = useRef(0);
  const reactionTimer = useRef(null);
  const greetingId = useId();

  useEffect(() => {
    const screen = { width: window.innerWidth, height: window.innerHeight };
    let saved;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { /* Optional preference storage. */ }
    const small = saved?.minimized === true;
    const box = bounds(screen, small);
    const validRatio = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
    const point = validRatio(saved?.x) && validRatio(saved?.y)
      ? { x: EDGE + saved.x * (box.maxX - EDGE), y: box.minY + saved.y * (box.maxY - box.minY) }
      : { x: box.maxX, y: screen.height - petSize(screen.width, small) - 96 };
    setViewport(screen);
    setPosition(constrain(point, screen, small));
    setMinimized(small);
    setReady(true);
    if (!saved && !small) setMessage('嗨，我是小鲸！点点我，也可以拖着我走～');
    return () => clearTimeout(reactionTimer.current);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const resize = () => {
      const screen = { width: window.innerWidth, height: window.innerHeight };
      setViewport(screen);
      setPosition((point) => constrain(point, screen, minimized));
    };
    const visibility = () => setPaused(document.hidden);
    visibility();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [ready, minimized]);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => {
      const box = bounds(viewport, minimized);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          minimized,
          x: (position.x - EDGE) / Math.max(1, box.maxX - EDGE),
          y: (position.y - box.minY) / Math.max(1, box.maxY - box.minY),
        }));
      } catch { /* The pet also works when storage is blocked. */ }
    }, 200);
    return () => clearTimeout(timer);
  }, [ready, minimized, position, viewport]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(null), 6500);
    return () => clearTimeout(timer);
  }, [message]);

  const toggleMinimized = () => {
    const next = !minimized;
    const delta = petSize(viewport.width, minimized) - petSize(viewport.width, next);
    setPosition((point) => constrain({ x: point.x + delta, y: point.y + delta }, viewport, next));
    setMinimized(next);
    setMessage(next ? null : '我回来啦，继续陪你探索！');
  };

  const greet = (event) => {
    if (suppressClick.current && event.detail !== 0) {
      suppressClick.current = false;
      return;
    }
    setMessage(MESSAGES[messageIndex.current++ % MESSAGES.length]);
    setHappy(true);
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setHappy(false), 700);
  };

  const startDrag = (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: position, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.moved && Math.hypot(dx, dy) < 5) return;
    current.moved = true;
    suppressClick.current = true;
    setDragging(true);
    setMessage(null);
    setPosition(constrain({ x: current.origin.x + dx, y: current.origin.y + dy }, viewport, minimized));
  };

  const finishDrag = (event) => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { setMessage(null); return; }
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 32 : 12;
    setPosition((point) => constrain({ x: point.x + direction[0] * step, y: point.y + direction[1] * step }, viewport, minimized));
    setMessage(null);
  };

  if (!ready) return null;
  const size = petSize(viewport.width, minimized);
  const bubbleWidth = Math.min(224, viewport.width - EDGE * 2);
  const bubbleLeft = Math.max(EDGE, Math.min(viewport.width - EDGE - bubbleWidth, position.x + size / 2 - bubbleWidth / 2)) - position.x;
  const bubbleAbove = position.y >= 150;

  return (
    <aside
      aria-label="DeepSeek 小鲸桌宠"
      className={`${styles.pet} ${paused ? styles.paused : ''} ${dragging ? styles.dragging : ''}`}
      style={{ left: position.x, top: position.y, width: size, height: size }}
    >
      {minimized ? (
        <button className={styles.restore} onClick={toggleMinimized} aria-label="唤醒小鲸桌宠" title="唤醒小鲸">
          <Whale still />
        </button>
      ) : (
        <>
          {message && !dragging && (
            <div className={styles.bubble} style={{ width: bubbleWidth, left: bubbleLeft, ...(bubbleAbove ? { bottom: size + 10 } : { top: size + 10 }) }}>
              <div className={styles.bubbleHeader}><span>小鲸 <small>陪你探索</small></span><button onClick={() => setMessage(null)} aria-label="关闭小鲸气泡">×</button></div>
              <p id={greetingId} role="status" aria-live="polite">{message}</p>
            </div>
          )}
          <button
            className={styles.character}
            aria-label="和小鲸互动，可拖动或用方向键移动"
            aria-describedby={message ? greetingId : undefined}
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Escape"
            title="点点我 · 拖动换位置 · 方向键也能移动"
            onClick={greet}
            onKeyDown={onKeyDown}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onLostPointerCapture={finishDrag}
          >
            <span className={`${styles.characterArt} ${happy ? styles.happy : ''}`}><Whale /></span>
            <span className={styles.name}>DeepSeek 小鲸</span>
          </button>
          <button className={styles.minimize} onClick={toggleMinimized} aria-label="收起小鲸桌宠" title="收起小鲸">−</button>
        </>
      )}
    </aside>
  );
}
