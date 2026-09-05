'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { fadeUp, viewportOnce } from '@/lib/motion';

export function FeaturedProducts() {
  const reducedMotion = useReducedMotion();
  return <motion.section className="product-section new-arrivals-section" aria-labelledby="new-arrivals-title" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}><div className="shell"><motion.header variants={fadeUp} className="new-arrivals-section__header"><div><p className="new-arrivals-section__eyebrow">Just in</p><h2 id="new-arrivals-title">New Arrivals</h2></div><Link className="new-arrivals-section__all" href="/collections/new-arrivals">Shop all <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></Link></motion.header><CatalogGrid collection="New Arrivals" limit={8} variant="new-arrivals" /></div></motion.section>;
}
