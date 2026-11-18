/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  learningSidebar: [
    {
      type: 'category',
      label: '学习 & 积累',
      collapsible: true,
      collapsed: false,
      link: { type: 'doc', id: 'learning/intro' },
      items: [
        'learning/getting-started',
        'learning/build-wiki',
        {
          type: 'category',
          label: 'AI 使用技巧',
          collapsible: true,
          collapsed: false,
          items: ['learning/ai/agent-intro'],
        },
        {
          type: 'category',
          label: '硬件原理',
          collapsible: true,
          collapsed: false,
          items: [
            'learning/hardware/schematic-basics',
            'learning/hardware/Communication_protocol',
          ],
        },
      ],
    },
  ],
  lifeSidebar: [
    {
      type: 'category',
      label: '生活 & 折腾',
      collapsible: true,
      collapsed: false,
      link: { type: 'doc', id: 'life/intro' },
      items: [],
    },
  ],
};

module.exports = sidebars;
