# App Router

[Back to the project README](../README.md)

This folder owns route composition, server rendering, loading/error boundaries, route handlers, and SEO metadata. The `(shop)` route group organizes storefront routes without changing public URLs.

## Boundaries

- `layout.tsx` is a server component. It defines global metadata, loads `globals.css`, and wraps the application in the client-side `SmoothScrollProvider` and `StoreProvider`.
- Page files remain server components unless they require browser state. Interactive behavior is delegated to client components under `components/`.
- Route handlers hold Storefront API, checkout, OAuth, Customer Account API, and filesystem boundaries. Never move customer tokens or the Storefront token into client components.
- `loading.tsx` files provide route-level loaders/skeletons. Client data fetchers provide their own retry and empty states.

## Routes

| Route | Purpose | Rendering style | Important dependencies |
| --- | --- | --- | --- |
| `/` | Editorial homepage | Server page composed from client/server feature components | `components/home`, `Navbar`, `Footer` |
| `/store` | Curated store landing page | Async server page with graceful catalog outage handling | `getCatalog`, editorial categories |
| `/collections` | All-products collection view | Server shell + client catalog | `CollectionHeader`, `CatalogGrid` |
| `/collections/[handle]` | Canonical Shopify collection | Async server metadata/header + client catalog/filtering | Collection normalization, Shopify collection query |
| `/products/[handle]` | Product detail page | Async server product/related fetch + client PDP | `getProduct`, `getCollectionProducts`, `ProductDetails` |
| `/search` | Product search | Server shell + debounced client search | `/api/catalog`, `SearchExperience` |
| `/cart` | Persisted local cart | Server shell + client cart summary | `StoreProvider`, `CheckoutButton` |
| `/checkout` | Resume a server-side Shopify cart | Server redirect | `getShopifyCart` |
| `/wishlist` | Standalone wishlist | Server shell + client catalog/wishlist reconciliation | `WishlistGrid`, `/api/catalog` |
| `/account` | Custom customer overview | Async server page | Customer Account API, account components |
| `/account/login` | Account entry/fallback | Server redirect or fallback UI | Customer API config, hosted account URL |
| `/account/orders` | Hosted order management handoff | Server redirect | `SHOPIFY_CUSTOMER_ACCOUNT_URL` |
| `/account/addresses` | Hosted address management handoff | Server redirect | `SHOPIFY_CUSTOMER_ACCOUNT_URL` |
| `/account/profile` | Hosted profile management handoff | Server redirect | `SHOPIFY_CUSTOMER_ACCOUNT_URL` |
| `/account/wishlist` | Branded full wishlist inside account shell | Async server shell + client wishlist | Customer state, `WishlistPreview` |
| `/api/catalog` | Product, collection and search JSON boundary | Dynamic route handler; no-store | `lib/catalog/products.ts` |
| `/api/shopify/checkout` | Creates/reconciles Shopify carts | POST route handler | `lib/shopify/cart.ts` |
| `/account/api/wishlist` | Authenticated wishlist GET/PUT | Force-dynamic private route handler | HttpOnly customer token, `custom.wishlist` |
| `/account/auth/login` | Starts OAuth/PKCE | GET redirect handler | Shopify OpenID discovery |
| `/account/auth/callback` | Validates OAuth response and sets cookies | GET redirect handler | Token endpoint, state/verifier cookies |
| `/account/auth/logout` | Clears cookies and ends Shopify session | GET redirect handler | ID token, end-session endpoint |
| `/api/assets` | Safely serves nested assets under `files/` | Filesystem route handler | Path containment and extension allowlist |
| `/api/images/[name]` | Serves flat WebP assets | Filesystem route handler | Basename sanitization |
| `/sitemap.xml` | Static/collection/product sitemap | Metadata route | Catalog with outage fallback |
| `/robots.txt` | Crawler rules | Metadata route | Hard-coded production sitemap URL |
| `/opengraph-image` | Generated social card | Image metadata route | `ImageResponse` |
| `/twitter-image` | Generated X/Twitter card | Image metadata route | `ImageResponse` |

Collection pages intentionally do not render the main navbar or announcement bar. Product, store, homepage, and account layout paths render navigation through their own page/layout composition.

## Dynamic route behavior

- Collection handles pass through `normalizeCollectionHandle`; known definitions and live Shopify details determine whether the route exists.
- Product pages use `notFound()` when Shopify has no matching handle and derive their back/related collection from non-special collection membership.
- Product and collection pages generate route-specific metadata on the server.
- Catalog and Customer Account data uses `no-store`; OpenID discovery is revalidated hourly.

## Loading and errors

- Root `loading.tsx` uses the full-screen brand loader.
- Collection/search loading renders product-grid skeletons.
- Product loading renders the product-detail skeleton.
- Root `error.tsx` is a client reset boundary; `not-found.tsx` is the global 404.
- API routes return structured status codes and avoid leaking upstream credentials or raw customer information.

## Safe extension points

- Add a page under `(shop)` when it belongs to the storefront and does not need to change its URL.
- Keep data fetching in server pages or route handlers and interactive state in focused client components.
- Add `loading.tsx`, route metadata, and an explicit empty/error state for any data-backed route.
- Update `sitemap.ts`, `robots.ts`, navigation, and footer when adding/removing public routes.

Do not add secrets to route output, cache customer responses publicly, or widen asset-file access beyond `files/`.

