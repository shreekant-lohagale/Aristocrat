'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function Hero() {
  const reducedMotion = useReducedMotion();
  return <section className="editorial-hero editorial-hero--brand-split">
    <motion.div className="editorial-hero__brand-panel" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.65 }}>
      <motion.div className="editorial-hero__brand-content" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.18, duration: reducedMotion ? 0 : 0.7, ease: [0.22, 0.61, 0.36, 1] }}>
        <Image className="editorial-hero__logo" src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')} alt="House of Aristocrat" width={560} height={132} priority />
        <Link className="hero-explore-button" href="/collections"><span>Shop the Collection</span><ArrowRight size={18} aria-hidden="true" /></Link>
      </motion.div>
    </motion.div>
    <motion.div className="editorial-hero__model-panel" initial={reducedMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.22, 0.61, 0.36, 1] }}>
      <ImageWithLoader src={asset('Brand Hero Pic.png')} alt="House of Aristocrat blue Indo-Western campaign look" fill priority sizes="(max-width: 768px) 100vw, 56vw" />
    </motion.div>
  </section>;
}
