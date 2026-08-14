export const collectionDefinitions = [
  { handle: 'new-arrivals', name: 'New Arrivals' },
  { handle: 'kurtis', name: 'Kurtis' },
  { handle: 'dresses', name: 'Dresses' },
  { handle: 'indo-western', name: 'Indo-Western' },
  { handle: 'chaniya-choli', name: 'Chaniya Choli' },
  { handle: 'jewellery', name: 'Jewellery' },
  { handle: 'best-sellers', name: 'Best Sellers' },
  { handle: 'sale', name: 'Sale' },
] as const;

export type CollectionHandle = (typeof collectionDefinitions)[number]['handle'];

export const collectionNames = collectionDefinitions.map((collection) => collection.name);

export function normalizeCollectionHandle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCollectionByHandle(value: string) {
  const handle = normalizeCollectionHandle(value);
  return collectionDefinitions.find((collection) => collection.handle === handle);
}

export function isSpecialCollection(value: string) {
  const handle = normalizeCollectionHandle(value);
  return handle === 'new-arrivals' || handle === 'best-sellers' || handle === 'sale';
}

