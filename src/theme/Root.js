// src/theme/Root.js
import React, { useEffect, useState } from 'react';
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

// ==================== 主题监听 Hook ====================
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ==================== 根组件 ====================
export default function Root({ children }) {
  const isDark = useTheme();
  return (
    <>
      {/* 背景图 — 暗色模式 0.7 透明度，亮色模式 0.45 防止过曝 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url(/img/to-the-moon.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        opacity: isDark ? 0.7 : 0.45,
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
      }} />
      <DiamondSwordCursor />
      <MusicPlayer />
      {children}
    </>
  );
}
