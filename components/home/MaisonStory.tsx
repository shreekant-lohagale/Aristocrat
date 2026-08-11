import Link from 'next/link';
const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;
export function MaisonStory() { return <section id="story" className="maison-story"><img src={asset('07_black_floral_kurta.png')} alt="House of Aristocrat Indo-Western look" /><div><p className="eyebrow">The Maison</p><h2>Designed Between<br />Tradition &amp; Tomorrow</h2><p>House of Aristocrat brings together timeless Indian artistry and contemporary silhouettes for a new generation of dressing.</p><Link href="/about">Our story <span>→</span></Link></div></section>; }

