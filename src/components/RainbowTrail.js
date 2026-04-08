import React, { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 20;
const COLORS = [
  '#ff0000', '#ff4500', '#ff8c00', '#ffd700',
  '#adff2f', '#00e676', '#00bcd4', '#2196f3',
  '#7c4dff', '#e040fb',
];

export default function RainbowTrail() {
  const canvasRef = useRef(null);
  const points = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      points.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (points.current.length > TRAIL_LENGTH) {
        points.current.shift();
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = points.current;
      const now = Date.now();

      // Remove old points (older than 400ms)
      while (pts.length > 0 && now - pts[0].t > 400) {
        pts.shift();
      }

      for (let i = 1; i < pts.length; i++) {
        const ratio = i / pts.length;
        const age = 1 - (now - pts[i].t) / 400;
        if (age <= 0) continue;

        const colorIdx = Math.floor(ratio * (COLORS.length - 1));
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = COLORS[colorIdx];
        ctx.globalAlpha = age * ratio;
        ctx.lineWidth = ratio * 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
