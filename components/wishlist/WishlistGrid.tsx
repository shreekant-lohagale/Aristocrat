'use client';
import { useEffect, useState } from 'react';
import type { CatalogProduct } from '@/types/commerce';
import { useStore } from '@/context/StoreProvider';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
import { isProductWishlisted } from '@/lib/catalog/wishlist';
export function WishlistGrid() { const { country, wishlist } = useStore(); const [products, setProducts] = useState<CatalogProduct[]>([]); useEffect(() => { fetch(`/api/catalog?country=${country.code}`).then((response) => response.ok ? response.json() : []).then(setProducts); }, [country.code]); const saved = products.filter((product) => isProductWishlisted(wishlist, product)); return saved.length ? <div className="catalog-grid">{saved.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div> : <p className="lede">Your saved edit is empty. Discover a piece worth keeping close.</p>; }
