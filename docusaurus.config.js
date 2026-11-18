const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
module.exports = async function createConfig() {
  const { default: remarkMath } = await import('remark-math');
  const { default: rehypeKatex } = await import('rehype-katex');

  return {
    title: 'SXQ HOME',
    tagline: 'Wiki',
    url: 'https://sxq8848.github.io',
    baseUrl: '/',
    favicon: 'img/favicon-64.png',
    organizationName: 'SXQ8848',
    projectName: 'SXQ8848.github.io',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    trailingSlash: false,
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            exclude: ['superpowers/**'],
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
          blog: false,
          theme: {
            customCss: [
              require.resolve('katex/dist/katex.min.css'),
              require.resolve('./src/css/custom.css'),
            ],
          },
        },
      ],
    ],
    themeConfig: {
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'SXQ HOME',
        logo: {
          alt: 'SXQ',
          src: 'img/favicon-64.png',
        },
        items: [
          { href: 'https://github.com/SXQ8848/SXQ8848.github.io', label: 'GitHub', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} SXQ`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },
  };
};
