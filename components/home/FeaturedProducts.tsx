'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProductCoverflow } from '@/components/product/ProductCoverflow';
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';
import { useStore } from '@/context/StoreProvider';
import { fadeUp, viewportOnce } from '@/lib/motion';
import type { CatalogProduct } from '@/types/commerce';

export function FeaturedProducts() {
  const reducedMotion = useReducedMotion();
  const { country } = useStore();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetch(`/api/catalog?country=${country.code}&collection=new-arrivals&sort=featured`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load New Arrivals.');
        return response.json() as Promise<CatalogProduct[]>;
      })
      .then((catalog) => {
        setProducts(catalog.slice(0, 8));
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setStatus('error');
      });
    return () => controller.abort();
  }, [country.code, requestKey]);

  return (
    <motion.section className="product-section new-arrivals-section" aria-labelledby="new-arrivals-title" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}>
      <div className="shell">
        <motion.header variants={fadeUp} className="new-arrivals-section__header">
          <div><p className="new-arrivals-section__eyebrow">Just in</p><h2 id="new-arrivals-title">New Arrivals</h2></div>
          <Link className="new-arrivals-section__all" href="/collections/new-arrivals">Shop all <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></Link>
        </motion.header>
        {status === 'loading' && <div className="product-coverflow__loading" aria-label="Loading New Arrivals"><ProductGridSkeleton count={3} /></div>}
        {status === 'error' && <div className="product-coverflow__error" role="alert"><p>New Arrivals are temporarily unavailable.</p><button type="button" onClick={() => setRequestKey((key) => key + 1)}>Try again</button></div>}
        {status === 'ready' && products.length > 0 && <ProductCoverflow products={products} reducedMotion={Boolean(reducedMotion)} />}
        {status === 'ready' && products.length === 0 && <div className="product-coverflow__error"><p>New pieces are arriving soon.</p></div>}
      </div>
    </motion.section>
  );
}
