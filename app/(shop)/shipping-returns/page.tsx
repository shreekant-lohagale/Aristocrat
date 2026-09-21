import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';
import { PublishedPolicy } from '@/components/common/PublishedPolicy';
import { getPublishedShopInformation } from '@/lib/shopify/shop-information';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const information = await getPublishedShopInformation();
  return { title: 'Shipping & Returns', description: 'Published shipping, return and exchange policies for House of Aristocrat.', alternates: { canonical: '/shipping-returns' }, robots: { index: Boolean(information?.shippingPolicy?.body && information?.refundPolicy?.body), follow: true } };
}

export default async function ShippingReturnsPage() {
  const information = await getPublishedShopInformation();
  return <InformationPage eyebrow="Client care" title="Shipping & returns" intro="Refer to the House policies published through Shopify for current conditions.">
    <section><h2>Shipping destinations</h2><p>Available destinations and charges must be confirmed in the published shipping policy and at checkout. Canada, USA and India rates are awaiting confirmation here.</p></section>
    <section><h2>Processing</h2><p>See the published shipping policy below for any confirmed processing details.</p></section>
    <section><h2>Delivery</h2><p>See the published shipping policy and the delivery options shown at checkout for your address.</p></section>
    <section><h2>Returns</h2><p>See the published refund and return policy below before requesting a return.</p></section>
    <section><h2>Exchanges</h2><p>Exchange conditions, if offered, are governed by the published refund and return policy.</p></section>
    <section><h2>Damaged items</h2><p>Review the published policy for instructions. For an existing order, open your secure order history.</p><Link href="/account/orders">Open order history</Link></section>
    <PublishedPolicy policy={information?.shippingPolicy} id="published-shipping-policy" unavailable="The approved shipping policy is not available to this storefront yet. Shipping destinations, charges and delivery times require client confirmation." />
    <PublishedPolicy policy={information?.refundPolicy} id="published-return-policy" unavailable="The approved return, refund and exchange policy is not available to this storefront yet. Eligibility and timelines require client confirmation." />
  </InformationPage>;
}
