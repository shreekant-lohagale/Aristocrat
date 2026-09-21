# Layout components

[Back to the project README](../../README.md) · [Component overview](../README.md)

This folder contains the announcement bar, full-width storefront navbar, country selector, mobile navigation, cart-drawer trigger, and footer.

## Navbar

`Navbar.tsx` is a client component because it owns scroll/hover/menu/drawer state and consumes global cart, wishlist, market, and customer status.

Current structure:

- Announcement bar above the header
- Left: mobile menu trigger, search, country selector
- Right: mobile search, wishlist/count, account state/action, cart/count
- Mobile: full-screen menu with logo, market selector, collection/account/wishlist links, and search

The navbar is transparent over compatible hero content and becomes solid from explicit `solid`, hover, menu-open, or scroll state. The scroll threshold is 88px. Product and store pages pass `solid`; collection pages intentionally do not render the navbar or announcement bar.

Account navigation depends on `customerAuthenticated`: logged-out users go to `/account/auth/login`, authenticated/unknown users go to `/account`. This status is derived by `StoreProvider` through the protected wishlist endpoint.

When changing menu behavior, preserve Escape closing, body-overflow restoration, dialog semantics, focus trapping/restoration through `useModalFocus`, minimum touch targets, visible focus treatment, and reduced motion.

## Country selector

`CountrySelector.tsx` reads the active market from `StoreProvider`. The menu closes on outside pointer press or Escape and exposes menu/radio semantics. Selecting a country persists its code and causes catalog/cart price refreshes.

Supported markets are defined centrally in `StoreProvider`; catalog and checkout server allowlists must be updated in the same change when adding one. Shopify determines real market pricing.

## Announcement bar

`AnnouncementBar.tsx` duplicates three messages to create the marquee track. Reduced-motion CSS stops the animation and presents only the first message. Update offers carefully; displayed promotions must match merchant configuration.

## Footer

`Footer.tsx` renders the official logo, client-care and House links, Privacy/Terms links, and a newsletter area with Framer Motion entrance. There are no invented social URLs. All listed internal destinations have routes. The footer checks `GET /api/newsletter`; when `NEWSLETTER_SUBSCRIBE_WEBHOOK_URL` is absent, it says email updates are coming soon. When configured, the form posts to the route and displays success/error feedback. The endpoint validates the address with Zod and optionally authenticates to the provider with `NEWSLETTER_SUBSCRIBE_TOKEN`. Do not claim a live newsletter subscription until the provider is configured and tested.

## Safe extension points

- Keep global cart/account/wishlist state in `StoreProvider`, not duplicated inside the navbar.
- Add navigation only for live destinations and test desktop/mobile layouts.
- Avoid embedding customer identity or tokens in header markup.
- Ensure dropdowns are not clipped by header overflow and open within the viewport.
- Verify transparent and solid color contrast over every page that renders the navbar.
