import type { Metadata } from 'next';
import { InformationPage } from '@/components/common/InformationPage';
import { PublishedPolicy } from '@/components/common/PublishedPolicy';
import { getPublishedShopInformation } from '@/lib/shopify/shop-information';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const information = await getPublishedShopInformation();
  const policy = information?.termsOfService || information?.termsOfSale;
  return { title: 'Terms of Use', description: 'The published House of Aristocrat terms.', alternates: { canonical: '/terms' }, robots: { index: Boolean(policy?.body), follow: true } };
}

export default async function TermsPage() {
  const information = await getPublishedShopInformation();
  return <InformationPage eyebrow="Legal" title="Terms of use" intro="The House terms published through Shopify appear below when available.">
    <PublishedPolicy policy={information?.termsOfService || information?.termsOfSale} unavailable="The approved terms are not available to this storefront yet. Client-approved terms must be connected before publication." />
  </InformationPage>;
}
