import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
export default function Home() { return <><Navbar /><main><Hero /><section className="intro shell"><p className="eyebrow">House of Aristocrat</p><h2>Timeless Indian elegance, designed for your every day.</h2></section><Categories /><FeaturedProducts /><section id="story" className="brand-story"><div><p className="eyebrow">Everyday luxury</p><h2>Luxury made accessible.</h2><p>House of Aristocrat brings luxurious Indian and Indo-Western fashion to modern women without compromising on thoughtful quality, feminine detail, or timeless appeal.</p></div><img src={`/api/assets?file=${encodeURIComponent('04_red_green_stylish.png')}`} alt="House of Aristocrat Indo-Western look" /></section></main><Footer /></>; }