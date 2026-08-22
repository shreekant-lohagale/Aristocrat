import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { CatalogProduct } from '@/types/commerce';

const root = join(process.cwd(), 'files');
const seeds = [
  ['01_black_sleeveless_maxi.png', 'Dresses', 'Black Sleeveless Maxi Dress', 'black-sleeveless-maxi-dress', 6990, 'Black'],
  ['02_black_printed_new_model.png', 'Chaniya Choli', 'Black Printed Lehenga Set', 'black-printed-lehenga-set', 7290, 'Black'],
  ['02_blue_patchwork_kurta.png', 'Kurtis', 'Blue Patchwork Kurta', 'blue-patchwork-kurta', 4490, 'Blue'],
  ['03_black_polka_red_new_model.png', 'Chaniya Choli', 'Black Polka Red Lehenga Set', 'black-polka-red-lehenga-set', 6490, 'Black / Red'],
  ['03_white_embroidered_kurta.png', 'Kurtis', 'White Embroidered Kurta', 'white-embroidered-kurta', 4290, 'White'],
  ['04_magenta_kurta_set.png', 'Kurtis', 'Magenta Kurta Set', 'magenta-kurta-set', 5990, 'Magenta'],
  ['04_red_green_stylish.png', 'Chaniya Choli', 'Red & Green Chaniya Choli', 'red-green-chaniya-choli', 8490, 'Red / Green'],
  ['05_slate_ruffled_kurta.png', 'Indo-Western', 'Slate Ruffled Kurta', 'slate-ruffled-kurta', 4790, 'Slate Grey'],
  ['06_turquoise_ruffled_kurta.png', 'Indo-Western', 'Turquoise Ruffled Kurta', 'turquoise-ruffled-kurta', 4890, 'Turquoise'],
  ['07_black_floral_kurta.png', 'Kurtis', 'Black Floral Kurta', 'black-floral-kurta', 4590, 'Black'],
  ['Product..png', 'Chaniya Choli', 'Multicolor Chaniya Choli Set', 'multicolor-chaniya-choli-set', 8990, 'Multicolor'],
  ['Product.png', 'Kurtis', 'Mustard Embroidered Kurta Set', 'mustard-embroidered-kurta-set', 6990, 'Mustard'],
] as const;

export async function getFallbackCatalog(): Promise<CatalogProduct[]> {
  const available = new Set(await readdir(root));
  return seeds.filter(([file]) => available.has(file)).map(([file, category, title, handle, price, color], index) => ({
    id: `fallback-${handle}`,
    handle,
    title,
    description: '',
    descriptionHtml: '',
    category,
    productType: category,
    tags: [],
    collectionHandles: [category.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 'new-arrivals'],
    image: file,
    images: [file],
    price,
    compareAtPrice: Math.round(price * 1.25),
    colors: [color],
    sizes: [],
    options: [],
    variants: [],
    inStock: false,
    isNew: true,
    isBestSeller: index < 4,
    source: 'fallback',
  }));
}
