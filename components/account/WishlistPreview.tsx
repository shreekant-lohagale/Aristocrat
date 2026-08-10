'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CatalogProduct } from '@/types/commerce';
import { useStore } from '@/context/StoreProvider';
import { AccountEmptyState } from './EmptyState';

export function WishlistPreview({ limit = 4, showAll = false }: { limit?: number; showAll?: boolean }) {
  const { wishlist, toggleWishlist, addToCart, formatPrice } = useStore();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  useEffect(() => { fetch('/api/catalog').then((response) => response.json()).then(setProducts); }, []);
  const saved = useMemo(() => products.filter((product) => wishlist.includes(product.id)), [products, wishlist]);
  const visible = showAll ? saved : saved.slice(0, limit);

  if (!visible.length) return <AccountEmptyState icon={Heart} title="Your wishlist is waiting" description="Save pieces you love and they will be waiting here." ctaHref="/collections/new-arrivals" ctaLabel="Shop new arrivals" />;

  return <><div className={`account-wishlist-grid ${showAll ? 'account-wishlist-grid--all' : ''}`}>{visible.map((product) => <article key={product.id} className="account-wishlist-card"><Link href={`/products/${product.handle}`} className="account-wishlist-card__image"><img src={`/api/assets?file=${encodeURIComponent(product.image)}`} alt={product.title} /></Link><div><Link href={`/products/${product.handle}`}><h3>{product.title}</h3></Link><p>{formatPrice(product.price)}</p><div className="account-wishlist-card__actions"><button type="button" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to bag`}><ShoppingBag size={15} /> Add to bag</button><button type="button" onClick={() => toggleWishlist(product.id)} aria-label={`Remove ${product.title} from wishlist`}><Heart size={15} fill="currentColor" /> Remove</button></div></div></article>)}</div>{!showAll && saved.length > limit && <Link className="account-text-link" href="/account/wishlist">View all wishlist</Link>}</>;
}
