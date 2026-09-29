import Link from 'next/link';
import { Logo } from '@/components/logo';

// Public site header and footer, ported from the marketing site
// (ymir/app resources/views/marketing/components/site-layout.blade.php). Keep the two in sync.

const marketingUrl = 'https://ymirapp.com';
const agenciesUrl = `${marketingUrl}/agencies`;
const vectorUrl = `${marketingUrl}/vector`;
const loginUrl = `${marketingUrl}/login`;

const brandClass =
  'focus-visible:outline-signal inline-flex min-h-11 w-max items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4';
const navLinkClass =
  'hover:text-signal focus-visible:outline-signal transition-colors focus-visible:outline-2 focus-visible:outline-offset-4';
const currentNavLinkClass = 'text-bone underline decoration-signal decoration-1 underline-offset-[6px]';
const accountClass =
  'border-control-border text-bone hover:border-signal hover:text-signal focus-visible:outline-signal inline-flex min-h-11 items-center gap-[9px] justify-self-end border px-[13px] py-[9px] font-mono text-[13px] leading-[normal] font-semibold transition-colors hover:bg-[rgba(165,201,168,.07)] focus-visible:outline-2 focus-visible:outline-offset-2 max-xl:hidden';
// The marketing site styles these columns with its `.site-footer-column` component class.
const footerColumnClass =
  'flex flex-col items-start [&>h2]:text-bone [&>h2]:mb-3 [&>h2]:font-mono [&>h2]:text-[0.8125rem] [&>h2]:leading-normal [&>h2]:font-semibold [&>h2]:tracking-[.12em] [&>h2]:uppercase [&>a]:inline-flex [&>a]:min-h-11 [&>a]:max-w-full [&>a]:min-w-11 [&>a]:items-center [&>a]:py-2 [&>a]:text-sm [&>a]:leading-relaxed [&>a]:text-[#b4c3b9] [&>a]:hover:text-signal [&>a]:focus-visible:outline-2 [&>a]:focus-visible:outline-offset-2 [&>a]:focus-visible:outline-signal';

/**
 * Arrow icon for outbound account links (marketing/components/arrow.blade.php).
 */
function Arrow({ strong = false }: { strong?: boolean }) {
  return (
    <svg className="block size-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth={strong ? '1.5' : '1.1'} />
    </svg>
  );
}

/**
 * Logo link to the marketing home page.
 */
function BrandLink() {
  return (
    <a className={brandClass} href={marketingUrl} aria-label="Ymir home">
      <Logo />
    </a>
  );
}

/**
 * Marketing header. It stays in normal flow like on the marketing site, so the sticky Fumadocs
 * sidebar, TOC and mobile subnav offsets are unchanged. Two differences from the marketing site:
 * the background is opaque Ink because the translucent one would tint over the paper surface here,
 * and `z-40` (`z-10` there) keeps the open menu above the `z-30` mobile subnav.
 */
