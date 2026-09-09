import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Shipping & Returns', description: 'House of Aristocrat shipping and returns guidance.' };

export default function ShippingReturnsPage() {
  return <InformationPage eyebrow="Client care" title="Shipping & returns" intro="Clear guidance for delivery, order changes and return eligibility.">
    <section><h2>Shipping</h2><p>Available shipping methods, charges, taxes and estimated delivery dates are calculated for your destination and shown before payment. Dispatch and tracking updates are sent using the details supplied at checkout.</p></section>
    <section><h2>Returns and exchanges</h2><p>Eligibility can depend on the item, its condition, customisation and the destination from which it is returned. Keep all tags and packaging intact and review the terms supplied with your order before wearing or altering a piece.</p></section>
    <section><h2>Need order-specific guidance?</h2><p>Use your secure order history so the correct purchase can be identified.</p><Link href="/account/orders">Open order history</Link></section>
  </InformationPage>;
}
