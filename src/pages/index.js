import React from 'react';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout title="Home">
      <main style={{ padding: '2rem' }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem' }}>Welcome</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem' }}>This is SXQ Home</p>
      </main>
    </Layout>
  );
}