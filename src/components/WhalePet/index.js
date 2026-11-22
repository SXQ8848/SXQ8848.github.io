import React, { useEffect, useId, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
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
  return minimized ? 48 : width <= 600 ? 128 : 176;
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

// Reference and creator credits are recorded alongside the local artwork.
function Whale({ still = false }) {
  const imageUrl = useBaseUrl('/img/whale-pet/deepseek-girl.webp');
  return (
    <span className={`${styles.whale} ${still ? styles.still : ''}`} aria-hidden="true">
      <span className={styles.shadow} />
      <img className={styles.characterImage} src={imageUrl} alt="" draggable={false} width="458" height="528" />
    </span>
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
      aria-label="DeepSeek 鲸鱼娘桌宠"
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
              <a className={styles.credit} href="https://genderswapai.com/zh-CN/ai-gijinka/deepseek/chibi" target="_blank" rel="noopener noreferrer" title="角色：上善无形 / ZipZipPipe；参考图整理：TreapGoGo">形象来源 · 上善无形 / ZipZipPipe</a>
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
            <span className={styles.name}>DeepSeek 鲸鱼娘</span>
          </button>
          <button className={styles.minimize} onClick={toggleMinimized} aria-label="收起小鲸桌宠" title="收起小鲸">−</button>
        </>
      )}
    </aside>
  );
}
