// Checks the grouped sidebar (components/sidebar.tsx) on a running server:
//   node scripts/check-sidebar.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const quickLinks = ['/'];
const groups = ['Start here', 'Projects', 'Team resources', 'Guides', 'Compatibility', 'Reference'];

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const get = async (path) => (await fetch(new URL(path, baseUrl))).text();

// Server-rendered desktop sidebar: links with their current-page state, and group toggles.
async function sidebar(path) {
  const html = await get(path);
  const aside = html.match(/<aside id="nd-sidebar"[\s\S]*?<\/aside>/)?.[0] ?? '';

  return {
    aside,
    breadcrumb: html.match(/<nav aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? null,
    links: [...aside.matchAll(/<a data-active="(true|false)"[^>]*\shref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, active, href, label]) => ({ href, active: active === 'true', label: label.replace(/<[^>]*>/g, '') })),
    groups: [...aside.matchAll(/<div data-(open|closed)=""><button[^>]*>([^<]+)</g)].map(([, state, name]) => ({ name, open: state === 'open' })),
  };
}

// The canonical page list, from the unchanged page tree.
const pages = [...(await get('/llms.txt')).matchAll(/\]\((\/[^)]*)\)/g)].map((match) => match[1]);
assert.equal(new Set(pages).size, 36, 'canonical pages');

const home = await sidebar('/');
assert.deepEqual(home.links.map((link) => link.href), quickLinks, 'home shows only the quick link');
assert.deepEqual(home.links.map((link) => link.active), [true], 'home current page');
assert.doesNotMatch(home.aside, /<hr\b/, 'no rule after the quick link');
// The quick link keeps its native bottom margin above the first group.
assert.match(home.aside, /mb-4"[^>]*>Overview<\/a><div data-closed="">/, 'quick link spacing');
assert.deepEqual(home.groups, groups.map((name) => ({ name, open: false })), 'home groups closed');

// The Reference group uses the short navTitle labels, in alphabetical order.
const configuration = await sidebar('/reference/configuration');
assert.deepEqual(configuration.links.slice(quickLinks.length).map((link) => link.label), ['CLI', 'PHP runtime', 'ymir.yml'], 'Reference labels');

const bedrock = await sidebar('/guides/bedrock');
assert.deepEqual(
  bedrock.links.slice(quickLinks.length).map((link) => link.label),
  ['Automated deployment', 'AWS costs', 'Bedrock', 'Cloudflare', 'Container image deployment', 'Domain mapping', 'Firewall', 'GD PHP extension', 'Lambda scaling', 'Laravel', 'Logging service', 'Migrating to Ymir', 'New Relic', 'Object cache', 'Queues'],
  'Guides labels',
);

const seen = new Set();

for (const page of pages) {
  const { links, groups: pageGroups, breadcrumb } = await sidebar(page);
  const hrefs = links.map((link) => link.href);
  const openGroups = pageGroups.filter((group) => group.open).map((group) => group.name);
  const duplicates = hrefs.filter((href, index) => hrefs.indexOf(href) !== index);
  const groupLabels = links.slice(quickLinks.length).map((link) => link.label);

  assert.deepEqual(hrefs.slice(0, quickLinks.length), quickLinks, `${page} quick link first`);
  assert.deepEqual(duplicates, [], `${page} duplicate links`);
  assert.deepEqual(links.filter((link) => link.active).map((link) => link.href), [page], `${page} current page`);
  assert.deepEqual(pageGroups.map((group) => group.name), groups, `${page} groups`);
  assert.equal(openGroups.length, page === '/' ? 0 : 1, `${page} open group`);
  assert.deepEqual(groupLabels, [...groupLabels].sort(collator.compare), `${page} open group alphabetical`);
  assert.equal(page.startsWith('/reference/'), openGroups.includes('Reference'), `${page} Reference group`);
  // The breadcrumb names the open sidebar group under a link home; the overview has none.
  assert.equal(
    breadcrumb,
    page === '/' ? null : `<a href="/">Documentation</a><span aria-hidden="true">/</span><span>${openGroups[0]}</span>`,
    `${page} breadcrumb`,
  );
  hrefs.forEach((href) => seen.add(href));
}

assert.deepEqual([...seen].sort(), [...pages].sort(), 'every page is reachable from the sidebar');

console.log(`Sidebar groups OK (${pages.length} pages)`);
