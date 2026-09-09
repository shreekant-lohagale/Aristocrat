import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'About the House', description: 'Discover the design point of view behind House of Aristocrat.' };

export default function AboutPage() {
  return <InformationPage eyebrow="The Maison" title="Designed between tradition and tomorrow" intro="House of Aristocrat creates expressive Indian and Indo-Western dressing for a modern way of life.">
    <section><h2>Our point of view</h2><p>We bring together enduring Indian craft language, confident colour and contemporary silhouettes. Each edit is considered for women who want occasion and everyday dressing to feel personal rather than prescribed.</p></section>
    <section><h2>Everyday fashion, elevated</h2><p>From relaxed kurtis and dresses to celebration-ready Chaniya Choli, the House is built around thoughtful proportion, versatile styling and a strong sense of individuality.</p></section>
    <Link className="information-page__cta" href="/collections">Explore the collections</Link>
  </InformationPage>;
}
