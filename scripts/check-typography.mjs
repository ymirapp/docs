// Checks the shared page, reading, table, code, callout and table of contents styles (app/global.css,
// components/mdx.tsx, source.config.ts) in a browser on a running server, with a Playwright install from outside the project:
//   PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs [CHROME_PATH=/path/to/chrome] \
//     node scripts/check-typography.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');

const pages = ['/', '/introduction', '/getting-started', '/reference/configuration', '/reference/ymir-cli', '/guides/bedrock', '/guides/scaling', '/team-resources/dns'];
// Code blocks whose fence opts in to the Copy button with the `copy` flag (source.config.ts). Every
// other block, including configuration, output and CLI reference examples, has none.
const copyableCodeBlocks = { '/getting-started': 5 };
const widths = [1400, 1024, 800, 768, 390];
const copy = 'rgb(64, 89, 77)';
const ink = 'rgb(7, 24, 18)';
// Code block palette: bone text, signal syntax and inverse copy for comments, punctuation and controls.
const bone = 'rgb(233, 231, 220)';
const signal = 'rgb(165, 201, 168)';
const copyInverse = 'rgb(180, 195, 185)';
const codeColors = [bone, signal, copyInverse];
const proof = 'rgb(231, 232, 219)';
const action = 'rgb(47, 122, 84)';
const rule = 'rgba(7, 24, 18, 0.14)';
// Callouts: a 9% status tint and 32% status border on paper, and an 80% status label on ink.
const calloutLabels = { info: 'Note', warning: 'Warning', error: 'Error' };
const calloutColors = { info: action, warning: '#94620b', error: '#b3402e' };
const paper = '#f4f1e6';
// Table of contents link indent by heading level, from the Fumadocs block style.
const tocIndents = { H2: '8px', H3: '20px', H4: '32px', H5: '32px', H6: '32px' };

// Computed colors as 0-255 channels, from `rgb()` or the `color(srgb)` that `color-mix()` returns.
const channels = (color) => {
  if (color.startsWith('#')) return color.match(/\w\w/g).map((hex) => parseInt(hex, 16));
  const values = color.match(/[\d.]+/g).slice(0, 3).map(Number);
  return color.startsWith('color(') ? values.map((value) => value * 255) : values;
};
const mix = (color, base, amount) => channels(color).map((value, index) => value * amount + channels(base)[index] * (1 - amount));

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
// Clipboard access lets the code block copy check read what the copy button wrote.
const permissions = ['clipboard-read', 'clipboard-write'];
const mouse = await browser.newPage({ permissions });
// Phone widths use touch, so the table of contents links keep their 44px targets.
const touch = await browser.newPage({ hasTouch: true, permissions });

