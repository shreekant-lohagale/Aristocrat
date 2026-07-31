import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types/product';
import Link from 'next/link';
const products: Product[] = [
  { handle: 'saanvi-embroidered-saree', title: 'Saanvi embroidered saree', subtitle: 'Hand-finished occasionwear', price: '18,900', image: 'Janvi-1.webp' },
  { handle: 'aarohi-anarkali-set', title: 'Aarohi anarkali set', subtitle: 'Hand-finished occasionwear', price: '16,500', image: 'Laskara10-09-2304491_1614ea9e-8103-44e5-9eea-2c0d2adf47d4.webp' },
  { handle: 'mira-silk-lehenga', title: 'Mira silk lehenga', subtitle: 'Hand-finished occasionwear', price: '24,800', image: 'LB5110_c4ae8630-9110-4a93-9c35-e883085521ab.webp' },
  { handle: 'zoya-embroidered-kurta', title: 'Zoya embroidered kurta', subtitle: 'Hand-finished occasionwear', price: '12,900', image: 'LB6492_491ec4a8-b995-4c92-a40b-3c64f11f9253.webp' },
];
export function FeaturedProducts() { return <section className="product-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Just in</p><h2>New arrivals</h2></div><Link className="button desktop-only" href="/collections">Shop all</Link></div><div className="product-grid">{products.map((product) => <ProductCard key={product.handle} product={product} />)}</div></div></section>; }
