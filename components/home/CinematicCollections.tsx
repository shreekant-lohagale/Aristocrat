'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const stories = [
  { number: '01 / Everyday elegance', title: <>Kurtis,<br />Refined for<br />Every Day</>, copy: 'Modern proportions, thoughtful details and timeless Indian character — designed to move effortlessly from day to evening.', href: '/collections/kurtis', cta: 'Explore Kurtis', image: '05_slate_ruffled_kurta.png', overviewImage: '02_blue_patchwork_kurta.png' },
  { number: '02 / Modern femininity', title: <>Dresses,<br />Made to Be<br />Remembered</>, copy: 'Fluid silhouettes and elevated details for moments that deserve something beautifully effortless.', href: '/collections/dresses', cta: 'Explore Dresses', image: '01_black_sleeveless_maxi.png', overviewImage: '03_black_polka_red_new_model.png', reversed: true },
  { number: '03 / Modern heritage', title: <>Tradition,<br />Styled Forward</>, copy: 'Indian craft language meets contemporary form — a collection created between heritage and modernity.', href: '/collections/indo-western', cta: 'Explore Indo-Western', image: '02_black_printed_new_model.png', overviewImage: '04_red_green_stylish.png' },
];

export function CinematicIntro() {
  const intro = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = intro.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => node.classList.toggle('intro-is-revealed', entry.isIntersecting), { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <section ref={intro} className="cinematic-intro">
    <div className="cinematic-intro__content"><p className="cinematic-intro__marker">01 / The House Edit</p><h2><span>Dressing,</span><i>Reimagined</i></h2><p>A study in modern Indian elegance — timeless silhouettes shaped for the way we live now.</p></div>
    <div className="cinematic-intro__gallery" aria-label="House of Aristocrat editorial looks">
      <figure className="cinematic-intro__image cinematic-intro__image--one"><Image src={asset('03_white_embroidered_kurta.png')} alt="White embroidered House of Aristocrat kurta look" fill sizes="(max-width: 768px) 50vw, 18vw" /></figure>
      <figure className="cinematic-intro__image cinematic-intro__image--two"><Image src={asset('04_magenta_kurta_set.png')} alt="Magenta House of Aristocrat kurta set" fill sizes="(max-width: 768px) 50vw, 22vw" /></figure>
      <figure className="cinematic-intro__image cinematic-intro__image--three"><Image src={asset('09_black_maxi_high_res.png')} alt="Black House of Aristocrat maxi dress" fill sizes="(max-width: 768px) 50vw, 15vw" /></figure>
    </div><span>Scroll to discover <b /></span>
  </section>;
}

export function CinematicCollections() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-revealed', entry.isIntersecting)), { threshold: 0.35 });
    root.current?.querySelectorAll('.cinematic-story').forEach((story) => observer.observe(story));
    return () => observer.disconnect();
  }, []);
  return <section ref={root} className="cinematic-collections">
    {stories.map((story, index) => <article key={story.number} className={`cinematic-story ${story.reversed ? 'cinematic-story--reversed' : ''}`}><div className="cinematic-story__sticky"><div className="cinematic-story__image"><Image src={asset(story.image)} alt={`${story.cta.replace('Explore ', '')} collection`} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 55vw" /></div><div className="cinematic-story__copy"><p className="eyebrow">{story.number}</p><h3>{story.title}</h3><p>{story.copy}</p><Link className="cinematic-story__cta" href={story.href}>{story.cta} <span aria-hidden="true">→</span></Link></div></div></article>)}
    <div className="cinematic-overview shell">{stories.map((story) => <Link href={story.href} key={story.number}><Image src={asset(story.overviewImage)} alt={`${story.cta.replace('Explore ', '')} collection`} fill sizes="(max-width: 768px) 78vw, 33vw" /><span>{story.cta.replace('Explore ', '')}<small>Explore collection →</small></span></Link>)}</div>
  </section>;
}