for (const width of widths) {
  const phone = width <= 560;
  const page = phone ? touch : mouse;
  await page.setViewportSize({ width, height: 900 });

  for (const path of pages) {
    await page.goto(new URL(path, baseUrl).href);
    const where = `${path} at ${width}px`;
    const result = await page.evaluate(() => {
      const style = (element) => {
        const { fontSize, lineHeight, fontWeight, letterSpacing, color } = getComputedStyle(element);
        return { size: parseFloat(fontSize), lineHeight: parseFloat(lineHeight), weight: fontWeight, tracking: parseFloat(letterSpacing) || 0, color };
      };
      const box = (selector) => document.querySelector(selector)?.getBoundingClientRect();
      const reading = ':not(.not-prose, .not-prose *)';
      const toc = [...document.querySelectorAll('#nd-toc a')].find((link) => link.offsetParent);

      return {
        title: style(document.querySelector('#nd-page > h1')),
        lead: style(document.querySelector('#nd-page > h1 + p')),
        body: style(document.querySelector(`#nd-page > .prose p${reading}`)),
        h2: [...document.querySelectorAll(`#nd-page > .prose h2${reading}`)].map(style),
        minor: [...document.querySelectorAll(`#nd-page > .prose :is(h3, h4, h5, h6)${reading}`)].map(style),
        toc: toc && style(toc),
        tocTitle: toc && style(document.querySelector('#toc-title')),
        smoothing: getComputedStyle(document.querySelector(`#nd-page > .prose p${reading}`)).webkitFontSmoothing,
        inlineCode: [...document.querySelectorAll(`#nd-page > .prose code:not(pre *, .docs-callout *)${reading}`)].map((code) => {
          const { padding, borderWidth, borderRadius, backgroundColor } = getComputedStyle(code);
          return { padding, borderWidth, borderRadius, backgroundColor };
        }),
        codeCopyButtons: document.querySelectorAll('figure.shiki button').length,
        code: [...document.querySelectorAll('figure.shiki pre')].map(style),
        codeBlocks: [...document.querySelectorAll('figure.shiki')].map((figure) => {
          const { backgroundColor, borderRadius } = getComputedStyle(figure);
          const tokens = [...figure.querySelectorAll('pre code span span')].filter((span) => span.textContent.trim());
          const viewport = figure.querySelector(':scope > [role="region"]');
          return {
            backgroundColor,
            borderRadius,
            colors: [...new Set(tokens.map((span) => getComputedStyle(span).color))],
            copyColor: figure.querySelector('button') && getComputedStyle(figure.querySelector('button')).color,
            header: figure.querySelector(':scope > div:has(> figcaption)')?.getBoundingClientRect().height,
            actionsRow: figure.querySelector(':scope > div:not([role="region"], :has(> figcaption))')?.getBoundingClientRect().height ?? 0,
            viewport: { tabIndex: viewport.tabIndex, overflowX: getComputedStyle(viewport).overflowX, hiddenHeight: viewport.scrollHeight - viewport.clientHeight },
          };
        }),
        nativeCallouts: document.querySelectorAll('#nd-page > .prose [style*="--callout-color"]').length,
        callouts: [...document.querySelectorAll('#nd-page > .prose .docs-callout')].map((callout) => {
          const { backgroundColor, borderColor, borderRadius, boxShadow, padding } = getComputedStyle(callout);
          const [label, title] = callout.querySelectorAll('.docs-callout-heading > p');
          const body = callout.querySelector('.docs-callout-heading + div');
          const icon = callout.querySelector(':scope > svg');
          const edge = callout.getBoundingClientRect();
          const offset = (element) => {
            const { left, top, bottom, width, height } = element.getBoundingClientRect();
            return { left: left - edge.left, top: top - edge.top, bottom: bottom - edge.top, width, height };
          };
          return {
            type: callout.style.getPropertyValue('--callout-color').match(/--color-fd-(\w+)/)[1],
            surface: { backgroundColor, borderColor, borderRadius, boxShadow, padding },
            label: { text: label.textContent, transform: getComputedStyle(label).textTransform, ...style(label), ...offset(label) },
            title: title && { text: title.textContent, ...style(title), ...offset(title) },
            body: { ...style(body), ...offset(body) },
            icon: { color: getComputedStyle(icon).color, ...offset(icon) },
            paragraphGaps: [...body.querySelectorAll(':scope > p + p')].map(
              (paragraph) => paragraph.getBoundingClientRect().top - paragraph.previousElementSibling.getBoundingClientRect().bottom,
            ),
          };
        }),
        tables: [...document.querySelectorAll(`#nd-page > .prose table${reading}`)].map((table) => ({
          borderRadius: getComputedStyle(table).borderRadius,
          overflowX: getComputedStyle(table.parentElement).overflowX,
          headers: [...table.querySelectorAll('thead th')].map((header) => {
            const { fontFamily, textTransform } = getComputedStyle(header);
            return { ...style(header), family: fontFamily.split(',')[0], transform: textTransform };
          }),
          cells: [...table.querySelectorAll('tbody td')].map(style),
        })),
        breadcrumb: box('.page-breadcrumb'),
        h1: box('#nd-page > h1'),
        leadBox: box('#nd-page > h1 + p'),
        copyButton: box('#nd-page > button'),
        prose: box('#nd-page > .prose'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 0.5, `${where}: ${message} is ${actual}, expected ${expected}`);
    const titleSize = Math.min(44, Math.max(32, width * 0.03));

    close(result.title.size, titleSize, 'title size');
    close(result.title.lineHeight, titleSize * 1.15, 'title line height');
    close(result.title.tracking, titleSize * -0.035, 'title tracking');
    assert.equal(result.title.weight, '500', `${where}: title weight`);

    close(result.lead.size, 18, 'lead size');
    close(result.lead.lineHeight, 27.9, 'lead line height');
    assert.equal(result.lead.color, copy, `${where}: lead color`);

    close(result.body.size, 16, 'body size');
    close(result.body.lineHeight, 26.4, 'body line height');
    assert.equal(result.body.color, copy, `${where}: body color`);

    assert.ok(result.h2.length > 0, `${where}: has section headings`);
    for (const heading of result.h2) {
      close(heading.size, 20, 'h2 size');
      close(heading.lineHeight, 28, 'h2 line height');
      assert.deepEqual([heading.weight, heading.color], ['600', ink], `${where}: h2 weight and color`);
    }
    for (const heading of result.minor) {
      close(heading.size, 16, 'h3-h6 size');
      close(heading.lineHeight, 26.4, 'h3-h6 line height');
      assert.deepEqual([heading.weight, heading.color], ['600', ink], `${where}: h3-h6 weight and color`);
    }

    if (result.toc) {
      close(result.toc.size, 14, 'table of contents size');
      assert.deepEqual([result.tocTitle.weight, result.tocTitle.color], ['600', ink], `${where}: table of contents label`);
    }

    assert.equal(result.codeCopyButtons, copyableCodeBlocks[path] ?? 0, `${where}: only opted-in code blocks have a copy button`);
    for (const code of result.code) close(code.size, 14, 'code block size');

    assert.equal(result.smoothing, 'antialiased', `${where}: body text smoothing`);
    for (const code of result.inlineCode) {
      assert.deepEqual(code, { padding: '2px 4px', borderWidth: '0px', borderRadius: '3px', backgroundColor: proof }, `${where}: inline code chip`);
    }
    for (const block of result.codeBlocks) {
      assert.deepEqual([block.backgroundColor, block.borderRadius], [ink, '8px'], `${where}: code block surface`);
      if (block.copyColor) assert.equal(block.copyColor, copyInverse, `${where}: code block copy button`);
      // Titled headers keep their 44px height without a button, and untitled blocks hide an empty actions row.
      if (block.header !== undefined) close(block.header, 44, 'code block title header');
      if (!block.copyColor && block.header === undefined) assert.equal(block.actionsRow, 0, `${where}: empty code block actions row`);
      for (const color of block.colors) assert.ok(codeColors.includes(color), `${where}: code block token color ${color}`);
      // Code blocks show their full height and stay keyboard scrollable sideways.
      assert.deepEqual(block.viewport, { tabIndex: 0, overflowX: 'auto', hiddenHeight: 0 }, `${where}: code block viewport`);
    }

    // Tables: square, quieter 14px semibold Geist headers in their source casing over 16px cells,
    // scrolling sideways.
    for (const table of result.tables) {
      assert.deepEqual([table.borderRadius, table.overflowX], ['0px', 'auto'], `${where}: table surface`);
      assert.ok(table.headers.length > 0, `${where}: table has headers`);
      for (const header of table.headers) {
        close(header.size, 14, 'table header size');
        close(header.lineHeight, 21, 'table header line height');
        assert.deepEqual([header.family, header.weight, header.transform, header.color], ['Geist', '600', 'none', ink], `${where}: table header type`);
      }
      for (const cell of table.cells) close(cell.size, 16, 'table cell size');
    }

    // Every callout is the Ymir one from the redesign, named by its type label as well as its color:
    // a square status surface, with the icon in the 20px padding and the text inset 50px inside the
    // border, or 16px and 44px on phones.
    const calloutPadding = phone ? 16 : 20;
    const textLeft = (phone ? 44 : 50) + 1;
    const colorClose = (actual, expected, message) =>
      channels(actual).forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < 1, `${where}: ${message} is ${actual}, expected rgb(${expected.map(Math.round)})`));
    assert.equal(result.callouts.length, result.nativeCallouts, `${where}: every callout has a type label`);
    for (const callout of result.callouts) {
      const what = `${where}: ${callout.type} callout "${callout.title?.text}"`;
      const status = calloutColors[callout.type];
      assert.ok(status, `${what} type`);
      colorClose(callout.surface.backgroundColor, mix(status, paper, 0.09), `${what} background`);
      colorClose(callout.surface.borderColor, mix(status, paper, 0.32), `${what} border`);
      assert.deepEqual([callout.surface.borderRadius, callout.surface.boxShadow, callout.surface.padding], ['0px', 'none', `${calloutPadding}px`], `${what} surface`);

      assert.equal(callout.label.text, calloutLabels[callout.type], `${what} label`);
      colorClose(callout.label.color, mix(status, ink, 0.8), `${what} label color`);
      close(callout.label.size, 12, `${what} label size`);
      close(callout.label.lineHeight, 20, `${what} label line height`);
      close(callout.label.tracking, 0.96, `${what} label tracking`);
      assert.deepEqual([callout.label.weight, callout.label.transform], ['600', 'uppercase'], `${what} label weight and case`);

      colorClose(callout.icon.color, channels(status), `${what} icon color`);
      close(callout.icon.width, 18, `${what} icon width`);
      close(callout.icon.left, calloutPadding + 1, `${what} icon left`);
      close(callout.icon.top, calloutPadding + 2, `${what} icon top`);

      assert.ok(callout.title?.text, `${what} keeps its title`);
      assert.deepEqual([callout.title.weight, callout.title.color], ['600', ink], `${what} title`);
      close(callout.title.size, 16, `${what} title size`);
      close(callout.title.top - callout.label.bottom, 4, `${what} label to title`);
      close(callout.body.top - callout.title.bottom, 12, `${what} title to body`);
      for (const box of [callout.label, callout.title, callout.body]) close(box.left, textLeft, `${what} text inset`);

      close(callout.body.size, 16, `${what} body size`);
      close(callout.body.lineHeight, 26.4, `${what} body line height`);
      assert.equal(callout.body.color, copy, `${what} body color`);
      for (const gap of callout.paragraphGaps) close(gap, 12, `${what} paragraph gap`);
    }

    // Header spacing: breadcrumb 24px, lead 20px, Copy Markdown 8px and body 32px.
    if (result.breadcrumb) close(result.h1.top - result.breadcrumb.bottom, 24, 'breadcrumb to title');
    close(result.leadBox.top - result.h1.bottom, 20, 'title to lead');
    close(result.copyButton.top - result.leadBox.bottom, 8, 'lead to Copy Markdown');
    close(result.prose.top - result.copyButton.bottom, 32, 'Copy Markdown to body');

    assert.ok(result.overflow <= 0, `${where}: page overflows horizontally by ${result.overflow}px`);

    // Opted-in code block copy buttons show the native status text, by mouse and keyboard: Copy, then
    // Copied with the block's text on the clipboard, then Copy again. They sit above the code, in the
    // title header or the untitled actions row, so they never cover it.
    const copyable = 'figure.shiki:has(button[aria-live="polite"])';
    assert.equal(await page.locator(copyable).count(), copyableCodeBlocks[path] ?? 0, `${where}: copyable code blocks`);
    for (const figure of [page.locator(`${copyable}:not(:has(figcaption))`).first(), page.locator(`${copyable}:has(figcaption)`).first()]) {
      if (!(await figure.count())) continue;
      const button = figure.locator('button');
      const state = () => button.evaluate((element) => [element.innerText, element.querySelector('svg').classList.contains('lucide-check')]);
      const what = `${where}: ${(await figure.locator('figcaption').count()) ? 'titled' : 'untitled'} code block copy button`;
      // The block text without its copy-ignored nodes, as the native button copies it.
      const text = await figure.evaluate((element) => {
        const pre = element.querySelector('pre').cloneNode(true);
        pre.querySelectorAll('.nd-copy-ignore').forEach((node) => node.replaceWith('\n'));
        return pre.textContent;
      });
      const layout = await figure.evaluate((element) => {
        const box = element.querySelector('button').getBoundingClientRect();
        const viewport = element.querySelector(':scope > [role="region"]').getBoundingClientRect();
        return { height: box.height, overlap: box.bottom - viewport.top };
      });
      assert.ok(layout.height >= 44, `${what} height ${layout.height}`);
      assert.ok(layout.overlap <= 0.5, `${what} covers the code by ${layout.overlap}px`);

      await figure.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      for (const activate of [() => button.click(), () => button.focus().then(() => page.keyboard.press('Enter'))]) {
        await page.evaluate(() => navigator.clipboard.writeText(''));
        assert.deepEqual(await state(), ['Copy', false], `${what} before copying`);
        await activate();
        await page.waitForFunction((element) => element.innerText === 'Copied', await button.elementHandle());
        assert.deepEqual(await state(), ['Copied', true], `${what} after copying`);
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), text, `${what} clipboard`);
        await page.waitForFunction((element) => element.innerText === 'Copy', await button.elementHandle(), { timeout: 3000 });
      }
    }

    // Table of contents, in the sidebar column or the opened narrow-screen popover: a straight rail,
    // each link indented by its heading level, and every current section marked on its own. The
    // configuration page scrolls to a run of short sections so several are current at once.
    if (path === '/reference/configuration') {
      await page.evaluate(() => document.getElementById('project-configuration').scrollIntoView());
      await page.waitForFunction(() => document.querySelector('.page-toc > a[href="#project-configuration"][data-active="true"]'));
    }
    const trigger = page.locator('[data-toc-popover-trigger]');
    if (await trigger.isVisible()) {
      // A click before React hydrates the native trigger is dropped, so wait for its props first.
      await page.waitForFunction((element) => Object.keys(element).some((key) => key.startsWith('__reactProps')), await trigger.elementHandle());
      await trigger.click();
      await page.locator('[data-toc-popover] .page-toc').waitFor({ state: 'visible' });
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true', `${where}: table of contents popover opens`);
    }
    const toc = await page.evaluate(() => [...document.querySelectorAll('.page-toc')].filter((list) => list.offsetParent).map((list) => ({
      block: getComputedStyle(list.firstElementChild).display,
      fine: matchMedia('(hover: hover) and (pointer: fine)').matches,
      links: [...list.querySelectorAll(':scope > a')].map((link) => {
        const { borderLeftStyle, borderLeftWidth, borderLeftColor, paddingLeft, minHeight, fontWeight, color, transitionDuration } = getComputedStyle(link);
        return {
          href: link.getAttribute('href'),
          heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))?.tagName,
          active: link.dataset.active === 'true',
          rail: [borderLeftStyle, borderLeftWidth, transitionDuration],
          railColor: borderLeftColor,
          paddingLeft,
          minHeight,
          height: link.getBoundingClientRect().height,
          weight: fontWeight,
          color,
        };
      }),
    })));

    for (const list of toc) {
      const target = list.fine ? 36 : 44;
      assert.equal(list.block, 'none', `${where}: table of contents has no sliding highlight`);
      for (const link of list.links) {
        const what = `${where}: table of contents link ${link.href}`;
        assert.deepEqual(link.rail, ['solid', '1px', '0s'], `${what} rail`);
        assert.equal(link.paddingLeft, tocIndents[link.heading], `${what} indent`);
        assert.equal(link.minHeight, `${target}px`, `${what} target`);
        assert.ok(link.height >= target, `${what} height ${link.height}`);
        assert.deepEqual(
          [link.railColor, link.weight, link.color],
          link.active ? [action, '600', ink] : [rule, '400', copy],
          `${what} ${link.active ? 'current' : 'other'} section`,
        );
      }
      if (path === '/reference/configuration') {
        const current = list.links.filter((link) => link.active).map((link) => link.href);
        assert.ok(current[0] === '#project-configuration' && current.length > 1, `${where}: several current sections ${current}`);
      }
    }
    assert.ok(toc.length > 0 || path === '/', `${where}: table of contents is shown`);
  }
}

await browser.close();
console.log(`Typography checks passed for ${pages.length} pages at ${widths.join(', ')}px.`);
