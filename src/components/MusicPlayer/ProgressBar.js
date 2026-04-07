// src/components/MusicPlayer/ProgressBar.js
import React, { useCallback, useRef } from 'react';
import styles from './styles.module.css';

function fmt(s) {
  if (!s || !isFinite(s) || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function ProgressBar({ progress, currentTime, duration, onSeek }) {
  const trackRef = useRef(null);

  const calcRatio = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = (e) => {
    onSeek(calcRatio(e.clientX));
  };

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSeek(calcRatio(e.clientX));
    const onMove = (ev) => onSeek(calcRatio(ev.clientX));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [calcRatio, onSeek]);

  return (
    <div className={styles.progressWrap} data-nodrag>
      <div className={styles.progressTrack} ref={trackRef} onClick={handleClick} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        <div
          className={styles.progressThumb}
          style={{ left: `${progress}%` }}
          onMouseDown={handleDragStart}
        />
      </div>
      <div className={styles.timeRow}>
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}
