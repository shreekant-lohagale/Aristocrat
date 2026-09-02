import Image from 'next/image';
import Link from 'next/link';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function MaisonStory() {
  return <section id="story" className="maison-story">
    <div className="maison-story__visual"><Image src={asset('07_black_floral_kurta.png')} alt="House of Aristocrat Indo-Western look" fill sizes="(max-width: 768px) 100vw, 52vw" /></div>
    <div className="maison-story__content"><p className="eyebrow">The Maison</p><h2>Designed Between<br />Tradition &amp; Tomorrow</h2><span className="maison-story__rule" aria-hidden="true" /><p>House of Aristocrat brings together timeless Indian artistry and contemporary silhouettes for a new generation of dressing.</p><Link href="/about">Our story <span>→</span></Link></div>
  </section>;
}
