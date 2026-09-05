'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { AccountUser } from '@/types/account';
import { BackButton } from '@/components/common/BackButton';
import { AccountMobileNav, AccountSidebar } from './AccountSidebar';

export function AccountShell({ children, user, authenticated = false, error = false, accountHref = '/account/auth/login' }: { children: ReactNode; user?: AccountUser; authenticated?: boolean; error?: boolean; accountHref?: string }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isOverview = pathname === '/account';
  return <main className="account-dashboard shell"><BackButton href={isOverview ? '/' : '/account'} label={isOverview ? 'Back to Home' : 'Back to Account'} /><AccountMobileNav user={user} authenticated={authenticated} error={error} accountHref={accountHref} /><div className="account-dashboard__layout"><AccountSidebar user={user} authenticated={authenticated} error={error} accountHref={accountHref} /><AnimatePresence mode="wait" initial={false}><motion.section key={pathname} className="account-dashboard__content" initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reducedMotion ? 0 : .26, ease: 'easeOut' }}>{children}</motion.section></AnimatePresence></div></main>;
}

