import Link from 'next/link';
import { Package } from 'lucide-react';
import { requireAccountUser } from '@/lib/auth/account';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountHeader } from '@/components/account/AccountHeader';
import { AccountSummaryCards } from '@/components/account/AccountSummaryCards';
import { AccountEmptyState } from '@/components/account/EmptyState';
import { WishlistPreview } from '@/components/account/WishlistPreview';

export default async function AccountPage() {
  const user = await requireAccountUser();
  const firstName = user.name?.trim().split(/\s+/)[0] || 'there';
  return <AccountShell user={user}><AccountHeader title={`Welcome back, ${firstName}`}>Manage your orders, wishlist and account details.</AccountHeader><AccountSummaryCards /><section className="account-content-section"><div className="account-content-section__heading"><div><p className="eyebrow">Order history</p><h2>Recent Orders</h2></div></div><AccountEmptyState icon={Package} title="No orders yet" description="Your future purchases will appear here." ctaHref="/collections/new-arrivals" ctaLabel="Shop new arrivals" /></section><section className="account-content-section"><div className="account-content-section__heading"><div><p className="eyebrow">Your saved edit</p><h2>Wishlist</h2></div><Link className="account-text-link" href="/account/wishlist">View all wishlist</Link></div><WishlistPreview /></section></AccountShell>;
}
