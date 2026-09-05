'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const MotionLink = motion.create(Link);

type DiscoverButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function DiscoverButton({ href, children, className = '' }: DiscoverButtonProps) {
  const reducedMotion = useReducedMotion();
  return <MotionLink href={href} whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} className={`discover-button ${className}`.trim()}><span className="discover-button__circle" aria-hidden="true" /><span className="discover-button__arrow" aria-hidden="true" /><span className="discover-button__text">{children}</span></MotionLink>;
}
