import type { MetadataRoute } from 'next';
import { collectionDefinitions } from '@/lib/catalog/collections';
import { getCatalog } from '@/lib/catalog/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://house-of-aristocrat.vercel.app';
  const staticPages = ['', 'collections', 'search', 'wishlist', 'account'];
  const collectionPages = collectionDefinitions.map((collection) => `collections/${collection.handle}`);
  let productPages: string[] = [];
  try {
    productPages = (await getCatalog()).map((product) => `products/${product.handle}`);
  } catch {
    // Keep the static sitemap available during a temporary Shopify outage.
  }
  return [...staticPages, ...collectionPages, ...productPages].map((path) => ({ url: `${base}/${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 }));
}

