import React, { useState } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './SocialLinks.module.css';

const LINKS = [
  {
    name: 'GitHub',
    icon: '🐙',
    url: 'https://github.com/SXQ8848',
    color: '#e2e8f0',
    action: 'link',
  },
  {
    name: 'QQ',
    icon: '💬',
    info: 'QQ 号：（待补充）',
    color: '#3b82f6',
    action: 'popup',
  },
  {
    name: '微信',
    icon: '📱',
    info: '微信号：（待补充）',
    color: '#22c55e',
    action: 'popup',
  },
];

export default function SocialLinks() {
  const [ref, visible] = useScrollReveal();
  const [popup, setPopup] = useState(null);

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="🔗" title="Find Me" />
      <div className={styles.grid}>
        {LINKS.map((link, i) => (
          <div key={link.name} className={styles.itemWrap}>
            {link.action === 'link' ? (
              <a
                href={link.url}
                className={styles.item}
                style={{ '--glow-color': link.color }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.name}>{link.name}</span>
              </a>
            ) : (
              <button
                className={styles.item}
                style={{ '--glow-color': link.color }}
                onClick={() => setPopup(popup === link.name ? null : link.name)}
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.name}>{link.name}</span>
              </button>
            )}
            {popup === link.name && (
              <div className={styles.popup} style={{ borderColor: link.color + '44' }}>
                {link.info}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
