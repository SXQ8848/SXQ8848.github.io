// src/components/MusicPlayer/Visualizer.js
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

const BAR_COUNT = 10;

export default function Visualizer({ audioRef, playing }) {
  const ctxRef = useRef(null);      // AudioContext
  const analyserRef = useRef(null);  // AnalyserNode
  const sourceRef = useRef(null);    // MediaElementSourceNode
  const rafRef = useRef(null);
  const [bars, setBars] = useState(new Array(BAR_COUNT).fill(2));

  // Initialize AudioContext and connect to audio element (once)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;

    const initAudio = () => {
      if (ctxRef.current) return;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    };

    audio.addEventListener('play', initAudio, { once: true });
    return () => audio.removeEventListener('play', initAudio);
  }, [audioRef]);

  // Animation loop
  useEffect(() => {
    if (!playing || !analyserRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBars(new Array(BAR_COUNT).fill(2));
      return;
    }

    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / BAR_COUNT);
      const newBars = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        const val = data[i * step] || 0;
        newBars.push(Math.max(2, (val / 255) * 20));
      }
      setBars(newBars);
      rafRef.current = requestAnimationFrame(tick);
    };

    // Resume context if suspended (browser policy)
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().then(tick);
    } else {
      tick();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  return (
    <div className={styles.visualizer}>
      {bars.map((h, i) => (
        <div key={i} className={styles.vizBar} style={{ height: h + 'px' }} />
      ))}
    </div>
  );
}
