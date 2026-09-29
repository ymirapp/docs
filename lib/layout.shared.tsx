import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { EmptyNavTitle } from '@/components/empty-nav-title';

/**
 * Navigation shared by the docs layout.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    // The site header already shows the logo. Without this slot, Fumadocs renders an empty title
    // link in the sidebar and the mobile subnav.
    slots: { navTitle: EmptyNavTitle },
    // Sidebar quick link to the overview, which the sidebar groups leave out.
    links: [{ text: 'Overview', url: '/', on: 'menu' }],
    themeSwitch: { enabled: false },
  };
}
