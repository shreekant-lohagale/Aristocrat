'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const dressingImages = [
  'new images/WhatsApp Image 2026-08-31 at 11.09.09 PM.jpeg',
  'new images/WhatsApp Image 2026-08-31 at 11.09.12 PM (2).jpeg',
] as const;

type Story = {
  number: string;
  title: React.ReactNode;
  copy: string;
  href: string;
  cta: string;
  image: string;
  alt: string;
  imagePosition: string;
  reversed?: boolean;
  dark?: boolean;
};

const stories: Story[] = [
  { number: '01 / Everyday elegance', title: <>Kurtis,<br />Refined for<br />Every Day</>, copy: 'Modern proportions, thoughtful details and timeless Indian character — designed to move effortlessly from day to evening.', href: '/collections/kurtis', cta: 'Explore Kurtis', image: '05_slate_ruffled_kurta.png', alt: 'Model wearing a slate ruffled House of Aristocrat kurti', imagePosition: 'center center' },
  { number: '02 / Modern femininity', title: <>Dresses,<br />Made to Be<br />Remembered</>, copy: 'Fluid silhouettes and elevated details for moments that deserve something beautifully effortless.', href: '/collections/dresses', cta: 'Explore Dresses', image: '01_black_sleeveless_maxi.png', alt: 'Model wearing a black sleeveless House of Aristocrat dress', imagePosition: 'center center', reversed: true, dark: true },
  { number: '03 / Modern heritage', title: <>Tradition,<br />Styled Forward</>, copy: 'Indian craft language meets contemporary form — celebration dressing created between heritage and modernity.', href: '/collections/chaniya-choli', cta: 'Explore Chaniya Choli', image: 'new images/WhatsApp Image 2026-08-31 at 11.09.11 PM (1).jpeg', alt: 'Model wearing a navy House of Aristocrat Chaniya Choli', imagePosition: 'center top' },
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
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const interactiveDesktop = useMediaQuery('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
  const [activeStory, setActiveStory] = useState(0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const storyOneOpacity = useTransform(scrollYProgress, [0, 0.27, 0.37, 1], [1, 1, 0, 0]);
  const storyTwoOpacity = useTransform(scrollYProgress, [0, 0.27, 0.37, 0.61, 0.71, 1], [0, 0, 1, 1, 0, 0]);
  const storyThreeOpacity = useTransform(scrollYProgress, [0, 0.61, 0.71, 1], [0, 0, 1, 1]);
  const storyOneY = useTransform(scrollYProgress, [0, 0.27, 0.37], [0, 0, -12]);
  const storyTwoY = useTransform(scrollYProgress, [0, 0.27, 0.37, 0.61, 0.71], [18, 18, 0, 0, -12]);
  const storyThreeY = useTransform(scrollYProgress, [0, 0.61, 0.71], [18, 18, 0]);
  const storyMotion = [
    { opacity: storyOneOpacity, y: storyOneY },
    { opacity: storyTwoOpacity, y: storyTwoY },
    { opacity: storyThreeOpacity, y: storyThreeY },
  ];

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = progress < 0.32 ? 0 : progress < 0.66 ? 1 : 2;
    setActiveStory((current) => current === next ? current : next);
  });

  return (
    <section ref={containerRef} className="editorial-scroll-stories" aria-label="The House editorial stories">
      <div className="editorial-scroll-stories__sticky">
        <div className="editorial-scroll-stories__layers">
          {stories.map((story, index) => <EditorialStoryLayer key={story.number} story={story} active={activeStory === index} interactive={interactiveDesktop} reducedMotion={Boolean(reducedMotion)} opacity={storyMotion[index].opacity} y={storyMotion[index].y} />)}
        </div>
        <div className="editorial-scroll-stories__progress" aria-hidden="true">
          <span>{String(activeStory + 1).padStart(2, '0')}</span>
          <i><motion.b style={{ scaleY: scrollYProgress }} /></i>
          <span>03</span>
        </div>
      </div>
    </section>
  );
}

function EditorialStoryLayer({ story, active, interactive, reducedMotion, opacity, y }: { story: Story; active: boolean; interactive: boolean; reducedMotion: boolean; opacity: MotionValue<number>; y: MotionValue<number> }) {
  const image = <StoryImage story={story} side={story.reversed ? 'right' : 'left'} />;
  const copy = <StoryCopy story={story} active={active} interactive={interactive} reducedMotion={reducedMotion} side={story.reversed ? 'left' : 'right'} />;

  return (
    <motion.article style={interactive ? { opacity, y } : undefined} className={`editorial-scroll-story ${active ? 'is-active' : ''} ${story.dark ? 'editorial-scroll-story--dark' : ''}`} aria-hidden={interactive && !active ? true : undefined}>
      {story.reversed ? <>{copy}{image}</> : <>{image}{copy}</>}
    </motion.article>
  );
}

function StoryImage({ story, side }: { story: Story; side: 'left' | 'right' }) {
  return <div className={`editorial-scroll-story__panel editorial-scroll-story__image editorial-scroll-story__panel--${side}`}><Image src={asset(story.image)} alt={story.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" style={{ objectPosition: story.imagePosition }} /></div>;
}

function StoryCopy({ story, side, active, interactive, reducedMotion }: { story: Story; side: 'left' | 'right'; active: boolean; interactive: boolean; reducedMotion: boolean }) {
  return (
    <div className={`editorial-scroll-story__panel editorial-scroll-story__copy editorial-scroll-story__panel--${side}`}>
      <motion.div className="editorial-scroll-story__copy-inner" variants={staggerContainer} initial={reducedMotion ? false : 'hidden'} animate={!reducedMotion && interactive ? (active ? 'visible' : 'hidden') : undefined} whileInView={!reducedMotion && !interactive ? 'visible' : undefined} viewport={viewportOnce}>
        <motion.p variants={fadeUp} className="eyebrow">{story.number}</motion.p>
        <motion.h3 variants={fadeUp}>{story.title}</motion.h3>
        <motion.p variants={fadeUp}>{story.copy}</motion.p>
        <motion.div variants={fadeUp}><Link className="editorial-scroll-story__cta" href={story.href} tabIndex={interactive && !active ? -1 : undefined}>{story.cta} <span aria-hidden="true">→</span></Link></motion.div>
      </motion.div>
    </div>
  );
}
