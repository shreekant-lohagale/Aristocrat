import type { MetadataRoute } from 'next';
import { collectionDefinitions } from '@/lib/catalog/collections';
import { getCatalog } from '@/lib/catalog/products';
import { getPublishedShopInformation } from '@/lib/shopify/shop-information';
import { absoluteSiteUrl } from '@/lib/seo/site';

const staticPaths = ['/', '/store', '/collections', '/about', '/contact'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: absoluteSiteUrl(path) }));
  const policies = await getPublishedShopInformation();
  if (policies?.shippingPolicy?.body && policies.refundPolicy?.body) entries.push({ url: absoluteSiteUrl('/shipping-returns') });
  if (policies?.privacyPolicy?.body) entries.push({ url: absoluteSiteUrl('/privacy-policy') });
  if (policies?.termsOfService?.body || policies?.termsOfSale?.body) entries.push({ url: absoluteSiteUrl('/terms') });

  try {
    const products = (await getCatalog()).filter((product) => product.source === 'shopify');
    const handles = new Set(products.flatMap((product) => product.collectionHandles));
    if (products.length) handles.add('new-arrivals');
    for (const collection of collectionDefinitions) {
      if (handles.has(collection.handle)) entries.push({ url: absoluteSiteUrl(`/collections/${collection.handle}`) });
    }
    for (const product of products) {
      const published = product.publishedAt ? new Date(product.publishedAt) : null;
      entries.push({
        url: absoluteSiteUrl(`/products/${product.handle}`),
        ...(published && !Number.isNaN(published.getTime()) ? { lastModified: published } : {}),
      });
    }
  } catch {
    // Keep stable public routes available while Shopify is unavailable.
  }
  return entries;
}
