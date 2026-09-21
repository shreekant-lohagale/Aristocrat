import { cache } from 'react';
import { hasShopifyStorefrontConfig } from './config';
import { shopifyFetch } from './shopify';

export type PublishedShopPolicy = { title: string; body: string; url: string };

type ShopInformation = {
  contactInformation: PublishedShopPolicy | null;
  privacyPolicy: PublishedShopPolicy | null;
  refundPolicy: PublishedShopPolicy | null;
  shippingPolicy: PublishedShopPolicy | null;
  termsOfService: PublishedShopPolicy | null;
  termsOfSale: PublishedShopPolicy | null;
};

const SHOP_INFORMATION_QUERY = `query HouseShopInformation {
  shop {
    contactInformation { title body url }
    privacyPolicy { title body url }
    refundPolicy { title body url }
    shippingPolicy { title body url }
    termsOfService { title body url }
    termsOfSale { title body url }
  }
}`;

export const getPublishedShopInformation = cache(async (): Promise<ShopInformation | null> => {
  if (!hasShopifyStorefrontConfig()) return null;
  try {
    const result = await shopifyFetch<{ shop: ShopInformation }>(SHOP_INFORMATION_QUERY);
    return result.shop;
  } catch (error) {
    console.error('Published Shopify shop information is unavailable.', error);
    return null;
  }
});

export function publishedPolicyText(body: string): string {
  return body
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(?:p|div|li|h[1-6]|tr)>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);|&#(?:x[0-9a-f]+|\d+);/gi, (entity) => {
      const named: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ', '&#39;': "'" };
      const normalized = entity.toLowerCase();
      if (named[normalized]) return named[normalized];
      const codePoint = normalized.startsWith('&#x') ? Number.parseInt(normalized.slice(3, -1), 16) : Number.parseInt(normalized.slice(2, -1), 10);
      return Number.isFinite(codePoint) && codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function publishedPolicyUrl(url: string): string | null {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' ? parsed.toString() : null; } catch { return null; }
}
