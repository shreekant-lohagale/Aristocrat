import type { Metadata } from 'next';
import { BackButton } from '@/components/common/BackButton';
import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore modern Indo-Western fashion, elevated kurtis, dresses and considered occasionwear from House of Aristocrat.',
  alternates: { canonical: '/collections' },
  openGraph: { url: '/collections', title: 'Collections | House of Aristocrat' },
};

export default function CollectionsPage() { return <><Navbar /><main className="collection-page shell"><BackButton href="/" label="Back to Home" /><section className="collection-hero"><p className="eyebrow">The House edit</p><h1>Collections</h1><p className="lede">Contemporary occasionwear, designed for the moments that become memories.</p></section><CatalogGrid /></main><Footer /></>; }
