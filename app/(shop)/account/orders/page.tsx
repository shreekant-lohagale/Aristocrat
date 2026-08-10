import { Package } from 'lucide-react';
import { requireAccountUser } from '@/lib/auth/account';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountHeader } from '@/components/account/AccountHeader';
import { AccountEmptyState } from '@/components/account/EmptyState';

export default async function OrdersPage() {
  const user = await requireAccountUser();
  return <AccountShell user={user}><AccountHeader title="My Orders">Once you place an order, you’ll be able to track it here.</AccountHeader><AccountEmptyState icon={Package} title="No orders yet" description="Your future purchases will appear here once Shopify customer orders are connected." ctaHref="/collections/new-arrivals" ctaLabel="Continue shopping" /></AccountShell>;
}
