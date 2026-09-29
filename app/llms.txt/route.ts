import { docsLlms } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export const revalidate = false;

const agentAccess = `
## Agent access

- Markdown for any page: append \`.md\` to its URL, for example ${siteUrl}/reference/configuration.md. Requests with \`Accept: text/markdown\` also get Markdown.
- All pages in one file: ${siteUrl}/llms-full.txt
- Full-text search: ${siteUrl}/api/search?query=tmp_storage
- Read-only MCP server (Streamable HTTP) with \`list_pages\`, \`get_page\` and \`search\` tools: ${siteUrl}/api/mcp
`;

export async function GET() {
  return new Response(`${await docsLlms.index()}\n${agentAccess}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
