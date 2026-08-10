'use client';

import { Heart, MapPin, PackageCheck, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreProvider';
import { AccountSummaryCard } from './AccountSummaryCard';

export function AccountSummaryCards() {
  const { wishlist } = useStore();
  return <section className="account-summary-grid"><AccountSummaryCard icon={PackageCheck} label="Orders" value={0} detail="Shopify integration pending" /><AccountSummaryCard icon={Heart} label="Wishlist" value={wishlist.length} detail="Pieces saved for later" /><AccountSummaryCard icon={MapPin} label="Addresses" value="Local" detail="Saved on this device" /><AccountSummaryCard icon={Sparkles} label="Member" value="Active" detail="House of Aristocrat" /></section>;
}
