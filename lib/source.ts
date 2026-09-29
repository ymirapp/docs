import { docs } from 'collections/server';
import { llms, loader } from 'fumadocs-core/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { siteUrl } from './shared';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [
    {
      // Shorter sidebar labels; titles stay unchanged everywhere else.
      transformPageTree: {
        file(node, filePath) {
          const file = filePath ? this.storage.read(filePath) : undefined;
          // The frontmatter schema in source.config.ts validates navTitle.
          const navTitle = file?.format === 'page' ? (file.data as { navTitle?: string }).navTitle : undefined;

          return navTitle ? { ...node, name: navTitle } : node;
        },
      },
    },
  ],
});

export const searchServer = createFromSource(source);

export const docsLlms = llms(source, {
  renderPage: async (page) => {
    const header = [`# ${page.data.title}`, `Source: ${siteUrl}${page.url}`];
    if (page.data.description) header.push(`> ${page.data.description}`);

    return `${header.join('\n\n')}\n\n${(await page.data.getText('processed')).trim()}\n`;
  },
});
