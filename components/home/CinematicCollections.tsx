'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const dressingImages = [
  'new images/WhatsApp Image 2026-08-31 at 11.09.09 PM.jpeg',
  'new images/WhatsApp Image 2026-08-31 at 11.09.12 PM (2).jpeg',
] as const;

const stories = [
  { number: '01 / Everyday elegance', title: <>Kurtis,<br />Refined for<br />Every Day</>, copy: 'Modern proportions, thoughtful details and timeless Indian character — designed to move effortlessly from day to evening.', href: '/collections/kurtis', cta: 'Explore Kurtis', image: '05_slate_ruffled_kurta.png' },
  { number: '02 / Modern femininity', title: <>Dresses,<br />Made to Be<br />Remembered</>, copy: 'Fluid silhouettes and elevated details for moments that deserve something beautifully effortless.', href: '/collections/dresses', cta: 'Explore Dresses', image: '01_black_sleeveless_maxi.png', reversed: true },
  { number: '03 / Modern heritage', title: <>Tradition,<br />Styled Forward</>, copy: 'Indian craft language meets contemporary form — a collection created between heritage and modernity.', href: '/collections/indo-western', cta: 'Explore Indo-Western', image: 'new images/WhatsApp Image 2026-08-31 at 11.09.11 PM (1).jpeg' },
];

export function CinematicIntro() {
  return (
    <section className="cinematic-intro cinematic-intro--campaign" aria-labelledby="cinematic-intro-title">
      <div className="cinematic-intro__gallery" aria-hidden="true">
        {dressingImages.map((file, index) => (
          <figure className={`cinematic-intro__portrait cinematic-intro__portrait--${index + 1}`} key={file}>
            <Image
              src={asset(file)}
              alt=""
              fill
              sizes={index === 0 ? '(max-width: 768px) 84vw, 34vw' : '(max-width: 768px) 70vw, 25vw'}
            />
          </figure>
        ))}
      </div>
      <div className="cinematic-intro__veil" aria-hidden="true" />
      <div className="cinematic-intro__content">
        <p className="cinematic-intro__marker">01 / The Aristocrat Edit</p>
        <h2 id="cinematic-intro-title"><span>Dressing</span><i>Reimagined</i></h2>
        <p>A study in modern Indian elegance — timeless silhouettes shaped for the way we live now.</p>
      </div>
    </section>
  );
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
  </section>;
}
