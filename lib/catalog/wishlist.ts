import type { CatalogProduct } from '@/types/commerce';

export function productWishlistAliases(product: CatalogProduct) {
  return [product.id, `fallback-${product.handle}`];
}

export function isProductWishlisted(wishlist: string[], product: CatalogProduct) {
  return [product.handle, ...productWishlistAliases(product)].some((key) => wishlist.includes(key));
}
