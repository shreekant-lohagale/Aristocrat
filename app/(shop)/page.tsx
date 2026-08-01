import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
export default function Home() { return <><Navbar /><main><Hero /><section className="intro shell"><p className="eyebrow">Crafted for the occasion</p><h2>Keepsake pieces for the stories you will tell forever.</h2></section><Categories /><FeaturedProducts /><section className="brand-story"><div><p className="eyebrow">Our promise</p><h2>An heirloom for today.</h2><p>Rooted in the poetry of Indian craft and cut for a modern life, every House of Aristocrat piece is considered in every detail.</p></div><img src="/api/images/LB6492_491ec4a8-b995-4c92-a40b-3c64f11f9253.webp" alt="House of Aristocrat collection" /></section></main><Footer /></>; }
