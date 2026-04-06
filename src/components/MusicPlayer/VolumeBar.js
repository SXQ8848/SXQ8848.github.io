// src/components/MusicPlayer/VolumeBar.js
import React, { useCallback, useRef } from 'react';
import styles from './styles.module.css';

function SpeakerIcon({ volume }) {
  if (volume === 0) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.45)" strokeWidth="2" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19" fill="rgba(255,180,190,0.15)" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.45)" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19" fill="rgba(255,180,190,0.15)" />
      {volume >= 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export default function VolumeBar({ volume, onVolumeChange }) {
  const trackRef = useRef(null);

  const calcVolume = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = (e) => {
    onVolumeChange(calcVolume(e.clientX));
  };

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onVolumeChange(calcVolume(e.clientX));
    const onMove = (ev) => onVolumeChange(calcVolume(ev.clientX));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [calcVolume, onVolumeChange]);

  const pct = Math.round(volume * 100);

  return (
    <div className={styles.volumeWrap}>
      <SpeakerIcon volume={volume} />
      <div className={styles.volumeTrack} ref={trackRef} onClick={handleClick}>
        <div className={styles.volumeFill} style={{ width: `${pct}%` }} />
        <div
          className={styles.volumeThumb}
          style={{ left: `${pct}%` }}
          onMouseDown={handleDragStart}
        />
      </div>
    </div>
  );
}
