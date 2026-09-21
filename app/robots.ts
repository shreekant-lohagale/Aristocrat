import type { MetadataRoute } from 'next';
import { absoluteSiteUrl } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/api/catalog', '/api/newsletter', '/api/shopify', '/cart', '/checkout', '/search', '/wishlist', '/track-order'],
    },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
  };
}
