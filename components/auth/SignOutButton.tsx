'use client';

import { useTransition } from 'react';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return <button type="button" className="account-sign-out" disabled={pending} onClick={() => startTransition(() => { void signOut({ redirectTo: '/' }); })}>{pending ? 'Signing out…' : 'Sign out'}</button>;
}
