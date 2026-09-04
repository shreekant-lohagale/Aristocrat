'use client';

import Link from 'next/link';
import { Heart, Headphones, LayoutDashboard, LogIn, LogOut, MapPin, Menu, Package, User, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AccountUser } from '@/types/account';

const navigation = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account#account-support', label: 'Support', icon: Headphones },
];

function ProfileIdentity({ user }: { user?: AccountUser }) {
  const initial = user?.name?.trim().slice(0, 1).toUpperCase() || 'H';
  return <div className="account-identity"><div className="account-identity__avatar" aria-hidden="true"><span>{initial}</span></div><div><strong>{user?.name || 'Private client account'}</strong><small>{user?.email || 'Secured by Shopify'}</small></div></div>;
}

function AccountLinks({ authenticated, close }: { authenticated: boolean; close?: () => void }) {
  const pathname = usePathname();
  const links = authenticated ? navigation : navigation.filter(({ label }) => ['Overview', 'Wishlist', 'Support'].includes(label));
  return <nav className="account-nav-links" aria-label="Account navigation">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? 'active' : ''} onClick={close}><Icon size={17} aria-hidden="true" /><span>{label}</span></Link>)}</nav>;
}

export function AccountSidebar({ user, authenticated, error, accountHref }: { user?: AccountUser; authenticated: boolean; error: boolean; accountHref: string }) {
  const SessionIcon = authenticated ? LogOut : LogIn;
  const sessionHref = authenticated ? '/account/auth/logout' : error ? accountHref : '/account/auth/login';
  const sessionLabel = authenticated ? 'Sign out' : error ? 'Open secure account' : 'Sign in';
  return <aside className="account-sidebar"><ProfileIdentity user={user} /><AccountLinks authenticated={authenticated} /><a className="account-sign-out" href={sessionHref}><SessionIcon size={16} aria-hidden="true" />{sessionLabel}</a></aside>;
}

export function AccountMobileNav({ user, authenticated, error, accountHref }: { user?: AccountUser; authenticated: boolean; error: boolean; accountHref: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  const SessionIcon = authenticated ? LogOut : LogIn;
  const sessionHref = authenticated ? '/account/auth/logout' : error ? accountHref : '/account/auth/login';
  const sessionLabel = authenticated ? 'Sign out' : error ? 'Open secure account' : 'Sign in';

  return <>
    <div className="account-mobile-nav"><ProfileIdentity user={user} /><button type="button" onClick={() => setOpen(true)} aria-label="Open account navigation"><Menu size={20} /></button></div>
    {open && <div className="account-mobile-sheet" role="dialog" aria-modal="true" aria-label="Account navigation">
      <button className="account-mobile-sheet__scrim" aria-label="Close account navigation" onClick={() => setOpen(false)} />
      <div className="account-mobile-sheet__panel" data-lenis-prevent>
        <header><p>My account</p><button type="button" aria-label="Close account navigation" onClick={() => setOpen(false)}><X size={20} /></button></header>
        <ProfileIdentity user={user} />
        <AccountLinks authenticated={authenticated} close={() => setOpen(false)} />
        <a className="account-sign-out" href={sessionHref}><SessionIcon size={16} aria-hidden="true" />{sessionLabel}</a>
      </div>
    </div>}
  </>;
}



