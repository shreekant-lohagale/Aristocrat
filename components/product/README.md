# Product components

[Back to the project README](../../README.md) · [Component overview](../README.md) · [Catalog domain](../../lib/catalog/README.md)

This folder provides reusable product cards and the interactive product-detail experience.

## Product cards

`CatalogProductCard.tsx` renders:

- Primary/secondary images through `ImageWithLoader`
- Product metadata, localized price and compare-at/sale state
- Wishlist toggle using product identifier aliases
- Availability-aware quick add
- Navigation to product detail when option selection is required
- Reduced-motion-aware interaction animation

Quick add is valid only when the product has a purchasable Shopify variant that does not require unresolved options. Do not infer a variant from label text.

## Product detail page

The server route fetches the initial product and related collection products. `ProductDetails.tsx` then owns:

- Market-specific client refresh when the selected country changes
- Image gallery with stable responsive containers
- Required option selection and availability-aware value disabling
- Selected variant price, compare-at price, stock and quantity behavior
- Add to cart and Buy Now
- Wishlist state
- Product details, fabric/fit and care tabs when content exists
- Share/copy interaction
- Related-product refresh
- Size-guide modal and keyboard close behavior

Single-value colour is displayed without forcing an unnecessary chooser. A product is purchasable only when all required selections resolve to an available Shopify variant.

## Data flow

```text
products/[handle] server page -> getProduct/getCollectionProducts
    -> ProductDetails initial props
    -> selected market change -> /api/catalog?handle=...
    -> selected variant -> StoreProvider cart or CheckoutButton Buy Now
```

Product fields originate in Shopify queries and `mapper.ts`. Keep product content, prices, inventory and variant data out of local component constants.

## Images and performance

- The first PDP image is priority; subsequent images are not.
- `ImageWithLoader` supplies loading/error presentation.
- Each `fill` image must retain its wrapper aspect ratio and accurate `sizes`.
- Verify mobile crops preserve faces, headwear, hands, outfit detail and the intended garment view.

## Safe extension points

- Add a Shopify field by updating raw query/type, mapper, shared model, and UI together.
- Reuse existing option normalization and variant matching.
- Add tabs only when authoritative content exists; omit empty sections.
- Keep related products constrained to a real non-special collection and exclude the current product.
- Test zero/one/many variants, unavailable combinations, single-value options, missing images/metafields, multiple currencies, wishlist state, and both purchase actions.

There is no review/rating integration, recently viewed system, or structured product data in the current implementation.

