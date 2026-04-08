// src/theme/Root.js
import React from 'react';
import MusicPlayer from '../components/MusicPlayer';
import RainbowTrail from '../components/RainbowTrail';


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
      <RainbowTrail />
      <MusicPlayer />
      {children}
    </>
  );
}
