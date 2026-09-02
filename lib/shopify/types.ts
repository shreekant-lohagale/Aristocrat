import type { CurrencyCode } from '@/types/commerce';
export type ShopifyMoney = { amount: string; currencyCode: CurrencyCode };
export type ShopifyImage = { url: string; altText: string | null; width?: number | null; height?: number | null };
export type ShopifyOption = { name: string; values: string[] };
export type ShopifyVariant = { id: string; title: string; sku: string | null; availableForSale: boolean; quantityAvailable?: number | null; selectedOptions: Array<{ name: string; value: string }>; price: ShopifyMoney; compareAtPrice: ShopifyMoney | null; image: ShopifyImage | null };
export type ShopifyMetafield = { value: string; type: string } | null;
export type ShopifyProduct = { id: string; handle: string; title: string; description: string; descriptionHtml: string; fabricAndFit: ShopifyMetafield; careInstructions: ShopifyMetafield; availableForSale: boolean; productType: string; tags: string[]; publishedAt: string | null; featuredImage: ShopifyImage | null; images: { nodes: ShopifyImage[] }; priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney }; compareAtPriceRange?: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney }; options: ShopifyOption[]; variants: { nodes: ShopifyVariant[] }; collections: { nodes: Array<{ handle: string; title: string }> } };
export type ShopifyCollection = { id: string; handle: string; title: string; description: string; descriptionHtml: string; products: { nodes: ShopifyProduct[] } };
