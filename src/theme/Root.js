// src/theme/Root.js
import React from 'react';
import Head from '@docusaurus/Head';
import MusicPlayer from '../components/MusicPlayer';
import RainbowTrail from '../components/RainbowTrail';
import styles from './Root.module.css';

// ==================== 根组件 ====================
export default function Root({ children }) {
  return (
    <>
      {/* Prefetch the other theme's background so toggle is instant */}
      <Head>
        <link rel="prefetch" as="image" href="/img/to-the-moon.jpg" />
        <link rel="prefetch" as="image" href="/img/white_mode.webp" />
      </Head>

      {/* 背景层 — 跟随 data-theme 切换图片与透明度 */}
      <div className={styles.bgLayer} />

      <RainbowTrail />
      <MusicPlayer />
      {children}
    </>
  );
}
