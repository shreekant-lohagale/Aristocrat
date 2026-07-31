'use client';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';

const menuItems = ['New arrivals', 'Sarees', 'Suits', 'Lehengas', 'Kurtis', 'Dresses', 'Jewellery'];
export function Navbar() {
  const [open, setOpen] = useState(false);
  return <><AnnouncementBar /><header className="navbar shell"><button suppressHydrationWarning className="icon-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><nav className="desktop-nav">{['New arrivals', 'Collections', 'The maison'].map((item) => <Link key={item} href={item === 'Collections' ? '/collections' : `/#${item.toLowerCase().replace(' ', '-')}`}>{item}</Link>)}</nav><Link className="wordmark" href="/">MAHERA</Link><div className="nav-actions"><Search className="desktop-only" size={19} /><Heart className="desktop-only" size={19} /><Link className="bag-link" href="/cart" aria-label="Shopping bag"><ShoppingBag size={19} /><span>0</span></Link></div></header>{open && <aside className="mobile-menu" aria-label="Mobile navigation"><button suppressHydrationWarning className="icon-button menu-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button><p className="wordmark">MAHERA</p>{menuItems.map((item) => <Link key={item} href="/collections" onClick={() => setOpen(false)}>{item}</Link>)}</aside>}</>;
}
