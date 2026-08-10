import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export type AccountUser = { name?: string | null; email?: string | null; image?: string | null };

export async function requireAccountUser(): Promise<AccountUser> {
  const session = await auth();
  if (!session?.user) redirect('/account/login');
  return session.user;
}
