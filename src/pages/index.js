import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function Typewriter({ texts, speed = 80, pause = 2000 }) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[idx];
    let timer;
    if (!deleting && charIdx < text.length) {
      timer = setTimeout(() => setCharIdx(charIdx + 1), speed);
    } else if (!deleting && charIdx === text.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }
    setDisplay(text.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return (
    <span className={styles.typewriter}>
      {display}
      <span className={styles.cursor}>|</span>
    </span>
  );
}

function Particles() {
  // Generate floating particles for ambiance
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className={styles.particles}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left + '%',
            animationDelay: p.delay + 's',
            animationDuration: p.duration + 's',
            width: p.size + 'px',
            height: p.size + 'px',
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Layout title="Home">
      <main className={styles.hero}>
        <Particles />
        <div className={styles.heroCard}>
          <div className={styles.greeting}>Hello, I'm</div>
          <h1 className={styles.title}>SXQ</h1>
          <div className={styles.subtitle}>
            <Typewriter
              texts={[
                'Welcome to my digital space',
                'Explorer & Creator',
                'Building cool things',
              ]}
            />
          </div>
          <p className={styles.description}>
            A personal wiki for notes, projects, and everything in between.
          </p>
          <div className={styles.actions}>
            <a href="/docs/intro" className={styles.btnPrimary}>
              Explore Docs
            </a>
            <a
              href="https://github.com/SXQ8848"
              className={styles.btnGhost}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}
