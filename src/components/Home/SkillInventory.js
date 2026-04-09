import React, { useState } from 'react';
import useScrollReveal from './useScrollReveal';
import SectionTitle from './SectionTitle';
import mcTheme from './mc-theme.module.css';
import styles from './SkillInventory.module.css';

const SKILLS = [
  { category: 'hardware', color: '#ef4444', items: [
    { name: '原理图设计', desc: '电路原理图绘制与分析' },
    { name: '电路设计', desc: 'PCB 布局与电路调试' },
    { name: '硬件基础原理', desc: '模拟/数字电路基础' },
  ]},
  { category: 'ai', color: '#a78bfa', items: [
    { name: 'AI Agent', desc: '自主智能体构建与应用' },
    { name: 'AI Skill', desc: 'AI 工具链与技巧' },
    { name: 'Prompt Engineering', desc: '提示词工程' },
  ]},
  { category: 'dev', color: '#3b82f6', items: [
    { name: 'React', desc: '前端 UI 框架' },
    { name: 'JavaScript', desc: 'Web 开发核心语言' },
    { name: 'Web 开发', desc: 'HTML/CSS/全栈基础' },
  ]},
  { category: 'tools', color: '#fbbf24', items: [
    { name: 'Git', desc: '版本控制与协作' },
    { name: 'Claude Code', desc: 'AI 辅助编程工具' },
    { name: 'Docusaurus', desc: '文档网站框架' },
  ]},
];

const ALL_SKILLS = SKILLS.flatMap((cat) =>
  cat.items.map((skill) => ({ ...skill, color: cat.color }))
);

export default function SkillInventory() {
  const [ref, visible] = useScrollReveal();
  const [tooltip, setTooltip] = useState(null);

  return (
    <div ref={ref} className={`${mcTheme.section} ${visible ? mcTheme.pixelRevealVisible : mcTheme.pixelRevealHidden}`}>
      <SectionTitle emoji="⛏" title="Skill Inventory" />
      <div className={styles.grid}>
        {ALL_SKILLS.map((skill, i) => (
          <div
            key={skill.name}
            className={styles.slot}
            style={{
              borderColor: skill.color + '44',
              backgroundColor: skill.color + '18',
              animationDelay: visible ? `${i * 80}ms` : '0ms',
            }}
            onMouseEnter={() => setTooltip(skill)}
            onMouseLeave={() => setTooltip(null)}
          >
            <span className={styles.slotName}>{skill.name}</span>
            {tooltip?.name === skill.name && (
              <div className={styles.tooltip} style={{ borderColor: skill.color + '66' }}>
                <div className={styles.tooltipTitle} style={{ color: skill.color }}>{skill.name}</div>
                <div className={styles.tooltipDesc}>{skill.desc}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
