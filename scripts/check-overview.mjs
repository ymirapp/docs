// Checks the overview page link layouts (content/docs/index.mdx) on a running server:
//   node scripts/check-overview.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const get = async (path) => (await fetch(new URL(path, baseUrl))).text();

const sections = [
  ['overview-rows', ['/getting-started', '/projects/manage', '/projects/deploy', '/projects/environments']],
  ['overview-columns', ['/reference/configuration', '/reference/ymir-cli', '/reference/php-runtime']],
  [
    'overview-links',
    [
      '/guides/domain-mapping',
      '/guides/automated-deployment',
      '/guides/scaling',
      '/guides/object-cache',
      '/guides/firewall',
      '/guides/container-image-deployment',
      '/guides/bedrock',
      '/guides/laravel',
      '/guides/migration-to-ymir',
      '/guides/aws-costs',
    ],
  ],
  [
    'overview-resources',
    [
      '/team-resources/database-servers',
      '/team-resources/caches',
      '/team-resources/dns',
      '/team-resources/email',
      '/team-resources/networks',
      '/team-resources/ssl-certificates',
    ],
  ],
];

const home = await get('/');
assert.match(home, /<title>Overview \| Ymir Documentation<\/title>/, 'home HTML title');
const body = home.match(/<div class="prose flex-1 overview"[\s\S]*?<footer\b/)?.[0] ?? '';
assert.ok(body, 'home body has the overview class');
assert.deepEqual(
  [...body.matchAll(/<h2 [^>]*id="([^"]*)"/g)].map((match) => match[1]),
  ['start-here', 'reference', 'guides', 'team-resources', 'use-these-docs-with-ai-agents'],
  'home section order',
);

// Each section renders plain card links, without the boxed Fumadocs card classes.
const blocks = [...body.matchAll(/<div class="(overview-[a-z]+)">([\s\S]*?<\/a>)<\/div>/g)];
assert.deepEqual(
  blocks.map(([, className, html]) => [className, [...html.matchAll(/<a data-card="true" class="group block" href="([^"]*)"/g)].map((match) => match[1])]),
  sections,
  'home link layouts and destinations',
);
assert.ok(!body.includes('rounded-xl border bg-fd-card'), 'home has no boxed cards');

assert.match(body, /id="team-resources"[^>]*>[\s\S]*?<\/h2>\s*<p>Manage the shared infrastructure behind your projects\.<\/p>\s*<div class="overview-resources">/, 'team resources intro');

// The intro links, AI agents text and MCP example stay on the page.
for (const text of ['href="/introduction"', 'href="/getting-started"', 'href="/llms.txt"', 'href="/llms-full.txt"', 'href="/reference/configuration.md"', 'https://modelcontextprotocol.io', 'MCP configuration', 'ymir-docs']) {
  assert.ok(body.includes(text), `home includes ${text}`);
}

// The overview is a link index with a table of contents but no pager.
const pager = '<nav aria-label="Previous and next documentation pages"';
assert.match(home, /<article id="nd-page"[^>]*class="[^"]*\boverview-page"/, 'home page class');
assert.ok(home.includes('id="nd-toc"'), 'home table of contents');
assert.ok(home.includes('data-toc-popover'), 'home table of contents popover');
assert.ok(!home.includes(pager), 'home has no pager');

// Articles keep the default page and body without the overview layouts.
const article = await get('/reference/configuration');
assert.match(article, /<title>Configuration reference \| Ymir Documentation<\/title>/, 'article HTML title');
assert.match(article, /<div class="prose flex-1">/, 'article body class');
assert.ok(!/overview-(page|rows|columns|links|resources)/.test(article), 'article has no overview layouts');
assert.ok(article.includes('id="nd-toc"'), 'article table of contents');
assert.ok(article.includes('data-toc-popover'), 'article table of contents popover');
assert.match(article, /class="[^"]*\bpage-toc\b/, 'article block table of contents');
assert.ok(article.includes(pager), 'article pager');

console.log('Overview layout OK');
