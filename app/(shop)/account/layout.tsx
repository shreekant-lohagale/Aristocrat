import type { Metadata } from 'next';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar solid />{children}<Footer /></>;
}
