import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BackButton } from '@/components/common/BackButton';

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect('/account/login');
  return <main className="page shell account-page"><BackButton /><p className="eyebrow search-kicker">Your account</p><h1>Orders</h1><section className="account-panel"><p>Order history will appear here once your House of Aristocrat account is connected to Shopify customer records.</p><Link className="button" href="/collections/new-arrivals">Explore new arrivals</Link></section></main>;
}
