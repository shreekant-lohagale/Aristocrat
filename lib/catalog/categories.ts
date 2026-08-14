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
  { id: 'dresses', title: 'Dresses', handle: 'dresses', href: '/collections/dresses', image: 'Product.png', eyebrow: 'After hours', description: 'Effortless pieces with a distinctly elevated point of view.', imagePosition: 'center center' },
  { id: 'indo-western', title: 'Indo-Western', handle: 'indo-western', href: '/collections/indo-western', image: '08_blue_patchwork_high_res.png', eyebrow: 'A modern heritage', description: 'Indian craft reinterpreted through contemporary tailoring.', imagePosition: 'center 16%', featured: true },
  { id: 'chaniya-choli', title: 'Chaniya Choli', handle: 'chaniya-choli', href: '/collections/chaniya-choli', image: '04_red_green_stylish.png', eyebrow: 'Celebration dressing', description: 'Vibrant occasionwear with a refined, modern sensibility.', imagePosition: 'center top' },
  {
    id: 'jewellery', title: 'Jewellery', handle: 'jewellery', href: '/collections/jewellery',
    // TODO: Replace with dedicated Jewellery campaign asset when it is available.
    image: 'Product..png', eyebrow: 'The finishing touch', description: 'Considered accents to complete a personal point of view.', imagePosition: 'center center'
  },
];
