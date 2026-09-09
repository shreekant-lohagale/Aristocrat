import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Track Order', description: 'Track a House of Aristocrat order securely.' };

export default function TrackOrderPage() {
  return <InformationPage eyebrow="Your order" title="Track your order" intro="Tracking becomes available after your order has been dispatched.">
    <section><h2>Signed-in customers</h2><p>Open your Shopify customer account to see current order information and any tracking details supplied by the carrier.</p><Link className="information-page__cta" href="/account/orders">View order history</Link></section>
    <section><h2>Guest checkout</h2><p>Use the dispatch email sent to the address entered at checkout. The carrier link in that message contains the most current delivery status.</p></section>
  </InformationPage>;
}
