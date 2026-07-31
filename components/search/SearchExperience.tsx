'use client';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CatalogProduct } from '@/types/commerce';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
export function SearchExperience() { const [query, setQuery] = useState(''); const [products, setProducts] = useState<CatalogProduct[]>([]); useEffect(() => { fetch('/api/catalog').then((response) => response.json()).then(setProducts); }, []); const results = useMemo(() => products.filter((product) => `${product.title} ${product.category} ${product.colors.join(' ')} ${product.fabric}`.toLowerCase().includes(query.toLowerCase())).slice(0, 24), [products, query]); return <section className="search-experience"><label className="search-field"><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by style, colour, fabric…" /></label>{query && <p className="search-count">{results.length} results for “{query}”</p>}<div className="catalog-grid">{results.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div></section>; }
