import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAuthenticatedCustomer } from '@/lib/shopify/customer-account';

export type AccountUser = { name?: string | null; email?: string | null; image?: string | null; source: 'shopify' | 'authjs' };

export async function getAccountUser(): Promise<AccountUser | null> {
  const customer = await getAuthenticatedCustomer();
  if (customer) return { name: customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'House client', email: customer.emailAddress?.emailAddress ?? null, source: 'shopify' };
  const session = await auth();
  return session?.user ? { ...session.user, source: 'authjs' } : null;
}

export async function requireAccountUser(): Promise<AccountUser> { const user = await getAccountUser(); if (!user) redirect('/account/login'); return user; }
