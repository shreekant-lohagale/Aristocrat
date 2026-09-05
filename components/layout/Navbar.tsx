'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useStore } from '@/context/StoreProvider';
import { AnnouncementBar } from './AnnouncementBar';
import { CountrySelector } from './CountrySelector';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

const collectionLinks = [
  ['Kurtis', '/collections/kurtis'],
  ['Dresses', '/collections/dresses'],
  ['Indo-Western', '/collections/indo-western'],
  ['Chaniya Choli', '/collections/chaniya-choli'],
  ['Jewellery', '/collections/jewellery'],
] as const;

const mobileLinks = [
  ['New Arrivals', '/collections/new-arrivals'],
  ...collectionLinks,
  ['The Maison', '/about'],
  ['My Account', '/account'],
  ['Wishlist', '/wishlist'],
] as const;

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { cartCount, wishlist, customerAuthenticated } = useStore();
  const accountLabel = customerAuthenticated === true ? 'My Account' : customerAuthenticated === false ? 'Sign In' : 'Account';
  const accountHref = customerAuthenticated === false ? '/account/auth/login' : '/account';

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 88);

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const solidNav = solid || scrolled || hovered || menuOpen;
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <AnnouncementBar />

      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`navbar editorial-navbar ${
          scrolled ? 'editorial-navbar--scrolled' : ''
        } ${solidNav ? 'editorial-navbar--solid' : ''}`}
        aria-label="Storefront navigation"
      >
        <div className="editorial-navbar__inner">
          <div className="editorial-navbar__left">
            <button
              className="editorial-navbar__menu"
              type="button"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1.6} />
            </button>

            <Link
              className="editorial-navbar__search"
              href="/search"
              aria-label="Search the collection"
            >
              <span>Search the collection...</span>
              <Search size={17} strokeWidth={1.6} />
            </Link>

            <div className="editorial-navbar__market">
              <CountrySelector />
            </div>
          </div>

          <div className="editorial-navbar__right">
            <Link
              className="editorial-navbar__mobile-search"
              href="/search"
              aria-label="Search the collection"
            >
              <Search size={19} strokeWidth={1.6} />
            </Link>

            <Link
              className="editorial-navbar__icon editorial-navbar__wishlist"
              href="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart size={19} strokeWidth={1.6} />
              {wishlist.length > 0 && <small>{wishlist.length}</small>}
            </Link>

            <Link
              className="editorial-navbar__icon editorial-navbar__account"
              href={accountHref}
              aria-label={accountLabel}
            >
              <UserRound size={19} strokeWidth={1.6} />
              <span className="editorial-navbar__account-label">{accountLabel}</span>
            </Link>

            <button
              suppressHydrationWarning
              className="editorial-navbar__icon"
              type="button"
              aria-label={`Open shopping bag, ${cartCount} items`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} strokeWidth={1.6} />
              {cartCount > 0 && <small suppressHydrationWarning>{cartCount}</small>}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="editorial-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <header>
            <Link href="/" aria-label="House of Aristocrat home" onClick={closeMenu}>
              <Image
                src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')}
                alt="House of Aristocrat"
                width={180}
                height={42}
              />
            </Link>
            <button type="button" aria-label="Close navigation" onClick={closeMenu}>
              <X size={22} strokeWidth={1.6} />
            </button>
          </header>

          <div className="editorial-mobile-menu__market">
            <CountrySelector />
          </div>

          <nav aria-label="Mobile navigation">
            {mobileLinks.map(([label, href]) => (
              <Link href={href === '/account' ? accountHref : href} key={href} onClick={closeMenu}>
                {href === '/account' ? accountLabel : label}
              </Link>
            ))}
          </nav>

          <Link
            className="editorial-mobile-menu__search"
            href="/search"
            onClick={closeMenu}
          >
            Search House of Aristocrat
            <Search size={18} strokeWidth={1.6} />
          </Link>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
