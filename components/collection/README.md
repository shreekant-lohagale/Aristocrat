# Collection components

[Back to the project README](../../README.md) · [Component overview](../README.md) · [Catalog domain](../../lib/catalog/README.md)

This folder renders collection headings and the interactive catalog used by `/collections`, `/collections/[handle]`, and the homepage New Arrivals section.

## Active files

- `CollectionHeader.tsx`: breadcrumb, collection title/description, and curated collection navigation.
- `CatalogGrid.tsx`: country-aware catalog fetch, URL-backed filters/sort/page, loading/error/empty states, mobile filter drawer, and product grid.
- `ProductGrid.tsx`: legacy wrapper around `FeaturedProducts`; not used by current routes.

## Data and state flow

`CatalogGrid` is a client component. It reads market/price formatting from `StoreProvider` and fetches `/api/catalog` with normalized collection, country, and sort values. Product mapping and Shopify credentials remain server-side.

Filter state uses query parameters:

- `category`
- `price`
- `size`
- `color`
- `availability`
- `sort`
- `page`

Changing a non-page filter clears `page`; updates use `router.replace(..., { scroll: false })`. Filtering and 12-item pagination occur in memory after the API response. Shopify performs the initial requested sort, while client code additionally enforces price/newest/alphabetical order where implemented.

## UI behavior

- The toolbar shows filtered range/count and sort selection.
- Filters are built only from options present in the fetched products.
- The filter interface is a modal bottom sheet with Escape/body-scroll cleanup and reduced-motion support.
- Missing/unpublished Shopify collections have a distinct retryable error.
- Empty collections and filtered-empty results have different copy/actions.
- Jewellery currently has explicit coming-soon empty copy.
- `variant="new-arrivals"` applies homepage-specific presentation; `limit={8}` is used there.

## Safe extension points

- Add a filter only after the shared product model and Shopify mapping provide authoritative values.
- Keep URL parameters shareable and reset pagination when a facet changes.
- Reuse `CatalogProductCard` and existing skeleton/error patterns.
- For catalogs above 100 products, redesign the API around cursors/server facets rather than increasing only the client page count.

Do not fetch Shopify directly from this client component or compare raw collection labels without `normalizeCollectionHandle`.

