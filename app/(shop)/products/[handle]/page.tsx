import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/common/BackButton';
import { ProductDetails } from '@/components/product/ProductDetails';
import { Navbar } from '@/components/layout/Navbar';
import { getCollectionProducts, getProduct } from '@/lib/catalog/products';
import { normalizeCollectionHandle } from '@/lib/catalog/collections';
import { productImageSrc } from '@/lib/catalog/image';
import { absoluteSiteUrl, brandedOpenGraph, serializeJsonLd, siteDescription } from '@/lib/seo/site';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Product not found', robots: { index: false, follow: false } };
  const description = product.description?.trim() || siteDescription;
  const canonical = `/products/${product.handle}`;
  const image = product.image ? productImageSrc(product.image) : '/opengraph-image';
  return { title: product.title, description, alternates: { canonical }, robots: { index: product.source === 'shopify', follow: true }, openGraph: { ...brandedOpenGraph(canonical), title: `${product.title} | House of Aristocrat`, description, images: [{ url: image, alt: product.title }] }, twitter: { card: 'summary_large_image', title: `${product.title} | House of Aristocrat`, description, images: [image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const collectionHandle = product.collectionHandles.find((entry) => !['new-arrivals', 'best-sellers', 'sale'].includes(entry)) ?? normalizeCollectionHandle(product.category);
  const collectionHref = `/collections/${collectionHandle}`;
  const related = (await getCollectionProducts(collectionHandle)).filter((item) => item.id !== product.id).slice(0, 4);
  const currency = product.currencyCode;
  const hasOffer = product.source === 'shopify' && currency && Number.isFinite(product.price) && product.price > 0;
  const productJsonLd = product.source === 'shopify' ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    url: absoluteSiteUrl(`/products/${product.handle}`),
    ...(product.description?.trim() ? { description: product.description.trim() } : {}),
    ...(product.images.length ? { image: product.images.map((image) => image.startsWith('http') ? image : absoluteSiteUrl(productImageSrc(image))) } : {}),
    ...(hasOffer ? { offers: { '@type': 'Offer', url: absoluteSiteUrl(`/products/${product.handle}`), price: product.price, priceCurrency: currency, availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } } : {}),
  } : null;
  return <><Navbar solid /><main className="product-page"><div className="product-page__utility"><BackButton href={collectionHref} label={`Back to ${product.category}`} /><nav className="product-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={collectionHref}>{product.category}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.title}</span></nav></div><ProductDetails product={product} related={related} /></main>{productJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }} />}</>;
}
