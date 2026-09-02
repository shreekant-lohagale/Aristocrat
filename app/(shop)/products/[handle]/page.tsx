import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/common/BackButton';
import { ProductDetails } from '@/components/product/ProductDetails';
import { Navbar } from '@/components/layout/Navbar';
import { getCollectionProducts, getProduct } from '@/lib/catalog/products';
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
  const collectionHandle = product.collectionHandles.find((entry) => !['new-arrivals', 'best-sellers', 'sale'].includes(entry)) ?? normalizeCollectionHandle(product.category);
  const collectionHref = `/collections/${collectionHandle}`;
  const related = (await getCollectionProducts(collectionHandle)).filter((item) => item.id !== product.id).slice(0, 4);
  return <><Navbar solid /><main className="product-page"><div className="product-page__utility"><BackButton href={collectionHref} label={`Back to ${product.category}`} /><nav className="product-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={collectionHref}>{product.category}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.title}</span></nav></div><ProductDetails product={product} related={related} /></main></>;
}
