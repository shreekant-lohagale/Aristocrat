'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;
const MotionLink = motion.create(Link);

export function MaisonStory() {
  const reducedMotion = useReducedMotion();
  return <motion.section id="story" className="maison-story" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}>
    <motion.div variants={imageReveal} className="maison-story__visual"><Image src={asset('new images/WhatsApp Image 2026-08-31 at 11.09.10 PM (3).jpeg')} alt="House of Aristocrat red and ivory Chaniya Choli campaign look" fill sizes="(max-width: 768px) 100vw, 52vw" /></motion.div>
    <motion.div variants={staggerContainer} className="maison-story__content"><motion.p variants={fadeUp} className="eyebrow">The Maison</motion.p><motion.h2 variants={fadeUp}>Designed Between<br />Tradition &amp; Tomorrow</motion.h2><motion.span variants={fadeUp} className="maison-story__rule" aria-hidden="true" /><motion.p variants={fadeUp}>House of Aristocrat brings together timeless Indian artistry and contemporary silhouettes for a new generation of dressing.</motion.p><MotionLink variants={fadeUp} whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} href="/about">Our story <span>→</span></MotionLink></motion.div>
  </motion.section>;
}
