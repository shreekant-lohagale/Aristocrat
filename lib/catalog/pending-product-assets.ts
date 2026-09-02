/**
 * Product photography intake awaiting client-supplied commerce data.
 *
 * These assets are intentionally excluded from the public catalog. A photo must
 * not become a Shopify/fallback product until its authoritative product fields
 * have been supplied and, where relevant, its identity has been confirmed.
 */

export const PENDING_PRODUCT_FIELDS = [
  'productName',
  'price',
  'compareAtPrice',
  'sizes',
  'stock',
  'sku',
  'color',
  'fabric',
  'description',
] as const;

export type PendingProductAssetStatus =
  | 'awaiting-product-data'
  | 'awaiting-existing-product-confirmation';

export type PendingProductAsset = {
  file: string;
  category: 'Chaniya Choli';
  visualReference: string;
  status: PendingProductAssetStatus;
  possibleExistingProductHandle?: string;
  reviewNote?: string;
};

export const PENDING_PRODUCT_ASSETS = [
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.09 PM.jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Grey lehenga, red blouse, and mustard/yellow dupatta',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.10 PM (1).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Multicolor lehenga, teal blouse, and mustard dupatta',
    status: 'awaiting-existing-product-confirmation',
    possibleExistingProductHandle: 'multicolor-chaniya-choli-set',
    reviewNote:
      'Do not replace the current Product..png without client confirmation; the blouse embroidery and skirt panel treatment are visibly different.',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.10 PM (2).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Teal/blue lehenga, teal blouse, and red dupatta',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.10 PM (3).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Light grey/white lehenga, red blouse, and red dupatta',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.10 PM.jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Grey/blue printed lehenga, blue blouse, and pink/mustard dupatta',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.11 PM (1).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Navy blue lehenga',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.11 PM (2).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Black lehenga with multicolor embroidered accents',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.11 PM.jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Charcoal/grey printed lehenga',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.12 PM (1).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Black lehenga with maroon/red blouse and dupatta',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.12 PM (2).jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Magenta/pink lehenga, multicolor blouse, and white dupatta',
    status: 'awaiting-product-data',
  },
  {
    file: 'new images/WhatsApp Image 2026-08-31 at 11.09.12 PM.jpeg',
    category: 'Chaniya Choli',
    visualReference: 'Black/cream patterned lehenga, black blouse, and red dupatta',
    status: 'awaiting-product-data',
  },
] as const satisfies readonly PendingProductAsset[];
