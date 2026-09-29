// Checks the previous and next page cards (components/page-navigation.tsx) on a running server: every
// page's neighbours, names and descriptions over HTTP, then the card layout, type and states in a
// browser, with a Playwright install from outside the project:
//   PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs [CHROME_PATH=/path/to/chrome] \
//     node scripts/check-pager.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';

// The page tree order from content/docs/meta.json, which the native Fumadocs footer also follows.
const order = [
  '/',
  '/introduction',
  '/getting-started',
  '/teams',
  '/projects/manage',
  '/projects/environments',
  '/projects/deploy',
  '/team-resources/caches',
  '/team-resources/database-servers',
  '/team-resources/dns',
  '/team-resources/email',
  '/team-resources/networks',
  '/team-resources/ssl-certificates',
  '/guides/bedrock',
  '/guides/laravel',
  '/guides/queues',
  '/guides/container-image-deployment',
  '/guides/domain-mapping',
  '/guides/scaling',
  '/guides/automated-deployment',
  '/guides/firewall',
  '/guides/object-cache',
  '/guides/cloudflare',
  '/guides/logging-service',
  '/guides/new-relic',
  '/guides/gd-extension',
  '/guides/migration-to-ymir',
  '/guides/aws-costs',
  '/compatibility/beaver-builder',
  '/compatibility/elementor',
  '/compatibility/oxygen',
  '/compatibility/sage-10',
  '/compatibility/woocommerce',
  '/reference/configuration',
  '/reference/php-runtime',
  '/reference/ymir-cli',
];

const label = 'Previous and next documentation pages';
const text = (html) =>
  html.replace(/<!-- -->|<[^>]*>/g, '').replace(/&(amp|lt|gt|quot|#x27|#39);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"' })[name] ?? "'");
const pages = new Map();
for (const path of order) pages.set(path, await (await fetch(new URL(path, baseUrl))).text());

// Each neighbour shows its sidebar name (`navTitle` or title), read from its own page where its
// sidebar group is open, and its frontmatter description.
const sidebarName = (path) => {
  const aside = pages.get(path).match(/<aside id="nd-sidebar"[\s\S]*?<\/aside>/)[0];
  return text(aside.match(new RegExp(`<a\\b[^>]*\\shref="${path}"[^>]*>([\\s\\S]*?)</a>`))[1]).trim();
};
const description = (path) => text(pages.get(path).match(/<meta name="description" content="([^"]*)"/)[1]);

assert.ok(!pages.get('/').includes(`aria-label="${label}"`), 'the overview has no pager');
for (const [index, path] of order.entries()) {
  if (path === '/') continue;
  const html = pages.get(path);
  assert.equal(html.split(`aria-label="${label}"`).length - 1, 1, `${path} has one pager`);
  assert.ok(!html.includes('<div class="@container grid gap-4'), `${path} has no native footer`);
  const nav = html.match(new RegExp(`<nav aria-label="${label}" class="page-navigation">([\\s\\S]*?)</nav>`))[1];
  const cards = [...nav.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attributes, inner]) => ({
    href: attributes.match(/\shref="([^"]*)"/)?.[1],
    rel: attributes.match(/\srel="([^"]*)"/)?.[1],
    rows: [...inner.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/g)].map((match) => text(match[1])),
  }));
  const expected = [
    ['prev', order[index - 1], 'Previous'],
    ['next', order[index + 1], 'Next'],
  ]
    .filter(([, href]) => href)
    .map(([rel, href, direction]) => ({ href, rel, rows: [direction, sidebarName(href), description(href)] }));
  assert.deepEqual(cards, expected, `${path} pager`);
}

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();
const copy = 'rgb(64, 89, 77)';
const ink = 'rgb(7, 24, 18)';
const patina = 'rgb(100, 139, 115)';
const proof = 'rgb(231, 232, 219)';
const rule = 'rgba(7, 24, 18, 0.18)';

