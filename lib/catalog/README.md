# Catalog domain

[Back to the project README](../../README.md) · [Shared domain logic](../README.md) · [Shopify layer](../shopify/README.md)

This folder defines the storefront's canonical collections and adapts Shopify retrieval to the shared commerce model.

## File map

| File | Responsibility |
| --- | --- |
| `products.ts` | Catalog, collection, search, product retrieval and sort/country policy |
| `collections.ts` | Canonical definitions and handle normalization |
| `categories.ts` | Homepage/store editorial category content and local campaign assets |
| `image.ts` | Converts remote/local image identifiers into renderable URLs |
| `wishlist.ts` | Product identifier aliases and wishlist matching |
| `fallback-products.ts` | Explicit development-only preview catalog sourced from `files/` |
| `pending-product-assets.ts` | Unpublished image intake awaiting authoritative commerce data |

## Canonical collections

The current registry contains `new-arrivals`, `kurtis`, `dresses`, `indo-western`, `chaniya-choli`, `jewellery`, `best-sellers`, and `sale`. `normalizeCollectionHandle` trims, lowercases, translates `&` to `and`, and collapses other separators to hyphens.

Use this helper for route handles, mapped Shopify membership, filter comparison, and wishlist/product links. Do not introduce a one-off normalization rule for one collection.

The visible collection header navigation intentionally shows a subset; the full registry also supplies route validation and the sitemap. Homepage editorial categories are separately curated in `categories.ts` because campaign content is not Shopify product data.

## Data flow

```text
server page or /api/catalog
  -> products.ts
  -> Storefront query with validated country and sort
  -> mapper.ts
  -> CatalogProduct[] / CatalogProduct
  -> client feature component
```

When Storefront configuration is absent, production throws. Development may use `fallback-products.ts` only when `ENABLE_LOCAL_CATALOG_FALLBACK=true`. Missing `new-arrivals` falls back to the newest general Shopify catalog; another missing collection produces `ShopifyCollectionNotFoundError`.

## Search, filtering, sorting and pagination

- Shopify performs collection membership and the initial requested sort.
- Search sends a Shopify product query and returns at most 48 products.
- `CatalogGrid` holds filter selections in URL query parameters.
- Category, price, size, colour, and availability filters run in the browser over fetched results.
- Client pagination slices the filtered list into 12 items by default.
- Price options are computed from the maximum price in the fetched result set.

This means result counts, facets, and pages are limited to the first 100 Shopify products. Implement Storefront cursor pagination and Shopify/server-side filters before scaling the catalog.

## Variants and product values

The Shopify mapper, not this folder, creates the final `CatalogProduct`. Products include options/variants, selected/default variant data, images, localized currency, collection handles, availability, category, tags, and custom detail metafields. Production price, stock, title, colour, and category must come from Shopify.

Fallback products are marked `source: 'fallback'`, have no purchasable variants, and are out of stock. Do not make them purchasable or deploy them as production data.

## Adding a collection

1. Create/publish the Shopify collection and assign products.
2. Add its normalized handle/display name to `collectionDefinitions` only when the storefront should expose it.
3. If it needs homepage promotion and a dedicated image exists, add an editorial category separately.
4. Update intentional navbar/header/footer surfaces and collection descriptions.
5. Test the direct route, sitemap, search, filters, related-product behavior, empty state, and mobile navigation.

Never create an empty navigation item merely because a future Shopify collection is planned.

## Image intake

`pending-product-assets.ts` records client-supplied photography without inventing commerce data. Do not turn an entry into a fallback/Shopify record until product identity, title, price, compare-at price, sizes, stock, SKU, colour, fabric, and description are authoritative. If an asset may replace an existing product image, confirm it depicts the same garment first.

