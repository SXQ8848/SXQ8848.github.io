import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';
import SkillInventory from '../components/Home/SkillInventory';
import ProjectCards from '../components/Home/ProjectCards';
import StatsAchievement from '../components/Home/StatsAchievement';
import Timeline from '../components/Home/Timeline';
import RecentUpdates from '../components/Home/RecentUpdates';
import SocialLinks from '../components/Home/SocialLinks';

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
  const avatarUrl = useBaseUrl('/img/avatar.jpg');
  return (
    <Layout title="Home">
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <Particles />
          <div className={styles.heroCard}>
            <div className={styles.avatarWrap}>
              <img src={avatarUrl} alt="SXQ" className={styles.avatar} />
            </div>
            <div className={styles.greeting}>Hello, I'm</div>
            <h1 className={styles.title}>SXQ</h1>
            <div className={styles.subtitle}>
              <Typewriter
                texts={[
                  '硬件原理探索者',
                  'AI 工具玩家',
                  '日常折腾爱好者',
                  'Building cool things',
                ]}
              />
            </div>
            <p className={styles.description}>
              一个关于硬件、AI、编程和日常折腾的个人知识库。
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
        </section>

        {/* Scrolling Sections */}
        <SkillInventory />
        <ProjectCards />
        <StatsAchievement />
        <Timeline />
        <RecentUpdates />
        <SocialLinks />
      </main>
    </Layout>
  );
}
