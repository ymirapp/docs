# Copy controls inventory

Date: 2026-10-02. Read-only investigation of `ymir/docs` at the current working tree, which has uncommitted changes. Nothing in the app was changed.

Update 2026-10-03: the policy was applied, see [Applied policy](#applied-policy-2026-10-03). Everything above that section describes the site before the change.

Question: should the code block Copy button be off by default and enabled only on blocks where copying makes sense? This report lists every copy control, finds the native opt-in seam, and suggests an implementation. The implementation was not applied.

## Method

- Source: the 36 pages under `content/docs/**/*.mdx`. Each file was parsed with the installed `unified` + `remark-parse` + `remark-mdx` + `remark-gfm`, and every `code` node was visited. No regex was used to find fences. The parser handles 3 or 4 backticks, tildes, and fences nested in JSX. The script is `/tmp/ymir-copy-inventory/inventory.mjs` and is not a durable dependency.
- Live HTML: one `GET` per page against `http://127.0.0.1:3000`. All 36 pages returned 200. Each response was counted for `figure.shiki`, code `Copy`, `Copy Anchor Link` and `Copy Markdown` controls.
- Live DOM check (Playwright, Chrome for Testing) on `/getting-started`, `/reference/ymir-cli` and `/teams`. The counts matched the HTTP counts. This covered page buttons only; no full browser matrix was run.
- Machine-readable rows (temporary, not durable): `/tmp/ymir-copy-inventory/blocks.csv`, `blocks.json`, `pages.json`.
- Independent verification reran the AST/live inventory and tested the native global default and a proposed explicit opt-in through the installed remark/rehype pipeline: default off, `copy` on, title retained, and `noCopy` overriding `copy` in either order. The temporary check is `/tmp/ymir-copy-policy-proof.mjs`. No application behavior was changed.

## Copy controls on the site

| Control | Source | Instances | Notes |
| --- | --- | --- | --- |
| Code block **Copy** / **Copied** | `fumadocs-ui/mdx` default `pre` → `CodeBlock` → `CopyButton` | **310** (one per fenced block, on 32 of 36 pages) | Today every block has one. Copies `pre.textContent` and replaces `.nd-copy-ignore` nodes with `\n`. No content uses `nd-copy-ignore`. Visible label comes from `app/layout.tsx` (`'Copy Text(code block)(aria-label)': 'Copy'`) and `app/global.css:403`. |
| Article **Copy Markdown** | `MarkdownCopyButton` in `app/(docs)/[[...slug]]/page.tsx:78` | **36** (one per page) | Keep, as previously agreed. Fetches the page `.md` export (`proxy.ts`). |
| Heading **Copy Anchor Link** | `fumadocs-ui/components/heading` (`h1`–`h6` defaults) | **844** (every heading with an id) | Low-visibility: `opacity-0` until hover, link icon, `sr-only` label. Not proposed for change. |
| Search (`⌘K`), sidebar, TOC popover | Fumadocs layout | n/a | Not copy actions. |
| Other page actions ("Open in" ChatGPT/GitHub, etc.) | `fumadocs-ui/layouts/shared/page-actions` | 0 | Not used. Only `MarkdownCopyButton` is imported. |

No other `clipboard` usage exists in `app/`, `components/` or `lib/`.

## Fenced code block counts

- Total: **310** fenced blocks. The source fence count matches rendered `figure.shiki` and rendered code Copy buttons on every page (0 mismatches).
- Fences: all 310 use 3 backticks. None use 4 backticks or tildes. One block sits inside a `Callout` (`getting-started.mdx:268`). The rest are top level.
- Lines (non-empty): **138** one-line, **172** multi-line, 0 empty.
- Languages: bash 243, yml 34, text 15, php 10, json 3, yaml 3, (none) 2.
- Existing meta: 19 blocks, all `title="..."`. No block uses `noCopy`, `lineNumbers` or `tab`.

### By kind

Kinds come from a heuristic. Treat them as a starting point for review, not a decision.

- `cli-synopsis`: the `ymir x:y [options] [<arg>]` usage line in the CLI reference. Not runnable as written.
- `cli-commented-examples`: multi-line `# comment` + command lists. The user calls these multi-line examples; copying the whole block runs several commands.
- `command-runnable`: shell lines with no placeholder and no destructive verb.
- `command-placeholder`: contains `<...>`, `[...]`, `YOUR_`, `example.com`, `path/to/...`.
- `command-destructive`: delete, destroy, rollback, remove, invalidate, and similar verbs.

| Kind | Blocks | One-line | Multi-line | Proposed default |
| --- | --- | --- | --- | --- |
| cli-commented-examples | 95 | 0 | 95 | intent-review |
| cli-synopsis | 68 | 68 | 0 | no |
| command-runnable | 55 | 49 | 6 | yes |
| yaml-config | 37 | 0 | 37 | no |
| text-other | 15 | 1 | 14 | no |
| command-placeholder | 14 | 8 | 6 | intent-review |
| php-example | 10 | 3 | 7 | no |
| command-destructive | 7 | 3 | 4 | intent-review |
| shell-output-or-mixed | 4 | 4 | 0 | no |
| json-example | 3 | 0 | 3 | no |
| plain-unlabelled | 2 | 2 | 0 | no |

Candidate split: no 139, intent-review 116, yes 55. `yes` means a candidate for opt-in, still subject to editorial review. `intent-review` means opt in only where the author intends it, never in bulk. Placeholder and destructive commands should need explicit intent. Copying `ymir delete` or a command with `<placeholder>` invites a broken or harmful paste. `no` means output, config and code examples stay without Copy.

Notes on the heuristic:

- Two synopsis blocks that list aliases on a second line (e.g. `ymir-cli.mdx:2722` `project:delete` + `delete`) are classified as `command-destructive` rather than `cli-synopsis`.
- `ymir-cli.mdx:1929` (nested brackets) is classified as `command-placeholder`.
- `text` blocks are almost all `title="Output"` / `"Example output"`. The exceptions are `~/.ssh/config` and an ARN format.
- The 4 `shell-output-or-mixed` blocks are real one-line local commands that the command allowlist missed: `redis-cli` (`caches.mdx:67`), `open -a TablePlus` and `mysql` (`database-servers.mdx:182`, `:190`), and a commented `dig` check (`dns.mdx:65`). Review them as possible candidates.
- 2 blocks have no language (`database-servers.mdx:170`, `:176`). These are connection URLs.

### Copy candidates (`command-runnable`)

- `compatibility/sage-10.mdx:110` (2 lines) `ymir environment:variables:change staging LOG_CHANNEL stderr`
- `getting-started.mdx:63` `composer global require ymirapp/cli`
- `getting-started.mdx:83` `composer require ymirapp/cli`
- `getting-started.mdx:103` `ymir login`
- `getting-started.mdx:111` (2 lines) `ymir team:current`
- `getting-started.mdx:220` `ymir provider:connect`
- `getting-started.mdx:286` `ymir provider:update 42`
- `getting-started.mdx:333` `ymir provider:connect --aws-profile=ymir`
- `getting-started.mdx:366` `ymir deploy staging`
- `getting-started.mdx:374` `ymir environment:url staging`
- `guides/container-image-deployment.mdx:43` `ymir docker:create staging`
- `guides/container-image-deployment.mdx:49` `ymir docker:create staging --architecture=x86_64 --php=8.3`
- `guides/container-image-deployment.mdx:81` `ymir docker:create staging --configure-project`
- `guides/container-image-deployment.mdx:104` `ymir deploy staging`
- `guides/domain-mapping.mdx:27` `ymir certificate:request domain.co.uk`
- `guides/gd-extension.mdx:39` `ymir php:info staging`
- `guides/migration-to-ymir.mdx:57` (3 lines) `ymir database:create example_rehearsal --server=example-database-server`
- `guides/migration-to-ymir.mdx:78` `ymir laravel:vapor:migrate`
- `guides/migration-to-ymir.mdx:116` `ymir database:import ~/migration/example-rehearsal.sql.gz example_rehearsal --server=example-databas`
- `guides/migration-to-ymir.mdx:133` `ymir media:import --environment=production ~/migration/uploads`
- `guides/object-cache.mdx:164` `ymir wp --environment=staging redis status`
- `guides/queues.mdx:71` `ymir artisan --environment=production queue:failed`
- `guides/queues.mdx:92` `ymir environment:logs:query production emails`
- `projects/deploy.mdx:11` (2 lines) `ymir deploy`
- `projects/deploy.mdx:24` `ymir build environment-name`
- `projects/deploy.mdx:87` (2 lines) `ymir redeploy`
- `projects/deploy.mdx:201` `ymir build staging --debug`
- `projects/environments.mdx:39` `ymir environment:create preview`
- `projects/environments.mdx:116` `ymir environment:variables:download preview`
- `projects/environments.mdx:122` `ymir environment:variables:upload preview`
- `projects/environments.mdx:225` `ymir environment:secret:change preview SECRET_NAME`
- `projects/manage.mdx:11` `ymir init`
- `reference/ymir-cli.mdx:18` `ymir login`
- `reference/ymir-cli.mdx:113` `ymir cache:list`
- `reference/ymir-cli.mdx:267` `ymir certificate:list`
- `reference/ymir-cli.mdx:729` `ymir database:server:list`
- `reference/ymir-cli.mdx:1354` `ymir dns:zone:list`
- `reference/ymir-cli.mdx:1569` `ymir email:identity:list`
- `reference/ymir-cli.mdx:2202` `ymir install-integration`
- `reference/ymir-cli.mdx:2291` `ymir laravel:vapor:migrate`
- `reference/ymir-cli.mdx:2533` `ymir network:list`
- `reference/ymir-cli.mdx:2848` (2 lines) `ymir project:init`
- `reference/ymir-cli.mdx:2864` `ymir project:list`
- `reference/ymir-cli.mdx:3066` `ymir provider:list`
- `reference/ymir-cli.mdx:3174` `ymir team:current`
- `reference/ymir-cli.mdx:3198` `ymir team:list`
- `team-resources/caches.mdx:22` `ymir cache:create`
- `team-resources/caches.mdx:51` `ymir cache:tunnel my-cache-cluster`
- `team-resources/database-servers.mdx:21` `ymir database:server:create`
- `team-resources/database-servers.mdx:59` `ymir database:user:create`
- `team-resources/database-servers.mdx:153` `ymir database:server:tunnel my-database-server`
- `team-resources/email.mdx:12` `ymir project:info`
- `team-resources/email.mdx:167` `ymir environment:variables:change production YMIR_DISABLE_EMAIL_SENDING 1`
- `team-resources/networks.mdx:88` `ymir network:bastion:add network-name`
- `team-resources/ssl-certificates.mdx:50` `ymir certificate:info 42`

## Per-page summary

Columns: source fences, rendered code Copy buttons, one-line/multi-line blocks, `yes` candidates, `intent-review` blocks, heading anchor buttons, Copy Markdown buttons, and kinds.

| Page | Fences | Code Copy | 1-line/multi | Yes | Intent | Anchor | Copy MD | Kinds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/compatibility/beaver-builder` | 1 | 1 | 0/1 | 0 | 0 | 2 | 1 | yaml-config 1 |
| `/compatibility/elementor` | 1 | 1 | 0/1 | 0 | 0 | 3 | 1 | yaml-config 1 |
| `/compatibility/oxygen` | 1 | 1 | 0/1 | 0 | 0 | 2 | 1 | yaml-config 1 |
| `/compatibility/sage-10` | 3 | 3 | 0/3 | 1 | 0 | 6 | 1 | yaml-config 1, php-example 1, command-runnable 1 |
| `/compatibility/woocommerce` | 2 | 2 | 0/2 | 0 | 0 | 5 | 1 | yaml-config 1, php-example 1 |
| `/getting-started` | 16 | 16 | 12/4 | 9 | 4 | 15 | 1 | command-runnable 9, command-placeholder 4, json-example 2, text-other 1 |
| `/guides/automated-deployment` | 2 | 2 | 0/2 | 0 | 0 | 9 | 1 | yaml-config 2 |
| `/guides/aws-costs` | 1 | 1 | 0/1 | 0 | 0 | 16 | 1 | yaml-config 1 |
| `/guides/bedrock` | 2 | 2 | 0/2 | 0 | 0 | 12 | 1 | yaml-config 2 |
| `/guides/cloudflare` | 2 | 2 | 0/2 | 0 | 0 | 13 | 1 | yaml-config 2 |
| `/guides/container-image-deployment` | 6 | 6 | 4/2 | 4 | 0 | 6 | 1 | command-runnable 4, yaml-config 2 |
| `/guides/domain-mapping` | 5 | 5 | 1/4 | 1 | 0 | 10 | 1 | yaml-config 3, command-runnable 1, text-other 1 |
| `/guides/firewall` | 4 | 4 | 0/4 | 0 | 0 | 11 | 1 | yaml-config 4 |
| `/guides/gd-extension` | 1 | 1 | 1/0 | 1 | 0 | 5 | 1 | command-runnable 1 |
| `/guides/laravel` | 1 | 1 | 0/1 | 0 | 0 | 13 | 1 | yaml-config 1 |
| `/guides/logging-service` | 2 | 2 | 0/2 | 0 | 1 | 9 | 1 | cli-commented-examples 1, yaml-config 1 |
| `/guides/migration-to-ymir` | 5 | 5 | 4/1 | 4 | 1 | 14 | 1 | command-runnable 4, command-placeholder 1 |
| `/guides/new-relic` | 0 | 0 | 0/0 | 0 | 0 | 5 | 1 | — |
| `/guides/object-cache` | 4 | 4 | 1/3 | 1 | 0 | 12 | 1 | php-example 2, yaml-config 1, command-runnable 1 |
| `/guides/queues` | 5 | 5 | 2/3 | 2 | 0 | 9 | 1 | php-example 2, command-runnable 2, yaml-config 1 |
| `/guides/scaling` | 0 | 0 | 0/0 | 0 | 0 | 12 | 1 | — |
| `/` | 1 | 1 | 0/1 | 0 | 0 | 5 | 1 | json-example 1 |
| `/introduction` | 0 | 0 | 0/0 | 0 | 0 | 3 | 1 | — |
| `/projects/deploy` | 8 | 8 | 2/6 | 4 | 2 | 8 | 1 | command-runnable 4, yaml-config 2, command-destructive 2 |
| `/projects/environments` | 6 | 6 | 5/1 | 4 | 1 | 15 | 1 | command-runnable 4, command-destructive 1, yaml-config 1 |
| `/projects/manage` | 3 | 3 | 2/1 | 1 | 2 | 11 | 1 | command-runnable 1, cli-commented-examples 1, command-destructive 1 |
| `/reference/configuration` | 6 | 6 | 0/6 | 0 | 0 | 82 | 1 | yaml-config 6 |
| `/reference/php-runtime` | 2 | 2 | 2/0 | 0 | 0 | 11 | 1 | php-example 2 |
| `/reference/ymir-cli` | 185 | 185 | 81/104 | 14 | 97 | 460 | 1 | cli-commented-examples 88, cli-synopsis 66, command-runnable 14, text-other 8, command-placeholder 7, command-destructive 2 |
| `/team-resources/caches` | 4 | 4 | 3/1 | 2 | 0 | 4 | 1 | command-runnable 2, yaml-config 1, shell-output-or-mixed 1 |
| `/team-resources/database-servers` | 8 | 8 | 7/1 | 3 | 0 | 11 | 1 | command-runnable 3, plain-unlabelled 2, shell-output-or-mixed 2, yaml-config 1 |
| `/team-resources/dns` | 5 | 5 | 2/3 | 0 | 3 | 11 | 1 | cli-commented-examples 3, cli-synopsis 2 |
| `/team-resources/email` | 9 | 9 | 5/4 | 2 | 3 | 12 | 1 | command-runnable 2, text-other 2, php-example 2, cli-commented-examples 1, command-placeholder 1, command-destructive 1 |
| `/team-resources/networks` | 4 | 4 | 2/2 | 1 | 0 | 8 | 1 | yaml-config 1, command-runnable 1, text-other 1, shell-output-or-mixed 1 |
| `/team-resources/ssl-certificates` | 5 | 5 | 2/3 | 1 | 2 | 6 | 1 | text-other 2, command-placeholder 1, command-runnable 1, cli-commented-examples 1 |
| `/teams` | 0 | 0 | 0/0 | 0 | 0 | 8 | 1 | — |

Totals: 310 code Copy, 844 anchor, 36 Copy Markdown. `/guides/new-relic`, `/guides/scaling`, `/introduction` and `/teams` have no code blocks.

## Native API findings

1. **The MDX `pre` mapping** (`node_modules/fumadocs-ui/dist/mdx.js:28`) is `pre: (props) => <CodeBlock {...props}><Pre>{props.children}</Pre></CodeBlock>`. All `<pre>` properties from the highlighter reach `CodeBlock`.
2. **`CodeBlock`** (`fumadocs-ui/dist/components/codeblock.js:20`) has `allowCopy = true` by default. It accepts boolean or the strings `"true"`/`"false"`, which it normalises. When it is false, no `CopyButton` renders. The untitled actions row is `empty:hidden`, and `app/global.css:426` already expects that empty row.
3. **The fence meta parser** is the public `rehypeCodeDefaultOptions.parseMetaString` (`fumadocs-core/dist/mdx-plugins/rehype-code.js`). The exported default options are an object, built from the private factory in `rehype-code.core-BwKlAUQz.js:473`. It only accepts `title`, `tab`, `noCopy` and `lineNumbers`. `noCopy` maps to `allowCopy: "false"`. There is **no native opt-in attribute**: writing `allowCopy="true"` or `copy` in a fence is ignored, because only allowed names are parsed and the rest stays in `__raw`.
4. **Meta becomes `<pre>` props.** Shiki core (`@shikijs/core/dist/index.mjs:835`) copies every non-`_` key of `options.meta` onto `<pre>`. Fumadocs builds `meta` as `{ ...rehypeCodeOptions.meta, __raw, ...parseMetaString(meta) }` (`rehype-code.core:67`). So `rehypeCodeOptions.meta: { allowCopy: 'false' }` is a **native global default**, and a per-block value from `parseMetaString` overrides it.
5. **Options merge** is shallow: `{ ...rehypeCodeDefaultOptions, ...ours }` (`fumadocs-core/dist/mdx-plugins/rehype-code.js:11`). Our `source.config.ts` only sets `themes`, so the default `parseMetaString` is active. Overriding it replaces it, so an override must delegate to the exported `rehypeCodeDefaultOptions.parseMetaString` to keep `title`, `tab` and `lineNumbers`.
6. **Markdown exports keep fence meta verbatim.** `includeProcessedMarkdown` (remark-llms) stringifies `code` nodes with mdast-util-to-markdown, meta included. `llms-full.txt` currently has 19 fences with `title=...`, and `/team-resources/networks.md` contains `` ```text title="~/.ssh/config" ``. A new `copy` flag would **leak into `.md`, llms-full.txt, MCP and Copy Markdown** unless it is stripped. `LLMsOptions.stringify` runs for every node before the defaults, so `source.config.ts` can strip it without new dependencies.
7. **The MDX `pre` override alternative** (`pre: (props) => <CodeBlock allowCopy={false} {...props}>…`) is valid: native props spread after `false`, so `noCopy`/meta values win. It still needs a parser change for opt-in, though, because no fence syntax can produce `allowCopy="true"` natively. The `rehypeCodeOptions.meta` default does the same job in config without touching components, so the `pre` override isn't needed.

## Proposed implementation (not applied)

One file, `source.config.ts`. Fence syntax for opt-in: `` ```bash copy ``. The existing `noCopy` keeps working and takes precedence if both flags are present. Existing fence metadata must remain byte-identical when no `copy` flag is present.

```ts
import { parseCodeBlockAttributes, rehypeCodeDefaultOptions, remarkStructureDefaultOptions } from 'fumadocs-core/mdx-plugins';

/**
 * Removes the `copy` code block flag, a site UI option, so the Markdown pages, llms-full.txt and MCP
 * keep the author's fence.
 */
function withoutCopyFlag(meta: string | null | undefined): string | null {
  if (!meta) return null;
  const { attributes, rest } = parseCodeBlockAttributes(meta, ['copy']);

  return 'copy' in attributes ? rest.trim() || null : meta;
}

// In llmsOptions.stringify, before the JSX branches:
//   if (node.type === 'code' && node.meta && node.meta !== withoutCopyFlag(node.meta)) {
//     return state.handle({ ...node, meta: withoutCopyFlag(node.meta) }, _parent, state, info);
//   }
// (the existing `if (node.type !== 'mdxJsxFlowElement') return;` guard moves below it)

// In defineConfig mdxOptions.rehypeCodeOptions:
//   // Code blocks have no Copy button unless the fence opts in with `copy`, so multi-line examples,
//   // output and placeholder or destructive commands aren't one click from a terminal.
//   meta: { allowCopy: 'false' },
//   parseMetaString(meta, ...args) {
//     const { attributes, rest } = parseCodeBlockAttributes(meta, ['copy']);
//
//     return {
//       ...('copy' in attributes && { allowCopy: 'true' }),
//       ...rehypeCodeDefaultOptions.parseMetaString?.(rest, ...args),
//     };
//   },
```

Things to check before applying:

- `state.handle` is the to-markdown dispatcher. Confirm the stripped fence in the `.md` export and `llms-full.txt` byte-for-byte against the current output, excluding the removed flag.
- `remarkStructureOptions` indexes `node.value` only, so search is unaffected by meta.
- Opt-in blocks are content edits (`` ```bash `` → `` ```bash copy ``) at the paths listed in the candidate section and appendix.
- With the default off, untitled blocks lose their actions row. Titled blocks keep the title bar, which stays 44px tall (`global.css:421`).
- The native icon + Copy/Copied label, the `.nd-copy-ignore` behaviour, Copy Markdown and heading anchors are untouched.
- Rollback: delete `meta` and `parseMetaString`. Leftover `copy` flags are then inert in HTML and still stripped from exports.

## Appendix: all fenced blocks

Columns: location, language, meta, physical/non-empty lines, kind, candidate, nearest heading (container), and first line (truncated).

| Location | Lang | Meta | Lines | Kind | Candidate | Heading | First line |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `compatibility/beaver-builder.mdx:19` | yml |  | 11/11 | yaml-config | no | h2 Project configuration changes | `environments:` |
| `compatibility/elementor.mdx:19` | yml |  | 5/5 | yaml-config | no | h2 Project configuration changes | `environments:` |
| `compatibility/oxygen.mdx:19` | yml |  | 8/8 | yaml-config | no | h2 Project configuration changes | `environments:` |
| `compatibility/sage-10.mdx:29` | yml |  | 17/17 | yaml-config | no | h2 Adding build steps to your project configuration | `environments:` |
| `compatibility/sage-10.mdx:73` | php |  | 17/14 | php-example | no | h2 Configuring the storage directory on Lambda | `if (getenv('YMIR_ENVIRONMENT')) {` |
| `compatibility/sage-10.mdx:110` | bash |  | 2/2 | command-runnable | yes | h2 Configuring logs [#configuring-external-logs] | `ymir environment:variables:change staging LOG_CHANNEL stderr` |
| `compatibility/woocommerce.mdx:19` | yml |  | 21/21 | yaml-config | no | h2 Project configuration changes | `environments:` |
| `compatibility/woocommerce.mdx:90` | php |  | 3/3 | php-example | no | h2 Scheduled actions [#scheduled-actions] | `add_filter('ymir_action_scheduler_command', function (): string {` |
| `getting-started.mdx:63` | bash |  | 1/1 | command-runnable | yes | h3 Globally (preferred) [#globally-preferred] | `composer global require ymirapp/cli` |
| `getting-started.mdx:75` | bash |  | 1/1 | command-placeholder | intent-review | h3 Globally (preferred) [#globally-preferred] | `ymir &lt;command>` |
| `getting-started.mdx:83` | bash |  | 1/1 | command-runnable | yes | h3 Inside your project [#inside-your-project] | `composer require ymirapp/cli` |
| `getting-started.mdx:89` | bash |  | 1/1 | command-placeholder | intent-review | h3 Inside your project [#inside-your-project] | `vendor/bin/ymir &lt;command>` |
| `getting-started.mdx:103` | bash |  | 1/1 | command-runnable | yes | h2 Logging in [#logging-in] | `ymir login` |
| `getting-started.mdx:111` | bash |  | 2/2 | command-runnable | yes | h2 Logging in [#logging-in] | `ymir team:current` |
| `getting-started.mdx:147` | json | title="Ymir permissions policy" | 60/60 | json-example | no | h3 Creating the Ymir permissions policy [#creating-the-ymir- | `{` |
| `getting-started.mdx:220` | bash |  | 1/1 | command-runnable | yes | h3 Connecting with an IAM role (recommended) [#connecting-wi | `ymir provider:connect` |
| `getting-started.mdx:242` | json | title="Trust policy" | 17/17 | json-example | no | h3 Connecting with an IAM role (recommended) [#connecting-wi | `{` |
| `getting-started.mdx:268` | text |  | 1/1 | text-other | no | h3 Connecting with an IAM role (recommended) [#connecting-wi | `arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/ROLE_NAME` |
| `getting-started.mdx:286` | bash |  | 1/1 | command-runnable | yes | h3 Finishing a pending connection [#finishing-a-pending-conn | `ymir provider:update 42` |
| `getting-started.mdx:292` | bash |  | 1/1 | command-placeholder | intent-review | h3 Finishing a pending connection [#finishing-a-pending-conn | `ymir provider:update 42 --role-arn=arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/ROLE_NA` |
| `getting-started.mdx:333` | bash |  | 1/1 | command-runnable | yes | h3 Adding an IAM user [#adding-an-iam-user] | `ymir provider:connect --aws-profile=ymir` |
| `getting-started.mdx:349` | bash |  | 2/2 | command-placeholder | intent-review | h2 Deploying your first project [#deploying-your-first-proje | `cd path/to/your-project` |
| `getting-started.mdx:366` | bash |  | 1/1 | command-runnable | yes | h2 Deploying your first project [#deploying-your-first-proje | `ymir deploy staging` |
| `getting-started.mdx:374` | bash |  | 1/1 | command-runnable | yes | h2 Deploying your first project [#deploying-your-first-proje | `ymir environment:url staging` |
| `guides/automated-deployment.mdx:50` | yml |  | 30/26 | yaml-config | no | h3 GitHub actions | `name: Deploy to production` |
| `guides/automated-deployment.mdx:97` | yml |  | 11/11 | yaml-config | no | h3 Bitbucket Pipelines | `pipelines:` |
| `guides/aws-costs.mdx:67` | yml |  | 5/5 | yaml-config | no | h2 Adding your own tags [#custom-tags] | `environments:` |
| `guides/bedrock.mdx:40` | yml |  | 9/9 | yaml-config | no | h3 The default build command [#default-build-command] | `environments:` |
| `guides/bedrock.mdx:80` | yml |  | 8/8 | yaml-config | no | h3 Adding your own build commands [#adding-bedrock-build-com | `environments:` |
| `guides/cloudflare.mdx:59` | yml |  | 3/3 | yaml-config | no | h3 Adding your domain | `environments:` |
| `guides/cloudflare.mdx:93` | yml |  | 5/5 | yaml-config | no | h3 Cloudflare WordPress plugin [#cloudflare-wordpress-plugin | `environments:` |
| `guides/container-image-deployment.mdx:43` | bash |  | 1/1 | command-runnable | yes | h3 Creating the Dockerfile [#creating-the-dockerfile] | `ymir docker:create staging` |
| `guides/container-image-deployment.mdx:49` | bash |  | 1/1 | command-runnable | yes | h3 Creating the Dockerfile [#creating-the-dockerfile] | `ymir docker:create staging --architecture=x86_64 --php=8.3` |
| `guides/container-image-deployment.mdx:65` | yml |  | 11/11 | yaml-config | no | h3 Configuring the environment [#configuring-the-environment | `id: 42` |
| `guides/container-image-deployment.mdx:81` | bash |  | 1/1 | command-runnable | yes | h3 Configuring the environment [#configuring-the-environment | `ymir docker:create staging --configure-project` |
| `guides/container-image-deployment.mdx:93` | yml |  | 6/6 | yaml-config | no | h3 Configuring the environment [#configuring-the-environment | `environments:` |
| `guides/container-image-deployment.mdx:104` | bash |  | 1/1 | command-runnable | yes | h3 Configuring the environment [#configuring-the-environment | `ymir deploy staging` |
| `guides/domain-mapping.mdx:27` | bash |  | 1/1 | command-runnable | yes | h3 Requesting a SSL certificate | `ymir certificate:request domain.co.uk` |
| `guides/domain-mapping.mdx:43` | text | title="Example output" | 7/6 | text-other | no | h3 Creating a DNS record pointing to the project environment | `Warning: Not all domains in this project are managed by Ymir. The following DNS ` |
| `guides/domain-mapping.mdx:85` | yml |  | 6/6 | yaml-config | no | h3 Mapping a single domain | `id: 1` |
| `guides/domain-mapping.mdx:104` | yml |  | 9/9 | yaml-config | no | h2 Mapping multiple domains | `id: 1` |
| `guides/domain-mapping.mdx:132` | yml |  | 8/8 | yaml-config | no | h2 Wildcard domains | `id: 1` |
| `guides/firewall.mdx:33` | yml |  | 9/9 | yaml-config | no | h2 Basic environment firewall configuration | `id: 42` |
| `guides/firewall.mdx:71` | yml |  | 11/11 | yaml-config | no | h3 Bot protection | `id: 42` |
| `guides/firewall.mdx:117` | yml |  | 10/10 | yaml-config | no | h3 Rate limit | `id: 42` |
| `guides/firewall.mdx:140` | yml |  | 10/10 | yaml-config | no | h2 Use your own web ACL [#custom-web-acl] | `id: 42` |
| `guides/gd-extension.mdx:39` | bash |  | 1/1 | command-runnable | yes | h2 Checking which image extensions are loaded [#gd-check-ext | `ymir php:info staging` |
| `guides/laravel.mdx:112` | yml |  | 8/8 | yaml-config | no | h2 Deploying your application [#deploying-your-application] | `environments:` |
| `guides/logging-service.mdx:15` | bash |  | 8/6 | cli-commented-examples | intent-review | h2 How Ymir handles logs [#how-ymir-handles-logs] | `# Retrieve the last 20 logged events from the "website" function of the "product` |
| `guides/logging-service.mdx:64` | yml |  | 10/10 | yaml-config | no | h2 Disable CloudWatch logging [#disable-cloudwatch-logging] | `id: 42` |
| `guides/migration-to-ymir.mdx:57` | bash |  | 3/3 | command-runnable | yes | h2 Setting up the Ymir project [#setting-up-the-ymir-project | `ymir database:create example_rehearsal --server=example-database-server` |
| `guides/migration-to-ymir.mdx:78` | bash |  | 1/1 | command-runnable | yes | h3 Migrating from Laravel Vapor [#migrating-from-laravel-vap | `ymir laravel:vapor:migrate` |
| `guides/migration-to-ymir.mdx:116` | bash |  | 1/1 | command-runnable | yes | h3 Importing the database [#importing-the-database] | `ymir database:import ~/migration/example-rehearsal.sql.gz example_rehearsal --se` |
| `guides/migration-to-ymir.mdx:133` | bash |  | 1/1 | command-runnable | yes | h3 Importing the uploads [#importing-the-uploads] | `ymir media:import --environment=production ~/migration/uploads` |
| `guides/migration-to-ymir.mdx:152` | bash |  | 1/1 | command-placeholder | intent-review | h3 Updating stored URLs [#updating-stored-urls] | `ymir wp --environment=production "search-replace 'https://www.example.com' 'http` |
| `guides/object-cache.mdx:44` | yml |  | 3/3 | yaml-config | no | h3 Valkey and Redis cache clusters [#redis] | `environments:` |
| `guides/object-cache.mdx:106` | php |  | 14/13 | php-example | no | h3 Redis Object Cache (free) | `// Database numbers (0-15) must be unique across all projects using the cache cl` |
| `guides/object-cache.mdx:131` | php |  | 24/23 | php-example | no | h3 Object Cache Pro (paid) | `// Database numbers (0-15) must be unique across all projects using the cache cl` |
| `guides/object-cache.mdx:164` | bash |  | 1/1 | command-runnable | yes | h2 Checking and flushing the object cache [#checking-and-flu | `ymir wp --environment=staging redis status` |
| `guides/queues.mdx:21` | yml |  | 9/9 | yaml-config | no | h2 Configuring queues [#configuring-queues] | `environments:` |
| `guides/queues.mdx:41` | php |  | 8/6 | php-example | no | h2 Dispatching jobs [#dispatching-jobs] | `use App\Jobs\ProcessPodcast;` |
| `guides/queues.mdx:71` | bash |  | 1/1 | command-runnable | yes | h2 Retries and failed jobs [#retries-and-failed-jobs] | `ymir artisan --environment=production queue:failed` |
| `guides/queues.mdx:92` | bash |  | 1/1 | command-runnable | yes | h3 Diagnosing failed jobs [#diagnosing-failed-jobs] | `ymir environment:logs:query production emails` |
| `guides/queues.mdx:122` | php | title="config/queue.php" | 8/8 | php-example | no | h2 Large job payloads [#large-job-payloads] | `'sqs' => [` |
| `index.mdx:111` | json | title="MCP configuration" | 5/5 | json-example | no | h2 Use these docs with AI agents | `{` |
| `projects/deploy.mdx:11` | bash |  | 2/2 | command-runnable | yes | h2 Starting the deployment process | `ymir deploy` |
| `projects/deploy.mdx:24` | bash |  | 1/1 | command-runnable | yes | h2 Build process | `ymir build environment-name` |
| `projects/deploy.mdx:50` | yml |  | 7/7 | yaml-config | no | h3 Build commands [#build-commands] | `id: 1` |
| `projects/deploy.mdx:64` | yml |  | 10/10 | yaml-config | no | h3 Build commands [#build-commands] | `id: 1` |
| `projects/deploy.mdx:87` | bash |  | 2/2 | command-runnable | yes | h2 Redeploying a project | `ymir redeploy` |
| `projects/deploy.mdx:106` | bash |  | 2/2 | command-destructive | intent-review | h2 Rolling back a deployment | `ymir rollback` |
| `projects/deploy.mdx:123` | bash |  | 2/2 | command-destructive | intent-review | h2 Rolling back a deployment | `ymir rollback --select` |
| `projects/deploy.mdx:201` | bash |  | 1/1 | command-runnable | yes | h3 Inspecting a build [#inspecting-a-build] | `ymir build staging --debug` |
| `projects/environments.mdx:39` | bash |  | 1/1 | command-runnable | yes | h2 Creating new environments | `ymir environment:create preview` |
| `projects/environments.mdx:59` | bash |  | 1/1 | command-destructive | intent-review | h2 Deleting an existing environment | `ymir environment:delete preview` |
| `projects/environments.mdx:116` | bash |  | 1/1 | command-runnable | yes | h3 Managing environment variables | `ymir environment:variables:download preview` |
| `projects/environments.mdx:122` | bash |  | 1/1 | command-runnable | yes | h3 Managing environment variables | `ymir environment:variables:upload preview` |
| `projects/environments.mdx:225` | bash |  | 1/1 | command-runnable | yes | h3 Managing secrets | `ymir environment:secret:change preview SECRET_NAME` |
| `projects/environments.mdx:267` | yml |  | 6/6 | yaml-config | no | h3 Additional domain names | `id: 1` |
| `projects/manage.mdx:11` | bash |  | 1/1 | command-runnable | yes | h2 Creating a project [#creating-a-project] | `ymir init` |
| `projects/manage.mdx:85` | bash |  | 2/2 | cli-commented-examples | intent-review | h3 Running Acorn commands [#radicle-acorn-commands] | `# List the Acorn commands available on the staging environment` |
| `projects/manage.mdx:106` | bash |  | 1/1 | command-destructive | intent-review | h2 Deleting a project | `ymir delete` |
| `reference/configuration.mdx:11` | yml |  | 79/79 | yaml-config | no | h2 Sample configuration file | `id: 1` |
| `reference/configuration.mdx:636` | yml |  | 3/3 | yaml-config | no | h3 layers (in Callout) | `layers:` |
| `reference/configuration.mdx:748` | yml |  | 5/5 | yaml-config | no | h3 tags | `environments:` |
| `reference/configuration.mdx:937` | yaml |  | 2/2 | yaml-config | no | h4 Queue Configuration Formats | `# Boolean format - creates "default" queue` |
| `reference/configuration.mdx:942` | yaml |  | 5/5 | yaml-config | no | h4 Queue Configuration Formats | `# Single queue format - creates "default" queue with specific settings` |
| `reference/configuration.mdx:950` | yaml |  | 12/12 | yaml-config | no | h4 Queue Configuration Formats | `# Multiple named queues format` |
| `reference/php-runtime.mdx:121` | php |  | 1/1 | php-example | no | h3 Upload size limit [#wordpress-upload-limit] | `define('YMIR_UPLOAD_LIMIT', '64MB');` |
| `reference/php-runtime.mdx:135` | php |  | 1/1 | php-example | no | h3 Attachment metadata and thumbnails [#wordpress-attachment | `define('YMIR_FORCE_ASYNC_ATTACHMENT_CREATION', true);` |
| `reference/ymir-cli.mdx:18` | bash |  | 1/1 | command-runnable | yes | h2 Login | `ymir login` |
| `reference/ymir-cli.mdx:42` | bash |  | 1/1 | cli-synopsis | no | h3 cache:create [#cache-create] | `ymir cache:create [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:74` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage | `# Create a new cache cluster with prompt for the name, network and type` |
| `reference/ymir-cli.mdx:84` | bash |  | 1/1 | cli-synopsis | no | h3 cache:delete [#cache-delete] | `ymir cache:delete [&lt;cache>]` |
| `reference/ymir-cli.mdx:100` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-2] | `# Delete the cache cluster with prompt for cache cluster` |
| `reference/ymir-cli.mdx:113` | bash |  | 1/1 | command-runnable | yes | h3 cache:list [#cache-list] | `ymir cache:list` |
| `reference/ymir-cli.mdx:121` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-3] | `# List all cache clusters` |
| `reference/ymir-cli.mdx:126` | text | title="Output" | 5/5 | text-other | no | h4 Usage [#usage-3] | `---- --------- ---------- --------- ----------- ----------- -------- -----------` |
| `reference/ymir-cli.mdx:136` | bash |  | 1/1 | cli-synopsis | no | h3 cache:modify [#cache-modify] | `ymir cache:modify [&lt;cache>]` |
| `reference/ymir-cli.mdx:158` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-4] | `# Modify a cache cluster with prompt for cache cluster` |
| `reference/ymir-cli.mdx:168` | bash |  | 1/1 | cli-synopsis | no | h3 cache:tunnel [#cache-tunnel] | `ymir cache:tunnel [options] [&lt;cache>]` |
| `reference/ymir-cli.mdx:198` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-5] | `# Create a SSH tunnel to a cache cluster with prompt for the cache cluster` |
| `reference/ymir-cli.mdx:215` | bash |  | 1/1 | cli-synopsis | no | h3 certificate:delete [#certificate-delete] | `ymir certificate:delete [&lt;certificate>]` |
| `reference/ymir-cli.mdx:231` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-6] | `# Delete an SSL certificate with prompt for the SSL certificate` |
| `reference/ymir-cli.mdx:241` | bash |  | 1/1 | cli-synopsis | no | h3 certificate:info [#certificate-info] | `ymir certificate:info [&lt;certificate>]` |
| `reference/ymir-cli.mdx:257` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-7] | `# Get information on an SSL certificate with prompt for the SSL certificate` |
| `reference/ymir-cli.mdx:267` | bash |  | 1/1 | command-runnable | yes | h3 certificate:list [#certificate-list] | `ymir certificate:list` |
| `reference/ymir-cli.mdx:275` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-8] | `# List all SSL certificates` |
| `reference/ymir-cli.mdx:280` | text | title="Output" | 5/5 | text-other | no | h4 Usage [#usage-8] | ` ---- -------------- ----------- --------------------- -------- --------` |
| `reference/ymir-cli.mdx:290` | bash |  | 1/1 | cli-synopsis | no | h3 certificate:request [#certificate-request] | `ymir certificate:request [options] [&lt;domains>...]` |
| `reference/ymir-cli.mdx:322` | bash |  | 11/8 | cli-commented-examples | intent-review | h4 Usage [#usage-9] | `# Create a SSL certificate with prompt for domain and region` |
| `reference/ymir-cli.mdx:350` | bash |  | 1/1 | cli-synopsis | no | h3 database:create [#database-create] | `ymir database:create [&lt;database>]` |
| `reference/ymir-cli.mdx:378` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-10] | `# Create a database with prompt for database server and database name` |
| `reference/ymir-cli.mdx:391` | bash |  | 1/1 | cli-synopsis | no | h3 database:delete [#database-delete] | `ymir database:delete [&lt;database>]` |
| `reference/ymir-cli.mdx:419` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-11] | `# Delete a database with prompt for database server and database name` |
| `reference/ymir-cli.mdx:432` | bash |  | 1/1 | cli-synopsis | no | h3 database:export [#database-export] | `ymir database:export [options] [&lt;database>]` |
| `reference/ymir-cli.mdx:489` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-12] | `# Export a database with prompt for database server, database name, database use` |
| `reference/ymir-cli.mdx:502` | bash |  | 1/1 | cli-synopsis | no | h3 database:import [#database-import] | `ymir database:import [options] &lt;filename> [&lt;database>]` |
| `reference/ymir-cli.mdx:563` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-13] | `# Import a database with prompt for database server, database name, database use` |
| `reference/ymir-cli.mdx:576` | bash |  | 1/1 | cli-synopsis | no | h3 database:list [#database-list] | `ymir database:list [&lt;server>]` |
| `reference/ymir-cli.mdx:598` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-14] | `# List all databases on the database server with prompt for database server` |
| `reference/ymir-cli.mdx:608` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:create [#database-server-create] | `ymir database:server:create [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:658` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-15] | `# Create a new database server with prompts for the name, network, database engi` |
| `reference/ymir-cli.mdx:671` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:delete [#database-server-delete] | `ymir database:server:delete [&lt;server>]` |
| `reference/ymir-cli.mdx:687` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-16] | `# Delete the database server with prompt for database server` |
| `reference/ymir-cli.mdx:700` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:info [#database-server-info] | `ymir database:server:info [&lt;server>]` |
| `reference/ymir-cli.mdx:716` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-17] | `# Get information on a database server with prompt for database server` |
| `reference/ymir-cli.mdx:729` | bash |  | 1/1 | command-runnable | yes | h3 database:server:list [#database-server-list] | `ymir database:server:list` |
| `reference/ymir-cli.mdx:737` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-18] | `# List all database servers` |
| `reference/ymir-cli.mdx:742` | text | title="Output" | 6/6 | text-other | no | h4 Usage [#usage-18] | `---- --------- ---------- --------- ----------- ----------- -------- ------ ----` |
| `reference/ymir-cli.mdx:753` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:lock [#database-server-lock] | `ymir database:server:lock [&lt;server>]` |
| `reference/ymir-cli.mdx:769` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-19] | `# Lock a database server with prompt for database server` |
| `reference/ymir-cli.mdx:782` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:modify [#database-server-modify] | `ymir database:server:modify [options] [&lt;server>]` |
| `reference/ymir-cli.mdx:808` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-20] | `# Modify a database server with prompt for database server` |
| `reference/ymir-cli.mdx:818` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:rotate-password [#database-server-rotate- | `ymir database:server:rotate-password [&lt;server>]` |
| `reference/ymir-cli.mdx:846` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-21] | `# Rotate the password of a database server with prompt for the database server` |
| `reference/ymir-cli.mdx:856` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:tunnel [#database-server-tunnel] | `ymir database:server:tunnel [options] [&lt;server>]` |
| `reference/ymir-cli.mdx:886` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-22] | `# Create a SSH tunnel to a database server with prompt for the database server` |
| `reference/ymir-cli.mdx:899` | bash |  | 1/1 | cli-synopsis | no | h3 database:server:unlock [#database-server-unlock] | `ymir database:server:unlock [&lt;server>]` |
| `reference/ymir-cli.mdx:915` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-23] | `# Unlock a database server with prompt for database server` |
| `reference/ymir-cli.mdx:928` | bash |  | 1/1 | cli-synopsis | no | h3 database:user:create [#database-user-create] | `ymir database:user:create [options] [&lt;user> [&lt;databases>...]]` |
| `reference/ymir-cli.mdx:968` | bash |  | 11/8 | cli-commented-examples | intent-review | h4 Usage [#usage-24] | `# Create a database user with prompt for database server and username` |
| `reference/ymir-cli.mdx:984` | bash |  | 1/1 | cli-synopsis | no | h3 database:user:delete [#database-user-delete] | `ymir database:user:delete [options] [&lt;user>]` |
| `reference/ymir-cli.mdx:1018` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-25] | `# Delete a database user with prompt for database server and username` |
| `reference/ymir-cli.mdx:1031` | bash |  | 1/1 | cli-synopsis | no | h3 database:user:list [#database-user-list] | `ymir database:user:list [&lt;server>]` |
| `reference/ymir-cli.mdx:1053` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-26] | `# List all the managed database users on the database server with prompt for dat` |
| `reference/ymir-cli.mdx:1063` | bash |  | 1/1 | cli-synopsis | no | h3 database:user:rotate-password [#database-user-rotate-pass | `ymir database:user:rotate-password [options] [&lt;user>]` |
| `reference/ymir-cli.mdx:1097` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-27] | `# Rotate a database user's password with prompt for database server and username` |
| `reference/ymir-cli.mdx:1114` | bash |  | 1/1 | cli-synopsis | no | h3 dns:record:change [#dns-record-change] | `ymir dns:record:change &lt;zone> &lt;type> &lt;name> &lt;value>` |
| `reference/ymir-cli.mdx:1154` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-28] | `# Change the A record of "example.com" to 192.0.2.10` |
| `reference/ymir-cli.mdx:1167` | bash |  | 1/1 | cli-synopsis | no | h3 dns:record:delete [#dns-record-delete] | `ymir dns:record:delete [options] &lt;zone> [&lt;record>]` |
| `reference/ymir-cli.mdx:1209` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-29] | `# Delete the DNS record with ID 42 from the "example.com" DNS zone` |
| `reference/ymir-cli.mdx:1222` | bash |  | 1/1 | cli-synopsis | no | h3 dns:record:list [#dns-record-list] | `ymir dns:record:list [&lt;zone>]` |
| `reference/ymir-cli.mdx:1240` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-30] | `# List DNS records from a DNS zone with prompt for the DNS zone` |
| `reference/ymir-cli.mdx:1250` | bash |  | 1/1 | cli-synopsis | no | h3 dns:zone:create [#dns-zone-create] | `ymir dns:zone:create [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:1274` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-31] | `# Create a DNS zone with prompt for the domain name` |
| `reference/ymir-cli.mdx:1286` | bash |  | 1/1 | cli-synopsis | no | h3 dns:zone:delete [#dns-zone-delete] | `ymir dns:zone:delete [&lt;zone>]` |
| `reference/ymir-cli.mdx:1308` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-32] | `# Delete a DNS zone with prompt to choose the DNS zone` |
| `reference/ymir-cli.mdx:1318` | bash |  | 1/1 | cli-synopsis | no | h3 dns:zone:import-records [#dns-zone-import-records] | `ymir dns:zone:import-records &lt;zone> [&lt;subdomain>...]` |
| `reference/ymir-cli.mdx:1344` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-33] | `# Import the DNS records of the "example.com" root domain` |
| `reference/ymir-cli.mdx:1354` | bash |  | 1/1 | command-runnable | yes | h3 dns:zone:list [#dns-zone-list] | `ymir dns:zone:list` |
| `reference/ymir-cli.mdx:1362` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-34] | `# List DNS zones` |
| `reference/ymir-cli.mdx:1373` | bash |  | 1/1 | cli-synopsis | no | h3 docker:create [#docker-create] | `ymir docker:create [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:1403` | bash |  | 11/8 | cli-commented-examples | intent-review | h4 Usage [#usage-35] | `# Create a project-wide Dockerfile` |
| `reference/ymir-cli.mdx:1419` | bash |  | 1/1 | cli-synopsis | no | h3 docker:delete-images [#docker-delete-images] | `ymir docker:delete-images [options] [&lt;project>]` |
| `reference/ymir-cli.mdx:1447` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-36] | `# Delete all local deployment images of the current project` |
| `reference/ymir-cli.mdx:1464` | bash |  | 1/1 | cli-synopsis | no | h3 email:identity:create [#email-identity-create] | `ymir email:identity:create [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:1498` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-37] | `# Create an email identity with a prompt for the identity name` |
| `reference/ymir-cli.mdx:1511` | bash |  | 1/1 | cli-synopsis | no | h3 email:identity:delete [#email-identity-delete] | `ymir email:identity:delete [&lt;identity>]` |
| `reference/ymir-cli.mdx:1533` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-38] | `# Delete an email identity with prompt to choose the identity` |
| `reference/ymir-cli.mdx:1543` | bash |  | 1/1 | cli-synopsis | no | h3 email:identity:info [#email-identity-info] | `ymir email:identity:info [&lt;identity>]` |
| `reference/ymir-cli.mdx:1559` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-39] | `# Get information on an email identity with prompt to choose the identity` |
| `reference/ymir-cli.mdx:1569` | bash |  | 1/1 | command-runnable | yes | h3 email:identity:list [#email-identity-list] | `ymir email:identity:list` |
| `reference/ymir-cli.mdx:1577` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-40] | `# List email identities` |
| `reference/ymir-cli.mdx:1588` | bash |  | 1/1 | cli-synopsis | no | h3 environment:create [#environment-create] | `ymir environment:create [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:1612` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-41] | `# Create a new environment with prompt to choose the name` |
| `reference/ymir-cli.mdx:1625` | bash |  | 1/1 | cli-synopsis | no | h3 environment:delete [#environment-delete] | `ymir environment:delete [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:1661` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-42] | `# Delete an environment with prompt to choose the environment` |
| `reference/ymir-cli.mdx:1674` | bash |  | 1/1 | cli-synopsis | no | h3 environment:info [#environment-info] | `ymir environment:info [&lt;environment>]` |
| `reference/ymir-cli.mdx:1690` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-43] | `# Get information on all environments found in ymir.yml file` |
| `reference/ymir-cli.mdx:1700` | bash |  | 1/1 | cli-synopsis | no | h3 environment:invalidate-cache [#environment-invalidate-cac | `ymir environment:invalidate-cache [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:1724` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-44] | `# Invalidate an environment's content delivery network cache with prompt to choo` |
| `reference/ymir-cli.mdx:1737` | bash |  | 1/1 | cli-synopsis | no | h3 environment:list [#environment-list] | `ymir environment:list [&lt;project>]` |
| `reference/ymir-cli.mdx:1753` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-45] | `# List the environments of the current project` |
| `reference/ymir-cli.mdx:1763` | bash |  | 1/1 | cli-synopsis | no | h3 environment:logs:query [#environment-logs-query] | `ymir environment:logs:query [options] [&lt;environment> [&lt;function>]]` |
| `reference/ymir-cli.mdx:1809` | bash |  | 20/14 | cli-commented-examples | intent-review | h4 Usage [#usage-46] | `# Retrieve the last 10 logged events from the "website" function over the last h` |
| `reference/ymir-cli.mdx:1834` | bash |  | 1/1 | cli-synopsis | no | h3 environment:logs:watch [#environment-logs-watch] | `ymir environment:logs:watch [options] [&lt;environment> [&lt;function>]]` |
| `reference/ymir-cli.mdx:1868` | bash |  | 17/12 | cli-commented-examples | intent-review | h4 Usage [#usage-47] | `# Continuously monitor and display the most recent logs from the "website" funct` |
| `reference/ymir-cli.mdx:1890` | bash |  | 1/1 | cli-synopsis | no | h3 environment:metrics [#environment-metrics] | `ymir environment:metrics [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:1914` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-48] | `# Get cost and usage metrics over the last 24h with prompt to choose the environ` |
| `reference/ymir-cli.mdx:1929` | bash |  | 1/1 | command-placeholder | intent-review | h3 environment:secret:change [#environment-secret-change] | `ymir environment:secret:change [&lt;environment> [&lt;name> [&lt;value>]]]` |
| `reference/ymir-cli.mdx:1969` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-49] | `# Change a secret with a prompt for the environment and the name and value of th` |
| `reference/ymir-cli.mdx:1984` | bash |  | 1/1 | cli-synopsis | no | h3 environment:secret:delete [#environment-secret-delete] | `ymir environment:secret:delete [&lt;environment> [&lt;secret>]]` |
| `reference/ymir-cli.mdx:2006` | bash |  | 11/8 | cli-commented-examples | intent-review | h4 Usage [#usage-50] | `# Delete a secret with prompt for the environment and the secret` |
| `reference/ymir-cli.mdx:2024` | bash |  | 1/1 | cli-synopsis | no | h3 environment:secret:list [#environment-secret-list] | `ymir environment:secret:list [&lt;environment>]` |
| `reference/ymir-cli.mdx:2040` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-51] | `# List the secrets used by an environment with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2050` | bash |  | 1/1 | cli-synopsis | no | h3 environment:url [#environment-url] | `ymir environment:url [&lt;environment>]` |
| `reference/ymir-cli.mdx:2066` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-52] | `# Get the URL to an environment with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2078` | bash |  | 1/1 | command-placeholder | intent-review | h3 environment:variables:change [#environment-variables-chan | `ymir environment:variables:change [&lt;environment> [&lt;name> [&lt;value>]]]` |
| `reference/ymir-cli.mdx:2112` | bash |  | 11/8 | cli-commented-examples | intent-review | h4 Usage [#usage-53] | `# Change an environment variable with a prompt for the environment and the name ` |
| `reference/ymir-cli.mdx:2130` | bash |  | 1/1 | cli-synopsis | no | h3 environment:variables:download [#environment-variables-do | `ymir environment:variables:download [&lt;environment>]` |
| `reference/ymir-cli.mdx:2152` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-54] | `# Download environment variables from the "staging" environment to the ".env.sta` |
| `reference/ymir-cli.mdx:2164` | bash |  | 1/1 | cli-synopsis | no | h3 environment:variables:upload [#environment-variables-uplo | `ymir environment:variables:upload [&lt;environment>]` |
| `reference/ymir-cli.mdx:2188` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-55] | `# Upload the environment variables in the ".env.staging" file to the "staging" e` |
| `reference/ymir-cli.mdx:2202` | bash |  | 1/1 | command-runnable | yes | h3 install-integration [#install-integration] | `ymir install-integration` |
| `reference/ymir-cli.mdx:2225` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-install-integration] | `# Install the Ymir integration for the project in the current directory` |
| `reference/ymir-cli.mdx:2236` | bash |  | 1/1 | cli-synopsis | no | h3 artisan [#artisan] | `ymir artisan [options] [&lt;artisan-command>...]` |
| `reference/ymir-cli.mdx:2272` | bash |  | 14/10 | cli-commented-examples | intent-review | h4 Usage [#usage-artisan] | `# Run "php artisan migrate:status" with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2291` | bash |  | 1/1 | command-runnable | yes | h3 laravel:vapor:migrate [#laravel-vapor-migrate] | `ymir laravel:vapor:migrate` |
| `reference/ymir-cli.mdx:2344` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-laravel-vapor-migrate] | `# Migrate the matching environments in vapor.yml into ymir.yml` |
| `reference/ymir-cli.mdx:2355` | bash |  | 1/1 | cli-synopsis | no | h3 media:import [#media-import] | `ymir media:import [options] [&lt;path>]` |
| `reference/ymir-cli.mdx:2402` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-56] | `# Import files to the "staging" environment with a confirmation prompt` |
| `reference/ymir-cli.mdx:2416` | bash |  | 1/1 | cli-synopsis | no | h3 network:bastion:add [#network-bastion-add] | `ymir network:bastion:add [&lt;network>]` |
| `reference/ymir-cli.mdx:2432` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-57] | `# Add a bastion host to a network with prompt for the network` |
| `reference/ymir-cli.mdx:2442` | bash |  | 1/1 | cli-synopsis | no | h3 network:bastion:remove [#network-bastion-remove] | `ymir network:bastion:remove [&lt;network>]` |
| `reference/ymir-cli.mdx:2458` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-58] | `# Remove a bastion host from a network with prompt for the network` |
| `reference/ymir-cli.mdx:2468` | bash |  | 1/1 | cli-synopsis | no | h3 network:create [#network-create] | `ymir network:create [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:2494` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-59] | `# Create a network with a prompt for the network name` |
| `reference/ymir-cli.mdx:2504` | bash |  | 1/1 | cli-synopsis | no | h3 network:delete [#network-delete] | `ymir network:delete [&lt;network>]` |
| `reference/ymir-cli.mdx:2520` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-60] | `# Delete a network with a prompt for the network` |
| `reference/ymir-cli.mdx:2533` | bash |  | 1/1 | command-runnable | yes | h3 network:list [#network-list] | `ymir network:list` |
| `reference/ymir-cli.mdx:2541` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-61] | `# List all networks` |
| `reference/ymir-cli.mdx:2546` | text | title="Output" | 5/5 | text-other | no | h4 Usage [#usage-61] | `---- ------ -------------- ----------- ----------- -------------` |
| `reference/ymir-cli.mdx:2556` | bash |  | 1/1 | cli-synopsis | no | h3 network:nat:add [#network-nat-add] | `ymir network:nat:add [&lt;network>]` |
| `reference/ymir-cli.mdx:2572` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-62] | `# Add a NAT gateway to a network with prompt for the network` |
| `reference/ymir-cli.mdx:2582` | bash |  | 1/1 | cli-synopsis | no | h3 network:nat:remove [#network-nat-remove] | `ymir network:nat:remove [&lt;network>]` |
| `reference/ymir-cli.mdx:2598` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-63] | `# Remove a NAT gateway from a network with prompt for the network` |
| `reference/ymir-cli.mdx:2612` | bash |  | 1/1 | cli-synopsis | no | h3 php:info [#php-info] | `ymir php:info [&lt;environment>]` |
| `reference/ymir-cli.mdx:2636` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-64] | `# Get PHP information about an environment with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2646` | bash |  | 1/1 | cli-synopsis | no | h3 php:version [#php-version] | `ymir php:version [&lt;environment>]` |
| `reference/ymir-cli.mdx:2662` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-65] | `# Get the PHP version on an environment with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2682` | bash |  | 2/2 | command-placeholder | intent-review | h3 project:build [build] [#project-build-build] | `ymir project:build [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:2709` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-66] | `# Build project for deployment with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2722` | bash |  | 2/2 | command-destructive | intent-review | h3 project:delete [delete] [#project-delete-delete] | `ymir project:delete [&lt;project>]` |
| `reference/ymir-cli.mdx:2747` | bash |  | 13/10 | cli-commented-examples | intent-review | h4 Usage [#usage-67] | `# Inside a Ymir project directory:` |
| `reference/ymir-cli.mdx:2765` | bash |  | 2/2 | command-placeholder | intent-review | h3 project:deploy [deploy] [#project-deploy-deploy] | `ymir project:deploy [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:2802` | bash |  | 14/10 | cli-commented-examples | intent-review | h4 Usage [#usage-68] | `# Deploy project with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2821` | bash |  | 2/2 | command-placeholder | intent-review | h3 project:info [info] [#project-info-info] | `ymir project:info [&lt;project>]` |
| `reference/ymir-cli.mdx:2838` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-69] | `# Get information on the project of the current directory` |
| `reference/ymir-cli.mdx:2848` | bash |  | 2/2 | command-runnable | yes | h3 project:init [init] [#project-init-init] | `ymir project:init` |
| `reference/ymir-cli.mdx:2857` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-70] | `# Initialize a new project` |
| `reference/ymir-cli.mdx:2864` | bash |  | 1/1 | command-runnable | yes | h3 project:list [#project-list] | `ymir project:list` |
| `reference/ymir-cli.mdx:2872` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-71] | `# List all projects` |
| `reference/ymir-cli.mdx:2877` | text | title="Output" | 5/5 | text-other | no | h4 Usage [#usage-71] | `---- ------ -------------- -----------` |
| `reference/ymir-cli.mdx:2887` | bash |  | 2/2 | command-placeholder | intent-review | h3 project:redeploy [redeploy] [#project-redeploy-redeploy] | `ymir project:redeploy [&lt;environment>]` |
| `reference/ymir-cli.mdx:2910` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-72] | `# Redeploy with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2923` | bash |  | 2/2 | command-destructive | intent-review | h3 project:rollback [rollback] [#project-rollback-rollback] | `ymir project:rollback [options] [&lt;environment>]` |
| `reference/ymir-cli.mdx:2946` | bash |  | 11/8 | cli-commented-examples | intent-review | h4 Usage [#usage-73] | `# Rollback with prompt to choose the environment` |
| `reference/ymir-cli.mdx:2962` | bash |  | 2/2 | command-placeholder | intent-review | h3 project:validate [validate] [#project-validate-validate] | `ymir project:validate [&lt;environments>...]` |
| `reference/ymir-cli.mdx:2979` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-74] | `# Validates the project's ymir.yml file` |
| `reference/ymir-cli.mdx:2990` | bash |  | 1/1 | cli-synopsis | no | h3 provider:connect [#provider-connect] | `ymir provider:connect [options] [&lt;name>]` |
| `reference/ymir-cli.mdx:3020` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-75] | `# Connect a cloud provider with prompts for the name and authentication method` |
| `reference/ymir-cli.mdx:3030` | bash |  | 1/1 | cli-synopsis | no | h3 provider:delete [#provider-delete] | `ymir provider:delete [&lt;provider>]` |
| `reference/ymir-cli.mdx:3056` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-76] | `# Outside a Ymir project directory, delete a cloud provider with prompt for the ` |
| `reference/ymir-cli.mdx:3066` | bash |  | 1/1 | command-runnable | yes | h3 provider:list [#provider-list] | `ymir provider:list` |
| `reference/ymir-cli.mdx:3074` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-77] | `# List all cloud providers` |
| `reference/ymir-cli.mdx:3079` | text | title="Output" | 5/5 | text-other | no | h4 Usage [#usage-77] | ` ---- ------ ----------- ----------------` |
| `reference/ymir-cli.mdx:3089` | bash |  | 1/1 | cli-synopsis | no | h3 provider:update [#provider-update] | `ymir provider:update [options] [&lt;provider> [&lt;name>]]` |
| `reference/ymir-cli.mdx:3129` | bash |  | 8/6 | cli-commented-examples | intent-review | h4 Usage [#usage-78] | `# Update cloud provider with ID 42` |
| `reference/ymir-cli.mdx:3148` | bash |  | 1/1 | cli-synopsis | no | h3 team:create [#team-create] | `ymir team:create [&lt;name>]` |
| `reference/ymir-cli.mdx:3164` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-79] | `# Create a new team with a prompt for the name` |
| `reference/ymir-cli.mdx:3174` | bash |  | 1/1 | command-runnable | yes | h3 team:current [#team-current] | `ymir team:current` |
| `reference/ymir-cli.mdx:3182` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-80] | `# Get the details on your currently active team` |
| `reference/ymir-cli.mdx:3187` | text | title="Output" | 6/6 | text-other | no | h4 Usage [#usage-80] | `Your currently active team is:` |
| `reference/ymir-cli.mdx:3198` | bash |  | 1/1 | command-runnable | yes | h3 team:list [#team-list] | `ymir team:list` |
| `reference/ymir-cli.mdx:3206` | bash |  | 2/2 | cli-commented-examples | intent-review | h4 Usage [#usage-81] | `# List all the teams that you're on` |
| `reference/ymir-cli.mdx:3211` | text | title="Output" | 6/6 | text-other | no | h4 Usage [#usage-81] | `You are on the following teams:` |
| `reference/ymir-cli.mdx:3222` | bash |  | 1/1 | cli-synopsis | no | h3 team:select [#team-select] | `ymir team:select [&lt;team>]` |
| `reference/ymir-cli.mdx:3240` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-82] | `# Select a new currently active team with prompt for the team` |
| `reference/ymir-cli.mdx:3254` | bash |  | 1/1 | cli-synopsis | no | h3 wordpress:change-domain [#wordpress-change-domain] | `ymir wordpress:change-domain [&lt;environment> [&lt;domain>]]` |
| `reference/ymir-cli.mdx:3292` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-83] | `# Change an environment's domain with prompt for the environment and the old and` |
| `reference/ymir-cli.mdx:3305` | bash |  | 1/1 | cli-synopsis | no | h3 wordpress:configure [#wordpress-configure] | `ymir wordpress:configure [&lt;environments>...]` |
| `reference/ymir-cli.mdx:3327` | bash |  | 5/4 | cli-commented-examples | intent-review | h4 Usage [#usage-84] | `# Scan the project's plugins and themes and configure all environments` |
| `reference/ymir-cli.mdx:3337` | bash |  | 1/1 | cli-synopsis | no | h3 wp | `ymir wp [options] [&lt;wp-command>...]` |
| `reference/ymir-cli.mdx:3367` | bash |  | 14/10 | cli-commented-examples | intent-review | h4 Usage [#usage-85] | `# Run "wp plugin list" with prompt to choose the environment` |
| `team-resources/caches.mdx:22` | bash |  | 1/1 | command-runnable | yes | h2 Managing cache clusters | `ymir cache:create` |
| `team-resources/caches.mdx:34` | yml |  | 8/8 | yaml-config | no | h2 Using a cache cluster in a project | `id: 1` |
| `team-resources/caches.mdx:51` | bash |  | 1/1 | command-runnable | yes | h2 Connecting to a cache cluster | `ymir cache:tunnel my-cache-cluster` |
| `team-resources/caches.mdx:67` | bash |  | 1/1 | shell-output-or-mixed | no | h2 Connecting to a cache cluster | `redis-cli -h 127.0.0.1 -p 6378` |
| `team-resources/database-servers.mdx:21` | bash |  | 1/1 | command-runnable | yes | h2 Managing database servers | `ymir database:server:create` |
| `team-resources/database-servers.mdx:59` | bash |  | 1/1 | command-runnable | yes | h2 Managing database users | `ymir database:user:create` |
| `team-resources/database-servers.mdx:79` | yml |  | 14/14 | yaml-config | no | h2 Using databases in a project | `id: 1` |
| `team-resources/database-servers.mdx:153` | bash |  | 1/1 | command-runnable | yes | h2 Connecting to a private database server | `ymir database:server:tunnel my-database-server` |
| `team-resources/database-servers.mdx:170` | — |  | 1/1 | plain-unlabelled | no | h2 Connecting to a private database server | `mysql://app_user@127.0.0.1:3305/app_database` |
| `team-resources/database-servers.mdx:176` | — |  | 1/1 | plain-unlabelled | no | h2 Connecting to a private database server | `postgresql://app_user@127.0.0.1:5433/app_database` |
| `team-resources/database-servers.mdx:182` | bash |  | 1/1 | shell-output-or-mixed | no | h2 Connecting to a private database server | `open -a TablePlus "postgresql://app_user@127.0.0.1:5433/app_database"` |
| `team-resources/database-servers.mdx:190` | bash |  | 1/1 | shell-output-or-mixed | no | h2 Connecting to a private database server | `mysql -h 127.0.0.1 -P 3305 -u ymir -p` |
| `team-resources/dns.mdx:40` | bash |  | 1/1 | cli-synopsis | no | h2 Managing DNS zones | `ymir dns:zone:create &lt;domain>` |
| `team-resources/dns.mdx:65` | bash |  | 5/4 | cli-commented-examples | intent-review | h3 Moving a domain's DNS to Ymir [#moving-a-domains-dns-to-y | `# Check which name servers your DNS resolver returns for the domain` |
| `team-resources/dns.mdx:105` | bash |  | 5/4 | cli-commented-examples | intent-review | h2 Importing DNS records | `# Import DNS records with a prompt for the subdomains (leave it blank to import ` |
| `team-resources/dns.mdx:131` | bash |  | 5/4 | cli-commented-examples | intent-review | h3 Changing DNS records [#changing-dns-records] | `# Point "www" to an IP address` |
| `team-resources/dns.mdx:165` | bash |  | 1/1 | cli-synopsis | no | h3 Deleting DNS records [#deleting-dns-records] | `ymir dns:record:delete &lt;domain> &lt;record-id>` |
| `team-resources/email.mdx:12` | bash |  | 1/1 | command-runnable | yes | h2 How does email work with Ymir? | `ymir project:info` |
| `team-resources/email.mdx:72` | bash |  | 5/4 | cli-commented-examples | intent-review | h3 Creating an email identity [#creating-an-email-identity] | `# Create an email identity for the "example.com" domain` |
| `team-resources/email.mdx:94` | text | title="Example output" | 11/9 | text-other | no | h3 Verifying a domain identity [#verifying-a-domain-identity | `Email identity created` |
| `team-resources/email.mdx:112` | bash |  | 1/1 | command-placeholder | intent-review | h3 Verifying a domain identity [#verifying-a-domain-identity | `ymir email:identity:info example.com` |
| `team-resources/email.mdx:124` | text | title="Example output" | 6/6 | text-other | no | h3 Checking your email identities [#checking-your-email-iden | ` ---- -------------------- -------- -------------- ----------- ---------- ------` |
| `team-resources/email.mdx:144` | bash |  | 1/1 | command-destructive | intent-review | h3 Deleting an email identity [#deleting-an-email-identity] | `ymir email:identity:delete 7` |
| `team-resources/email.mdx:161` | php |  | 1/1 | php-example | no | h2 Using another email service [#using-another-email-service | `define('YMIR_DISABLE_EMAIL_SENDING', true);` |
| `team-resources/email.mdx:167` | bash |  | 1/1 | command-runnable | yes | h2 Using another email service [#using-another-email-service | `ymir environment:variables:change production YMIR_DISABLE_EMAIL_SENDING 1` |
| `team-resources/email.mdx:177` | php | title="wp-content/mu-plugins/log-email-errors.php" | 5/4 | php-example | no | h2 Troubleshooting email sending [#troubleshooting-email-sen | `&lt;?php` |
| `team-resources/networks.mdx:61` | yml |  | 6/6 | yaml-config | no | h3 Connect a network to an environment | `id: 1` |
| `team-resources/networks.mdx:88` | bash |  | 1/1 | command-runnable | yes | h2 Bastion host | `ymir network:bastion:add network-name` |
| `team-resources/networks.mdx:100` | text | title="~/.ssh/config" | 4/4 | text-other | no | h2 Bastion host | `Host &lt;bastion-host-domain-name>` |
| `team-resources/networks.mdx:109` | bash |  | 1/1 | shell-output-or-mixed | no | h2 Bastion host | `ssh &lt;bastion-host-domain-name>` |
| `team-resources/ssl-certificates.mdx:20` | bash |  | 1/1 | command-placeholder | intent-review | h2 Requesting a SSL certificate | `ymir certificate:request example.com` |
| `team-resources/ssl-certificates.mdx:30` | text | title="Example output" | 11/8 | text-other | no | h2 Requesting a SSL certificate | `SSL certificate requested` |
| `team-resources/ssl-certificates.mdx:50` | bash |  | 1/1 | command-runnable | yes | h2 Requesting a SSL certificate | `ymir certificate:info 42` |
| `team-resources/ssl-certificates.mdx:60` | bash |  | 5/4 | cli-commented-examples | intent-review | h3 Choosing the domains to cover [#choosing-the-domains-to-c | `# Cover "example.com" and one level of "example.com" subdomains` |
| `team-resources/ssl-certificates.mdx:76` | text | title="Example output" | 6/6 | text-other | no | h2 Validating your SSL certificate [#validating-your-ssl-cer | ` ---- -------------- ----------- --------------- --------- --------` |

## Applied policy (2026-10-03)

- `source.config.ts` applies the proposed implementation: `rehypeCodeOptions.meta: { allowCopy: 'false' }` and a `parseMetaString` that reads the `copy` flag with `parseCodeBlockAttributes`, then delegates the rest to the public `rehypeCodeDefaultOptions.parseMetaString`. `noCopy` wins when both flags are present. `llmsOptions.stringify` drops the flag from Markdown through `state.handle`, and leaves fences without the flag untouched.
- Opted in: only these 5 single-command blocks in `getting-started.mdx` (lines 63, 83, 103, 366, 374): `composer global require ymirapp/cli`, `composer require ymirapp/cli`, `ymir login`, `ymir deploy staging` and `ymir environment:url staging`. Only the fence lines changed. The code is byte-identical.
- Result: 310 blocks, **5 with Copy and 305 without**. Copy Markdown (36) and heading anchors (844) are unchanged. All 36 page Markdown exports, `llms.txt` and `llms-full.txt` are byte-identical to the pre-change exports.
- The 138 one-line blocks and the 55 `command-runnable` candidates above were **not** opted in. Each one still needs a manual review. The other candidates stay off until they are reviewed.
- Checks: `scripts/check-code-copy.mjs` (project config through the installed pipeline: default off, `copy`, title, `noCopy` precedence, Markdown and search output) and the opted-in count and copy behaviour in `scripts/check-typography.mjs`.
