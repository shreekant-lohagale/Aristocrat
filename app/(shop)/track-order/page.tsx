import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Track Order', description: 'Find secure order status and carrier tracking through Shopify.', alternates: { canonical: '/track-order' } };

export default function TrackOrderPage() {
  return <InformationPage eyebrow="Your order" title="Track your order" intro="Order status is managed through Shopify and the carrier, when tracking is available.">
    <section><h2>Signed-in customers</h2><p>Open your secure Shopify customer account to review orders and any available fulfilment or tracking details.</p><Link className="information-page__cta" href="/account/orders">View order history</Link></section>
    <section><h2>Guest checkout</h2><p>If you received a dispatch message with a carrier tracking link, use that link for the latest delivery status.</p><Link href="/contact">Contact guidance</Link></section>
  </InformationPage>;
}
