import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { docsContentRoute } from '@/lib/shared';

/** Maps a page path (`/reference/configuration`) to its Markdown route. */
function contentPath(pathname: string): string {
  return `${docsContentRoute}${pathname.replace(/\/(index)?$/, '')}/content.md`;
}

/**
 * Redirects legacy `.html` URLs and serves Markdown for `.md` URLs and `Accept: text/markdown`.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The legacy VuePress site served `/page.html`, and the app, CLI and WordPress plugin link to
  // those URLs. Browsers keep the `#fragment` across the redirect, and the headings keep their ids.
  if (pathname.endsWith('.html')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/(\/index)?\.html$/, '') || '/';

    return NextResponse.redirect(url, 301);
  }

  if (pathname.endsWith('.md')) {
    return NextResponse.rewrite(new URL(contentPath(pathname.slice(0, -'.md'.length)), request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    return NextResponse.rewrite(new URL(contentPath(pathname), request.nextUrl), {
      headers: { Vary: 'Accept' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/|llms|images/|.*\\.(?:png|ico|svg|webmanifest|txt|xml|woff2?)$).*)'],
};