for (const width of [1400, 390]) {
  await page.setViewportSize({ width, height: 900 });
  for (const path of ['/getting-started', '/reference/ymir-cli']) {
    const where = `${path} at ${width}px`;
    await page.goto(new URL(path, baseUrl).href);
    const nav = page.locator(`nav[aria-label="${label}"]`);
    await nav.scrollIntoViewIfNeeded();

    const result = await nav.evaluate((element) => {
      const style = (node) => {
        const { fontSize, lineHeight, fontWeight, color, textDecorationLine } = getComputedStyle(node);
        return { size: fontSize, lineHeight, weight: fontWeight, color, decoration: textDecorationLine };
      };
      return {
        gap: element.getBoundingClientRect().top - element.previousElementSibling.getBoundingClientRect().bottom,
        icons: element.querySelectorAll('svg').length,
        generated: [...element.querySelectorAll('*')].flatMap((node) => ['::before', '::after'].map((pseudo) => getComputedStyle(node, pseudo).content)).filter((content) => content !== 'none'),
        cards: [...element.children].map((link) => {
          const { padding, borderRadius, borderColor, borderWidth, textAlign } = getComputedStyle(link);
          return { padding, borderRadius, borderColor, borderWidth, textAlign, box: link.getBoundingClientRect().toJSON(), rows: [...link.children].map((row) => ({ ...style(row), top: row.getBoundingClientRect().top })) };
        }),
      };
    });

    close(result.gap, 48, `${where}: body to pager`);
    assert.deepEqual([result.icons, result.generated], [0, []], `${where}: no arrows or generated labels`);
    assert.equal(result.cards.length, path === '/reference/ymir-cli' ? 1 : 2, `${where}: cards`);
    for (const card of result.cards) {
      assert.deepEqual([card.padding, card.borderRadius, card.borderWidth, card.borderColor, card.textAlign], ['20px', '0px', '1px', rule, 'start'], `${where}: card surface`);
      const [direction, title, summary] = card.rows;
      assert.deepEqual(direction, { size: '14px', lineHeight: '21px', weight: '400', color: copy, decoration: 'none', top: direction.top }, `${where}: direction label`);
      assert.deepEqual(title, { size: '16px', lineHeight: '26.4px', weight: '600', color: ink, decoration: 'none', top: title.top }, `${where}: title`);
      assert.deepEqual(summary, { size: '14px', lineHeight: '21px', weight: '400', color: copy, decoration: 'none', top: summary.top }, `${where}: description`);
      close(title.top - direction.top, 21 + 8, `${where}: label to title`);
    }
    if (result.cards.length === 2) {
      const [previous, next] = result.cards.map((card) => card.box);
      // Side by side on wider screens, stacked on phones, 16px apart either way.
      if (width > 560) {
        close(next.top, previous.top, `${where}: cards share a row`);
        close(next.left - previous.right, 16, `${where}: card gap`);
      } else {
        close(next.left, previous.left, `${where}: cards stack`);
        close(next.top - previous.bottom, 16, `${where}: stacked card gap`);
      }
    }

    // Hover and keyboard focus: patina border on proof, with the title underlined.
    const link = nav.locator('a').first();
    const state = () =>
      link.evaluate((element) => {
        const { borderColor, backgroundColor } = getComputedStyle(element);
        return [borderColor, backgroundColor, getComputedStyle(element.children[1]).textDecorationLine];
      });
    await link.hover();
    assert.deepEqual(await state(), [patina, proof, 'underline'], `${where}: hovered card`);
    await page.mouse.move(0, 0);
    await link.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    assert.ok(await link.evaluate((element) => element.matches(':focus-visible')), `${where}: card has keyboard focus`);
    assert.deepEqual(await state(), [patina, proof, 'underline'], `${where}: focused card`);
  }
}

function close(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 0.5, `${message} is ${actual}, expected ${expected}`);
}

await browser.close();
console.log(`Pager checks passed for ${order.length} pages.`);
