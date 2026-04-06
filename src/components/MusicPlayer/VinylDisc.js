// src/components/MusicPlayer/VinylDisc.js
import React from 'react';
import styles from './styles.module.css';

export default function VinylDisc({ cover, playing, size, onClick }) {
  const armHeight = Math.round(size * 0.36);

  return (
    <div
      className={styles.vinylWrap}
      style={{ width: size, height: size }}
      onClick={onClick}
      title={onClick ? '展开播放器' : undefined}
    >
      {/* Breathing glow */}
      <div className={styles.vinylGlow} />

      {/* Disc — cover fills entire circle */}
      <div
        className={`${styles.vinyl} ${playing ? styles.vinylPlaying : ''}`}
        style={{ width: size, height: size }}
      >
        {cover ? (
          <img src={cover} alt="cover" draggable="false" className={styles.vinylCoverImg} />
        ) : (
          <span style={{ fontSize: Math.round(size * 0.2), color: '#fff' }}>♪</span>
        )}
      </div>

      {/* Tone arm */}
      <div
        className={styles.toneArm}
        style={{
          height: armHeight,
          top: -Math.round(size * 0.08),
          right: -Math.round(size * 0.14),
          transform: playing ? 'rotate(25deg)' : 'rotate(0deg)',
        }}
      >
        <div className={styles.toneArmDot} />
      </div>
    </div>
  );
}
