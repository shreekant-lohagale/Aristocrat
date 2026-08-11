export type CurrencyCode = 'INR' | 'USD' | 'CAD' | 'GBP' | 'AUD';
export type Country = { code: string; name: string; flag: string; currency: CurrencyCode; symbol: string; rate: number };
export type CatalogProduct = { id: string; handle: string; title: string; category: string; image: string; images: string[]; price: number; compareAtPrice: number; rating: number; reviewCount: number; colors: string[]; sizes: string[]; fabric: string; inStock: boolean; isNew: boolean; isBestSeller: boolean; shopifyVariantId?: string; shopifyAvailableForSale?: boolean; shopifyVariantCount?: number };
export type CartLine = { product: CatalogProduct; quantity: number; size?: string; color?: string };

