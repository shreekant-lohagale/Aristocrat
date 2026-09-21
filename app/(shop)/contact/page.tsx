import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';
import { PublishedPolicy } from '@/components/common/PublishedPolicy';
import { getPublishedShopInformation } from '@/lib/shopify/shop-information';
import { brandedOpenGraph } from '@/lib/seo/site';

export const metadata: Metadata = { title: 'Contact', description: 'Customer care and order support for House of Aristocrat.', alternates: { canonical: '/contact' }, openGraph: brandedOpenGraph('/contact') };
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const information = await getPublishedShopInformation();
  return <InformationPage eyebrow="Client care" title="How can we help?" intro="Choose the right route for an order, a return or a general question.">
    <section><h2>Orders</h2><p>Review an existing purchase through your secure Shopify customer account.</p><Link href="/account/orders">View your orders</Link></section>
    <section><h2>Returns &amp; exchanges</h2><p>Read the published policy before making a request.</p><Link href="/shipping-returns">Shipping &amp; returns</Link></section>
    <section><h2>General support</h2><p>For other questions, use the published contact details below when available.</p><div className="information-page__links"><Link href="/size-guide">Size guide</Link><Link href="/track-order">Track order</Link></div></section>
    <PublishedPolicy policy={information?.contactInformation} id="published-contact-details" unavailable="Customer-care contact details are awaiting confirmation for this storefront. No contact form or unverified address is available here yet." />
  </InformationPage>;
}
