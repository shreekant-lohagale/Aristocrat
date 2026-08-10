'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { AccountUser } from '@/lib/auth/account';
import { BackButton } from '@/components/common/BackButton';
import { AccountMobileNav, AccountSidebar } from './AccountSidebar';

export function AccountShell({ user, children }: { user: AccountUser; children: ReactNode }) {
  const pathname = usePathname();
  const isOverview = pathname === '/account';
  return <main className="account-dashboard shell"><BackButton href={isOverview ? '/' : '/account'} label={isOverview ? 'Back to Home' : 'Back to Account'} /><AccountMobileNav user={user} /><div className="account-dashboard__layout"><AccountSidebar user={user} /><motion.section className="account-dashboard__content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, ease: 'easeOut' }}>{children}</motion.section></div></main>;
}
