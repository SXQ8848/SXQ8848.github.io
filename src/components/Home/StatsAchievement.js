import React, { useEffect, useState } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './StatsAchievement.module.css';

const STATS = [
  { label: '文档篇数', value: 12, suffix: '', color: '#6ee7b7' },
  { label: '项目数', value: 3, suffix: '', color: '#3b82f6' },
  { label: '折腾次数', value: null, display: '∞', color: '#a78bfa' },
];

function CountUp({ target, visible, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible || target === null) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.8
        ? (progress / 0.8) * 1.15
        : 1.15 - 0.15 * ((progress - 0.8) / 0.2);
      const val = Math.round(Math.min(ease, 1.15) * target);
      setCount(Math.min(val, target + Math.round(target * 0.15)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);

  return <span>{count}</span>;
}

export default function StatsAchievement() {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="📊" title="Achievement" />
      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.achievement}
            style={{ animationDelay: visible ? `${i * 150}ms` : '0ms' }}
          >
            <div className={styles.achievementIcon}>🏆</div>
            <div className={styles.achievementContent}>
              <div className={styles.achievementTitle}>成就已解锁！</div>
              <div className={styles.achievementValue} style={{ color: stat.color }}>
                {stat.value !== null ? (
                  <><CountUp target={stat.value} visible={visible} />{stat.suffix}</>
                ) : (
                  stat.display
                )}
              </div>
              <div className={styles.achievementLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
