const { removePlugin, PLUGINS } = require('@vuepress/markdown');

function formatHeading(content) {
  return content;
}

module.exports = {
  markdown: {
    chainMarkdown(config) {
      removePlugin(config, PLUGINS.EMOJI)
    },
    toc: {
      format: formatHeading
    }
  },
  sidebar: true,
  title: 'Ymir',
  head: [
    ['link', { rel: 'apple-touch-icon', sizes:'180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes:'16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes:'32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }]
  ],

  themeConfig: {
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    logo: '/logo.png',
    nav: [
      {
        text: 'Log in',
        link: 'https://ymirapp.com/login',
      },
      {
        text: 'Create account',
        link: 'https://ymirapp.com/register',
      }
    ],
    sidebar: [
      'introduction',
      'getting-started',
      'teams',
      {
        title: 'Projects',
        collapsable: false,
        children: [
          '/projects/manage',
          '/projects/environments',
          '/projects/deploy'
        ]
      },
      {
        title: 'Team Resources',
        collapsable: false,
        children: [
          '/team-resources/caches',
          '/team-resources/database-servers',
          '/team-resources/dns',
          '/team-resources/email',
          '/team-resources/networks',
          '/team-resources/ssl-certificates',
        ]
      },
      {
        title: 'Guides',
        children: [
          '/guides/container-image-deployment',
          '/guides/domain-mapping',
          '/guides/scaling',
          '/guides/automated-deployment',
          '/guides/firewall',
          '/guides/object-cache',
          '/guides/cloudflare',
          '/guides/new-relic',
          '/guides/gd-extension',
        ]
      },
      {
        title: 'Compatibility',
        children: [
          ['/compatibility/beaver-builder', 'Beaver Builder'],
          ['/compatibility/elementor', 'Elementor'],
          ['/compatibility/oxygen', 'Oxygen'],
          ['/compatibility/sage-10', 'Sage 10'],
          ['/compatibility/woocommerce', 'WooCommerce']
        ]
      },
      {
        title: 'Reference',
        children: [
          '/reference/configuration',
          '/reference/ymir-cli'
        ]
      }
    ]
  }
}
