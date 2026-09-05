'use client';

import Link from 'next/link';
import { ArrowUpRight, UserRound } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useStore } from '@/context/StoreProvider';
import { fadeUp, viewportOnce } from '@/lib/motion';

const MotionLink = motion.create(Link);

export function HomepageAccountCta() {
  const { customerAuthenticated } = useStore();
  const reducedMotion = useReducedMotion();
  const href = customerAuthenticated === false ? '/account/auth/login' : '/account';
  const label = customerAuthenticated === true
    ? 'My Account'
    : customerAuthenticated === false
      ? 'Already part of the House? Sign in'
      : 'Your House account';

  return <motion.aside variants={fadeUp} initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce} className="homepage-account-cta" aria-label="Customer account"><UserRound size={17} strokeWidth={1.5} aria-hidden="true" /><MotionLink href={href} whileHover={reducedMotion ? undefined : { y: -1 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>{label}<ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></MotionLink></motion.aside>;
}
