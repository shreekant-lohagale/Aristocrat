import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export const metadata: Metadata = {
  title: { default: 'HOUSE OF ARISTOCRAT | Modern Indian Occasionwear', template: '%s | HOUSE OF ARISTOCRAT' },
  description: 'Contemporary Indian occasionwear designed for moments worth remembering.',
  metadataBase: new URL('https://houseofaristocrat.example'),
  openGraph: { type: 'website', title: 'HOUSE OF ARISTOCRAT', description: 'Modern Indian occasionwear.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions (Grammarly/form fillers) can inject attributes before React hydrates.
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><SmoothScrollProvider><StoreProvider>{children}</StoreProvider></SmoothScrollProvider></body></html>;
}
