'use client';
import { startTransition, useState } from 'react';
import { signOut } from 'next-auth/react';
import type { AccountUser } from '@/lib/auth/account';

export function SignOutButton({ source }: { source: AccountUser['source'] }) { const [pending, setPending] = useState(false); const logout = () => { setPending(true); if (source === 'shopify') { window.location.assign('/api/customer-auth/logout'); return; } startTransition(() => { void signOut({ redirectTo: '/' }); }); }; return <button type="button" className="account-sign-out" disabled={pending} onClick={logout}>{pending ? 'Signing out…' : 'Sign out'}</button>; }
