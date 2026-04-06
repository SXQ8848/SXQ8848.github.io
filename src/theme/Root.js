// src/theme/Root.js
import React from 'react';
import MusicPlayer from '../components/MusicPlayer';

// ==================== 根组件 ====================
export default function Root({ children }) {
  return (
    <>
      <MusicPlayer />
      {children}
    </>
  );
}
