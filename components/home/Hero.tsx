'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function Hero() {
  return <section className="editorial-hero editorial-hero--brand-split">
    <motion.div className="editorial-hero__brand-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65 }}>
      <motion.div className="editorial-hero__brand-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}>
        <Image className="editorial-hero__logo" src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')} alt="House of Aristocrat" width={560} height={132} priority />
        <Link className="hero-explore-button" href="/collections"><span>Shop the Collection</span><ArrowRight size={18} aria-hidden="true" /></Link>
      </motion.div>
    </motion.div>
    <motion.div className="editorial-hero__model-panel" initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}>
      <Image src={asset('Brand Hero Pic.png')} alt="House of Aristocrat blue Indo-Western campaign look" fill priority sizes="(max-width: 768px) 100vw, 56vw" />
    </motion.div>
  </section>;
}