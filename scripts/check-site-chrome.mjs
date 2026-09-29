// Checks the header and footer link contract (components/site-chrome.tsx) and the page actions on a running server:
//   node scripts/check-site-chrome.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const app = 'https://ymirapp.com';
const logo = 'viewBox="0 0 200 50.201561"';
const collapseButton = 'aria-label="Collapse Sidebar"';

const header = [
  app,
  '/',
  `${app}/agencies`,
  `${app}/vector`,
  '/',
  `${app}/agencies`,
  `${app}/vector`,
  `${app}/login`,
  `${app}/login`,
];
const footer = [
  app,
  'https://blog.ymirapp.com/category/case-study',
  `${app}/agencies`,
  `${app}/vector`,
  '/',
  `${app}/terms`,
  `${app}/about`,
  'https://blog.ymirapp.com',
  `${app}/business-continuity`,
  `${app}/changelog`,
  `${app}/reports`,
  'https://discord.gg/Ze9qHTJWmc',
  'https://github.com/ymirapp',
  'https://twitter.com/ymirapp',
  'https://www.youtube.com/channel/UCc9GZVFs-KpnfUQ3MZJU0pQ',
];

const hrefs = (html) => [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map((match) => match[1]);

for (const path of ['/', '/reference/configuration']) {
  const html = await (await fetch(new URL(path, baseUrl))).text();
  const headerHtml = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? '';
  const footerHtml = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';

  assert.deepEqual(hrefs(headerHtml), header, `${path} header links`);
  // Documentation is the current site section on both the overview and article pages.
  const currentLinks = [...headerHtml.matchAll(/<a\b[^>]*aria-current="location"[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0]);
  assert.deepEqual(hrefs(currentLinks.join('')), ['/', '/'], `${path} current desktop and mobile links`);
  assert.deepEqual(currentLinks.map((link) => link.replace(/<[^>]*>/g, '')), ['Documentation', 'Documentation'], `${path} current section`);
  assert.deepEqual(hrefs(footerHtml), footer, `${path} footer links`);
  assert.match(footerHtml, new RegExp(`2020 - (<!-- -->)?${new Date().getFullYear()}(<!-- -->)? Ymir, Inc\\. All rights reserved\\.`));
  // The header owns the account link, so the docs sidebar must not repeat it.
  assert.equal(hrefs(html).filter((href) => href === `${app}/login`).length, 2, `${path} login links`);
  // Only the header and footer show the logo; the sidebar has no title.
  assert.equal(html.split(logo).length - 1, 2, `${path} logos`);
  assert.ok(headerHtml.includes(logo), `${path} header logo`);
  assert.ok(footerHtml.includes(logo), `${path} footer logo`);
  // With `collapsible: false`, the only collapse button left is in Fumadocs' inert reopen panel.
  const panelHtml = html.match(/<div data-sidebar-panel=""[^>]*>[\s\S]*?<\/div>/)?.[0] ?? '';
  assert.match(panelHtml, /^<div[^>]*\sinert=""/, `${path} reopen panel inert`);
  assert.equal(html.split(collapseButton).length - 1, 1, `${path} collapse buttons`);
  assert.ok(panelHtml.includes(collapseButton), `${path} collapse button in panel`);
  assert.match(html, /aria-label="Open Sidebar"/, `${path} mobile sidebar toggle`);
  // The footer keeps the organization link, but the sidebar has no docs repository shortcut. The
  // mobile drawer is only rendered once opened, so the browser check covers it.
  const sidebarHtml = html.match(/<aside id="nd-sidebar"[\s\S]*?<\/aside>/)?.[0] ?? '';
  assert.ok(sidebarHtml.includes('Overview</a>'), `${path} sidebar found`);
  assert.ok(!sidebarHtml.includes('github.com'), `${path} sidebar GitHub link`);
  // The page actions are only Copy Markdown, without the Open dropdown, on its own between the
  // description and the body instead of in a bordered row.
  const actionsHtml = html.match(/<\/p>(<button\b[\s\S]*?<\/button>)<div class="prose flex-1[^"]*">/)?.[1] ?? '';
  assert.deepEqual([...actionsHtml.matchAll(/<button\b[\s\S]*?<\/button>/g)].map((match) => match[0].replace(/<[^>]*>/g, '')), ['Copy Markdown'], `${path} page actions`);
  assert.ok(!html.includes('border-b pb-6'), `${path} no bordered actions row`);
}

console.log('Site header and footer links OK');
