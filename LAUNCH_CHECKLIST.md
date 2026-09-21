# House of Aristocrat — Shopify launch checklist

This is a release gate, not evidence that Shopify Admin settings or live transactions have been verified. Check an item only after the named owner verifies it in the production store. The homepage is frozen; keep subsequent changes limited to confirmed bugs or approved launch configuration.

**Severity:** CRITICAL blocks safe selling or publishing; HIGH blocks the approved launch experience; MEDIUM should be resolved or explicitly accepted before launch; LOW is useful follow-up. The severity assumes the listed catalogue and Canada, USA, and India are in launch scope. If the client narrows scope, record that decision before changing a gate.

## A. Development complete — repository implementation

- [x] Homepage and responsive mobile navigation implemented; homepage frozen.
- [x] Collection, product, search, wishlist, cart, and customer account routes implemented with loading, empty, or error handling where applicable.
- [x] About, Contact, Shipping & Returns, Size Guide, Track Order, Privacy, and Terms routes implemented. Published Shopify content and client details still need live verification.
- [x] SEO metadata, canonical rules, sitemap, robots, favicon/app icons, and Open Graph/Twitter image routes implemented and locally checked.
- [x] Product 1–27 intake, Product 28 candidate, and 12 Chaniya Choli image candidates prepared without publication.
- [x] Developer documentation and this release checklist present.
- [x] Local lint and production build pass for this audit. This does not certify live Shopify behavior.

## B. Client confirmation required

| Severity | Confirmation needed | Status |
| --- | --- | --- |
| CRITICAL | Confirm price currency and final selling price for each Product 1–27; the source `$` does not establish CAD or USD. | Pending |
| CRITICAL | Confirm launch product sizes, required variants, exact included items, and stock/quantity before publication. | Pending |
| HIGH | Approve final titles, categories, colours, material/fabric, descriptions, and product images for Product 1–27. | Pending |
| HIGH | Resolve Product 1 `Opening Dis` note: whether a discount exists and its approved amount. | Pending |
| HIGH | Decide whether Product 28 launches; its image alone is not a product record. | Pending |
| HIGH | Supply and approve commercial records for the 12 Chaniya Choli image candidates if they launch. | Pending |
| HIGH | Supply a Jewellery launch catalogue or explicitly exclude Jewellery from launch scope. | Pending |
| HIGH | Approve a final apparel size chart. | Pending |
| CRITICAL | Confirm shipping charges for every launch market and the corresponding delivery expectations. | Pending |
| HIGH | Confirm final production domain and storefront approval. | Pending |

Use [catalog-intake/README.md](catalog-intake/README.md) and `client-completion.csv` for the exact intake fields. Do not infer answers from imagery or source notes.

## C. Shopify Admin required

None of these settings is verified from this repository.

| Severity | Admin gate | Status |
| --- | --- | --- |
| CRITICAL | Activate Shopify Payments or the approved payment provider; complete merchant verification if requested. | Unverified |
| CRITICAL | Confirm base/store currency, then verify Shopify Markets and localized prices for Canada, USA, and India. | Unverified |
| CRITICAL | Configure shipping profiles, zones, and rates for each approved launch market. | Unverified |
| CRITICAL | Publish approved products with correct variants, inventory, prices, images, and Headless sales-channel availability. | Pending client data and Admin work |
| HIGH | Publish approved shipping, refund, privacy, and terms policies; verify Storefront API visibility. | Unverified |
| HIGH | Configure and verify support/contact details and order notifications. | Unverified |
| HIGH | Connect the approved domain and DNS; verify SSL and intended redirects. | Pending domain decision |
| HIGH | Configure Customer Account application with the exact production JavaScript origin, callback URI, and logout URI. | Unverified |
| HIGH | Define and expose the customer wishlist metafield required by the account integration. | Unverified |
| CRITICAL | Verify checkout settings, payment methods, taxes, and duties against client/business requirements. | Unverified |

## D. Production acceptance testing

Use live production-like Shopify credentials and approved test products. Record market, device, expected result, actual result, and evidence for each run. **Do not place a real paid order without explicit instruction.** Use a Shopify-supported test method for the payment check.

1. [ ] Homepage live catalogue data and links.
2. [ ] Collection loading, including empty/error states.
3. [ ] Product loading, images, and approved details.
4. [ ] Canada, USA, and India market/currency and price display against Shopify checkout.
5. [ ] Variant selection, unavailable options, and required sizes.
6. [ ] Add to Cart.
7. [ ] Cart quantity changes and persistence after reload.
8. [ ] Remove from cart.
9. [ ] Buy Now.
10. [ ] Normal `checkoutUrl` handoff.
11. [ ] Login.
12. [ ] OAuth callback.
13. [ ] Logout and customer isolation.
14. [ ] Account overview.
15. [ ] Hosted orders.
16. [ ] Hosted addresses.
17. [ ] Anonymous wishlist.
18. [ ] Wishlist merge after login.
19. [ ] Authenticated wishlist save and reload.
20. [ ] Cross-device wishlist persistence.
21. [ ] Published Shopify policies.
22. [ ] Approved contact data.
23. [ ] Catalogue URLs in sitemap.
24. [ ] Product canonical and metadata.
25. [ ] Shopify-derived Product JSON-LD.
26. [ ] Checkout on mobile.
27. [ ] Successful checkout and payment using a Shopify-supported test method; inspect the resulting order and notification.

## E. Launch-day checks

- [ ] Production environment variables are set in Vercel; no secret is exposed to the client bundle.
- [ ] No development/fallback catalogue is visible and no unapproved product, dummy text, or test content is published.
- [ ] Final domain, SSL, redirects, Customer Account redirect URIs, and checkout domain work.
- [ ] Canonical origin in `lib/seo/site.ts` is updated; redeploy, regenerate sitemap, and inspect robots.
- [ ] Branded OG/Twitter images and PNG icons resolve on the final domain.
- [ ] Payment provider, shipping rates, taxes, and market/currency settings match approved configuration.
- [ ] Policies, size chart, and support details are visible and approved.
- [ ] Shopify-supported test checkout passes on desktop and mobile; remove test products/orders where appropriate under merchant policy.
- [ ] Analytics works if configured; record if analytics is intentionally deferred.
- [ ] Final mobile smoke test: navigation, search, product selection, cart, account, wishlist, and checkout.

## F. Post-launch checks

- [ ] Verify the first real order, payment capture, order notification, fulfilment handoff, and shipping confirmation.
- [ ] Verify account order visibility and authenticated wishlist persistence after real use.
- [ ] Review 404s, server/client error logs, Web Vitals, and mobile usability.
- [ ] Review abandoned checkout behavior if Shopify handles it for the merchant.
- [ ] Train the client on approved product, discount, and order workflows.

## Current release decision

**Not ready to launch.** The repository builds, but product commercial data, currency, shipping, payments, Admin configuration, final domain, and live acceptance tests remain open. Complete the critical gates before accepting orders; obtain client sign-off on high-severity catalogue and content gates before publication. A local build and fallback catalogue cannot verify Shopify Payments, Markets, checkout, customer accounts, or cross-device wishlist behavior.
