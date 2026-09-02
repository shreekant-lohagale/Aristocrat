import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/common/BackButton';
import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { CollectionHeader } from '@/components/collection/CollectionHeader';
import { getCollectionByHandle, normalizeCollectionHandle } from '@/lib/catalog/collections';
import { getCollectionDetails } from '@/lib/catalog/products';

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
  const normalizedHandle = normalizeCollectionHandle(handle);
  const collection = getCollectionByHandle(normalizedHandle);
  const shopifyCollection = await getCollectionDetails(normalizedHandle);
  if (!collection && !shopifyCollection) return { title: 'Collection not found' };
  const description = shopifyCollection?.description || descriptions[normalizedHandle] || 'Explore elevated Indo-Western fashion from House of Aristocrat.';
  const canonical = `/collections/${normalizedHandle}`;
  const title = shopifyCollection?.title || collection?.name || normalizedHandle;
  return { title, description, alternates: { canonical }, openGraph: { url: canonical, title: `${title} | House of Aristocrat`, description } };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const normalizedHandle = normalizeCollectionHandle(handle);
  const collection = getCollectionByHandle(normalizedHandle);
  const shopifyCollection = await getCollectionDetails(normalizedHandle);
  if (!collection && !shopifyCollection) notFound();
  const title = shopifyCollection?.title || collection?.name || normalizedHandle;
  const description = shopifyCollection?.description || descriptions[normalizedHandle] || 'Explore elevated Indo-Western fashion from House of Aristocrat.';
  return <main className="collection-page"><div className="collection-page__inner"><BackButton href="/collections" label="Back to Collections" /><CollectionHeader title={title} description={description} activeHandle={normalizedHandle} /><CatalogGrid collection={normalizedHandle} /></div></main>;
}
