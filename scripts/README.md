# Developer scripts

[Back to the project README](../README.md) · [Unpublished intake](../catalog-intake/README.md) · [Shopify layer](../lib/shopify/README.md)

Scripts are local diagnostics and validation. None creates, updates or publishes Shopify products.

| Script | Command | What it checks |
| --- | --- | --- |
| `validate-product-intake.mjs` | `node scripts/validate-product-intake.mjs` | Exactly 27 CSV/image mappings, source price/quantity/comments, Product 28 blocked status, twelve blocked model images, and readiness gates |
| `validate-product-intake.test.mjs` | `node --test scripts/validate-product-intake.test.mjs` | Intake remains blocked for Products 1, 4, 13, 27 and Product 28; complete-field readiness example |
| `test-shopify-connection.mjs` | `npm run test:shopify` | Server-side Storefront connection and a small product fetch |
| `audit-shopify-catalog.mjs` | `npm run audit:shopify` | Up to 100 Shopify products/collections, options, variants and expected legacy titles |

The Shopify scripts load .env.local through the package scripts and fail if the store domain or Storefront token is missing. They contact the configured Shopify store and can print product catalogue details. Run them only against the intended environment; do not paste their output if it contains private merchant information. The audit's expected title list is a diagnostic reference to earlier products, not the new Product 1–27 intake or a publication manifest.

The intake validator exits nonzero for missing files, mismatched CSV rows/images, changed source notes/quantity, invalid currency, or a record marked ready without required commercial fields and client approval. It reads the original CSV without modifying it. The Node test runner spawns a worker process, which may require permission in a restricted shell.

To extend intake validation, keep source assertions separate from client-approved fields. Do not add a Shopify Admin write operation or treat passing validation as permission to publish.
