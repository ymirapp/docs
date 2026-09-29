// Checks the code block Copy policy in source.config.ts with the installed Fumadocs pipeline, without a server:
// Copy is off unless a fence has the `copy` flag, `noCopy` wins, and the flag stays out of the Markdown
// pages, llms-full.txt, MCP and search.
//   node scripts/check-code-copy.mjs (Node 22 needs --experimental-strip-types)
import assert from 'node:assert/strict';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { rehypeCode, remarkHeading, remarkStructure } from 'fumadocs-core/mdx-plugins';
import { remarkLLMs } from 'fumadocs-core/mdx-plugins/remark-llms';
import config, { docs } from '../source.config.ts';

const { rehypeCodeOptions, remarkStructureOptions } = config.mdxOptions;

// The `<pre>` properties Fumadocs passes to its CodeBlock, which reads `allowCopy` and `title`.
const highlighter = unified().use(remarkParse).use(remarkRehype).use(rehypeCode, rehypeCodeOptions);
const pre = async (meta) => {
  let found;
  visit(await highlighter.run(highlighter.parse(`\`\`\`bash ${meta}\nymir login\n\`\`\``)), 'element', (node) => {
    if (node.tagName === 'pre') found = node;
  });
  return found;
};

for (const [meta, allowCopy, title] of [
  ['', 'false'],
  ['copy', 'true'],
  ['title="Install" copy', 'true', 'Install'],
  ['copy title="Install"', 'true', 'Install'],
  ['title="Copy this"', 'false', 'Copy this'],
  ['noCopy copy', 'false'],
  ['copy noCopy', 'false'],
]) {
  const { properties } = await pre(meta);
  assert.deepEqual([properties.allowCopy, properties.title], [allowCopy, title], `\`${meta}\` Copy and title`);
}
const numbered = await pre('lineNumbers copy');
assert.deepEqual([numbered.properties.allowCopy, numbered.properties['data-line-numbers']], ['true', true], 'native line numbers with copy');

// Markdown and search output for flagged fences match the same content written without the flag.
const flagged = [
  '# Install [#install]',
  '```bash copy\nymir login\n```',
  '```text title="~/.ssh/config" copy\nHost example\n```',
  '```text copy title="Copy this"\nHost example\n```',
  '<Callout title="Deploy">\n```bash copy\nymir deploy staging\n```\n</Callout>',
  '```json title="Policy"\n{}\n```',
  '```\nplain\n```',
].join('\n\n');
const unflagged = flagged.replace(/ copy(?=[ \n])/g, '');
assert.equal(flagged.split(' copy').length - 1, 4, 'fixture has its copy flags');

const markdown = async (source) => {
  const file = new VFile(source);
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkLLMs, { ...docs.docs.postprocess.includeProcessedMarkdown, _data: true });
  await processor.run(processor.parse(source), file);
  return file.data.markdown;
};
const structure = async (source) => {
  const file = new VFile(source);
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkHeading).use(remarkStructure, remarkStructureOptions);
  await processor.run(processor.parse(source), file);
  return file.data.structuredData;
};

const output = await markdown(flagged);
assert.equal(output, await markdown(unflagged), 'Markdown without the copy flag');
assert.ok(!/```\w* copy\b| copy\n/.test(output), 'Markdown has no copy flag');
for (const fence of ['```bash\nymir login', '```text title="~/.ssh/config"\n', '```text title="Copy this"\n', '> ```bash\n> ymir deploy staging', '```json title="Policy"\n']) {
  assert.ok(output.includes(fence), `Markdown keeps ${JSON.stringify(fence)}`);
}
assert.deepEqual(await structure(flagged), await structure(unflagged), 'search index without the copy flag');

console.log('Code block copy policy OK');
