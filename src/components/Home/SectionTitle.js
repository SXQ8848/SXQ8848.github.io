import React from 'react';
import styles from './SectionTitle.module.css';

export default function SectionTitle({ emoji, title }) {
  return (
    <h2 className={styles.sectionTitle}>
      <span className={styles.emoji}>{emoji}</span>
      {title}
    </h2>
  );
}
