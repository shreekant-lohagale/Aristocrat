import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BackButton } from '@/components/common/BackButton';

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect('/account/login');
  return <main className="page shell account-page"><BackButton /><p className="eyebrow search-kicker">Your account</p><h1>Addresses</h1><section className="account-panel"><p>Saved delivery addresses will be available once Shopify customer accounts are connected.</p></section></main>;
}
