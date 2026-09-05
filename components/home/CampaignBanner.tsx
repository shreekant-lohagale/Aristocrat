'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DiscoverButton } from '@/components/ui/DiscoverButton';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function CampaignBanner() {
  const reducedMotion = useReducedMotion();
  return <motion.section className="campaign-banner" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}><Image src={asset('new images/WhatsApp Image 2026-08-31 at 11.09.12 PM (1).jpeg')} alt="House of Aristocrat modern heritage campaign look" fill sizes="100vw" /><motion.div variants={staggerContainer}><motion.p variants={fadeUp} className="eyebrow">The Aristocrat edit</motion.p><motion.h2 variants={fadeUp}>Modern<br /><i>Heritage</i></motion.h2><motion.p variants={fadeUp}>Tradition reimagined for the woman writing her own story.</motion.p><motion.div variants={fadeUp} whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}><DiscoverButton href="/collections/indo-western">Discover the Edit</DiscoverButton></motion.div></motion.div></motion.section>;
}
