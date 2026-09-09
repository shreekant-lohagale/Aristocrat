import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Contact', description: 'Customer care information for House of Aristocrat.' };

export default function ContactPage() {
  return <InformationPage eyebrow="Client care" title="How can we help?" intro="Find the fastest route to order, delivery and account assistance.">
    <section><h2>Order assistance</h2><p>For help connected to an existing purchase, open your secure Shopify customer account. Your order details remain protected and available in one place.</p><Link href="/account/orders">View your orders</Link></section>
    <section><h2>Before you order</h2><p>Review sizing and delivery information before checkout. Final delivery estimates and available services are confirmed for your address during checkout.</p><div className="information-page__links"><Link href="/size-guide">Size guide</Link><Link href="/shipping-returns">Shipping &amp; returns</Link></div></section>
    <aside className="information-page__notice">A public customer-care email or social support channel has not been configured for this storefront. We will not display an unmonitored contact address.</aside>
  </InformationPage>;
}
