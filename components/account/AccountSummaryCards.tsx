'use client';

import { Heart, MapPin, PackageCheck } from 'lucide-react';
import { useStore } from '@/context/StoreProvider';
import { AccountSummaryCard } from './AccountSummaryCard';

export function AccountSummaryCards({ accountHref }: { accountHref: string }) {
  const { wishlist } = useStore();
  return <section className="account-summary-grid account-summary-grid--dashboard"><AccountSummaryCard icon={PackageCheck} label="Orders" value="View orders" detail="Secure Shopify order history" href={accountHref} /><AccountSummaryCard icon={Heart} label="Wishlist" value={wishlist.length ? `${wishlist.length} saved` : 'View wishlist'} detail="Pieces saved on this device" href="/account/wishlist" /><AccountSummaryCard icon={MapPin} label="Addresses" value="Manage" detail="Securely stored by Shopify" href={accountHref} /></section>;
}
