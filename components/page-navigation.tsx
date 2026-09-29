import Link from 'fumadocs-core/link';
import { findNeighbour, type Item } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';

/**
 * One pager card: the direction, then the page's sidebar name and description from the page tree.
 */
function PageLink({ item, rel, label }: { item: Item; rel: 'prev' | 'next'; label: string }) {
  return (
    <Link href={item.url} rel={rel}>
      <span>{label}</span>
      <span className="page-navigation-title">{item.name}</span>
      {item.description && <span>{item.description}</span>}
    </Link>
  );
}

/**
 * Previous and next page cards from the redesign, styled in app/global.css. Neighbours come from
 * the page tree in the same order as the native Fumadocs footer, which can't render custom cards.
 */
export function PageNavigation({ url }: { url: string }) {
  const { previous, next } = findNeighbour(source.getPageTree(), url);

  return (
    <nav aria-label="Previous and next documentation pages" className="page-navigation">
      {previous && <PageLink item={previous} rel="prev" label="Previous" />}
      {next && <PageLink item={next} rel="next" label="Next" />}
    </nav>
  );
}
