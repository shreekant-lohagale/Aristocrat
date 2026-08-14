import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/common/BackButton';
import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { getCollectionByHandle } from '@/lib/catalog/collections';

const descriptions: Record<string, string> = {
  'new-arrivals': 'The latest House of Aristocrat pieces, made for an elevated everyday wardrobe.',
  kurtis: 'Modern kurtis with considered details and effortless elegance.',
  dresses: 'Sophisticated dresses for daytime plans and evening occasions.',
  'indo-western': 'Contemporary silhouettes informed by timeless Indian elegance.',
  'chaniya-choli': 'Celebration-ready Chaniya Choli silhouettes with refined, modern detail.',
  jewellery: 'Considered jewellery and finishing touches for a complete House of Aristocrat look.',
  'best-sellers': 'The House of Aristocrat pieces our clients return to again and again.',
  sale: 'A final opportunity to bring home elevated everyday fashion.',
};

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollectionByHandle(handle);
  if (!collection) return { title: 'Collection not found' };
  const description = descriptions[collection.handle] ?? 'Explore elevated Indo-Western fashion from House of Aristocrat.';
  const canonical = `/collections/${collection.handle}`;
  return { title: collection.name, description, alternates: { canonical }, openGraph: { url: canonical, title: `${collection.name} | House of Aristocrat`, description } };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = getCollectionByHandle(handle);
  if (!collection) notFound();
  const description = descriptions[collection.handle] ?? 'Explore elevated Indo-Western fashion from House of Aristocrat.';
  return <main className="collection-page shell"><BackButton href="/collections" label="Back to Collections" /><section className="collection-hero"><p className="eyebrow">House of Aristocrat</p><h1>{collection.name}</h1><p className="lede">{description}</p></section><CatalogGrid collection={collection.handle} /></main>;
}
