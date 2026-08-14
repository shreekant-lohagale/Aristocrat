import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const siteUrl = 'https://house-of-aristocrat.vercel.app';
const siteTitle = 'House of Aristocrat | Modern Indo-Western Fashion';
const siteDescription = 'Discover House of Aristocrat — elevated Indo-Western fashion, modern silhouettes and timeless Indian elegance designed for the contemporary woman.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: '%s | House of Aristocrat' },
  description: siteDescription,
  keywords: ['Indo-Western fashion', 'Indian fashion', "women's fashion", 'Kurtis', 'Dresses', 'Chaniya Choli', 'Indian designer fashion', 'House of Aristocrat'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: 'House of Aristocrat',
    title: siteTitle,
    description: 'Elevated Indo-Western fashion, modern silhouettes and timeless Indian elegance for the contemporary woman.',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'House of Aristocrat — Modern Indo-Western Fashion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: 'Elevated Indo-Western fashion, modern silhouettes and timeless Indian elegance.',
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><SmoothScrollProvider><StoreProvider>{children}</StoreProvider></SmoothScrollProvider></body></html>;
}
