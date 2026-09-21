/** Current public Vercel origin. Replace this one value when the final domain is approved. */
export const siteOrigin = 'https://house-of-aristocrat.vercel.app';
export const siteDescription = 'Discover House of Aristocrat — elevated Indo-Western fashion, modern silhouettes and timeless Indian elegance designed for the contemporary woman.';

export const brandedOgImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'House of Aristocrat: Everyday Elegance',
};

export function brandedOpenGraph(url: string) {
  return { type: 'website' as const, siteName: 'House of Aristocrat', url, images: [brandedOgImage] };
}

export function absoluteSiteUrl(path = '/') {
  return new URL(path, siteOrigin).toString();
}

/** Keep JSON-LD data inert inside an HTML script element. */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
