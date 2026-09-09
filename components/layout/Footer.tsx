'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { type FormEvent, useState } from 'react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

type NewsletterState = { kind: 'idle' | 'loading' | 'success' | 'error'; message: string };

const clientCareLinks = [
  ['Contact', '/contact'],
  ['Shipping & returns', '/shipping-returns'],
  ['Size guide', '/size-guide'],
  ['Track order', '/track-order'],
] as const;

const houseLinks = [
  ['About the House', '/about'],
  ['New arrivals', '/collections/new-arrivals'],
  ['Collections', '/collections'],
  ['My account', '/account'],
] as const;

export function Footer() {
  const reducedMotion = useReducedMotion();
  const [newsletter, setNewsletter] = useState<NewsletterState>({ kind: 'idle', message: '' });

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get('email');
    if (typeof email !== 'string' || !email.trim()) {
      setNewsletter({ kind: 'error', message: 'Enter your email address.' });
      return;
    }

    setNewsletter({ kind: 'loading', message: 'Checking subscription availability...' });
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || 'Subscription is unavailable.');
      form.reset();
      setNewsletter({ kind: 'success', message: result.message || 'You have joined the House.' });
    } catch (error) {
      setNewsletter({ kind: 'error', message: error instanceof Error ? error.message : 'Subscription is unavailable.' });
    }
  };

  return (
    <motion.footer className="footer" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}>
      <motion.div variants={staggerContainer} className="shell footer-grid">
        <motion.div variants={staggerItem}>
          <Image className="footer-logo" src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')} alt="House of Aristocrat" width={250} height={58} />
          <p className="eyebrow">Join the House</p>
          <p className="footer-copy">Private edits, new collections and stories from House of Aristocrat.</p>
          <form className="newsletter-form" onSubmit={subscribe} noValidate>
            <input name="email" aria-label="Email address" placeholder="Your email address" type="email" autoComplete="email" disabled={newsletter.kind === 'loading'} />
            <button aria-label="Subscribe" type="submit" disabled={newsletter.kind === 'loading'}><ArrowUpRight /></button>
          </form>
          <p className={`newsletter-form__status newsletter-form__status--${newsletter.kind}`} role="status" aria-live="polite">{newsletter.message}</p>
        </motion.div>
        <motion.div variants={staggerItem}>
          <p className="eyebrow">Client care</p>
          {clientCareLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </motion.div>
        <motion.div variants={staggerItem}>
          <p className="eyebrow">The House</p>
          {houseLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </motion.div>
      </motion.div>
      <div className="shell footer-bottom">
        <span>&copy; 2026 HOUSE OF ARISTOCRAT</span>
        <span className="footer-bottom__legal"><Link href="/privacy-policy">Privacy</Link><i aria-hidden="true">&middot;</i><Link href="/terms">Terms</Link></span>
      </div>
    </motion.footer>
  );
}
