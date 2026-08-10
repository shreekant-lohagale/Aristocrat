import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { cache } from 'react';
import type { CatalogProduct } from '@/types/commerce';

const root = join(process.cwd(), 'files');
const productSeed = [
  ['02_blue_patchwork_kurta.png', 'Kurtis', 'Blue Patchwork Kurta', 4490, 5990, 4.9, 'Cobalt', 'Cotton blend'],
  ['03_white_embroidered_kurta.png', 'Kurtis', 'White Embroidered Kurta', 4290, 5490, 4.8, 'Ivory', 'Cotton silk'],
  ['04_magenta_kurta_set.png', 'Kurtis', 'Magenta Kurta Set', 5990, 7590, 4.9, 'Magenta', 'Viscose silk'],
  ['05_slate_ruffled_kurta.png', 'Kurtis', 'Slate Ruffled Kurta', 4790, 6290, 4.7, 'Slate', 'Premium rayon'],
  ['06_turquoise_ruffled_kurta.png', 'Kurtis', 'Turquoise Ruffled Kurta', 4890, 6490, 4.8, 'Turquoise', 'Cotton blend'],
  ['07_black_floral_kurta.png', 'Kurtis', 'Black Floral Kurta', 4590, 5890, 4.7, 'Black', 'Printed viscose'],
  ['01_black_sleeveless_maxi.png', 'Dresses', 'Black Sleeveless Maxi', 6990, 8990, 4.9, 'Black', 'Satin crepe'],
  ['03_black_polka_red_new_model.png', 'Dresses', 'Black Polka Occasion Dress', 6490, 8290, 4.6, 'Black', 'Printed georgette'],
  ['09_black_maxi_high_res.png', 'Dresses', 'Black Maxi', 7490, 9490, 4.8, 'Black', 'Fluid satin'],
  ['04_red_green_stylish.png', 'Indo-Western', 'Red Green Stylish Set', 8490, 10990, 4.9, 'Red green', 'Embroidered silk blend'],
  ['02_black_printed_new_model.png', 'Indo-Western', 'Black Printed Indo-Western', 7290, 9290, 4.7, 'Black', 'Printed crepe'],
  ['08_blue_patchwork_high_res.png', 'Indo-Western', 'Blue Patchwork High Resolution', 7790, 9990, 4.8, 'Blue', 'Textured cotton'],
] as const;
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
export const activeCollections = ['New Arrivals', 'Kurtis', 'Dresses', 'Indo-Western', 'Best Sellers', 'Sale'] as const;
export const getCatalog = cache(async (): Promise<CatalogProduct[]> => { const available = new Set(await readdir(root)); return productSeed.filter(([file]) => available.has(file)).map(([file, category, title, price, compareAtPrice, rating, color, fabric], index) => ({ id: `aristocrat-${index + 1}`, handle: `${slug(title)}-${index + 1}`, title, category, image: file, images: [file], price, compareAtPrice, rating, reviewCount: 24 + index * 13, colors: [color, 'Ivory', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], fabric, inStock: true, isNew: true, isBestSeller: rating >= 4.8 })); });
export const getProduct = cache(async (handle: string) => (await getCatalog()).find((product) => product.handle === handle));