import React from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './Timeline.module.css';

const EVENTS = [
  { year: '2026', text: '搭建个人 Wiki 网站', color: '#6ee7b7' },
  { year: '2025', text: '开始学习 AI Agent', color: '#3b82f6' },
  { year: '2024', text: '深入硬件原理学习', color: '#a78bfa' },
  { year: '更早', text: '编程与硬件启蒙', color: '#fbbf24' },
];

function TimelineItem({ event, index, visible }) {
  return (
    <div
      className={styles.item}
      style={{
        animationDelay: visible ? `${index * 200}ms` : '0ms',
      }}
    >
      <div className={styles.dot} style={{ backgroundColor: event.color, boxShadow: `0 0 8px ${event.color}88, 0 0 20px ${event.color}33` }} />
      <div className={styles.content}>
        <span className={styles.year} style={{ color: event.color }}>{event.year}</span>
        <span className={styles.text}>{event.text}</span>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="📜" title="Timeline" />
      <div className={styles.timeline}>
        {EVENTS.map((event, i) => (
          <TimelineItem key={event.year} event={event} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}
