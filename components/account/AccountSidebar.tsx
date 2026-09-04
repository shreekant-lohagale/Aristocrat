'use client';

import Link from 'next/link';
import { Heart, Headphones, LayoutDashboard, LogOut, MapPin, Menu, Package, User, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account#account-support', label: 'Support', icon: Headphones },
];

function ProfileIdentity() {
  return <div className="account-identity"><div className="account-identity__avatar" aria-hidden="true"><span>H</span></div><div><strong>Private client account</strong><small>Secured by Shopify</small></div></div>;
}

function AccountLinks({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return <nav className="account-nav-links" aria-label="Account navigation">{navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? 'active' : ''} onClick={close}><Icon size={17} aria-hidden="true" /><span>{label}</span></Link>)}</nav>;
}

export function AccountSidebar() {
  return <aside className="account-sidebar"><ProfileIdentity /><AccountLinks /><a className="account-sign-out" href="/account/login"><LogOut size={16} aria-hidden="true" />Manage / sign out</a></aside>;
}

export function AccountMobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return <>
    <div className="account-mobile-nav"><ProfileIdentity /><button type="button" onClick={() => setOpen(true)} aria-label="Open account navigation"><Menu size={20} /></button></div>
    {open && <div className="account-mobile-sheet" role="dialog" aria-modal="true" aria-label="Account navigation">
      <button className="account-mobile-sheet__scrim" aria-label="Close account navigation" onClick={() => setOpen(false)} />
      <div className="account-mobile-sheet__panel" data-lenis-prevent>
        <header><p>My account</p><button type="button" aria-label="Close account navigation" onClick={() => setOpen(false)}><X size={20} /></button></header>
        <ProfileIdentity />
        <AccountLinks close={() => setOpen(false)} />
        <a className="account-sign-out" href="/account/login"><LogOut size={16} aria-hidden="true" />Manage / sign out</a>
      </div>
    </div>}
  </>;
}



