// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  // ---- Required ----
  title: 'Doc Site Using Docusaurus Project',
  tagline: 'Technical documentation using Docusaurus',

  // Your favicon under /static/images
  favicon: 'images/favicon.svg',

  // ✅ GitHub Pages (project site) values
  url: 'https://lizmarlowe-byte.github.io',
  baseUrl: '/docs-as-code-portfolio-docusaurus/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  future: { v4: true },

  // GitHub repo info
  organizationName: 'lizmarlowe-byte',
  projectName: 'docs-as-code-portfolio-docusaurus',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/lizmarlowe-byte/docs-as-code-portfolio-docusaurus/edit/master/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          editUrl:
            'https://github.com/lizmarlowe-byte/docs-as-code-portfolio-docusaurus/edit/master/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card; you can replace this later with your own under /static/images/
      image: 'img/docusaurus-social-card.jpg',

      // Current behavior: respect system preference
      colorMode: { respectPrefersColorScheme: true },

      // Global docs UI tweaks (sidebar behavior)
      docs: {
        sidebar: {
          hideable: true,               // Adds a toggle to collapse the entire sidebar
          autoCollapseCategories: true, // Only one category expanded at a time
        },
      },

      // Optional: Tweak right-hand Table of Contents site-wide
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },

      navbar: {
        // Rename if you like (e.g., 'Liz Marlowe Docs')
        title: 'My Site',
        logo: {
          alt: 'Liz Marlowe Docs Logo',
          // Your new LM icon-only logo
          src: 'images/logo.svg',
        },
        items: [
          // Keep this simple Docs link if you want a top nav route to /docs/
          { to: '/docs/', label: 'About this Site', position: 'left' },

          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/lizmarlowe-byte/docs-as-code-portfolio-docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      // ✅ Footer is inside themeConfig
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              // Replaces the 404 /docs/intro link
              { label: 'About this Site', to: '/docs/' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
              { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
              { label: 'X', href: 'https://x.com/docusaurus' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Blog', to: '/blog' },
              { label: 'GitHub', href: 'https://github.com/facebook/docusaurus' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },

      // ✅ Prism is a sibling of footer (also inside themeConfig)
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;