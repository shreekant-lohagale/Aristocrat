import type { Metadata } from 'next';
import { CinematicCollections, CinematicIntro } from '@/components/home/CinematicCollections';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { EditorialCategories } from '@/components/home/EditorialCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { HomepageAccountCta } from '@/components/home/HomepageAccountCta';
import { MaisonStory } from '@/components/home/MaisonStory';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { brandedOpenGraph } from '@/lib/seo/site';

export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: brandedOpenGraph('/') };

export default function Home() {
  return <><Navbar /><main><Hero /><CinematicIntro /><EditorialCategories /><CinematicCollections /><CampaignBanner /><FeaturedProducts /><MaisonStory /><HomepageAccountCta /></main><Footer /></>;
}
