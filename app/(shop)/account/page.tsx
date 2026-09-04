import Link from 'next/link';
import { ArrowUpRight, Headphones, MapPin, Package } from 'lucide-react';
import { AccountHeader } from '@/components/account/AccountHeader';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountSummaryCards } from '@/components/account/AccountSummaryCards';
import { WishlistPreview } from '@/components/account/WishlistPreview';
import { getHostedCustomerAccountUrl } from '@/lib/shopify/customer-account-url';

export default function AccountPage() {
  const hostedAccountUrl = getHostedCustomerAccountUrl();
  const secureAccountHref = hostedAccountUrl || '/account/login';

  return <AccountShell>
    <AccountHeader title="Your House">Your wardrobe, saved pieces and secure Shopify account access, gathered in one considered place.</AccountHeader>

    <section className="account-welcome-card" id="account-overview">
      <div><p className="eyebrow">Private client access</p><h2>Welcome to House of Aristocrat</h2><p>Sign in through Shopify to view your identity, order history, addresses and account settings securely.</p></div>
      <a className="account-primary-link" href={secureAccountHref}>Sign in <ArrowUpRight size={16} aria-hidden="true" /></a>
    </section>

    {!hostedAccountUrl && <p className="account-service-note" role="status">Secure customer account access is temporarily unavailable. Your storefront wishlist remains available below.</p>}

    <AccountSummaryCards accountHref={secureAccountHref} />

    <section className="account-content-section" id="account-orders">
      <div className="account-content-section__heading"><div><p className="eyebrow">Your purchases</p><h2>Recent orders</h2></div></div>
      <article className="account-secure-card"><Package size={24} aria-hidden="true" /><div><h3>Order history, secured by Shopify</h3><p>View current and previous orders, fulfillment details and secure account actions through your Shopify customer account.</p></div><a href={secureAccountHref}>View orders <ArrowUpRight size={15} aria-hidden="true" /></a></article>
    </section>

    <section className="account-content-section" id="account-wishlist">
      <div className="account-content-section__heading"><div><p className="eyebrow">Saved for later</p><h2>Your wishlist</h2></div><Link className="account-text-link" href="/account/wishlist">View all</Link></div>
      <WishlistPreview />
    </section>

    <section className="account-management-grid">
      <article><MapPin size={21} aria-hidden="true" /><p className="eyebrow">Personal details</p><h2>Profile &amp; addresses</h2><p>Shopify securely manages your name, contact details and saved delivery addresses.</p><a href={secureAccountHref}>Manage account <ArrowUpRight size={15} aria-hidden="true" /></a></article>
      <article id="account-support"><Headphones size={21} aria-hidden="true" /><p className="eyebrow">Client care</p><h2>Need help with an order?</h2><p>Open your secure account to review order details and access the customer support options available for your purchase.</p><a href={secureAccountHref}>Open secure account <ArrowUpRight size={15} aria-hidden="true" /></a></article>
    </section>
  </AccountShell>;
}