export function SiteHeader() {
  return (
    <header className="border-line max-compact:px-[18px] bg-ink text-bone relative z-40 grid min-h-[68px] grid-cols-[1fr_auto_1fr] items-center border-b px-[3.2vw] font-sans antialiased max-xl:grid-cols-[1fr_auto] max-xl:gap-4">
      <BrandLink />
      <nav
        className="flex items-center gap-[34px] text-[14px] font-medium text-[#c7d0ca] max-xl:hidden [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center"
        aria-label="Primary navigation"
      >
        <Link className={`${navLinkClass} ${currentNavLinkClass}`} href="/" aria-current="location">
          Documentation
        </Link>
        <a className={navLinkClass} href={agenciesUrl}>
          For Agencies
        </a>
        <a className={navLinkClass} href={vectorUrl}>
          For Hosting Companies
        </a>
      </nav>
      <details className="group/mobile relative hidden max-xl:block">
        <summary className="border-control-border text-bone hover:border-signal hover:text-signal focus-visible:outline-signal flex min-h-11 min-w-20 cursor-pointer list-none items-center justify-center border px-[13px] font-mono text-[13px] font-semibold transition-colors hover:bg-[rgba(165,201,168,.07)] focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
          <span className="group-open/mobile:hidden">Menu</span>
          <span className="hidden group-open/mobile:inline">
            Close <span className="sr-only">menu</span>
          </span>
        </summary>
        <div className="border-line [&_a]:focus-visible:outline-signal absolute top-[calc(100%+12px)] right-0 grid w-[min(82vw,360px)] gap-1 border bg-[#0a2018] px-6 py-5 text-base shadow-xl [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&>a]:flex [&>a]:min-h-11 [&>a]:items-center [&>a]:py-2">
          {/* A full page load closes the menu, which client navigation would leave open. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className={currentNavLinkClass} href="/" aria-current="location">Documentation</a>
          <a href={agenciesUrl}>For Agencies</a>
          <a href={vectorUrl}>For Hosting Companies</a>
          <a className="border-line text-bone mt-3 justify-between border-t" href={loginUrl}>
            Log in
            <Arrow />
          </a>
        </div>
      </details>
      <a className={accountClass} href={loginUrl}>
        Log in
        <Arrow strong />
      </a>
    </header>
  );
}

/**
 * Marketing footer.
 */
export function SiteFooter() {
  return (
    <footer className="border-line max-compact:grid-cols-2 max-compact:gap-x-6 max-compact:gap-y-[38px] max-compact:px-7 max-compact:pt-[52px] max-compact:pb-[25px] text-bone grid grid-cols-[1.25fr_repeat(3,1fr)] gap-[45px] border-t bg-[#06130e] px-[5vw] pt-16 pb-[30px] font-sans antialiased max-xl:grid-cols-2">
      <div className="max-xl:col-span-full">
        <BrandLink />
        <p className="mt-4 max-w-[250px] text-sm leading-[1.5] text-[#94aa9e]">
          Serverless WordPress &amp; PHP applications on AWS
        </p>
      </div>
      <div className={footerColumnClass}>
        <h2>Product</h2>
        <a href="https://blog.ymirapp.com/category/case-study">Case Studies</a>
        <a href={agenciesUrl}>For Agencies</a>
        <a href={vectorUrl}>For Hosting Companies</a>
        <Link href="/">Documentation</Link>
      </div>
      <div className={footerColumnClass}>
        <h2>Legal</h2>
        <a href={`${marketingUrl}/terms`}>Terms of Service</a>
      </div>
      <div className={footerColumnClass}>
        <h2>Company</h2>
        <a href={`${marketingUrl}/about`}>About</a>
        <a href="https://blog.ymirapp.com">Blog</a>
        <a href={`${marketingUrl}/business-continuity`}>Business Continuity</a>
        <a href={`${marketingUrl}/changelog`}>Changelog</a>
        <a href={`${marketingUrl}/reports`}>Reports</a>
      </div>
      <div className="border-line max-compact:flex-col max-compact:items-start col-span-full mt-9 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t pt-[22px] font-mono text-xs leading-relaxed text-[#94aa9e]">
        {/* Rendered at build time, so the year updates on the next deploy. */}
        <p>&copy; 2020 - {new Date().getFullYear()} Ymir, Inc. All rights reserved.</p>
        <nav
          className="[&_a]:hover:text-signal [&_a]:focus-visible:outline-signal flex flex-wrap gap-x-5 gap-y-1 text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:min-w-11 [&_a]:items-center [&_a]:py-2 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2"
          aria-label="Social links"
        >
          <a href="https://discord.gg/Ze9qHTJWmc">Discord</a>
          <a href="https://github.com/ymirapp">GitHub</a>
          <a href="https://twitter.com/ymirapp">Twitter</a>
          <a href="https://www.youtube.com/channel/UCc9GZVFs-KpnfUQ3MZJU0pQ">YouTube</a>
        </nav>
      </div>
    </footer>
  );
}
