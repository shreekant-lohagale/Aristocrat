export type EditorialCategory = {
  id: string;
  title: string;
  handle: string;
  href: string;
  image: string;
  eyebrow: string;
  description: string;
  imagePosition?: string;
  featured?: boolean;
  comingSoon?: boolean;
};

/**
 * Homepage category content is intentionally separate from product/catalog data.
 * Add a new category here when its Shopify collection and campaign asset are ready.
 */
export const editorialCategories: readonly EditorialCategory[] = [
  { id: 'kurtis', title: 'Kurtis', handle: 'kurtis', href: '/collections/kurtis', image: '06_turquoise_ruffled_kurta.png', eyebrow: 'The everyday edit', description: 'Modern silhouettes, made for every rhythm of the day.', imagePosition: 'center 20%', featured: true },
  { id: 'dresses', title: 'Dresses', handle: 'dresses', href: '/collections/dresses', image: '09_black_maxi_high_res.png', eyebrow: 'After hours', description: 'Effortless pieces with a distinctly elevated point of view.', imagePosition: 'center 10%' },
  { id: 'indo-western', title: 'Indo-Western', handle: 'indo-western', href: '/collections/indo-western', image: 'Brand Hero Pic.png', eyebrow: 'A modern perspective', description: 'Indian design language reinterpreted through contemporary tailoring.', imagePosition: 'center 8%', featured: true },
  { id: 'chaniya-choli', title: 'Chaniya Choli', handle: 'chaniya-choli', href: '/collections/chaniya-choli', image: 'new images/WhatsApp Image 2026-08-31 at 11.09.10 PM (1).jpeg', eyebrow: 'Celebration dressing', description: 'Vibrant occasionwear with a refined, modern sensibility.', imagePosition: 'center 18%' },
  {
    id: 'jewellery', title: 'Jewellery', handle: 'jewellery', href: '/collections/jewellery',
    // A dedicated jewellery campaign asset is not available yet; use the House
    // motif rather than presenting an unrelated garment as jewellery.
    image: 'flower.png', eyebrow: 'The finishing touch', description: 'Considered accents to complete a personal point of view.', imagePosition: 'center center', comingSoon: true
  },
];
