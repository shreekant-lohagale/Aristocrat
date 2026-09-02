import type { Metadata } from 'next';
import { BackButton } from '@/components/common/BackButton';
import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { CollectionHeader } from '@/components/collection/CollectionHeader';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore modern Indo-Western fashion, elevated kurtis, dresses and considered occasionwear from House of Aristocrat.',
  alternates: { canonical: '/collections' },
  openGraph: { url: '/collections', title: 'Collections | House of Aristocrat' },
};

export default function CollectionsPage() { return <><main className="collection-page"><div className="collection-page__inner"><BackButton href="/" label="Back to Home" /><CollectionHeader title="Collections" description="Contemporary occasionwear, designed for the moments that become memories." /><CatalogGrid /></div></main><Footer /></>; }
