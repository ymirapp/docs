# Fumadocs customization and a shared public header

Research date: 2026-10-02. Nothing was implemented or verified in a browser, and no servers were started.

Unless noted otherwise, paths are relative to this repository. Laravel paths are prefixed with `ymir/app/`.

## Summary

Fumadocs can be customized at several levels. Most of the docs UI can change while Fumadocs core and its content, search, and page-tree handling stay in place underneath:

- **Theme tokens and CSS:** `--color-fd-*` variables and the layout variables. This site already uses them for the Ymir palette (`app/global.css`).
- **Layout options:** `nav`, `links`, `githubUrl`, `searchToggle`, and `themeSwitch` (`lib/layout.shared.tsx`).
- **Component slots:** `header`, `container`, `sidebar.*`, and the base slots.
- **Custom layouts:** your own React components built on `fumadocs-core`.

Matching the marketing site's header is possible without forking Fumadocs or creating a frontend package shared with Laravel. The header would be a React component in this repository that copies the markup from the Laravel Blade component.

## Recommendation

1. Port the `<header>` from `ymir/app/resources/views/marketing/components/site-layout.blade.php` into one React component in this repository. Reuse `components/logo.tsx` and the same Tailwind classes. The design reference already has a React `SiteHeader` (see "Design reference" below), which may be a better starting point than the Blade markup.
2. Render it above `<DocsLayout>` in `app/(docs)/layout.tsx`. In Laravel and in the reference the header is `relative`, not sticky. A non-sticky header in normal flow gives the same visual result and does not touch Fumadocs' offsets.
3. Making it sticky is an optional choice and is not needed to match the design. If it is wanted, the candidate approach is to set `--fd-banner-height` to the header height. The layout and Fumadocs' own `Banner` component use that variable for sticky offsets. This approach still needs browser verification, mainly for heading anchors on mobile (see "Offsets").
4. Keep the current fixed "Log in" link. Showing "Dashboard" to logged-in users is out of scope (see "Auth").

## Confirmed in installed source and official docs

### Version and extension points

- `fumadocs-ui` is `npm:@fumadocs/base-ui@16.15.15` (`package.json`, `node_modules/fumadocs-ui/package.json`).
- `DocsLayoutProps.slots?: Partial<DocsSlots>`. The available slots are `container`, `header`, and `sidebar.{provider,root,trigger,useSidebar}`, plus the base slots (`node_modules/fumadocs-ui/dist/layouts/docs/client.d.ts`, `dist/layouts/docs/index.d.ts`).
- `nav.component`, `sidebar.component`, and `themeSwitch.component` are `@deprecated` in favor of slots (`dist/layouts/shared/index.d.ts`).
- The official docs describe `DocsLayout` as having "a sidebar and **mobile-only** navbar/header", and they document the grid and offset variables: https://www.fumadocs.dev/docs/ui/layouts/docs ("The Layout System").

### Why replacing `slots.header` is not enough for a full-width header

- The default header slot (`id="nd-subnav"`) sits in `[grid-area:header]` and is `md:hidden` (`dist/layouts/docs/slots/header.js`).
- The container grid is `"sidebar sidebar header toc toc"` (`dist/layouts/docs/slots/container.js`). A replacement header slot therefore fills only the column between the sidebar and the TOC.
- The grid could be overridden through `containerProps.style.gridTemplate`, because `...props.style` is spread last. That would make this site responsible for Fumadocs' internal grid, so I don't recommend it.
- The supported route is a header outside `DocsLayout`. On desktop, `DocsLayout` keeps its title, links, and search in the sidebar.

### Offsets

- `--fd-docs-row-1` is `var(--fd-banner-height, 0px)`. Rows 2 and 3 add the mobile header height and the TOC popover height (`container.js`; official docs above).
- These elements are sticky and position themselves from those variables:
  - the desktop sidebar and desktop TOC (`top-(--fd-docs-row-1)`, `dist/layouts/docs/slots/sidebar.js`, `dist/layouts/docs/page/slots/toc.js`);
  - the mobile subnav, which contains search and the sidebar toggle (`top-(--fd-docs-row-1)`, `header.js`);
  - the TOC popover (`top-(--fd-docs-row-2)`).
- `Banner` sets `:root { --fd-banner-height: <height> }` and uses `sticky top-0 z-40` (`dist/components/banner.js`; https://www.fumadocs.dev/docs/ui/components/banner).
- Headings use a fixed `scroll-m-28` (112px), which does not read the offset variables (`dist/components/heading.js`).
  - If the header is sticky at 68px, the sticky elements on mobile add up to 68 + 56 + 40 = 164px. Anchored headings would then land underneath the header unless the scroll margin is raised, for example to `calc(var(--fd-docs-row-3) + 1rem)`. This figure comes from reading the source and has not been checked in a browser.
  - A non-sticky header does not cause this problem.

### Existing alignment

- **Logo:** `components/logo.tsx` uses the same SVG paths as `ymir/app/resources/views/marketing/components/logo.blade.php`. The width (72px vs 82px) and fill (`fill-current` vs `fill-paper`) differ.
- **Fonts:** both sites use Geist and Geist Mono. This site loads them with `next/font/google` (`app/layout.tsx`). Laravel self-hosts `/fonts/geist*.woff2` and applies them inside `.public-site` (`ymir/app/resources/css/app.css`).
- **Colors:** `app/global.css` maps the Ymir palette onto `--color-fd-*` with a forced light theme and a forest-colored sidebar. The header also uses `control-border #587064`, `signal #a5c9a8`, and `#c7d0ca`. These are not defined in the docs CSS today, and they can stay as literal values in the component.
- **Breakpoints:** the marketing header switches to a `<details>` menu below `xl` (1280px) (`ymir/app/DESIGN.md` "Navigation"). Fumadocs switches to its mobile sidebar below `md` (768px). Between 768px and 1280px, the page would show both the marketing "Menu" and the desktop docs sidebar. This works but needs a visual check.

### Design reference (parent-confirmed)

The parent agent confirmed that the preview at `http://localhost:3002/docs` is the separate Vinext design reference (`/Users/carlalexander/Documents/Codex/2026-09-02/files-pasted-by-the-user-redesign/work/site`), not this repository. Its `app/SiteChrome.tsx` already renders a React `SiteHeader` with the same 68px dark public header and navigation as Laravel. I did not inspect it myself.

### Auth

- Blade components cannot be rendered in this separate Next.js app on `docs.ymirapp.com` (`ymir/app/routes/external.php`, `lib/shared.ts`). The React header would be a hand-maintained copy of the Blade header.
- The docs app has no Laravel session integration today, and its pages are statically generated (`generateStaticParams`). It cannot automatically apply Laravel's `@auth` the way the Blade layout does.
- A "Dashboard" label for logged-in users would need a separately designed integration with the app's session. That is out of scope here, and this note does not prescribe how to build it.
- The current link `https://ymirapp.com/login` (`lib/layout.shared.tsx`) can stay:
  - Fortify registers `GET /login` with `guest` middleware (`ymir/app/vendor/laravel/fortify/routes/routes.php`).
  - `RedirectIfAuthenticated` sends logged-in users to `route('dashboard')` (`ymir/app/app/Http/Middleware/RedirectIfAuthenticated.php`).

## Not verified

- No browser check: actual header heights, backdrop and translucency over the cream surface, how the header stacks against the search dialog (`Banner` is `z-40`, the subnav is `z-30`), and anchor landing positions.
- Whether to keep or remove the logo and links that `DocsLayout` shows in the sidebar (`baseOptions().nav.title`, `links`) once a top header exists. Fumadocs supports either choice through `baseOptions`.
