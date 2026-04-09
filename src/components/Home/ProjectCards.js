import React, { useRef, useCallback } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './ProjectCards.module.css';

const PROJECTS = [
  {
    name: 'SXQ Wiki',
    desc: '个人知识库网站，记录学习笔记、技术积累与日常折腾',
    tags: ['Docusaurus', 'React', 'GitHub Pages'],
    url: 'https://github.com/SXQ8848/SXQ8848.github.io',
  },
  {
    name: '更多项目',
    desc: '持续探索中...',
    tags: ['Coming Soon'],
    url: null,
  },
];

function TiltCard({ children }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const onMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div ref={cardRef} className={styles.card} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={glowRef} className={styles.cardGlow} />
      {children}
    </div>
  );
}

export default function ProjectCards() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="🏗" title="Projects" />
      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <TiltCard key={p.name}>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{p.name}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              {p.url && (
                <a href={p.url} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
                  查看项目 →
                </a>
              )}
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
