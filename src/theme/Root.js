// src/theme/Root.js
import React, { useEffect } from 'react';
import MusicPlayer from '../components/MusicPlayer';

// ==================== MC 钻石剑光标 ====================
function DiamondSwordCursor() {
  useEffect(() => {
    const cursor = document.createElement('img');
    cursor.src = '/img/MC_Diamond.png';
    cursor.style.cssText = `
      position: fixed;
      width: 52px;
      height: auto;
      pointer-events: none;
      z-index: 99999;
      transform-origin: top left;
      transform: rotate(0deg);
      display: none;
    `;
    document.body.appendChild(cursor);

    const onMove = (e) => {
      cursor.style.display = 'block';
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const onLeave = () => { cursor.style.display = 'none'; };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cursor.remove();
    };
  }, []);
  return null;
}

// ==================== 根组件 ====================
export default function Root({ children }) {
  return (
    <>
      {/* 背景图 — 固定全屏 70% 透明度 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url(/img/to-the-moon.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.7,
        pointerEvents: 'none',
      }} />
      <DiamondSwordCursor />
      <MusicPlayer />
      {children}
    </>
  );
}
