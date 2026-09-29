import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';
import type { LLMsOptions } from 'fumadocs-core/mdx-plugins/remark-llms';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import {
  parseCodeBlockAttributes,
  rehypeCodeDefaultOptions,
  remarkStructureDefaultOptions,
} from 'fumadocs-core/mdx-plugins';

const alertTypes: Record<string, string> = { info: 'NOTE', warn: 'WARNING', error: 'CAUTION' };

/**
 * Marketing palette (ymir/app resources/css/app.css) for the code block theme, which Shiki needs as
 * literal colors rather than CSS variables.
 */
const codeColors = { ink: '#071812', bone: '#e9e7dc', signal: '#a5c9a8', copyInverse: '#b4c3b9' };

/**
 * Reads a string attribute from an MDX JSX element.
 */
function attribute(node: MdxJsxFlowElement, name: string): string | undefined {
  const attr = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);

  return typeof attr?.value === 'string' ? attr.value : undefined;
}

/**
 * Code block flag that shows the Copy button on a block. Copy is off by default (`rehypeCodeOptions`).
 */
const copyFlag = 'copy';

/**
 * Splits the `copy` flag from the rest of a code block meta string.
 */
function parseCopyFlag(meta: string): { copy: boolean; rest: string } {
  const { attributes, rest } = parseCodeBlockAttributes(meta, [copyFlag]);

  return { copy: copyFlag in attributes, rest };
}

/**
 * Renders the MDX components used in content as plain Markdown so the Markdown pages,
 * llms-full.txt and MCP get the same information as the HTML page.
 */
const llmsOptions: LLMsOptions = {
  stringify(node, parent, state, info) {
    // `copy` is a site UI flag, so the Markdown keeps the fence as the author wrote it without it.
    if (node.type === 'code' && node.meta) {
      const { copy, rest } = parseCopyFlag(node.meta);
      if (!copy) return;

      return state.handle({ ...node, meta: rest.trim() || null }, parent, state, info);
    }

    if (node.type !== 'mdxJsxFlowElement') return;

    if (node.name === 'Callout') {
      const title = attribute(node, 'title');
      const body = state.containerFlow(node, info);
      const alert = alertTypes[attribute(node, 'type') ?? 'info'] ?? 'NOTE';

      return [`[!${alert}]`, ...(title ? [`**${title}**`, ''] : []), ...body.split('\n')]
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n');
    }

    if (node.name === 'Cards') return state.containerFlow(node, info);

    if (node.name === 'Card') {
      const text = state.containerFlow(node, info).replace(/\s+/g, ' ').trim();

      return `- [${attribute(node, 'title')}](${attribute(node, 'href')})${text ? `: ${text}` : ''}`;
    }
  },
};

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      /** Short sidebar label, when the title is too long for navigation. */
      navTitle: z.string().optional(),
      /** Deepest heading level listed in the table of contents. */
      tocDepth: z.number().int().min(2).max(6).default(4),
    }),
    postprocess: {
      includeProcessedMarkdown: llmsOptions,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // Index code blocks too, so commands, options and configuration keys that only appear in
    // examples are searchable.
    remarkStructureOptions: {
      types: [...remarkStructureDefaultOptions.types, 'code'],
      stringify: {
        stringify: (node) => (node.type === 'code' ? node.value : undefined),
      },
    },
    // Code blocks use the marketing CLI colors: bone on ink, signal for keys, strings, keywords and
    // functions, and inverse copy for comments and punctuation. Unquoted values and arguments stay
    // bone. The site is forced light, so only the light theme that Fumadocs reads is set.
    rehypeCodeOptions: {
      // Code blocks have no Copy button unless the fence opts in with `copy`, so output, configuration,
      // placeholder and multi-command examples aren't one click from a terminal. The native parser
      // still reads `title`, `tab`, `lineNumbers` and `noCopy`, which wins over `copy`.
      meta: { allowCopy: 'false' },
      parseMetaString(meta, ...args) {
        const { copy, rest } = parseCopyFlag(meta);

        return { ...(copy && { allowCopy: 'true' }), ...rehypeCodeDefaultOptions.parseMetaString?.(rest, ...args) };
      },
      themes: {
        light: {
          name: 'ymir',
          type: 'dark',
          colors: { 'editor.background': codeColors.ink, 'editor.foreground': codeColors.bone },
          tokenColors: [
            {
              scope: [
                'entity.name.tag',
                'support.type.property-name',
                'string',
                'keyword',
                'storage',
                'entity.name.function',
                'entity.name.command',
                'support.function',
                'punctuation.definition.string',
                'punctuation.support.type.property-name',
              ],
              settings: { foreground: codeColors.signal },
            },
            { scope: ['string.unquoted', 'keyword.operator'], settings: { foreground: codeColors.bone } },
            { scope: ['comment', 'punctuation'], settings: { foreground: codeColors.copyInverse } },
          ],
        },
      },
    },
  },
});
