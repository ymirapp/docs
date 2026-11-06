import { createMcpHandler, McpServer, originValidationResponse } from '@modelcontextprotocol/server';
import { registerSearchTool, registerSourceTools } from 'fumadocs-core/mcp';
import { docsLlms, searchServer, source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

// Search results cite heading URLs (`/page#heading`), so get_page drops the fragment and returns the whole page.
const mcpSource: typeof source = {
  ...source,
  getPageByUrl: (url, language) => source.getPageByUrl(url.split('#', 1)[0], language),
};

// Read-only: only the official list_pages, get_page and search tools are registered.
const handler = createMcpHandler(() => {
  const mcp = new McpServer({
    name: 'ymir-docs',
    version: '1.0.0',
  });

  registerSourceTools(mcp, mcpSource, docsLlms);
  registerSearchTool(mcp, searchServer);

  return mcp;
});

async function handleRequest(request: Request) {
  const rejected = originValidationResponse(request, [new URL(siteUrl).hostname]);
  return rejected ?? handler.fetch(request);
}

export { handleRequest as GET, handleRequest as POST, handleRequest as DELETE };
