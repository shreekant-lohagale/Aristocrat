import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { cache } from 'react';
import type { CatalogProduct } from '@/types/commerce';

const root = join(process.cwd(), 'files', 'women fashion');
const categories = ['Sarees', 'Suits', 'Kurtis', 'Dresses', 'Lehengas', 'Indo-Western', 'Co-ord Sets', 'Jewellery', 'Bags'];
const names: Record<string, string[]> = {
  Sarees: ['Banarasi Silk Saree', 'Handwoven Ikat Saree', 'Pichwai Printed Saree', 'Festive Bandhani Saree'],
  Suits: ['Embroidered Anarkali Suit', 'Velvet Occasion Suit', 'Mirrorwork Salwar Set'],
  Kurtis: ['Cotton Embroidered Kurti', 'Floral Straight Kurti', 'Festive A-line Kurta'],
  Dresses: ['Celeste Evening Dress', 'Satin Occasion Dress', 'Embellished Party Dress'],
  Lehengas: ['Zari Embroidered Lehenga', 'Rose Garden Lehenga Set', 'Silk Celebration Lehenga'],
  'Indo-Western': ['Drape Detail Indo-Western Set', 'Contemporary Cape Set', 'Modern Festive Gown'],
  'Co-ord Sets': ['Tailored Co-ord Set', 'Printed Resort Co-ord', 'Embroidered Two Piece Set'],
  Jewellery: ['Kundan Statement Set', 'Pearl Drop Earrings', 'Polki Celebration Set'],
  Bags: ['Embroidered Potli Bag', 'Crystal Evening Clutch', 'Mini Occasion Bag'],
};

async function files(directory: string): Promise<string[]> { const entries = await readdir(directory, { withFileTypes: true }); const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : /\.(jpe?g|png|webp)$/i.test(entry.name) ? [join(directory, entry.name)] : [])); return nested.flat(); }
function categoryFor(path: string, index: number) { const source = path.toLowerCase(); if (source.includes('saree') || source.includes('banarasi') || source.includes('ikat') || source.includes('bandhani') || source.includes('pichwai')) return 'Sarees'; if (source.includes('suit') || source.includes('anarkali') || source.includes('salwar')) return 'Suits'; if (source.includes('kurta')) return 'Kurtis'; if (source.includes('lehenga')) return 'Lehengas'; if (source.includes('bag') || source.includes('clutch')) return 'Bags'; return categories[index % categories.length]; }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export const getCatalog = cache(async (): Promise<CatalogProduct[]> => {
  const imageFiles = await files(root);
  return imageFiles.map((file, index) => { const category = categoryFor(file, index); const variants = names[category] ?? names.Dresses; const title = variants[index % variants.length]; const price = 3900 + ((index * 1375) % 19800); const discount = index % 3 === 0 ? 0.24 : index % 5 === 0 ? 0.16 : 0.1; const relativePath = relative(join(process.cwd(), 'files'), file).replaceAll('\\', '/'); return { id: `mahera-${index + 1}`, handle: `${slug(title)}-${index + 1}`, title, category, image: relativePath, images: [relativePath], price, compareAtPrice: Math.round(price / (1 - discount)), rating: 4.3 + ((index % 7) / 10), reviewCount: 12 + ((index * 11) % 180), colors: ['Ivory', 'Rose', 'Midnight'], sizes: ['XS', 'S', 'M', 'L', 'XL'], fabric: category === 'Sarees' ? 'Silk blend' : 'Premium artisan textile', inStock: index % 13 !== 0, isNew: index % 4 === 0, isBestSeller: index % 5 === 0 }; });
});
export const getProduct = cache(async (handle: string) => (await getCatalog()).find((product) => product.handle === handle));
