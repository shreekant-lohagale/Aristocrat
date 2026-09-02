import Link from 'next/link';
import { collectionDefinitions } from '@/lib/catalog/collections';

const navigationHandles = new Set([
  'new-arrivals',
  'kurtis',
  'dresses',
  'indo-western',
  'chaniya-choli',
  'jewellery',
]);

type CollectionHeaderProps = {
  title: string;
  description?: string;
  activeHandle?: string;
};

export function CollectionHeader({ title, description, activeHandle }: CollectionHeaderProps) {
  const navigation = collectionDefinitions.filter((collection) => navigationHandles.has(collection.handle));

  return (
    <header className="collection-editorial-header">
      <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/collections">Collections</Link>
        {activeHandle && <><span aria-hidden="true">/</span><span aria-current="page">{title}</span></>}
      </nav>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <nav className="collection-category-nav" aria-label="Shop collections">
        {navigation.map((collection) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            aria-current={activeHandle === collection.handle ? 'page' : undefined}
          >
            {collection.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
