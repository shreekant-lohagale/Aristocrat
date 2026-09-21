# Unpublished product intake

This folder is developer-only preparation. It is not imported by the storefront, the development fallback catalog, or any Shopify write path. No file here creates products or inventory.

## Sources and status

| Group | Source mapping | Commercial status |
| --- | --- | --- |
| Product 1–27 | One row per number in `products-1-27.json`; each maps to `files/new images-2/Final Product/Product N.png` and a row in `files/new images-2/Book(Kurti and Dresses).csv` | Blocked. Source price amounts, quantity 1, and the notes below are mapped; currency, size, category, final title, and catalogue approval are unresolved. |
| Product 28 | `product-28-candidate.json` maps its PNG only | Image-only candidate; no CSV row or confirmed commercial fields. Never include it in a product import without a client record. |
| Chaniya Choli | `chaniya-choli-candidates.json` maps `Model 1.png` through `Model 12.png` | Twelve outfit candidates, not twelve confirmed products. No price, size, stock, variants, or other commercial data is supplied. |
| Jewellery | No intake records | Launch status: pending client catalogue. |

The source note `Opening Dis` belongs to Product 1 only; it does not establish a discount amount. `Full set` belongs to Products 4–12, but does not establish which items are included or whether bottoms are included. `No bottoms` belongs to Products 1–3 and 13–27. The source uses a `$` symbol without identifying CAD or USD. The intake preserves that symbol but leaves `priceCurrency` unresolved.

The `Final Product` PNGs are source image mappings, not approval to publish. WhatsApp photos under `Final Pictures` are reference material only. No WhatsApp photo is mapped as a customer-facing product image, and no relationship between those photos and Model 1–12 is asserted.

## Completing the intake

`client-completion.csv` has one row per Product 1–27, prefilled only with source identity, image path, source price amount, and known quantity. The client/developer must supply the final product name, category, confirmed currency, regular price, optional approved sale price, size, quantity confirmation, colour, material/fabric, description, exact included items, image approval, any additional approved images, optional SKU, and explicit publish decision. Do not copy values from the development fallback catalog or infer them from photographs. Leave unknown fields blank until confirmed.

The original CSV is retained unchanged. The 27 price amounts have been transcribed into `sourcePriceAmount`, with row numbers, raw price strings, names, comments, and deal notes for traceability. The `$` symbol is insufficient to fill `priceCurrency`. Reconcile any discrepancy with the client before setting a record ready. The blank `regularPrice` field is for the client-confirmed selling price and must not silently inherit a source amount without currency and approval.

To prepare a future import, review the completed template against the source records, update the intake JSON with approved fields, and run `node scripts/validate-product-intake.mjs` and `node --test scripts/validate-product-intake.test.mjs`. The validator checks numbered image mappings and requires a final title, category, three-letter currency, positive regular price, size, nonnegative integer quantity, approved image, exact included items, and explicit publish approval before `publicationStatus` can be `ready`. Material and description remain editorial fields for client completion; the script does not interpret them as permission to publish. A `ready` marker is only a local review state; there is deliberately no Shopify import or publish command.

## Later Shopify handoff

1. Obtain the client's completed fields and resolve every discrepancy with the unchanged source CSV. Confirm currency explicitly; `$` does not identify CAD or USD. Confirm Product 1's discount separately from its `Opening Dis` note and Products 4–12's exact set contents separately from `Full set`.
2. Record approved details in the intake and run the validator/tests. Keep Product 28, model images and Jewellery separate until each has its own authorized commercial record.
3. Through a separately approved Shopify merchant workflow, create draft products with real variant/size/stock data and approved images. This repository has no Admin API product-creation tool and stores no Admin credential.
4. Review draft prices, currency, market availability, copy, images, variants, inventory and collection membership with the client. Publish to the Headless sales channel only after explicit approval, then verify product, collection, search, cart and checkout behavior through the Storefront API.

Passing the local validator is a data-quality gate, not authorization to create inventory or publish. Do not map WhatsApp reference photos to customer-facing product images without specific image approval.
