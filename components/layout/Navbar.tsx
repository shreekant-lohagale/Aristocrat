'use client';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/context/StoreProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CountrySelector } from './CountrySelector';
import { AnnouncementBar } from './AnnouncementBar';

const menuItems = ['New Arrivals', 'Sarees', 'Suits', 'Kurtis', 'Dresses', 'Lehengas', 'Indo-Western', 'Co-ord Sets', 'Jewellery', 'Bags', 'Sale'];
export function Navbar() {
  const [open, setOpen] = useState(false); const [cartOpen, setCartOpen] = useState(false); const { cartCount, wishlist } = useStore();
  return <><AnnouncementBar /><header className="navbar shell"><button className="icon-button nav-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><nav className="desktop-nav">{['New Arrivals', 'Collections', 'The maison'].map((item) => <Link key={item} href={item === 'Collections' ? '/collections' : item === 'New Arrivals' ? '/collections/new-arrivals' : '/#story'}>{item}</Link>)}</nav><Link className="wordmark" href="/">MAHERA</Link><div className="nav-actions"><CountrySelector /><Link className="desktop-only nav-icon" href="/search" aria-label="Search"><Search size={19} /></Link><Link className="nav-icon" href="/wishlist" aria-label="Wishlist"><Heart size={19} /><span>{wishlist.length}</span></Link><Link className="desktop-only nav-icon" href="/account" aria-label="Account"><UserRound size={19} /></Link><button className="nav-icon cart-trigger" onClick={() => setCartOpen(true)} aria-label="Shopping bag"><ShoppingBag size={19} /><span>{cartCount}</span></button></div></header>{open && <aside className="mobile-menu" aria-label="Mobile navigation"><button className="icon-button menu-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button><p className="wordmark">MAHERA</p>{menuItems.map((item) => <Link key={item} href={`/collections/${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setOpen(false)}>{item}</Link>)}</aside>}<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} /></>;
}