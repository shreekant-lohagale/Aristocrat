import type { CatalogProduct, Country } from '@/types/commerce';
import { hasDevelopmentCatalogFallback, hasShopifyStorefrontConfig } from '@/lib/shopify/config';
import { shopifyFetch } from '@/lib/shopify/shopify';
import { COLLECTION_BY_HANDLE_QUERY, PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY, SEARCH_PRODUCTS_QUERY } from '@/lib/shopify/queries';
import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify/types';
import { mapShopifyProductToStoreProduct } from '@/lib/shopify/mapper';
import { getFallbackCatalog } from './fallback-products';
import { collectionNames, normalizeCollectionHandle } from './collections';

type CountryCode = Country['code'];
type ProductsResponse = { products: { nodes: ShopifyProduct[] } };
type ProductResponse = { product: ShopifyProduct | null };
type CollectionResponse = { collection: ShopifyCollection | null };
export const activeCollections = collectionNames;

function safeCountry(country: string): CountryCode { return ['IN', 'US', 'CA', 'GB', 'AU'].includes(country) ? country as CountryCode : 'IN'; }
function mapProducts(products: ShopifyProduct[]) { return products.map(mapShopifyProductToStoreProduct); }
function requireCatalogSource() { if (!hasDevelopmentCatalogFallback()) throw new Error('Shopify Storefront is not configured. Local catalog fallback is disabled.'); }
function productSort(sort = 'featured') { if (sort === 'price-low') return { sortKey: 'PRICE', reverse: false }; if (sort === 'price-high') return { sortKey: 'PRICE', reverse: true }; if (sort === 'best-selling') return { sortKey: 'BEST_SELLING', reverse: false }; if (sort === 'alphabetical') return { sortKey: 'TITLE', reverse: false }; return { sortKey: 'CREATED_AT', reverse: true }; }
function collectionSort(sort = 'featured') { if (sort === 'price-low') return { sortKey: 'PRICE', reverse: false }; if (sort === 'price-high') return { sortKey: 'PRICE', reverse: true }; if (sort === 'newest') return { sortKey: 'CREATED', reverse: true }; if (sort === 'best-selling') return { sortKey: 'BEST_SELLING', reverse: false }; if (sort === 'alphabetical') return { sortKey: 'ALPHA_ASC', reverse: false }; return { sortKey: 'COLLECTION_DEFAULT', reverse: false }; }

export async function getCatalog(country = 'IN', sort = 'featured'): Promise<CatalogProduct[]> {
  if (!hasShopifyStorefrontConfig()) { requireCatalogSource(); return getFallbackCatalog(); }
  const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, { country: safeCountry(country), first: 100, ...productSort(sort) }, { cache: 'no-store' });
  return mapProducts(data.products.nodes);
}

export async function getCollectionProducts(handle: string, country = 'IN', sort = 'featured'): Promise<CatalogProduct[]> {
  const normalized = normalizeCollectionHandle(handle);
  if (!hasShopifyStorefrontConfig()) { requireCatalogSource(); return (await getFallbackCatalog()).filter((product) => product.collectionHandles.includes(normalized)); }
  const data = await shopifyFetch<CollectionResponse>(COLLECTION_BY_HANDLE_QUERY, { country: safeCountry(country), handle: normalized, first: 100, ...collectionSort(sort) }, { cache: 'no-store' });
  if (data.collection) return mapProducts(data.collection.products.nodes);
  console.warn('Shopify collection is not published to the Storefront channel.', { handle: normalized });
  return [];
}

export async function getCollectionDetails(handle: string, country = 'IN') {
  if (!hasShopifyStorefrontConfig()) return null;
  const normalized = normalizeCollectionHandle(handle);
  const data = await shopifyFetch<CollectionResponse>(COLLECTION_BY_HANDLE_QUERY, { country: safeCountry(country), handle: normalized, first: 1, ...collectionSort() }, { cache: 'no-store' });
  return data.collection ? { handle: data.collection.handle, title: data.collection.title, description: data.collection.description } : null;
}

export async function searchCatalog(query: string, country = 'IN'): Promise<CatalogProduct[]> {
  const term = query.trim();
  if (!term) return getCatalog(country);
  if (!hasShopifyStorefrontConfig()) { requireCatalogSource(); const lowered = term.toLowerCase(); return (await getFallbackCatalog()).filter((product) => `${product.title} ${product.category} ${product.colors.join(' ')}`.toLowerCase().includes(lowered)); }
  const data = await shopifyFetch<ProductsResponse>(SEARCH_PRODUCTS_QUERY, { country: safeCountry(country), first: 48, query: term }, { cache: 'no-store' });
  return mapProducts(data.products.nodes);
}

export async function getProduct(handle: string, country = 'IN') {
  if (!hasShopifyStorefrontConfig()) { requireCatalogSource(); return (await getFallbackCatalog()).find((product) => product.handle === handle); }
  const data = await shopifyFetch<ProductResponse>(PRODUCT_BY_HANDLE_QUERY, { country: safeCountry(country), handle }, { cache: 'no-store' });
  return data.product ? mapShopifyProductToStoreProduct(data.product) : undefined;
}
