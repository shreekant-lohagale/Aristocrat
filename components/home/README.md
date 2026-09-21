# Homepage components

[Back to the project README](../../README.md) · [Component overview](../README.md)

The current homepage is assembled in `app/(shop)/page.tsx`. Its order is intentional:

1. `Navbar` and announcement bar
2. `Hero`
3. `CinematicIntro` — “Dressing, Reimagined”
4. `EditorialCategories`
5. `CinematicCollections`
6. `CampaignBanner` — “Modern Heritage”
7. `FeaturedProducts` — Shopify New Arrivals
8. `MaisonStory`
9. `HomepageAccountCta`
10. `Footer`

## Section ownership

| Component | Content source | Purpose |
| --- | --- | --- |
| `Hero` | Official logo and `new images/WhatsApp Image 2026-08-31 at 11.09.10 PM.jpeg` | Full-viewport campaign visual, Everyday Elegance headline and collection CTA |
| `CinematicIntro` | Two local Chaniya Choli campaign photographs | Dressing, Reimagined editorial statement |
| `EditorialCategories` | `lib/catalog/categories.ts` | Campaign-driven category navigation |
| `CinematicCollections` | Local story configuration/images | Three desktop sticky collection stories |
| `CampaignBanner` | Local campaign image | Full-width Modern Heritage promotion |
| `FeaturedProducts` | `/api/catalog`, Shopify `new-arrivals` | Up to eight products in `ProductCoverflow`, with loading/error/empty states |
| `MaisonStory` | Local campaign image/copy | Editorial brand story and `/about` CTA |
| `HomepageAccountCta` | `StoreProvider.customerAuthenticated` | Minimal sign-in/account entry point |

Only `FeaturedProducts` is directly Shopify-product-driven. Editorial category labels/routes are centralized in `lib/catalog/categories.ts`, while campaign story configuration currently lives in `CinematicCollections.tsx`. The three desktop story chapters share one progress treatment; mobile uses native stacked sections. `ProductCoverflow` is in `components/product/` and handles pointer, touch and keyboard selection with reduced-motion support.

## Motion and responsive behavior

Homepage sections use shared `fadeUp`, `imageReveal`, stagger and viewport-once variants. Every component checks `useReducedMotion`.

Desktop cinematic stories use a tall scroll area and sticky full-viewport composition. At 1023px and below, or with reduced motion, they become ordinary image-then-copy sections with no sticky/pinned behavior. Global Lenis is also disabled at 1023px and below, on coarse pointers and with reduced motion.

Do not add mobile scrub/parallax, continuous scale, expensive blur animation, or another scroll loop. Preserve ordinary document flow on touch devices.

## Image and crop rules

- Hero image: the local campaign JPEG named above; it is the prioritized LCP visual. Do not replace it during routine catalogue work.
- Keep campaign subjects identifiable and faces/heads visible on mobile.
- Use `next/image`, stable positioned/aspect-ratio wrappers, intentional `object-position`, and accurate `sizes`.
- Non-critical sections should remain lazy-loaded by default.
- Avoid reusing one campaign image in multiple homepage sections unless the art direction explicitly requires it.
- Do not promote pending product assets as commerce records; homepage campaign use does not create Shopify product data.

## Dormant components

`Categories.tsx`, `SeasonEdit.tsx`, and `EditorialCollectionGrid.tsx` are not imported by the current homepage. They represent older compositions and should not be documented as current sections or edited without first deciding whether to remove/reactivate them. `SeasonEdit` includes the removed “The New Season” content.

## Safe changes

- Preserve section order unless the product/design owner explicitly changes the editorial flow.
- Add categories through the shared editorial registry only when both a valid collection and image exist.
- Keep the hero and first viewport free of layout shifts.
- Check every CTA route before publishing; `/about` and the other support/legal destinations now exist.
- Test at desktop, tablet, 430/390/375/360px, reduced motion, slow images, and Shopify outage states.

The homepage design and section order are frozen at their current 9/10 state. Change them only for a confirmed bug or explicit client request. Preserve the hero image, centered wordmark, palette and editorial chapter concepts.
