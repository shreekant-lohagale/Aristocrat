'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const stories = [
  {
    number: '01 / Everyday elegance',
    title: <>Kurtis,<br />Refined for<br />Every Day</>,
    copy: 'Modern proportions, thoughtful details and timeless Indian character — designed to move effortlessly from day to evening.',
    href: '/collections/kurtis',
    cta: 'Explore Kurtis',
    image: '05_slate_ruffled_kurta.png',
    overviewImage: '02_blue_patchwork_kurta.png',
  },
  {
    number: '02 / Modern femininity',
    title: <>Dresses,<br />Made to Be<br />Remembered</>,
    copy: 'Fluid silhouettes and elevated details for moments that deserve something beautifully effortless.',
    href: '/collections/dresses',
    cta: 'Explore Dresses',
    image: '01_black_sleeveless_maxi.png',
    overviewImage: '03_black_polka_red_new_model.png',
    reversed: true,
  },
  {
    number: '03 / Modern heritage',
    title: <>Tradition,<br />Styled Forward</>,
    copy: 'Indian craft language meets contemporary form — a collection created between heritage and modernity.',
    href: '/collections/indo-western',
    cta: 'Explore Indo-Western',
    image: '02_black_printed_new_model.png',
    overviewImage: '04_red_green_stylish.png',
  },
];

export function CinematicCollections() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('is-revealed', entry.isIntersecting)),
      { threshold: 0.35 },
    );

    root.current?.querySelectorAll('.cinematic-story').forEach((story) => observer.observe(story));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>('.navbar');
    const desktop = window.matchMedia('(min-width: 769px)');
    let observer: IntersectionObserver | undefined;

    const updateNavbarObserver = () => {
      observer?.disconnect();
      navbar?.classList.remove('cinematic-nav-hidden');

      const immersiveSections = [root.current, document.querySelector<HTMLElement>('.campaign-banner')]
        .filter((section): section is HTMLElement => Boolean(section));
      if (!navbar || !desktop.matches || immersiveSections.length === 0) return;

      const activeSections = new Set<HTMLElement>();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const section = entry.target as HTMLElement;
            if (entry.isIntersecting) activeSections.add(section);
            else activeSections.delete(section);
          });
          navbar.classList.toggle('cinematic-nav-hidden', activeSections.size > 0);
        },
        { threshold: 0.04 },
      );
      immersiveSections.forEach((section) => observer?.observe(section));
    };

    updateNavbarObserver();
    desktop.addEventListener('change', updateNavbarObserver);

    return () => {
      observer?.disconnect();
      desktop.removeEventListener('change', updateNavbarObserver);
      navbar?.classList.remove('cinematic-nav-hidden');
    };
  }, []);

  return (
    <section ref={root} className="cinematic-collections">
      <header className="cinematic-intro">
        <div className="cinematic-intro__content">
          <p className="eyebrow">The House edit</p>
          <h2>Dressing,<br /><i>Reimagined</i></h2>
          <p>A study in modern Indian elegance — timeless silhouettes shaped for the way we live now.</p>
        </div>
        <span>Scroll to discover <b /></span>
      </header>

      {stories.map((story, index) => (
        <article key={story.number} className={`cinematic-story ${story.reversed ? 'cinematic-story--reversed' : ''}`}>
          <div className="cinematic-story__sticky">
            <div className="cinematic-story__image">
              <Image src={asset(story.image)} alt={`${story.cta.replace('Explore ', '')} collection`} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 55vw" />
            </div>
            <div className="cinematic-story__copy">
              <p className="eyebrow">{story.number}</p>
              <h3>{story.title}</h3>
              <p>{story.copy}</p>
              <Link className="cinematic-story__cta" href={story.href}>{story.cta} <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </article>
      ))}

      <div className="cinematic-overview shell">
        {stories.map((story) => (
          <Link href={story.href} key={story.number}>
            <Image src={asset(story.overviewImage)} alt={`${story.cta.replace('Explore ', '')} collection`} fill sizes="(max-width: 768px) 78vw, 33vw" />
            <span>{story.cta.replace('Explore ', '')}<small>Explore collection →</small></span>
          </Link>
        ))}
      </div>
    </section>
  );
}


