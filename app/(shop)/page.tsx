import { CinematicCollections } from '@/components/home/CinematicCollections';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { Hero } from '@/components/home/Hero';
import { MaisonStory } from '@/components/home/MaisonStory';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return <><Navbar /><main><Hero /><CinematicCollections /><CampaignBanner /><MaisonStory /></main><Footer /></>;
}
