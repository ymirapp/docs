'use client';

import { useMemo } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { TreeContextProvider, useTreeContext } from 'fumadocs-ui/contexts/tree';
import { Sidebar, type SidebarProps } from 'fumadocs-ui/layouts/docs/slots/sidebar';

/**
 * Sidebar label order: natural and case-insensitive, with a fixed locale so the server and browser
 * agree. Page names are their `navTitle` or `title` strings; a non-string name sorts first.
 */
function compareNames(a: PageTree.Node, b: PageTree.Node): number {
  const name = (node: PageTree.Node) => (typeof node.name === 'string' ? node.name : '');

  return name(a).localeCompare(name(b), 'en', { numeric: true, sensitivity: 'base' });
}

/**
 * Sidebar view of the page tree, below the Overview quick link (`baseOptions().links`): one
 * collapsible group per `content/docs/meta.json` separator with its pages in alphabetical order.
 */
function groupSidebarTree(tree: PageTree.Root): PageTree.Root {
  const top: PageTree.Node[] = [];
  const groups: PageTree.Folder[] = [];

  for (const node of tree.children) {
    // The Overview quick link replaces the index page.
    if (node.type === 'page' && node.url === '/') continue;

    if (node.type === 'separator') {
      groups.push({
        type: 'folder',
        name: node.name === 'Get started' ? 'Start here' : node.name,
        defaultOpen: false,
        children: [],
      });
    } else {
      (groups.at(-1)?.children ?? top).push(node);
    }
  }

  // The group children arrays are built here, so sorting them leaves the canonical tree as is.
  for (const group of groups) group.children.sort(compareNames);

  return {
    ...tree,
    $id: `${tree.$id ?? 'root'}:sidebar`,
    children: [...top, ...groups.filter((group) => group.children.length > 0)],
  };
}

/**
 * Default Fumadocs sidebar (desktop and mobile drawer) rendering the grouped tree. The tree context
 * is only replaced inside the sidebar, so breadcrumbs, previous/next links, search and the Markdown
 * exports keep using the canonical tree.
 */
export function GroupedSidebar(props: SidebarProps) {
  const { full } = useTreeContext();
  const tree = useMemo(() => groupSidebarTree(full), [full]);

  return (
    <TreeContextProvider tree={tree}>
      <Sidebar {...props} />
    </TreeContextProvider>
  );
}
