'use client';

import Link from 'next/link';
import { Heart, LayoutDashboard, LogOut, MapPin, Menu, Package, User, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AccountUser } from '@/lib/auth/account';
import { SignOutButton } from '@/components/auth/SignOutButton';

const navigation = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: User },
];

function ProfileIdentity({ user }: { user: AccountUser }) {
  return <div className="account-identity"><div className="account-identity__avatar">{user.image ? <img src={user.image} alt="" /> : <span>{user.name?.slice(0, 1) || 'A'}</span>}</div><div><strong>{user.name || 'House client'}</strong><small>{user.email}</small></div></div>;
}

function AccountLinks({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return <nav className="account-nav-links" aria-label="Account navigation">{navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? 'active' : ''} onClick={close}><Icon size={17} aria-hidden="true" /><span>{label}</span></Link>)}</nav>;
}

export function AccountSidebar({ user }: { user: AccountUser }) {
  return <aside className="account-sidebar"><ProfileIdentity user={user} /><AccountLinks /><div className="account-sidebar__signout"><LogOut size={16} aria-hidden="true" /><SignOutButton source={user.source} /></div></aside>;
}

export function AccountMobileNav({ user }: { user: AccountUser }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return <>
    <div className="account-mobile-nav"><ProfileIdentity user={user} /><button type="button" onClick={() => setOpen(true)} aria-label="Open account navigation"><Menu size={20} /></button></div>
    {open && <div className="account-mobile-sheet" role="dialog" aria-modal="true" aria-label="Account navigation">
      <button className="account-mobile-sheet__scrim" aria-label="Close account navigation" onClick={() => setOpen(false)} />
      <div className="account-mobile-sheet__panel" data-lenis-prevent>
        <header><p>My account</p><button type="button" aria-label="Close account navigation" onClick={() => setOpen(false)}><X size={20} /></button></header>
        <ProfileIdentity user={user} />
        <AccountLinks close={() => setOpen(false)} />
        <div className="account-sidebar__signout"><LogOut size={16} aria-hidden="true" /><SignOutButton source={user.source} /></div>
      </div>
    </div>}
  </>;
}

