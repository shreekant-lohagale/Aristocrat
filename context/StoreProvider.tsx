'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { CartLine, CatalogProduct, Country, CurrencyCode } from '@/types/commerce';

const countries: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹', rate: 1 },
  { code: 'US', name: 'USA', flag: '🇺🇸', currency: 'USD', symbol: '$', rate: 0.012 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'C$', rate: 0.016 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£', rate: 0.0095 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$', rate: 0.018 },
];

type AddOptions = Pick<CartLine, 'size' | 'color' | 'variantId'>;
type Store = {
  country: Country;
  countries: Country[];
  setCountry: (country: Country) => void;
  formatPrice: (price: number, currencyCode?: CurrencyCode) => string;
  cart: CartLine[];
  addToCart: (product: CatalogProduct, options?: AddOptions) => void;
  updateQuantity: (lineId: string, amount: number) => void;
  removeFromCart: (lineId: string) => void;
  cartCount: number;
  subtotal: number;
  wishlist: string[];
  customerAuthenticated: boolean | null;
  wishlistStatus: 'loading' | 'ready' | 'error';
  wishlistError: string | null;
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (id: string, aliases?: string[]) => void;
};

const StoreContext = createContext<Store | null>(null);

function persistCart(lines: CartLine[]) {
  localStorage.setItem('mahera-cart', JSON.stringify(lines));
  return lines;
}

const anonymousWishlistKey = 'hoa-anonymous-wishlist';
const legacyWishlistKey = 'mahera-wishlist';
const wishlistSyncKey = 'hoa-wishlist-sync';
const wishlistEndpoint = '/account/api/wishlist';

function normalizeWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.flatMap((entry) => typeof entry === 'string' && entry.trim() ? [entry.trim()] : []))];
}

function readLocalWishlist() {
  try {
    const current = localStorage.getItem(anonymousWishlistKey);
    const legacy = localStorage.getItem(legacyWishlistKey);
    const wishlist = normalizeWishlist(JSON.parse(current ?? legacy ?? '[]'));
    localStorage.setItem(anonymousWishlistKey, JSON.stringify(wishlist));
    if (legacy) localStorage.removeItem(legacyWishlistKey);
    return wishlist;
  } catch {
    localStorage.removeItem(anonymousWishlistKey);
    localStorage.removeItem(legacyWishlistKey);
    return [];
  }
}

