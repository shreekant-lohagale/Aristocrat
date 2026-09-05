'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

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
  const reducedMotion = useReducedMotion();
  return <motion.section className="cinematic-intro cinematic-intro--campaign" aria-labelledby="cinematic-intro-title" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}>
    <div className="cinematic-intro__gallery" aria-hidden="true">
      {dressingImages.map((file, index) => <motion.figure variants={fadeUp} className={`cinematic-intro__portrait cinematic-intro__portrait--${index + 1}`} key={file}><Image src={asset(file)} alt="" fill sizes={index === 0 ? '(max-width: 768px) 84vw, 34vw' : '(max-width: 768px) 70vw, 25vw'} /></motion.figure>)}
    </div>
    <div className="cinematic-intro__veil" aria-hidden="true" />
    <motion.div variants={staggerContainer} className="cinematic-intro__content"><motion.p variants={fadeUp} className="cinematic-intro__marker">01 / The Aristocrat Edit</motion.p><motion.h2 variants={fadeUp} id="cinematic-intro-title"><span>Dressing</span><i>Reimagined</i></motion.h2><motion.p variants={fadeUp}>A study in modern Indian elegance — timeless silhouettes shaped for the way we live now.</motion.p></motion.div>
  </motion.section>;
}

export function CinematicCollections() {
  const reducedMotion = useReducedMotion();
  return <section className="cinematic-collections">
    {stories.map((story) => <motion.article key={story.number} className={`cinematic-story is-revealed ${story.reversed ? 'cinematic-story--reversed' : ''}`} initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}><div className="cinematic-story__sticky"><div className="cinematic-story__image"><Image src={asset(story.image)} alt={`${story.cta.replace('Explore ', '')} collection`} fill sizes="(max-width: 768px) 100vw, 55vw" /></div><motion.div variants={staggerContainer} className="cinematic-story__copy"><motion.p variants={fadeUp} className="eyebrow">{story.number}</motion.p><motion.h3 variants={fadeUp}>{story.title}</motion.h3><motion.p variants={fadeUp}>{story.copy}</motion.p><motion.div variants={fadeUp}><Link className="cinematic-story__cta" href={story.href}>{story.cta} <span aria-hidden="true">→</span></Link></motion.div></motion.div></div></motion.article>)}
  </section>;
}
