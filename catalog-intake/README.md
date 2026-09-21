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

`client-completion.csv` has one row per Product 1–27, prefilled only with source identity, image path, and known quantity. The client/developer must supply the final product name, category, confirmed currency, regular price, optional approved sale price, size, quantity confirmation, colour, material/fabric, description, exact included items, image approval, any additional approved images, optional SKU, and explicit publish decision. Do not copy values from the development fallback catalog or infer them from photographs. Leave unknown fields blank until confirmed.

The original CSV is retained unchanged. The 27 price amounts have been transcribed into `sourcePriceAmount`, with row numbers, raw price strings, names, comments, and deal notes for traceability. The `$` symbol is insufficient to fill `priceCurrency`. Reconcile any discrepancy with the client before setting a record ready. The blank `regularPrice` field is for the client-confirmed selling price and must not silently inherit a source amount without currency and approval.

To prepare a future import, review the completed template against the source records, update the intake JSON with approved fields, and run `node scripts/validate-product-intake.mjs` and `node --test scripts/validate-product-intake.test.mjs`. The validator checks numbered image mappings and requires a final title, category, three-letter currency, positive regular price, size, nonnegative integer quantity, approved image, exact included items, and explicit publish approval before `publicationStatus` can be `ready`. Material and description remain editorial fields for client completion; the script does not interpret them as permission to publish. A `ready` marker is only a local review state; there is deliberately no Shopify import or publish command.
