'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Playfair_Display, Poppins } from 'next/font/google';
import { motion } from 'framer-motion';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-playfair-hero', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins-hero', display: 'swap' });
const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const ease = [0.22, 0.61, 0.36, 1] as const;

export function Hero() {
  return (
    <section className={`${playfair.variable} ${poppins.variable} split-hero`}>
      <div className="split-hero__grid">
        <motion.div
          className="split-hero__brand-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, ease }}
        >
          <div className="split-hero__pattern" aria-hidden="true" />
          <div className="split-hero__circle" aria-hidden="true" />
          <div className="split-hero__brand-content">
            <span className="split-hero__eyebrow">The House Edit</span>
            <div className="split-hero__brand-lockup">
              <span>House of</span>
              <strong>Aristocrat</strong>
            </div>
            <p>Contemporary Indian fashion shaped through refined silhouettes, confident details and a modern point of view.</p>
            <div className="split-hero__actions">
              <Link href="/collections">Shop Collection <ArrowUpRight size={16} strokeWidth={1.8} /></Link>
              <Link href="/collections/indo-western">Discover the Edit</Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="split-hero__editorial-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          <span>Modern Indian Luxury</span>
          <i aria-hidden="true" />
        </motion.div>

        <motion.div
          className="split-hero__image-panel"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
        >
          <Image
            src={asset('Brand Hero Pic.png')}
            alt="House of Aristocrat editorial campaign model"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
          <div className="split-hero__monogram" aria-hidden="true">HA</div>
          <div className="split-hero__image-caption">
            <span>House of Aristocrat</span>
            <p>Dressing the modern woman with a new Indian point of view.</p>
          </div>
        </motion.div>

        <div className="split-hero__mobile-strip">
          <span>Modern Indian Luxury</span>
          <i aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
