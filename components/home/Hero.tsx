'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { DiscoverButton } from '@/components/ui/DiscoverButton';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { editorialEase } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const content = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.16 } },
};

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: editorialEase } },
};

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="editorial-hero editorial-hero--campaign" aria-labelledby="homepage-hero-title">
      <motion.div
        className="editorial-hero__campaign-visual"
        initial={reducedMotion ? false : { opacity: 0.96, scale: 1.018 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.1, ease: editorialEase }}
      >
        <ImageWithLoader
          src={asset('new images/WhatsApp Image 2026-08-31 at 11.09.10 PM.jpeg')}
          alt="Model wearing a grey-blue printed House of Aristocrat lehenga with a pink and mustard dupatta"
          fill
          priority
          sizes="100vw"
        />
      </motion.div>

      <div className="editorial-hero__campaign-shade" aria-hidden="true" />

      <div className="editorial-hero__campaign-layout">
        <motion.div
          className="editorial-hero__campaign-content"
          variants={content}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.p variants={reveal} className="editorial-hero__campaign-eyebrow">The New Collection</motion.p>
          <motion.h1 variants={reveal} id="homepage-hero-title"><span>Everyday</span><i>Elegance</i></motion.h1>
          <motion.p variants={reveal} className="editorial-hero__campaign-copy">Modern Indian silhouettes, made for the way you live now.</motion.p>
          <motion.div variants={reveal} className="editorial-hero__campaign-actions">
            <DiscoverButton href="/collections" className="editorial-hero__campaign-cta">Explore the Collection</DiscoverButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
