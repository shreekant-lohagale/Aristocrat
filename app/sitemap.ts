import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mahera.example';
  return ['', 'collections', 'about', 'contact', 'faq', 'size-guide', 'shipping', 'returns'].map((path) => ({ url: `${base}/${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 }));
}
