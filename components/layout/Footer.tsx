'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function Footer() {
  const reducedMotion = useReducedMotion();
  return <motion.footer className="footer" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}><motion.div variants={staggerContainer} className="shell footer-grid"><motion.div variants={staggerItem}><Image className="footer-logo" src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')} alt="House of Aristocrat" width={250} height={58} /><p className="eyebrow">Join the House</p><p className="footer-copy">Private edits, new collections and stories from House of Aristocrat.</p><form className="newsletter-form"><input suppressHydrationWarning aria-label="Email address" placeholder="Your email address" type="email" /><button suppressHydrationWarning aria-label="Subscribe"><ArrowUpRight /></button></form></motion.div><motion.div variants={staggerItem}><p className="eyebrow">Client care</p>{['Contact', 'Shipping & returns', 'Size guide', 'Track order'].map((label) => <Link key={label} href={`/${label.toLowerCase().replaceAll(' ', '-').replace('&-', '')}`}>{label}</Link>)}</motion.div><motion.div variants={staggerItem}><p className="eyebrow">Stay connected</p>{['Instagram', 'Pinterest', 'Journal', 'About us'].map((label) => <a key={label} href="#">{label}</a>)}</motion.div></motion.div><div className="shell footer-bottom"><span>© 2026 HOUSE OF ARISTOCRAT</span><span>Privacy · Terms</span></div></motion.footer>;
}
