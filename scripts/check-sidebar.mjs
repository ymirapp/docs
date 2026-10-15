// Checks the grouped sidebar (components/sidebar.tsx) on a running server:
//   node scripts/check-sidebar.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const quickLinks = ['/'];
const groups = ['Start here', 'Projects', 'Applications', 'Team resources', 'Guides', 'Compatibility', 'Reference'];

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

// The canonical page list comes from the page tree.
const pages = [...(await get('/llms.txt')).matchAll(/\]\((\/[^)]*)\)/g)].map((match) => match[1]);
assert.equal(new Set(pages).size, 38, 'canonical pages');

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

const bedrock = await sidebar('/applications/bedrock');
assert.deepEqual(bedrock.links.slice(quickLinks.length).map((link) => link.label), ['Bedrock', 'Laravel', 'Radicle', 'WordPress'], 'Applications labels');

const queues = await sidebar('/guides/queues');
assert.deepEqual(
  queues.links.slice(quickLinks.length).map((link) => link.label),
  ['Automated deployment', 'AWS costs', 'Cloudflare', 'Container image deployment', 'Domain mapping', 'Firewall', 'GD PHP extension', 'Lambda scaling', 'Logging service', 'Migrating to Ymir', 'New Relic', 'Object cache', 'Queues'],
  'Guides labels',
);

// The application pages moved out of Guides. Their old URLs redirect without a fragment, so the
// browser keeps an old link's `#fragment`, and the new pages keep the old section ids.
const redirects = {
  '/projects': ['/projects/manage', 307, []],
  '/guides/bedrock': ['/applications/bedrock', 308, ['setting-up-a-bedrock-project', 'matching-your-php-version', 'ymir-wordpress-plugin', 'building-a-bedrock-project', 'default-build-command', 'what-your-bedrock-build-contains', 'adding-bedrock-build-commands', 'bedrock-configuration', 'bedrock-values-ymir-sets', 'bedrock-env-file', 'wp-env-and-custom-environments', 'bedrock-on-aws-lambda']],
  '/guides/laravel': ['/applications/laravel', 308, ['setting-up-a-laravel-project', 'laravel-bridge', 'laravel-and-php-versions', 'health-endpoint', 'environment-configuration', 'env-files', 'configuration-values-ymir-sets', 'application-key', 'running-on-aws-lambda', 'files-and-storage', 'cache-sessions-logs-and-mail', 'scheduler', 'deploying-your-application', 'queues']],
  '/guides/wordpress-health-endpoint': ['/applications/wordpress', 308, ['health-endpoint', 'disabling-the-endpoint', 'adding-your-own-checks', 'routing-and-maintenance', 'enabling-the-deployment-health-check']],
};
for (const [from, [to, status, ids]] of Object.entries(redirects)) {
  const response = await fetch(new URL(from, baseUrl), { redirect: 'manual' });
  assert.deepEqual([response.status, response.headers.get('location')], [status, to], `${from} redirect`);
  const html = await get(to);
  for (const id of ids) assert.match(html, new RegExp(`<h[2-6] id="${id}"`), `${to} keeps #${id}`);
  if (from.startsWith('/guides/')) {
    const markdownRedirect = await fetch(new URL(`${from}.md`, baseUrl), { redirect: 'manual' });
    assert.deepEqual([markdownRedirect.status, markdownRedirect.headers.get('location')], [308, `${to}.md`], `${from}.md redirect`);
    const markdown = await fetch(new URL(`${from}.md`, baseUrl));
    assert.equal(markdown.status, 200, `${from}.md resolves`);
    assert.match(markdown.headers.get('content-type'), /^text\/markdown\b/, `${from}.md stays Markdown`);
    const legacyHtml = await fetch(new URL(`${from}.html`, baseUrl));
    assert.equal(legacyHtml.status, 200, `${from}.html resolves`);
    assert.equal(new URL(legacyHtml.url).pathname, to, `${from}.html destination`);
  }
}
// Old Managing projects fragments lead to links for the corresponding moved Radicle sections.
const radicle = await get('/applications/radicle');
const manage = await get('/projects/manage');
for (const id of ['radicle-integrations', 'radicle-acorn-on-aws-lambda', 'radicle-acorn-commands', 'radicle-queues', 'radicle-scheduled-tasks']) {
  assert.match(radicle, new RegExp(`<h2 id="${id}"`), `/applications/radicle keeps #${id}`);
  assert.match(manage, new RegExp(`<a id="${id}" href="/applications/radicle#${id}"`), `/projects/manage keeps #${id}`);
}
assert.match(radicle, /<h2 id="health-endpoint"/, '/applications/radicle health endpoint');
assert.match(manage, /<h2 id="radicle-projects"[\s\S]*?href="\/applications\/radicle"/, '/projects/manage#radicle-projects');

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
