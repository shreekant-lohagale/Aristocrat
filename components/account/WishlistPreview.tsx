'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CatalogProduct } from '@/types/commerce';
import { useStore } from '@/context/StoreProvider';
import { AccountEmptyState } from './EmptyState';
import { productImageSrc } from '@/lib/catalog/image';
import { isProductWishlisted, productWishlistAliases } from '@/lib/catalog/wishlist';

export function WishlistPreview({ limit = 4, showAll = false }: { limit?: number; showAll?: boolean }) {
  const { country, wishlist, wishlistStatus, wishlistError, refreshWishlist, toggleWishlist, addToCart, formatPrice } = useStore();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetch(`/api/catalog?country=${country.code}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Catalog request failed');
        return response.json();
      })
      .then((catalog: CatalogProduct[]) => { setProducts(catalog); setStatus('ready'); })
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) setStatus('error'); });
    return () => controller.abort();
  }, [country.code]);
  const saved = useMemo(() => products.filter((product) => isProductWishlisted(wishlist, product)), [products, wishlist]);
  const visible = showAll ? saved : saved.slice(0, limit);

  if (status === 'loading' || wishlistStatus === 'loading') return <div className="account-wishlist-loading" aria-label="Loading wishlist"><span /><span /><span /></div>;
  if (status === 'error' || wishlistStatus === 'error') return <AccountEmptyState icon={Heart} title="We couldn’t load your saved pieces" description={wishlistError ?? 'Please try again when the collection is available.'} ctaLabel="Try again" onCta={() => void refreshWishlist()} />;
  if (!visible.length) return <AccountEmptyState icon={Heart} title="Your wishlist is waiting" description="Save pieces you love and they will be waiting here." ctaHref="/collections/new-arrivals" ctaLabel="Shop new arrivals" />;

  return <><div className={`account-wishlist-grid ${showAll ? 'account-wishlist-grid--all' : ''}`}>{visible.map((product) => <article key={product.id} className="account-wishlist-card"><Link href={`/products/${product.handle}`} className="account-wishlist-card__image"><img src={productImageSrc(product.image)} alt={product.title} /></Link><div><Link href={`/products/${product.handle}`}><h3>{product.title}</h3></Link><p>{formatPrice(product.price, product.currencyCode)}</p><div className="account-wishlist-card__actions">{(product.shopifyVariantCount ?? 0) > 1 ? <Link href={`/products/${product.handle}`}><ShoppingBag size={15} /> Choose options</Link> : <button type="button" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to bag`} disabled={!product.inStock}><ShoppingBag size={15} /> {product.inStock ? 'Add to bag' : 'Sold out'}</button>}<button type="button" onClick={() => toggleWishlist(product.handle, productWishlistAliases(product))} aria-label={`Remove ${product.title} from wishlist`}><Heart size={15} fill="currentColor" /> Remove</button></div></div></article>)}</div>{!showAll && saved.length > limit && <Link className="account-text-link" href="/account/wishlist">View all wishlist</Link>}</>;
}
