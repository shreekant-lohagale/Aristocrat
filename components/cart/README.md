# Cart and checkout components

[Back to the project README](../../README.md) · [Component overview](../README.md) · [Shopify integration](../../lib/shopify/README.md)

This folder owns the browser cart presentation and the client action that hands cart lines to the server-side Shopify checkout boundary.

## Files

| File | Responsibility |
| --- | --- |
| `CartDrawer.tsx` | Navbar-triggered side drawer, line quantities/removal, subtotal and checkout |
| `CartSummary.tsx` | Full `/cart` page content using the same `StoreProvider` cart |
| `CheckoutButton.tsx` | Normalizes cart/Buy Now lines, submits checkout API request, handles timeout/loading/error, redirects |

## Cart ownership

The active cart lives in `StoreProvider` and persists in `mahera-cart`. A line ID includes product, variant, size, and colour so distinct option combinations do not collapse into one line. The provider exposes add, increment/decrement, remove, count, and subtotal behavior.

The browser cart is not the Shopify cart of record. When checkout starts, `CheckoutButton` converts each line into `CheckoutLineInput` and POSTs it with the selected country to `/api/shopify/checkout`. The server creates or reconciles a Shopify cart and returns Shopify's `checkoutUrl`.

Buy Now passes one selected variant with mode `buy-now`; the server creates a separate cart. The reusable animated button itself lives in `components/ui/BuyNowButton.tsx`.

## Interaction and error behavior

- Checkout is disabled when any line lacks a Shopify variant ID.
- Requests time out client-side after 15 seconds.
- Pending state uses `InlineLoader`; errors remain visible with `role="alert"`.
- The drawer uses Framer Motion, an interactive scrim, `data-lenis-prevent`, and preserves the underlying page until closed.
- Empty cart views link to collections.

## Safe changes

- Treat variant IDs, not product handles or titles, as Shopify merchandise identities.
- Never submit prices from the browser as authoritative.
- Keep checkout route errors generic and credentials server-side.
- Preserve quantity/variant semantics in both the drawer and full cart page.
- Test persistence, selected market, unavailable items, repeated checkout, stale Shopify cart cookies, Buy Now, mobile scrolling, keyboard focus, and Shopify redirect.

## Limitations

- The local cart is not customer-bound, cross-device, or explicitly multi-tab synchronized.
- Discounts, gift cards, shipping, taxes, and payment are resolved in Shopify-hosted checkout rather than the storefront UI.
- A cart is synchronized with Shopify at checkout time, not after every browser cart edit.

