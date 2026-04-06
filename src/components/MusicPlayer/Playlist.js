// src/components/MusicPlayer/Playlist.js
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function Playlist({ songs, current, visible, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.playlistDrop} ref={ref}>
      <div className={styles.playlistTitle}>播放列表</div>
      {songs.map((song, i) => {
        const active = i === current;
        return (
          <div
            key={i}
            className={`${styles.playlistItem} ${active ? styles.playlistItemActive : ''}`}
            onClick={() => onSelect(i)}
          >
            <span className={active ? styles.playlistItemIconActive : styles.playlistItemIcon}>♪</span>
            <div>
              <div className={active ? styles.playlistItemTitleActive : styles.playlistItemTitle}>
                {song.title}
              </div>
              <div className={styles.playlistItemArtist}>{song.artist}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
