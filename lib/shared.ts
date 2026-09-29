export const appName = 'Ymir';
export const siteUrl = 'https://docs.ymirapp.com';
export const docsContentRoute = '/llms.mdx';

/**
 * `url` is the public Markdown URL (`/reference/configuration.md`) that the proxy rewrites to
 * the `segments` of the internal Markdown route.
 */
export function getPageMarkdownUrl(page: { slugs: string[] }) {
  return {
    segments: [...page.slugs, 'content.md'],
    url: `/${page.slugs.length > 0 ? page.slugs.join('/') : 'index'}.md`,
  };
}
