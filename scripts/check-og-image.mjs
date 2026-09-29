// Checks the shared social card (app/opengraph-image.png, rendered from resources/og/social-card.html)
// and that every page inherits it as its Open Graph and Twitter image on a running server:
//   node scripts/check-og-image.mjs [base URL, default http://127.0.0.1:3000]
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const image = await readFile('app/opengraph-image.png');
// Next.js uses the file as is, so it has no trailing newline.
const alt = await readFile('app/opengraph-image.alt.txt', 'utf8');

// The PNG header stores the width and height in the IHDR chunk.
assert.ok(image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'PNG signature');
assert.deepEqual([image.readUInt32BE(16), image.readUInt32BE(20)], [1200, 630], 'image size');
// The Twitter limit is 5MB, but the card should stay a small static file.
assert.ok(image.length < 300_000, `image is ${image.length} bytes`);

const paths = (await readdir('content/docs', { recursive: true }))
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => `/${file.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')}`);
assert.equal(paths.length, 36, 'pages');

for (const path of paths) {
  const response = await fetch(new URL(path, baseUrl));
  assert.equal(response.status, 200, `${path} HTTP status`);
  const html = await response.text();
  const meta = (key) => html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`))?.[1];
  // Absolute in production (metadataBase) and the dev server origin in development.
  const imageUrl = new URL(meta('og:image') ?? '', baseUrl);

  assert.equal(imageUrl.pathname, '/opengraph-image.png', `${path} og:image`);
  assert.equal(meta('og:image:type'), 'image/png', `${path} og:image:type`);
  assert.equal(meta('og:image:width'), '1200', `${path} og:image:width`);
  assert.equal(meta('og:image:height'), '630', `${path} og:image:height`);
  assert.equal(meta('og:image:alt'), alt, `${path} og:image:alt`);
  // Without a twitter metadata field, Next.js copies the Open Graph images into the Twitter card.
  assert.equal(meta('twitter:card'), 'summary_large_image', `${path} twitter:card`);
  assert.equal(meta('twitter:image'), meta('og:image'), `${path} twitter:image`);
  assert.equal(meta('twitter:image:alt'), alt, `${path} twitter:image:alt`);
}

const response = await fetch(new URL('/opengraph-image.png', baseUrl));
assert.equal(response.status, 200, 'image HTTP status');
assert.equal(response.headers.get('content-type')?.split(';', 1)[0], 'image/png', 'image content type');
const served = Buffer.from(await response.arrayBuffer());
assert.ok(served.equals(image), 'served image');

console.log(`Social card OK on ${paths.length} pages`);
