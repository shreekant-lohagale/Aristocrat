import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/common/BackButton';
import { ProductDetails } from '@/components/product/ProductDetails';
import { getCatalog, getProduct } from '@/lib/catalog/products';
import { normalizeCollectionHandle } from '@/lib/catalog/collections';
import { productImageSrc } from '@/lib/catalog/image';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Product not found' };
  const description = product.description || `Discover ${product.title} from House of Aristocrat.`;
  const canonical = `/products/${product.handle}`;
  const image = productImageSrc(product.image);
  return { title: product.title, description, alternates: { canonical }, openGraph: { url: canonical, title: `${product.title} | House of Aristocrat`, description, images: [{ url: image, alt: product.title }] }, twitter: { card: 'summary_large_image', title: `${product.title} | House of Aristocrat`, description, images: [image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const related = (await getCatalog()).filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const collectionHref = `/collections/${normalizeCollectionHandle(product.category)}`;
  return <main className="product-page shell"><BackButton href={collectionHref} label={`Back to ${product.category}`} /><ProductDetails product={product} related={related} /></main>;
}
