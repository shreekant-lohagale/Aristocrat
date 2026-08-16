'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CatalogProduct } from '@/types/commerce';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';
import { isSpecialCollection, normalizeCollectionHandle } from '@/lib/catalog/collections';

const pageSize = 8;
const sortOptions = [
  ['featured', 'Featured'],
  ['newest', 'Newest'],
  ['price-low', 'Price: Low to high'],
  ['price-high', 'Price: High to low'],
  ['best-selling', 'Best selling'],
  ['highest-rated', 'Highest rated'],
] as const;

type CatalogGridProps = {
  collection?: string;
  limit?: number;
  variant?: 'default' | 'new-arrivals';
};

export function CatalogGrid({ collection, limit = pageSize, variant = 'default' }: CatalogGridProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const values = {
    category: searchParams.get('category') ?? '',
    price: searchParams.get('price') ?? '',
    size: searchParams.get('size') ?? '',
    color: searchParams.get('color') ?? '',
    availability: searchParams.get('availability') ?? '',
    sort: searchParams.get('sort') ?? 'featured',
    page: Number(searchParams.get('page') ?? 1),
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadCatalog = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/catalog', { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load this collection.');
        setProducts(await response.json() as CatalogProduct[]);
      } catch (catalogError) {
        if (controller.signal.aborted) return;
        setError(catalogError instanceof Error ? catalogError.message : 'Unable to load this collection.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadCatalog();
    return () => controller.abort();
  }, [requestKey]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [drawerOpen]);

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    if (key !== 'page') params.delete('page');
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const clear = () => router.replace(pathname, { scroll: false });
  const categories = [...new Set(products.map((product) => product.category))];
  const colors = [...new Set(products.flatMap((product) => product.colors))];
  const sizes = [...new Set(products.flatMap((product) => product.sizes))];

  const filtered = useMemo(() => {
    const collectionHandle = collection ? normalizeCollectionHandle(collection) : '';
    let list = collection && !isSpecialCollection(collection)
      ? products.filter((product) => normalizeCollectionHandle(product.category) === collectionHandle)
      : collectionHandle === 'best-sellers'
        ? products.filter((product) => product.isBestSeller)
        : collectionHandle === 'sale'
          ? products.filter((product) => product.compareAtPrice > product.price)
          : products;

    if (values.category) list = list.filter((product) => normalizeCollectionHandle(product.category) === normalizeCollectionHandle(values.category));
    if (values.size) list = list.filter((product) => product.sizes.includes(values.size));
    if (values.color) list = list.filter((product) => product.colors.includes(values.color));
    if (values.availability) list = list.filter((product) => values.availability === 'in-stock' ? product.inStock : !product.inStock);
    if (values.price) {
      const [min, max] = values.price.split('-').map(Number);
      list = list.filter((product) => product.price >= min && (!max || product.price <= max));
    }

    return [...list].sort((a, b) => {
      if (values.sort === 'price-low') return a.price - b.price;
      if (values.sort === 'price-high') return b.price - a.price;
      if (values.sort === 'highest-rated') return b.rating - a.rating || b.reviewCount - a.reviewCount;
      if (values.sort === 'best-selling') return Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating;
      if (values.sort === 'newest') return Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id);
      return Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating;
    });
  }, [collection, products, values.availability, values.category, values.color, values.price, values.size, values.sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const currentPage = Math.min(values.page, totalPages);
  const visible = filtered.slice((currentPage - 1) * limit, currentPage * limit);
  const activeFilterCount = [values.category, values.price, values.size, values.color, values.availability].filter(Boolean).length;
  const hasFilters = Boolean(activeFilterCount || values.sort !== 'featured');
  const groupProps = { values, categories, colors, sizes, update };

  if (loading) {
    return <section className={`catalog ${variant === 'new-arrivals' ? 'catalog--new-arrivals' : ''}`} aria-busy="true"><ProductGridSkeleton count={limit} /></section>;
  }

  if (error) {
    return <section className="catalog"><div className="catalog-load-error" role="alert"><p>{error} Please try again.</p><button className="button" type="button" onClick={() => setRequestKey((key) => key + 1)}>Retry</button></div></section>;
  }

  return (
    <section className={`catalog ${variant === 'new-arrivals' ? 'catalog--new-arrivals' : ''}`}>
      <div className="catalog-toolbar">
        <span>{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</span>
        <button className="catalog-filter-trigger" type="button" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal size={15} aria-hidden="true" /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
        </button>
        <div className="sort-control">
          <label>
            <span>Sort by:</span>
            <select suppressHydrationWarning value={values.sort} onChange={(event) => update('sort', event.target.value)}>
              {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="filter-sidebar" aria-label="Product filters">
          <FilterPanel {...groupProps} hasFilters={hasFilters} clear={clear} />
        </aside>
        <CatalogResults currentPage={currentPage} clear={clear} filtered={filtered.length} totalPages={totalPages} update={update} visible={visible} />
      </div>

      {drawerOpen && (
        <div className="mobile-filter-sheet" role="dialog" aria-modal="true" aria-label="Filters">
          <button className="mobile-filter-sheet__scrim" aria-label="Close filters" onClick={() => setDrawerOpen(false)} />
          <div className="mobile-filter-sheet__panel" data-lenis-prevent>
            <header>
              <div><p>Refine the edit</p><h3>Filters</h3></div>
              <button type="button" aria-label="Close filters" onClick={() => setDrawerOpen(false)}><X size={20} /></button>
            </header>
            <div className="mobile-filter-sheet__content">
              <FilterPanel {...groupProps} hasFilters={hasFilters} clear={clear} mobile />
            </div>
            <footer>
              <button type="button" className="mobile-filter-sheet__clear" onClick={clear} disabled={!hasFilters}>Clear all</button>
              <button type="button" className="mobile-filter-sheet__apply" onClick={() => setDrawerOpen(false)}>View {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}

function CatalogResults({ visible, filtered, totalPages, currentPage, update, clear }: { visible: CatalogProduct[]; filtered: number; totalPages: number; currentPage: number; update: (key: string, value: string) => void; clear: () => void }) {
  return (
    <div className="catalog-results">
      <div className="catalog-grid">{visible.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div>
      {visible.length === 0 && <div className="empty-results"><p>No pieces match your selection.</p><button className="button" onClick={clear}>Clear filters</button></div>}
      {filtered > 0 && totalPages > 1 && <div className="pagination">{Array.from({ length: totalPages }, (_, index) => <button key={index} className={currentPage === index + 1 ? 'active' : ''} onClick={() => update('page', String(index + 1))}>{index + 1}</button>)}</div>}
    </div>
  );
}

function FilterPanel({ values, categories, colors, sizes, update, hasFilters, clear, mobile = false }: { values: { category: string; price: string; size: string; color: string; availability: string }; categories: string[]; colors: string[]; sizes: string[]; update: (key: string, value: string) => void; hasFilters: boolean; clear: () => void; mobile?: boolean }) {
  return <>
    <div className="filter-heading"><b>Filters</b>{hasFilters && <button type="button" onClick={clear}>Clear all</button>}</div>
    <Filter label="Category" value={values.category} options={categories} onChange={(value) => update('category', value)} defaultOpen={!mobile} />
    <Filter label="Price" value={values.price} options={[['0-5000', 'Under ₹5,000'], ['5000-7000', '₹5,000 – ₹7,000'], ['7000-0', '₹7,000+']]} onChange={(value) => update('price', value)} defaultOpen={!mobile} />
    <Filter label="Size" value={values.size} options={sizes} onChange={(value) => update('size', value)} defaultOpen={!mobile} />
    <Filter label="Colour" value={values.color} options={colors} onChange={(value) => update('color', value)} defaultOpen={!mobile} />
    <Filter label="Availability" value={values.availability} options={[['in-stock', 'In stock'], ['out-of-stock', 'Out of stock']]} onChange={(value) => update('availability', value)} defaultOpen={!mobile} />
  </>;
}

function Filter({ label, value, options, onChange, defaultOpen }: { label: string; value: string; options: (string | readonly [string, string])[]; onChange: (value: string) => void; defaultOpen: boolean }) {
  return <details className="filter-group" open={defaultOpen || undefined}>
    <summary>{label}</summary>
    <div>{options.map((option) => {
      const [optionValue, optionLabel] = Array.isArray(option) ? option : [option, option];
      return <label key={optionValue}><input type="radio" name={label} checked={value === optionValue} onChange={() => onChange(value === optionValue ? '' : optionValue)} />{optionLabel}</label>;
    })}</div>
  </details>;
}






