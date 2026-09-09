import type { Metadata } from 'next';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Terms', description: 'Terms for using the House of Aristocrat storefront.' };

export default function TermsPage() {
  return <InformationPage eyebrow="Legal" title="Terms of use" intro="These terms apply when browsing this storefront or placing an order through its Shopify checkout.">
    <section><h2>Store use</h2><p>Use this website lawfully and do not interfere with its operation, security or other customers. Product imagery, copy and House of Aristocrat branding may not be reused without permission.</p></section>
    <section><h2>Products and orders</h2><p>Availability, variant options, market pricing, taxes, delivery services and final totals are confirmed through Shopify. An order is subject to successful payment and acceptance. Obvious pricing or availability errors may be corrected before fulfilment.</p></section>
    <section><h2>Account security</h2><p>You are responsible for protecting access to your customer account and for ensuring checkout and delivery information is accurate.</p></section>
    <section><h2>Policies</h2><p>Shipping, return and privacy guidance forms part of these terms. Mandatory consumer rights that apply in your location are not excluded by this page.</p></section>
  </InformationPage>;
}
