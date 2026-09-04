import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Headphones, MapPin, Package } from 'lucide-react';
import { AccountHeader } from '@/components/account/AccountHeader';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountSummaryCards } from '@/components/account/AccountSummaryCards';
import { WishlistPreview } from '@/components/account/WishlistPreview';
import {
  customerCookieNames,
  getCustomerAccountState,
  hasCustomerAccountApiConfig,
} from '@/lib/shopify/customer-account';
import { getHostedCustomerAccountUrl } from '@/lib/shopify/customer-account-url';

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ auth?: string }> }) {
  const params = await searchParams;
  const accountState = await getCustomerAccountState();
  const apiConfigured = hasCustomerAccountApiConfig();
  const cookieStore = await cookies();

  if (accountState.status === 'unauthenticated' && apiConfigured && !cookieStore.has(customerCookieNames.checked)) {
    redirect('/account/auth/login?prompt=none');
  }

  const customer = accountState.status === 'authenticated' ? accountState.customer : null;
  const authenticated = Boolean(customer);
  const authError = accountState.status === 'error' || params.auth === 'error';
  const hostedAccountUrl = getHostedCustomerAccountUrl();
  const secureAccountHref = hostedAccountUrl || '/account/login';
  const signInHref = apiConfigured ? '/account/auth/login' : secureAccountHref;
  const user = customer ? { name: customer.displayName, email: customer.email } : undefined;
  const welcomeName = customer?.firstName?.trim();

  return <AccountShell user={user} authenticated={authenticated} error={authError} accountHref={secureAccountHref}>
    <AccountHeader title={authenticated ? `Welcome back${welcomeName ? `, ${welcomeName}` : ''}` : 'Your House'}>Your wardrobe, saved pieces and secure Shopify account access, gathered in one considered place.</AccountHeader>

    <section className="account-welcome-card" id="account-overview">
      {customer ? <>
        <div><p className="eyebrow">Client overview</p><h2>{welcomeName ? `Welcome, ${welcomeName}` : 'Welcome back'}</h2><p>{customer.email || 'Your authenticated Shopify customer account is connected.'}</p></div>
        <a className="account-primary-link" href="/account/orders">View orders <ArrowUpRight size={16} aria-hidden="true" /></a>
      </> : authError ? <>
        <div><p className="eyebrow">Account unavailable</p><h2>We couldn’t load your account details right now.</h2><p>Your private information remains secure with Shopify. You can continue through the secure account portal.</p></div>
        <a className="account-primary-link" href={secureAccountHref}>Open secure account <ArrowUpRight size={16} aria-hidden="true" /></a>
      </> : <>
        <div><p className="eyebrow">Private client access</p><h2>Welcome to House of Aristocrat</h2><p>Sign in through Shopify to view your identity, order history, addresses and account settings securely.</p></div>
        <a className="account-primary-link" href={signInHref}>Sign in <ArrowUpRight size={16} aria-hidden="true" /></a>
      </>}
    </section>

    {accountState.status === 'unconfigured' && !hostedAccountUrl && <p className="account-service-note" role="status">Secure customer account access is temporarily unavailable. Your storefront wishlist remains available below.</p>}

    {customer && <AccountSummaryCards accountHref={secureAccountHref} />}

    {customer && <section className="account-content-section" id="account-orders">
      <div className="account-content-section__heading"><div><p className="eyebrow">Your purchases</p><h2>Recent orders</h2></div></div>
      <article className="account-secure-card"><Package size={24} aria-hidden="true" /><div><h3>{customer.hasOrders ? 'Your order history is ready' : 'No order history yet'}</h3><p>{customer.hasOrders ? 'View orders, fulfillment details and secure account actions through your Shopify customer account.' : 'When you place an order, its status and details will be available through your secure Shopify account.'}</p></div><a href="/account/orders">View orders <ArrowUpRight size={15} aria-hidden="true" /></a></article>
    </section>}

    <section className="account-content-section" id="account-wishlist">
      <div className="account-content-section__heading"><div><p className="eyebrow">Saved for later</p><h2>Your wishlist</h2></div><Link className="account-text-link" href="/account/wishlist">View all</Link></div>
      <WishlistPreview />
    </section>

    <section className={`account-management-grid ${authenticated ? '' : 'account-management-grid--single'}`}>
      {customer && <article><MapPin size={21} aria-hidden="true" /><p className="eyebrow">Personal details</p><h2>Profile &amp; addresses</h2><p>{customer.hasAddresses ? 'Your saved delivery addresses are securely managed by Shopify.' : 'Add or manage your profile and delivery addresses securely through Shopify.'}</p><dl className="account-customer-identity"><div><dt>Name</dt><dd>{customer.displayName}</dd></div>{customer.email && <div><dt>Email</dt><dd>{customer.email}</dd></div>}</dl><a href="/account/profile">Manage profile <ArrowUpRight size={15} aria-hidden="true" /></a></article>}
      <article id="account-support"><Headphones size={21} aria-hidden="true" /><p className="eyebrow">Client care</p><h2>Need help with an order?</h2><p>Open your secure account to review order details and access the customer support options available for your purchase.</p><a href={secureAccountHref}>Open secure account <ArrowUpRight size={15} aria-hidden="true" /></a></article>
    </section>
  </AccountShell>;
}
