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
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,180,190,0.7)' }}>词</span>
      </button>
    </div>
  );
}
