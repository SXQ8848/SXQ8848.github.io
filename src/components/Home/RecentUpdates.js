import React from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './RecentUpdates.module.css';

const UPDATES = [
  { title: '原理图设计入门', category: '硬件', categoryColor: '#ef4444', date: '2026-04-09', url: '/docs/hardware/schematic-basics' },
  { title: 'AI Agent 入门', category: 'AI', categoryColor: '#a78bfa', date: '2026-04-09', url: '/docs/ai/agent-intro' },
  { title: 'AI 建站记录', category: '折腾', categoryColor: '#fbbf24', date: '2026-04-09', url: '/docs/tinkering/build-wiki' },
  { title: '学习路线', category: '学习', categoryColor: '#3b82f6', date: '2026-04-09', url: '/docs/learning/getting-started' },
];

export default function RecentUpdates() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="📰" title="Recent Updates" />
      <div className={styles.list}>
        {UPDATES.map((item, i) => (
          <a
            key={item.title}
            href={item.url}
            className={styles.item}
            style={{ animationDelay: visible ? `${i * 100}ms` : '0ms' }}
          >
            <span className={styles.category} style={{ color: item.categoryColor, borderColor: item.categoryColor + '44' }}>
              {item.category}
            </span>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.date}>{item.date}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
