// src/components/MusicPlayer/Lyrics.js
import React from 'react';
import styles from './styles.module.css';

export default function Lyrics({ lyrics, lyricIdx, visible, playerLeft, playerWidth }) {
  if (!visible || !lyrics || lyrics.length === 0) return null;

  const prev = lyrics[lyricIdx - 1]?.text || '';
  const curr = lyrics[lyricIdx]?.text || '';
  const next = lyrics[lyricIdx + 1]?.text || '';

  if (!curr) return null;

  const left = playerLeft + playerWidth + 16;

  return (
    <div className={styles.lyricsWrap} style={{ left: left + 'px' }} key={lyricIdx}>
      {prev && <span className={styles.lyricLine}>{prev}</span>}
      <span className={styles.lyricLineCurrent}>{curr}</span>
      {next && <span className={styles.lyricLine}>{next}</span>}
    </div>
  );
}
