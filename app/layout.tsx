import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { absoluteSiteUrl, brandedOgImage, serializeJsonLd, siteDescription, siteOrigin } from '@/lib/seo/site';

const siteTitle = 'House of Aristocrat | Modern Indo-Western Fashion';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: siteTitle, template: '%s | House of Aristocrat' },
  description: siteDescription,
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  keywords: ['Indo-Western fashion', 'Indian fashion', "women's fashion", 'Kurtis', 'Dresses', 'Chaniya Choli', 'Indian designer fashion', 'House of Aristocrat'],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'House of Aristocrat',
    title: siteTitle,
    description: 'Elevated Indo-Western fashion, modern silhouettes and timeless Indian elegance for the contemporary woman.',
    images: [brandedOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: 'Elevated Indo-Western fashion, modern silhouettes and timeless Indian elegance.',
    images: ['/twitter-image'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'House of Aristocrat', url: absoluteSiteUrl('/') };
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'House of Aristocrat', url: absoluteSiteUrl('/') };
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([organization, website]) }} /><SmoothScrollProvider><StoreProvider>{children}</StoreProvider></SmoothScrollProvider></body></html>;
}
