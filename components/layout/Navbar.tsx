'use client';

import Link from 'next/link';
import { Grid2X2, Heart, Home, Search, ShoppingBag, Sparkles, UserRound } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CountrySelector } from './CountrySelector';
import { AnnouncementBar } from './AnnouncementBar';

type DockActionProps = {
  label: string;
  active?: boolean;
  mobileHidden?: boolean;
  children: ReactNode;
};

function DockAction({ label, active = false, mobileHidden = false, children }: DockActionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`nav-dock-action ${active ? 'is-active' : ''} ${mobileHidden ? 'nav-dock-action--mobile-hidden' : ''}`}
      data-tooltip={label}
      initial={false}
      whileHover={reduceMotion ? undefined : 'hover'}
      whileFocus={reduceMotion ? undefined : 'hover'}
    >
      <motion.span
        aria-hidden="true"
        className="nav-dock-action__bubble"
        variants={{ hover: { opacity: 1, scale: 1.18 } }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      />
      <motion.span
        className="nav-dock-action__icon"
        variants={{ hover: { scale: 1.08 } }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        {children}
      </motion.span>
      <span className="nav-dock-action__label">{label}</span>
    </motion.span>
  );
}

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.7] },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const isHome = pathname === '/';
  const isCollections = pathname === '/collections' || pathname.startsWith('/collections/');
  const isNewArrivals = pathname === '/collections/new-arrivals';

  return (
    <>
      <AnnouncementBar />
      <header className={`navbar ${footerVisible ? 'navbar--footer-hidden' : ''} ${cartOpen ? 'navbar--cart-hidden' : ''}`} aria-label="Storefront navigation">
        <div className="desktop-country"><CountrySelector /></div>
        <nav className="bottom-dock-nav" aria-label="Primary navigation">
          <DockAction label="Home" active={isHome}>
            <Link className="nav-icon" href="/" aria-label="Home"><Home size={19} /></Link>
          </DockAction>
          <DockAction label="New Arrivals" active={isNewArrivals} mobileHidden>
            <Link className="nav-icon nav-new-arrivals" href="/collections/new-arrivals" aria-label="New Arrivals"><Sparkles size={18} /></Link>
          </DockAction>
          <DockAction label="Collections" active={isCollections && !isNewArrivals}>
            <Link className="nav-icon" href="/collections" aria-label="Collections"><Grid2X2 size={18} /></Link>
          </DockAction>
          <DockAction label="Search" active={pathname === '/search'}>
            <Link className="nav-icon" href="/search" aria-label="Search"><Search size={18} /></Link>
          </DockAction>
          <DockAction label="Wishlist" active={pathname === '/wishlist'} mobileHidden>
            <Link className="nav-icon nav-wishlist" href="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={18} /><span>{wishlist.length}</span></Link>
          </DockAction>
          <DockAction label="Account" active={pathname.startsWith('/account')}>
            <Link className="nav-icon" href="/account" aria-label="Account"><UserRound size={18} /></Link>
          </DockAction>
          <DockAction label="Shopping Bag" active={pathname === '/cart'}>
            <button suppressHydrationWarning className="nav-icon cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBag size={18} /><span>{cartCount}</span></button>
          </DockAction>
        </nav>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}


