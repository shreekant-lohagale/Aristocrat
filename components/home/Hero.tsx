'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { DiscoverButton } from '@/components/ui/DiscoverButton';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { editorialEase } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const content = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
};

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: editorialEase } },
};

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="editorial-hero editorial-hero--campaign" aria-labelledby="homepage-hero-title">
      <motion.div
        className="editorial-hero__campaign-visual"
        initial={reducedMotion ? false : { opacity: 0.94, scale: 1.018 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.05, ease: editorialEase }}
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
          className="editorial-hero__campaign-signature"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.12, ease: editorialEase }}
        >
          <Image
            src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')}
            alt="House of Aristocrat — Everyday Fashion"
            width={901}
            height={172}
            sizes="(max-width: 768px) 54vw, 34vw"
          />
        </motion.div>

        <motion.div
          className="editorial-hero__campaign-content"
          variants={content}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.h1 variants={reveal} id="homepage-hero-title"><span>Everyday</span><i>Elegance</i></motion.h1>
          <motion.p variants={reveal} className="editorial-hero__campaign-copy">Modern Indian silhouettes, made for the way you live now.</motion.p>
          <motion.div variants={reveal} className="editorial-hero__campaign-actions">
            <DiscoverButton href="/collections">Shop the Collection</DiscoverButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
