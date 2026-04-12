import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './about.module.css';
import SkillInventory from '../components/Home/SkillInventory';
import SocialLinks from '../components/Home/SocialLinks';

export default function About() {
  const avatarUrl = useBaseUrl('/img/avatar.jpg');
  return (
    <Layout title="About">
      <main className={styles.container}>
        <section className={styles.intro}>
          <img src={avatarUrl} alt="SXQ" className={styles.avatar} />
          <h1 className={styles.title}>关于 SXQ</h1>
          <p className={styles.bio}>
            硬件原理探索者 · AI 工具玩家 · 日常折腾爱好者。
            这里是我的个人知识库，记录学习、折腾和生活。
          </p>
        </section>

        <SkillInventory />
        <SocialLinks />
      </main>
    </Layout>
  );
}
