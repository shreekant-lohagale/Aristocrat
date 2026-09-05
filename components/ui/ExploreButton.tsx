'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const MotionLink = motion.create(Link);

type ExploreButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function ExploreButton({ href, children, className = '', ariaLabel }: ExploreButtonProps) {
  const reducedMotion = useReducedMotion();
  return <MotionLink href={href} aria-label={ariaLabel} whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} className={`explore-button ${className}`.trim()}><span aria-hidden="true" className="explore-button__glow" /><span className="explore-button__label">{children}</span></MotionLink>;
}
