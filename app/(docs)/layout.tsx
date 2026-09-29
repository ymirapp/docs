import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SidebarProvider, SidebarTrigger, useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { baseOptions } from '@/lib/layout.shared';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { GroupedSidebar } from '@/components/sidebar';

export default function Layout({ children }: LayoutProps<'/'>) {
  const options = baseOptions();

  return (
    <>
      <SiteHeader />
      {/* Collapsing would leave the desktop sidebar without a visible way to reopen it. */}
      <DocsLayout
        tree={source.getPageTree()}
        sidebar={{ collapsible: false }}
        {...options}
        slots={{
          ...options.slots,
          sidebar: { provider: SidebarProvider, root: GroupedSidebar, trigger: SidebarTrigger, useSidebar },
        }}
      >
        {children}
      </DocsLayout>
      <SiteFooter />
    </>
  );
}
