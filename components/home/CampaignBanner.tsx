import Image from 'next/image';
import { DiscoverButton } from '@/components/ui/DiscoverButton';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function CampaignBanner() {
  return <section className="campaign-banner"><Image src={asset('House_of_Aristocrat_Hero_Product_1920x1080.png')} alt="House of Aristocrat Indo-Western campaign look" fill sizes="100vw" /><div><p className="eyebrow">The Aristocrat edit</p><h2>Modern<br /><i>Heritage</i></h2><p>Tradition reimagined for the woman writing her own story.</p><DiscoverButton href="/collections/indo-western">Discover the Edit</DiscoverButton></div></section>;
}