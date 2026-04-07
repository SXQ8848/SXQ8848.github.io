// src/components/MusicPlayer/ProgressBar.js
import React, { useCallback, useRef } from 'react';
import styles from './styles.module.css';

function fmt(s) {
  if (!s || !isFinite(s) || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function ProgressBar({ progress, currentTime, duration, onSeek }) {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const thumbRef = useRef(null);
  const draggingRef = useRef(false);

  const calcRatio = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const updateVisual = useCallback((ratio) => {
    const pct = ratio * 100 + '%';
    if (fillRef.current) fillRef.current.style.width = pct;
    if (thumbRef.current) thumbRef.current.style.left = pct;
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    const ratio = calcRatio(e.clientX);
    updateVisual(ratio);
    onSeek(ratio);

    const onMove = (ev) => {
      const r = calcRatio(ev.clientX);
      updateVisual(r);
      onSeek(r);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [calcRatio, updateVisual, onSeek]);

  const pct = progress + '%';

  return (
    <div className={styles.progressWrap} data-nodrag>
      <div
        className={styles.progressTrack}
        ref={trackRef}
        onMouseDown={handleMouseDown}
      >
        <div ref={fillRef} className={styles.progressFill} style={{ width: pct }} />
        <div ref={thumbRef} className={styles.progressThumb} style={{ left: pct }} />
      </div>
      <div className={styles.timeRow}>
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}
