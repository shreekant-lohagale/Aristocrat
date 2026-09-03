import { CinematicCollections, CinematicIntro } from '@/components/home/CinematicCollections';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { EditorialCategories } from '@/components/home/EditorialCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { MaisonStory } from '@/components/home/MaisonStory';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return <><Navbar /><main><Hero /><CinematicIntro /><EditorialCategories /><CinematicCollections /><CampaignBanner /><FeaturedProducts /><MaisonStory /></main><Footer /></>;
}
