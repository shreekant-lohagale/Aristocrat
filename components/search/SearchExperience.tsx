'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';
import type { CatalogProduct } from '@/types/commerce';

export function SearchExperience() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadCatalog = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/catalog', { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load search results.');
        setProducts(await response.json() as CatalogProduct[]);
      } catch (searchError) {
        if (controller.signal.aborted) return;
        setError(searchError instanceof Error ? searchError.message : 'Unable to load search results.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadCatalog();
    return () => controller.abort();
  }, [requestKey]);

  const results = useMemo(
    () => products
      .filter((product) => `${product.title} ${product.category} ${product.colors.join(' ')} ${product.fabric}`.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 24),
    [products, query],
  );

  return (
    <section className="search-experience">
      <label className="search-field">
        <Search size={19} />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by style, colour, fabric…"
        />
      </label>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <div className="catalog-load-error" role="alert">
          <p>{error} Please try again.</p>
          <button className="button" type="button" onClick={() => setRequestKey((key) => key + 1)}>Retry</button>
        </div>
      ) : (
        <>
          {query && <p className="search-count">{results.length} results for “{query}”</p>}
          <div className="catalog-grid">
            {results.map((product) => <CatalogProductCard key={product.id} product={product} />)}
          </div>
        </>
      )}
    </section>
  );
}
