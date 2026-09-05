'use client';

import Link from 'next/link';
import { ArrowUpRight, UserRound } from 'lucide-react';
import { useStore } from '@/context/StoreProvider';

export function HomepageAccountCta() {
  const { customerAuthenticated } = useStore();
  const href = customerAuthenticated === false ? '/account/auth/login' : '/account';
  const label = customerAuthenticated === true
    ? 'My Account'
    : customerAuthenticated === false
      ? 'Already part of the House? Sign in'
      : 'Your House account';

  return <aside className="homepage-account-cta" aria-label="Customer account"><UserRound size={17} strokeWidth={1.5} aria-hidden="true" /><Link href={href}>{label}<ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></Link></aside>;
}