function writeLocalWishlist(wishlist: string[]) {
  localStorage.setItem(anonymousWishlistKey, JSON.stringify(normalizeWishlist(wishlist)));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState(countries[0]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customerAuthenticated, setCustomerAuthenticated] = useState<boolean | null>(null);
  const [wishlistStatus, setWishlistStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const wishlistRef = useRef<string[]>([]);
  const wishlistModeRef = useRef<'unknown' | 'anonymous' | 'customer'>('unknown');
  const wishlistQueueRef = useRef<Promise<void>>(Promise.resolve());
  const wishlistChannelRef = useRef<BroadcastChannel | null>(null);

  const applyWishlist = useCallback((next: string[]) => {
    const normalized = normalizeWishlist(next);
    wishlistRef.current = normalized;
    setWishlist(normalized);
    return normalized;
  }, []);

  const announceCustomerWishlist = useCallback(() => {
    wishlistChannelRef.current?.postMessage('customer-updated');
    localStorage.setItem(wishlistSyncKey, String(Date.now()));
  }, []);

  const fetchCustomerWishlist = useCallback(async () => {
    const response = await fetch(wishlistEndpoint, { cache: 'no-store', credentials: 'same-origin' });
    if (response.status === 401) {
      setCustomerAuthenticated(false);
      return null;
    }
    if (!response.ok) throw new Error('Unable to load customer wishlist.');
    setCustomerAuthenticated(true);
    const payload = await response.json() as { wishlist?: unknown };
    return normalizeWishlist(payload.wishlist);
  }, []);

  const putCustomerWishlist = useCallback(async (next: string[]) => {
    const response = await fetch(wishlistEndpoint, {
      method: 'PUT',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlist: normalizeWishlist(next) }),
    });
    if (response.status === 401) {
      setCustomerAuthenticated(false);
      return null;
    }
    if (!response.ok) throw new Error('Unable to save customer wishlist.');
    setCustomerAuthenticated(true);
    const payload = await response.json() as { wishlist?: unknown };
    return normalizeWishlist(payload.wishlist);
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const remote = await fetchCustomerWishlist();
      if (remote === null) {
        wishlistModeRef.current = 'anonymous';
        applyWishlist(readLocalWishlist());
      } else {
        wishlistModeRef.current = 'customer';
        const anonymous = readLocalWishlist();
        const merged = normalizeWishlist([...remote, ...anonymous]);
        const saved = merged.length === remote.length ? remote : await putCustomerWishlist(merged);
        if (saved === null) throw new Error('Customer session ended during wishlist merge.');
        applyWishlist(saved);
        writeLocalWishlist([]);
        if (merged.length !== remote.length) announceCustomerWishlist();
      }
      setWishlistError(null);
      setWishlistStatus('ready');
    } catch {
      setWishlistError('Your wishlist could not be synchronized. Please try again.');
      setWishlistStatus('error');
    }
  }, [announceCustomerWishlist, applyWishlist, fetchCustomerWishlist, putCustomerWishlist]);

  const queueCustomerSave = useCallback(() => {
    wishlistQueueRef.current = wishlistQueueRef.current.catch(() => undefined).then(async () => {
      try {
        const saved = await putCustomerWishlist(wishlistRef.current);
        if (saved === null) {
          wishlistModeRef.current = 'anonymous';
          const local = readLocalWishlist();
          applyWishlist(local);
          setWishlistStatus('ready');
          return;
        }
        applyWishlist(saved);
        setWishlistError(null);
        setWishlistStatus('ready');
        announceCustomerWishlist();
      } catch {
        try {
          const remote = await fetchCustomerWishlist();
          if (remote === null) {
            wishlistModeRef.current = 'anonymous';
            applyWishlist(readLocalWishlist());
          } else {
            applyWishlist(remote);
          }
        } catch {
          // Keep the optimistic list visible when both saving and recovery fail.
        }
        setWishlistError('Your wishlist change was not saved. Please try again.');
        setWishlistStatus('error');
      }
    });
  }, [announceCustomerWishlist, applyWishlist, fetchCustomerWishlist, putCustomerWishlist]);

  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem('mahera-country');
      const savedCart = localStorage.getItem('mahera-cart');
      const found = countries.find((entry) => entry.code === savedCountry);
      if (found) setCountryState(found);
      if (savedCart) {
        setCart((JSON.parse(savedCart) as CartLine[]).map((line) => ({
          ...line,
          variantId: line.variantId ?? line.product.shopifyVariantId,
          lineId: line.lineId ?? `${line.product.id}:${line.variantId ?? line.product.shopifyVariantId ?? 'default'}:${line.size ?? ''}:${line.color ?? ''}`,
        })));
      }
    } catch {
      localStorage.removeItem('mahera-cart');
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const initialise = async () => {
      const anonymous = readLocalWishlist();
      applyWishlist(anonymous);
      try {
        const remote = await fetchCustomerWishlist();
        if (cancelled) return;
        if (remote === null) {
          wishlistModeRef.current = 'anonymous';
          setWishlistStatus('ready');
          return;
        }

        wishlistModeRef.current = 'customer';
        const pendingAnonymous = readLocalWishlist();
        const merged = normalizeWishlist([...remote, ...pendingAnonymous]);
        applyWishlist(merged);
        if (merged.length !== remote.length) {
          const saved = await putCustomerWishlist(merged);
          if (cancelled) return;
          if (saved === null) throw new Error('Customer session ended during wishlist merge.');
          applyWishlist(saved);
          announceCustomerWishlist();
        }
        writeLocalWishlist([]);
        setWishlistError(null);
        setWishlistStatus('ready');
      } catch {
        if (cancelled) return;
        wishlistModeRef.current = 'unknown';
        applyWishlist(readLocalWishlist());
        setWishlistError('Your wishlist could not be synchronized. Please try again.');
        setWishlistStatus('error');
      }
    };
    void initialise();
    return () => { cancelled = true; };
  }, [announceCustomerWishlist, applyWishlist, fetchCustomerWishlist, putCustomerWishlist]);

  useEffect(() => {
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('hoa-wishlist');
    wishlistChannelRef.current = channel;
    const syncCustomer = () => { if (wishlistModeRef.current === 'customer') void refreshWishlist(); };
    if (channel) channel.onmessage = syncCustomer;
    const onStorage = (event: StorageEvent) => {
      if (event.key === anonymousWishlistKey && wishlistModeRef.current === 'anonymous') applyWishlist(readLocalWishlist());
      if (event.key === wishlistSyncKey) syncCustomer();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      channel?.close();
      wishlistChannelRef.current = null;
    };
  }, [applyWishlist, refreshWishlist]);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible' && wishlistModeRef.current === 'customer') void refreshWishlist(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshWishlist]);

  useEffect(() => {
    if (!hydrated || !cart.length) return;
    const controller = new AbortController();
    const products = new Map<string, Promise<CatalogProduct>>();
    for (const line of cart) {
      if (!products.has(line.product.handle)) {
        products.set(line.product.handle, fetch(`/api/catalog?handle=${encodeURIComponent(line.product.handle)}&country=${country.code}`, { signal: controller.signal }).then((response) => {
          if (!response.ok) throw new Error('Unable to refresh cart pricing.');
          return response.json() as Promise<CatalogProduct>;
        }));
      }
    }

    Promise.all([...products.entries()].map(async ([handle, request]) => [handle, await request] as const))
      .then((entries) => {
        const refreshed = new Map(entries);
        setCart((lines) => persistCart(lines.map((line) => {
          const product = refreshed.get(line.product.handle);
          if (!product) return line;
          const variant = product.variants.find((entry) => entry.id === line.variantId);
          return {
            ...line,
            product: variant ? {
              ...product,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              currencyCode: variant.currencyCode,
              shopifyVariantId: variant.id,
              shopifyAvailableForSale: variant.availableForSale,
            } : product,
          };
        })));
      })
      .catch(() => undefined);

    return () => controller.abort();
    // Cart changes should not repeatedly refetch the same market prices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.code, hydrated]);

  const setCountry = (value: Country) => {
    setCountryState(value);
    localStorage.setItem('mahera-country', value.code);
  };

  const addToCart = (product: CatalogProduct, options: AddOptions = {}) => setCart((lines) => {
    const variantId = options.variantId ?? product.shopifyVariantId;
    const lineId = `${product.id}:${variantId ?? 'default'}:${options.size ?? ''}:${options.color ?? ''}`;
    const found = lines.find((line) => line.lineId === lineId);
    return persistCart(found
      ? lines.map((line) => line.lineId === lineId ? { ...line, quantity: line.quantity + 1 } : line)
      : [...lines, { lineId, product, variantId, quantity: 1, size: options.size, color: options.color }]);
  });

  const updateQuantity = (lineId: string, amount: number) => setCart((lines) => persistCart(lines.flatMap((line) =>
    line.lineId !== lineId ? [line] : line.quantity + amount > 0 ? [{ ...line, quantity: line.quantity + amount }] : [])));

  const removeFromCart = (lineId: string) => setCart((lines) => persistCart(lines.filter((line) => line.lineId !== lineId)));

  const toggleWishlist = useCallback((id: string, aliases: string[] = []) => {
    const keys = new Set([id, ...aliases]);
    const items = wishlistRef.current;
    const next = normalizeWishlist(items.some((item) => keys.has(item)) ? items.filter((item) => !keys.has(item)) : [...items, id]);
    applyWishlist(next);
    setWishlistError(null);
    if (wishlistModeRef.current === 'customer') {
      queueCustomerSave();
    } else {
      wishlistModeRef.current = 'anonymous';
      writeLocalWishlist(next);
      setWishlistStatus('ready');
    }
  }, [applyWishlist, queueCustomerSave]);

  const value = useMemo(() => ({
    country,
    countries,
    setCountry,
    formatPrice: (price: number, currencyCode?: CurrencyCode) => {
      const currency = currencyCode ?? country.currency;
      const amount = currencyCode ? price : price * country.rate;
      return new Intl.NumberFormat(country.code === 'IN' ? 'en-IN' : `en-${country.code}`, {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'INR' ? 0 : 2,
      }).format(amount);
    },
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    wishlist,
    customerAuthenticated,
    wishlistStatus,
    wishlistError,
    refreshWishlist,
    toggleWishlist,
  }), [country, cart, wishlist, customerAuthenticated, wishlistStatus, wishlistError, refreshWishlist, toggleWishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
