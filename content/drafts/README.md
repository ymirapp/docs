# Unpublished drafts

Historical drafts carried over from the VuePress working tree. Nothing in this directory is built,
indexed for search, or exposed through `llms.txt`, Markdown routes or MCP. Only `content/docs` is
part of the docs build. Files keep their original VuePress syntax (`:::` callouts, `[[toc]]`, relative `.md`
links) and stay unchanged as a record.

Every draft below is superseded by reviewed public-docs source in `content/docs`. That source isn't
necessarily live yet; it's what the docs build publishes once it's deployed. Don't publish, convert or
merge these drafts. Change the reviewed page instead.

| Draft | What it was | Superseded by | Disposition |
| --- | --- | --- | --- |
| `guides/tagging.md` | Title only. Was listed in the legacy sidebar edit. | `content/docs/guides/aws-costs.mdx` (YMIR-89), which covers Ymir's tags and cost allocation. | Keep as history. Don't publish. |
| `guides/cost-saving.md` | Empty file. | `content/docs/guides/aws-costs.mdx` (YMIR-89), which covers reducing AWS costs safely. | Keep as history. Don't publish. |
| `guides/bedrock.md` | Title and a note about `.gitignore` changes. | `content/docs/guides/bedrock.mdx` (YMIR-87), which covers the `.gitignore` rules. | Keep as history. Don't publish. |
| `guides/migration-to-ymir.md` | One section; its `init` link has a malformed `##` fragment. | `content/docs/guides/migration-to-ymir.mdx` (YMIR-88). | Keep as history. Don't publish. |
| `compatibility/cloudflare.md` | Copied from the Beaver Builder page: mentions Beaver Builder, has an unfinished sentence, duplicate `[2]` link definitions, and a link to a nonexistent `#project-configure-configure` anchor. | The "Cloudflare WordPress plugin" section of `content/docs/guides/cloudflare.mdx` (YMIR-85), which covers `build.include` and `wordpress:configure`. | Keep as history. Don't publish. |
| `guides/cloudflare-serving-assets.md` | Section that pointed a Cloudflare `CNAME` record at the S3 bucket and set `YMIR_CUSTOM_ASSETS_URL`. Its screenshots are in `images/`. | The "Serving assets through Cloudflare" callout of `content/docs/guides/cloudflare.mdx` (YMIR-85), which explains why a `CNAME` record plus `YMIR_CUSTOM_ASSETS_URL` alone isn't enough for a validated HTTPS custom asset domain, and what `YMIR_CUSTOM_ASSETS_URL` changes. | Keep as history. Don't publish, and don't move its screenshots to `public/images`. |
| `guides/logging-service.md` | Restructure of the logging guide into "How to configure logging" with empty "Why do you need logging?" and "stderr" sections. | `content/docs/guides/logging-service.mdx` (YMIR-84), which covers how Ymir handles logs, including `stderr`, and logging services. | Keep as history. Don't publish or fill in the empty sections. |

Also unpublished: a TODO that was in the SSL certificates page, after the paragraph about DNS records:

> The SSL certificate will be issued automatically when DNS record(s) are added within the next 15 minutes. If you are unable to add those records in time, please rerun the command

It's superseded by the validation section of `content/docs/team-resources/ssl-certificates.mdx` (YMIR-77),
which describes the current certificate behavior without a fixed deadline. Keep it here as history. Don't
add the 15-minute claim or the former one-hour warning back.
