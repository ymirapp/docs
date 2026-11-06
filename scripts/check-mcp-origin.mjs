import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Exercise the compiled route, including all three exports, without starting a server.
const require = createRequire(import.meta.url);
const { routeModule } = require('../.next/server/app/api/mcp/route.js');
await routeModule.ensureUserland();
const route = routeModule.userland;
const siteOrigin = 'https://docs.ymirapp.com';
const initialize = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'origin-check', version: '1.0.0' },
  },
});

for (const method of ['GET', 'POST', 'DELETE']) {
  for (const origin of [undefined, '', siteOrigin, 'https://untrusted.example', `${siteOrigin}.evil.example`, 'null', 'not-an-origin']) {
    const headers = new Headers({ accept: 'application/json, text/event-stream', 'content-type': 'application/json' });
    if (origin !== undefined) headers.set('origin', origin);
    // An attacker-controlled request URL must not become the origin allowlist.
    const url = origin === 'https://untrusted.example' ? `${origin}/api/mcp` : `${siteOrigin}/api/mcp`;
    const response = await route[method](new Request(url, {
      method,
      headers,
      ...(method === 'POST' ? { body: initialize } : {}),
    }));
    const allowed = origin === undefined || origin === '' || origin === siteOrigin;
    assert.equal(response.status, allowed ? (method === 'POST' ? 200 : 405) : 403, `${method} Origin: ${origin}`);
    const body = await response.text();
    if (allowed && method === 'POST') {
      assert.match(response.headers.get('content-type'), /text\/event-stream/);
      const message = JSON.parse(body.split('\n').find((line) => line.startsWith('data: ')).slice(6));
      assert.equal(message.result.serverInfo.name, 'ymir-docs');
    } else if (!allowed) {
      assert.equal(JSON.parse(body).error.code, -32000);
    }
  }
}
console.log('MCP origin checks passed: 21 requests across GET, POST and DELETE.');
