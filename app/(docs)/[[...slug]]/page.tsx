import { source } from '@/lib/source';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageMarkdownUrl } from '@/lib/shared';
import { PageNavigation } from '@/components/page-navigation';
import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';

/**
 * Overview cards render as plain links. The layout comes from the `className` on each `<Cards>`
 * in content/docs/index.mdx, styled in app/global.css.
 */
const overviewComponents = {
  Cards: ({ className, children }: { className?: string; children?: ReactNode }) => (
    <div className={className}>{children}</div>
  ),
  // `data-card` opts the link out of the prose link styles, like the Fumadocs card.
  Card: ({ title, href, children }: { title: ReactNode; href?: string; children?: ReactNode }) => (
    <Link href={href} data-card className="group block">
      <span className="font-semibold text-fd-foreground underline decoration-1 underline-offset-4 group-hover:text-fd-primary">
        {title}
      </span>
      <div className="mt-1 text-sm text-fd-muted-foreground prose-no-margin empty:hidden">{children}</div>
    </Link>
  ),
};

export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const isOverview = page.url === '/';
  // The page's `content/docs/meta.json` separator, named like its sidebar group. The overview has none.
  const topic = getBreadcrumbItems(page.url, source.getPageTree(), { includeSeparator: true }).at(-1)?.name;

  // The overview is a link index without a pager, and the `overview-page` styles in
  // app/global.css set its title and section type.
  const overviewOptions = isOverview
    ? { className: 'overview-page', footer: { enabled: false } }
    : undefined;

  // The block style keeps native heading indentation without the default style's winding line.
  // `page-toc` lets app/global.css replace the moving highlight with per-section rail markers.
  const tocOptions = { style: 'block', list: { className: 'page-toc' } } as const;

  return (
    <DocsPage
      toc={page.data.toc.filter((item) => item.depth <= page.data.tocDepth)}
      tableOfContent={tocOptions}
      tableOfContentPopover={tocOptions}
      full={page.data.full}
      breadcrumb={{
        enabled: topic !== undefined,
        component: (
          <nav aria-label="Breadcrumb" className="page-breadcrumb">
            <Link href="/">Documentation</Link>
            <span aria-hidden="true">/</span>
            <span>{topic === 'Get started' ? 'Start here' : topic}</span>
          </nav>
        ),
      }}
      footer={{ component: <PageNavigation url={page.url} /> }}
      {...overviewOptions}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <MarkdownCopyButton markdownUrl={markdownUrl} />
      <DocsBody className={isOverview ? 'overview' : undefined}>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
            ...(isOverview && overviewComponents),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.url === '/' ? 'Overview' : page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: { 'text/markdown': getPageMarkdownUrl(page).url },
    },
  };
}
