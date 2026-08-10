import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CatalogGrid } from '@/components/collection/CatalogGrid';

export function FeaturedProducts() {
  return (
    <section className="product-section new-arrivals-section" aria-labelledby="new-arrivals-title">
      <div className="shell">
        <header className="new-arrivals-section__header">
          <div>
            <p className="new-arrivals-section__eyebrow">Just in</p>
            <h2 id="new-arrivals-title">New Arrivals</h2>
          </div>
          <Link className="new-arrivals-section__all" href="/collections/new-arrivals">Shop all <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></Link>
        </header>
        <CatalogGrid collection="New Arrivals" limit={8} variant="new-arrivals" />
      </div>
    </section>
  );
}
