import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { editorialCategories } from '@/lib/catalog/categories';
import { getCatalog } from '@/lib/catalog/products';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;
const storeCategoryHandles = new Set(['kurtis', 'dresses', 'indo-western', 'chaniya-choli']);

export const metadata: Metadata = {
  title: 'The Store',
  description: 'Enter the House of Aristocrat store and discover elevated kurtis, dresses, Indo-Western pieces and Chaniya Choli collections.',
  alternates: { canonical: '/store' },
  openGraph: { url: '/store', title: 'The Store | House of Aristocrat' },
};

export default async function StorePage() {
  const categories = editorialCategories.filter((category) => storeCategoryHandles.has(category.handle));
  let products = [] as Awaited<ReturnType<typeof getCatalog>>;

  try {
    products = await getCatalog();
  } catch {
    // Category entry points remain available during a temporary Shopify outage.
  }

  const featured = [...products]
    .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller))
    .slice(0, 4);

  return <>
    <Navbar solid />
    <main className="store-page">
      <section className="store-hero">
        <p>Enter the House</p>
        <h1>The Store</h1>
        <span>Curated expressions of modern Indian dressing—considered silhouettes, confident colour and craftsmanship made for now.</span>
        <Link href="/collections">Explore all collections <b aria-hidden="true">→</b></Link>
      </section>

      <section className="store-categories" aria-labelledby="store-categories-title">
        <header><p>Shop the edit</p><h2 id="store-categories-title">Discover by <i>Collection</i></h2></header>
        <div>
          {categories.map((category) => <Link href={category.href} key={category.handle} className="store-category">
            <Image src={asset(category.image)} alt={`${category.title} collection`} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectPosition: category.imagePosition }} />
            <span><small>{category.eyebrow}</small><strong>{category.title}</strong><em>Explore collection →</em></span>
          </Link>)}
        </div>
      </section>

      {featured.length > 0 && <section className="store-products" aria-labelledby="store-products-title">
        <header><p>Selected by the House</p><h2 id="store-products-title">The Curated Edit</h2></header>
        <div className="store-products__grid">{featured.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div>
      </section>}
    </main>
    <Footer />
  </>;
}
