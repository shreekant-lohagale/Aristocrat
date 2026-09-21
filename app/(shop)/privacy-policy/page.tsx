import type { Metadata } from 'next';
import { InformationPage } from '@/components/common/InformationPage';
import { PublishedPolicy } from '@/components/common/PublishedPolicy';
import { getPublishedShopInformation } from '@/lib/shopify/shop-information';
import { brandedOpenGraph } from '@/lib/seo/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const policy = (await getPublishedShopInformation())?.privacyPolicy;
  return { title: 'Privacy Policy', description: 'The published House of Aristocrat privacy policy.', alternates: { canonical: '/privacy-policy' }, openGraph: brandedOpenGraph('/privacy-policy'), robots: { index: Boolean(policy?.body), follow: true } };
}

export default async function PrivacyPolicyPage() {
  const information = await getPublishedShopInformation();
  return <InformationPage eyebrow="Legal" title="Privacy policy" intro="The House privacy policy published through Shopify appears below when available.">
    <PublishedPolicy policy={information?.privacyPolicy} unavailable="The approved privacy policy is not available to this storefront yet. Client-approved policy text must be connected before publication." />
  </InformationPage>;
}
