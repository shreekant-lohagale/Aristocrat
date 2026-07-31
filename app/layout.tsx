import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';

export const metadata: Metadata = {
  title: { default: 'MAHERA | Modern Indian Occasionwear', template: '%s | MAHERA' },
  description: 'Contemporary Indian occasionwear designed for moments worth remembering.',
  metadataBase: new URL('https://mahera.example'),
  openGraph: { type: 'website', title: 'MAHERA', description: 'Modern Indian occasionwear.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions (Grammarly/form fillers) can inject attributes before React hydrates.
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><StoreProvider>{children}</StoreProvider></body></html>;
}
