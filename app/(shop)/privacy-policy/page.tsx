import type { Metadata } from 'next';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Privacy information for the House of Aristocrat storefront.' };

export default function PrivacyPolicyPage() {
  return <InformationPage eyebrow="Legal" title="Privacy policy" intro="This notice explains the information used to operate the House of Aristocrat storefront.">
    <section><h2>Information we use</h2><p>Information you provide at checkout or through your customer account may include contact, delivery and order details. Shopify processes commerce and customer-account information used to fulfil purchases and provide secure account access.</p></section>
    <section><h2>Storefront preferences</h2><p>This site may store necessary cart, country and anonymous wishlist preferences on your device. When you sign in, eligible wishlist information can be associated with your Shopify customer profile so it is available across devices.</p></section>
    <section><h2>How information is used</h2><p>Information is used to operate the storefront, process orders, provide customer support, prevent misuse and improve reliability. We do not claim newsletter consent when a subscription service is unavailable.</p></section>
    <section><h2>Your choices</h2><p>You can clear device storage through your browser and manage supported customer information through your secure Shopify account. Privacy requests require a verified customer-care channel before they can be accepted through this website.</p></section>
  </InformationPage>;
}
