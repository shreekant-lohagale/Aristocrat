'use client';
import { useEffect, useState } from 'react';
import type { CatalogProduct } from '@/types/commerce';
import { useStore } from '@/context/StoreProvider';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
export function WishlistGrid() { const { wishlist } = useStore(); const [products, setProducts] = useState<CatalogProduct[]>([]); useEffect(() => { fetch('/api/catalog').then((response) => response.json()).then(setProducts); }, []); const saved = products.filter((product) => wishlist.includes(product.id)); return saved.length ? <div className="catalog-grid">{saved.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div> : <p className="lede">Your saved edit is empty. Discover a piece worth keeping close.</p>; }
