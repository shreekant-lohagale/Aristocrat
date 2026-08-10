import type { MetadataRoute } from 'next';
import { collectionDefinitions } from '@/lib/catalog/collections';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://houseofaristocrat.example';
  const staticPages = ['', 'collections', 'search', 'wishlist', 'account'];
  const collectionPages = collectionDefinitions.map((collection) => `collections/${collection.handle}`);
  return [...staticPages, ...collectionPages].map((path) => ({ url: `${base}/${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 }));
}
