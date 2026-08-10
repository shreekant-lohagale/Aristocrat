import { notFound } from 'next/navigation';
import { BackButton } from '@/components/common/BackButton';
import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { getCollectionByHandle } from '@/lib/catalog/collections';

const descriptions: Record<string, string> = {
  'new-arrivals': 'The latest House of Aristocrat pieces, made for an elevated everyday wardrobe.',
  kurtis: 'Modern kurtis with considered details and effortless elegance.',
  dresses: 'Sophisticated dresses for daytime plans and evening occasions.',
  'indo-western': 'Contemporary silhouettes informed by timeless Indian elegance.',
  'best-sellers': 'The House of Aristocrat pieces our clients return to again and again.',
  sale: 'A final opportunity to bring home elevated everyday fashion.',
};

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = getCollectionByHandle(handle);
  if (!collection) notFound();

  return <main className="collection-page shell"><BackButton /><section className="collection-hero"><p className="eyebrow">House of Aristocrat</p><h1>{collection.name}</h1><p className="lede">{descriptions[collection.handle]}</p></section><CatalogGrid collection={collection.handle} /></main>;
}
