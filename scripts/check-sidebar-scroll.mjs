// Checks native sticky desktop navigation and independently scrolling mobile drawers:
//   PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs [CHROME_PATH=/path/to/chrome] \
//     node scripts/check-sidebar-scroll.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();
const viewportSelector = (root) => `${root} > [role='presentation'] > [role='presentation']`;

async function openGroups(root) {
  const closed = page.locator(`${root} [data-closed] > button`);
  while (await closed.count()) await closed.first().click();
  await page.waitForFunction((selector) => document.querySelector(selector).getAnimations({ subtree: true }).every((animation) => animation.playState !== 'running'), root);
  assert.equal(await page.locator(`${root} a[data-active]`).count(), 36, 'expanded navigation contains all pages');
}

try {
  for (const [width, height] of [[1400, 900], [1024, 480], [768, 600]]) {
    const where = `${width}×${height}`;
    await page.setViewportSize({ width, height });
    await page.goto(new URL('/reference/ymir-cli', baseUrl).href, { waitUntil: 'networkidle' });
    const sidebar = page.locator('#nd-sidebar');
    const viewport = page.locator(viewportSelector('#nd-sidebar'));
    assert.equal(await sidebar.evaluate((element) => getComputedStyle(element.parentElement).position), 'sticky', `${where}: native sticky wrapper`);

    for (const y of [400, 1200]) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForFunction(() => Math.abs(document.getElementById('nd-sidebar').getBoundingClientRect().top) < 1);
      const box = await sidebar.boundingBox();
      assert.ok(Math.abs(box.height - height) < 1, `${where}: viewport-height sidebar`);
      assert.ok(await page.locator('header:has(nav[aria-label="Primary navigation"])').evaluate((element) => element.getBoundingClientRect().bottom <= 0), `${where}: marketing header scrolls away`);
    }

    await openGroups('#nd-sidebar');
    assert.ok(await viewport.evaluate((element) => element.scrollHeight > element.clientHeight), `${where}: expanded navigation scrolls internally`);
    await viewport.evaluate((element) => { element.scrollTop = 0; });
    const scrollY = await page.evaluate(() => window.scrollY);
    const box = await viewport.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 400);
    await page.waitForFunction((selector) => document.querySelector(selector).scrollTop > 0, viewportSelector('#nd-sidebar'));
    assert.equal(await page.evaluate(() => window.scrollY), scrollY, `${where}: sidebar scrolling leaves the article in place`);

    const links = sidebar.locator('a[data-active]');
    await links.nth(-2).focus();
    await page.keyboard.press('Tab');
    assert.ok(await links.last().evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return element.matches(':focus-visible') && rect.top >= 0 && rect.bottom <= innerHeight;
    }), `${where}: last navigation link is keyboard reachable and visible`);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    assert.ok(await sidebar.evaluate((element) => element.getBoundingClientRect().bottom <= document.querySelector('footer').getBoundingClientRect().top + 1), `${where}: sticky sidebar stops before the footer`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, `${where}: no horizontal overflow`);
  }

  for (const width of [767, 390]) {
    const where = `${width}px mobile`;
    await page.setViewportSize({ width, height: 700 });
    await page.goto(new URL('/reference/ymir-cli', baseUrl).href, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#nd-sidebar').isVisible(), false, `${where}: desktop sidebar hidden`);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.locator('#nd-subnav').getByRole('button', { name: 'Open Sidebar', exact: true }).click();
    const drawer = page.locator('#nd-sidebar-mobile');
    await drawer.waitFor({ state: 'visible' });
    await openGroups('#nd-sidebar-mobile');
    const viewport = page.locator(viewportSelector('#nd-sidebar-mobile'));
    assert.equal(await drawer.evaluate((element) => getComputedStyle(element).position), 'fixed', `${where}: native drawer`);
    assert.ok(await viewport.evaluate((element) => element.scrollHeight > element.clientHeight), `${where}: drawer scrolls internally`);
    await viewport.evaluate((element) => { element.scrollTop = 0; });
    const scrollY = await page.evaluate(() => window.scrollY);
    const box = await viewport.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 400);
    await page.waitForFunction((selector) => document.querySelector(selector).scrollTop > 0, viewportSelector('#nd-sidebar-mobile'));
    assert.equal(await page.evaluate(() => window.scrollY), scrollY, `${where}: drawer scrolling leaves the article in place`);
    await drawer.locator('a[href="/reference/configuration"]').click();
    await page.waitForURL(new URL('/reference/configuration', baseUrl).href);
    await drawer.waitFor({ state: 'hidden' });
  }

  console.log('Sidebar scrolling OK (three desktop sizes and two mobile widths)');
} finally {
  await browser.close();
}
