import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BackButton } from '@/components/common/BackButton';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/account/login');
  const user = session.user;

  return <main className="page shell account-page"><BackButton /><section className="account-overview"><div className="account-avatar">{user.image ? <img src={user.image} alt="" /> : <span>{user.name?.slice(0, 1) || 'A'}</span>}</div><div><p className="eyebrow search-kicker">House of Aristocrat</p><h1>Welcome, {user.name || 'Guest'}</h1><p className="lede">{user.email}</p></div></section><nav className="account-navigation" aria-label="Account navigation"><Link href="/account">Overview</Link><Link href="/account/orders">Orders</Link><Link href="/wishlist">Wishlist</Link><Link href="/account/addresses">Addresses</Link></nav><section className="account-panel"><p className="eyebrow">Your account</p><h2>Your private edit, in one place.</h2><p>Orders, delivery addresses, and a future Shopify customer profile will appear here as your account evolves.</p><SignOutButton /></section></main>;
}
