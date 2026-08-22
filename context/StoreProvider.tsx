'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
  toggleWishlist: (id: string, aliases?: string[]) => void;
};

const StoreContext = createContext<Store | null>(null);

function persistCart(lines: CartLine[]) {
  localStorage.setItem('mahera-cart', JSON.stringify(lines));
  return lines;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState(countries[0]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem('mahera-country');
      const savedCart = localStorage.getItem('mahera-cart');
      const savedWishlist = localStorage.getItem('mahera-wishlist');
      const found = countries.find((entry) => entry.code === savedCountry);
      if (found) setCountryState(found);
      if (savedCart) {
        setCart((JSON.parse(savedCart) as CartLine[]).map((line) => ({
          ...line,
          variantId: line.variantId ?? line.product.shopifyVariantId,
          lineId: line.lineId ?? `${line.product.id}:${line.variantId ?? line.product.shopifyVariantId ?? 'default'}:${line.size ?? ''}:${line.color ?? ''}`,
        })));
      }
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist) as string[]);
    } catch {
      localStorage.removeItem('mahera-cart');
    } finally {
      setHydrated(true);
    }
  }, []);

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

  const toggleWishlist = (id: string, aliases: string[] = []) => setWishlist((items) => {
    const keys = new Set([id, ...aliases]);
    const next = items.some((item) => keys.has(item)) ? items.filter((item) => !keys.has(item)) : [...items, id];
    localStorage.setItem('mahera-wishlist', JSON.stringify(next));
    return next;
  });

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
    toggleWishlist,
  }), [country, cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
