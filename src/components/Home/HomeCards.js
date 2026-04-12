import React from 'react';
import styles from './HomeCards.module.css';

const CARDS = [
  {
    icon: '📖',
    title: '学习 & 积累',
    subtitle: 'Learning & Knowledge',
    desc: '知识 · 笔记 · 教程',
    href: '/docs/learning/intro',
  },
  {
    icon: '☕',
    title: '生活 & 折腾',
    subtitle: 'Life & Tinkering',
    desc: '日常 · DIY · 折腾',
    href: '/docs/life/intro',
  },
  {
    icon: '✨',
    title: '关于',
    subtitle: 'About',
    desc: '关于我和这个站',
    href: '/about',
  },
];

export default function HomeCards() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {CARDS.map((card) => (
          <a key={card.href} href={card.href} className={styles.card}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardSubtitle}>{card.subtitle}</p>
            <p className={styles.cardDesc}>{card.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
