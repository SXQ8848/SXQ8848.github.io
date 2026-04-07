// src/components/MusicPlayer/index.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PLAYLIST } from './playlist-data';
import VinylDisc from './VinylDisc';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeBar from './VolumeBar';
import Playlist from './Playlist';
import Lyrics from './Lyrics';
import styles from './styles.module.css';

const MODES = ['loop', 'single', 'random'];
const MINI_SIZE = 64;
const STORAGE_KEY = 'music-player-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const wrapRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const saveTimerRef = useRef(0);

  // Load persisted state
  const saved = useRef(loadState()).current;

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(saved?.volume ?? 0.6);
  const [current, setCurrent] = useState(saved?.current ?? 0);
  const [modeIdx, setModeIdx] = useState(
    saved?.mode ? MODES.indexOf(saved.mode) : 0
  );
  const [mini, setMini] = useState(true);
  const [progress, setProgress] = useState(0);
  const [durSec, setDurSec] = useState(0);
  const [currSec, setCurrSec] = useState(0);
  const [lyricIdx, setLyricIdx] = useState(0);
  const [showLyric, setShowLyric] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const song = PLAYLIST[current];
  const mode = MODES[modeIdx];

  // ---- Restore saved currentTime on first load ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !saved?.currentTime) return;
    const onLoaded = () => {
      if (isFinite(saved.currentTime) && saved.currentTime > 0) {
        audio.currentTime = saved.currentTime;
      }
    };
    audio.addEventListener('loadedmetadata', onLoaded, { once: true });
    return () => audio.removeEventListener('loadedmetadata', onLoaded);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Auto-reposition: keep player within viewport on expand/collapse ----
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let newLeft = rect.left;
    let newTop = rect.top;
    if (rect.right > vw) newLeft = Math.max(0, vw - rect.width);
    if (rect.bottom > vh) newTop = Math.max(0, vh - rect.height);
    if (newLeft !== rect.left || newTop !== rect.top) {
      wrap.style.left = newLeft + 'px';
      wrap.style.top = newTop + 'px';
      wrap.style.bottom = 'auto';
    }
  }, [mini]);

  // ---- Drag ----
  const onDragStart = useCallback((e) => {
    if (['BUTTON', 'INPUT', 'IMG', 'svg', 'path', 'line', 'polyline', 'polygon', 'rect', 'text', 'circle'].includes(e.target.tagName)) return;
    // Don't drag when interacting with progress/volume bars
    if (e.target.closest('[data-nodrag]')) return;
    e.preventDefault();
    const wrap = wrapRef.current;
    const rect = wrap.getBoundingClientRect();
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top };
    const onMove = (ev) => {
      if (!dragRef.current.dragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - rect.width, dragRef.current.origX + ev.clientX - dragRef.current.startX));
      const newY = Math.max(0, Math.min(window.innerHeight - rect.height, dragRef.current.origY + ev.clientY - dragRef.current.startY));
      wrap.style.left = newX + 'px';
      wrap.style.top = newY + 'px';
      wrap.style.bottom = 'auto';
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  // ---- Playback ----
  const playSong = useCallback((idx) => {
    setCurrent(idx);
    setLyricIdx(0);
    setProgress(0);
    setCurrSec(0);
    saveState({ current: idx, volume, mode, currentTime: 0 });
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
      setPlaying(true);
    }, 50);
  }, [volume, mode]);

  const toggle = () => {
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const prevSong = () => playSong((current - 1 + PLAYLIST.length) % PLAYLIST.length);

  const nextSong = useCallback(() => {
    const idx = mode === 'random'
      ? Math.floor(Math.random() * PLAYLIST.length)
      : mode === 'single'
        ? current
        : (current + 1) % PLAYLIST.length;
    playSong(idx);
  }, [mode, current, playSong]);

  const cycleMode = () => setModeIdx((i) => (i + 1) % MODES.length);

  // ---- Progress & lyric sync ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      const t = audio.currentTime || 0;
      const d = isFinite(audio.duration) ? audio.duration : 0;
      setCurrSec(t);
      setDurSec(d);
      setProgress(d > 0 ? (t / d) * 100 : 0);

      const lyr = song.lyrics || [];
      let li = 0;
      for (let i = 0; i < lyr.length; i++) {
        if (t >= lyr[i].time) li = i;
      }
      setLyricIdx(li);

      // Throttled save: every 3 seconds
      const now = Date.now();
      if (now - saveTimerRef.current > 3000) {
        saveTimerRef.current = now;
        saveState({ current, volume, mode, currentTime: t });
      }
    };

    const onMeta = () => {
      if (isFinite(audio.duration)) setDurSec(audio.duration);
    };

    const onEnded = () => nextSong();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [song, nextSong, current, volume, mode]);

  // ---- Volume sync ----
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ---- Seek ----
  const onSeek = (ratio) => {
    const t = ratio * (audioRef.current?.duration || 0);
    if (audioRef.current && isFinite(t)) audioRef.current.currentTime = t;
  };

  // ---- Volume change (also persist) ----
  const onVolumeChange = (val) => {
    setVolume(val);
    saveState({ current, volume: val, mode, currentTime: audioRef.current?.currentTime || 0 });
  };

  return (
    <>
      {/* Player */}
      <div
        ref={wrapRef}
        onMouseDown={onDragStart}
        className={styles.player}
      >
        <audio ref={audioRef} src={song.src} />

        {/* Lyrics — inside wrapper so it follows drag */}
        <Lyrics
          lyrics={song.lyrics}
          lyricIdx={lyricIdx}
          visible={showLyric && playing}
        />

        {mini ? (
          /* ---- Mini mode: vinyl disc ---- */
          <VinylDisc
            cover={song.cover}
            playing={playing}
            size={MINI_SIZE}
            onClick={() => setMini(false)}
          />
        ) : (
          /* ---- Expanded mode: horizontal layout ---- */
          <div className={styles.hPanel}>
            {/* Tone arm at top-right */}
            <div
              className={styles.panelToneArm}
              style={{ transform: playing ? 'rotate(25deg)' : 'rotate(0deg)' }}
            >
              <div className={styles.toneArmDotLg} />
            </div>

            {/* Left: vinyl disc (no arm, arm is on panel) */}
            <VinylDisc cover={song.cover} playing={playing} size={52} showArm={false} />

            {/* Right: controls column */}
            <div className={styles.hContent}>
              {/* Top row: song info + playlist + collapse */}
              <div className={styles.hTopRow}>
                <div className={styles.songInfo}>
                  <div className={styles.songTitle}>{song.title}</div>
                  <div className={styles.songArtist}>{song.artist}</div>
                </div>

                {/* Playlist hamburger */}
                <button
                  className={styles.iconBtn}
                  onClick={() => setShowPlaylist((s) => !s)}
                  title="歌单"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5px' }}>
                    <div className={styles.hamburgerLine} style={{ width: 12 }} />
                    <div className={styles.hamburgerLine} style={{ width: 10 }} />
                    <div className={styles.hamburgerLine} style={{ width: 8 }} />
                  </div>
                </button>

                {/* Collapse */}
                <button className={styles.collapseBtn} onClick={() => setMini(true)} title="收起">
                  —
                </button>
              </div>

              {/* Progress */}
              <ProgressBar
                progress={progress}
                currentTime={currSec}
                duration={durSec}
                onSeek={onSeek}
              />

              {/* Controls */}
              <PlayerControls
                playing={playing}
                mode={mode}
                showLyric={showLyric}
                onToggle={toggle}
                onPrev={prevSong}
                onNext={nextSong}
                onModeChange={cycleMode}
                onLyricToggle={() => setShowLyric((s) => !s)}
              />

              {/* Volume */}
              <VolumeBar volume={volume} onVolumeChange={onVolumeChange} />
            </div>

            {/* Playlist dropdown */}
            <Playlist
              songs={PLAYLIST}
              current={current}
              visible={showPlaylist}
              onSelect={(i) => { playSong(i); setShowPlaylist(false); }}
              onClose={() => setShowPlaylist(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
