import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider';

export const metadata: Metadata = {
  title: { default: 'HOUSE OF ARISTOCRAT | Modern Indian Occasionwear', template: '%s | HOUSE OF ARISTOCRAT' },
  description: 'Contemporary Indian occasionwear designed for moments worth remembering.',
  metadataBase: new URL('https://houseofaristocrat.example'),
  openGraph: { type: 'website', title: 'HOUSE OF ARISTOCRAT', description: 'Modern Indian occasionwear.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><SmoothScrollProvider><AuthSessionProvider><StoreProvider>{children}</StoreProvider></AuthSessionProvider></SmoothScrollProvider></body></html>;
}
