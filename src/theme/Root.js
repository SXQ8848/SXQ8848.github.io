// src/theme/Root.js
import React, { useEffect } from 'react';

function CursorEffect() {
  useEffect(() => {
    // --- 创建光标 DOM ---
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    const onMove = (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';

      // 拖尾粒子
      const trail = document.createElement('div');
      const hue = 250 + Math.random() * 40;
      trail.style.cssText = `
        position:fixed; left:${e.clientX}px; top:${e.clientY}px;
        width:6px; height:6px; border-radius:50%;
        background:hsl(${hue},80%,70%); pointer-events:none;
        transform:translate(-50%,-50%); z-index:99997;
        transition:opacity 0.5s, transform 0.5s;
      `;
      document.body.appendChild(trail);
      requestAnimationFrame(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      setTimeout(() => trail.remove(), 550);
    };

    const onDown = () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      ring.style.transform = 'translate(-50%,-50%) scale(0.5)';
      dot.style.background = '#e86cd8';
    };
    const onUp = () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      dot.style.background = '#7c6ef5';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}

function ParticleBackground() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0; pointer-events: none;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    let raf;

    const resize = () => {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx + (mouse.x - p.x) * 0.0002;
        p.y += p.vy + (mouse.y - p.y) * 0.0002;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150, 130, 255, 0.65)';
        ctx.fill();
      });

      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,110,245,${(1 - d / 110) * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }, []);

  return null;
}

export default function Root({ children }) {
  return (
    <>
      <ParticleBackground />
      <CursorEffect />
      {children}
    </>
  );
}