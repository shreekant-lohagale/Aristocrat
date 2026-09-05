# Components

[Back to the project README](../README.md)

Components are grouped by storefront feature. Shared state comes from `StoreProvider`; Shopify/network and filesystem boundaries remain in server pages or route handlers.

## Groups

| Folder | Responsibility |
| --- | --- |
| `home/` | Current homepage campaign/editorial composition |
| `collection/` | Collection heading, catalog loading, filters, sort, pagination |
| `product/` | Reusable product cards and interactive PDP |
| `cart/` | Cart drawer/page summary and checkout action |
| `account/` | Branded customer overview, navigation, wishlist preview |
| `layout/` | Announcement bar, navbar, market selector and footer |
| `ui/` | Buttons, loaders, image-loading wrapper and skeletons |
| `common/` | Small generic controls such as back/button wrappers |
| `providers/` | Global client behavior; currently desktop Lenis/GSAP integration |
| `search/` | Debounced catalog search experience |
| `wishlist/` | Standalone wishlist-to-catalog view |

Detailed guides: [home](home/README.md), [collections](collection/README.md), [products](product/README.md), [cart](cart/README.md), [account](account/README.md), [layout](layout/README.md), and [UI](ui/README.md).

## Server and client rules

- Components using state, effects, event handlers, browser APIs, `useStore`, Lenis, or Framer Motion hooks declare `'use client'`.
- Server pages should fetch authoritative data and pass serializable `CatalogProduct`/account shapes into clients.
- Client refetches use internal APIs (`/api/catalog`, `/api/shopify/checkout`, `/account/api/wishlist`), not server secrets.
- Keep `next/image` dimensions stable. A `fill` image requires a positioned wrapper with stable dimensions/aspect ratio.

## State ownership

- Global country, cart, wishlist and coarse customer-session status: `StoreProvider`.
- UI-only state such as drawers, selected variants, pagination controls and tabs: owning feature component.
- Authoritative product/collection/cart/customer/wishlist persistence: Shopify server APIs.
- Do not add a second global cart, auth or wishlist provider. `context/CartProvider.tsx` is dormant.

## Motion and responsive conventions

- Reuse `lib/motion.ts` variants and respect `useReducedMotion`.
- Use feature-scoped class names in `app/globals.css`; check later declarations because the stylesheet contains legacy override layers.
- CSS uses explicit mobile/tablet breakpoints rather than a Tailwind utility workflow.
- On mobile, prefer native scrolling, ordinary document flow, opacity, and small translate transitions.
- Drawers/dialogs must restore body overflow, close on Escape, expose dialog semantics, and use `data-lenis-prevent` where desktop Lenis could interfere.

## Creating or extending components

Reuse a UI primitive when interaction and semantics already match. Create a feature component when it owns domain-specific behavior or layout. Keep `CatalogProduct` mapping out of components and never introduce hard-coded production commerce records into JSX.

Known dormant components include older homepage sections (`Categories`, `SeasonEdit`, `EditorialCollectionGrid`), `collection/ProductGrid`, and local account editors. Confirm imports before editing them.

