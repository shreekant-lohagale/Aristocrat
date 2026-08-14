import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://house-of-aristocrat.vercel.app/sitemap.xml' }; }

