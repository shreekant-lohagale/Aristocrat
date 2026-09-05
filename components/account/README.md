# Account components

[Back to the project README](../../README.md) · [Component overview](../README.md) · [Shopify integration](../../lib/shopify/README.md)

This folder supplies the branded account shell and customer summary UI. Authentication and customer records remain owned by Shopify.

## Active architecture

| Component | Responsibility |
| --- | --- |
| `AccountShell` | Responsive account layout, explicit back navigation, page transition |
| `AccountSidebar` / `AccountMobileNav` | Identity, section links, hosted account links and session action |
| `AccountHeader` | Shared account page heading |
| `AccountSummaryCard(s)` | Orders/wishlist/addresses overview cards |
| `WishlistPreview` | Resolves saved identifiers against current catalog and supports add/remove |
| `EmptyState` | Shared account empty-state treatment |

`/account` is an async server page. It calls `getCustomerAccountState()` and passes only display data/status into client layout components. The client never receives Shopify Customer Account tokens.

Custom storefront surfaces are the overview and wishlist. Orders, addresses, and profile routes redirect to `SHOPIFY_CUSTOMER_ACCOUNT_URL` (or login fallback), where Shopify owns customer data and security.

## Authentication states

- **Authenticated:** show customer display name/email, order/address presence, account summaries, wishlist, and logout.
- **Unauthenticated:** show Shopify sign-in entry and local anonymous wishlist.
- **Unconfigured:** use the hosted account URL when present; otherwise show the service-unavailable note.
- **Error:** preserve private-data safety and offer the hosted secure account destination.

The account page attempts one silent OAuth check with `prompt=none` when configured and not already marked checked. The short-lived checked cookie prevents redirect loops.

## Wishlist behavior

`WishlistPreview` loads the catalog for the selected country, matches product aliases through `lib/catalog/wishlist.ts`, and reflects `StoreProvider` loading/error state. Authenticated persistence is handled by the Customer API metafield flow; anonymous persistence remains local.

## Dormant local editors

`AddressManager.tsx` and `ProfileForm.tsx` are not imported by active account routes. They store/edit device-local values and must not be described or wired as Shopify customer data. `ProfileForm` also contains legacy Google-account copy inconsistent with the current Shopify-only authentication architecture.

If custom address/profile/order management is implemented later, build it against supported Shopify Customer Account API mutations/queries and replace hosted redirects intentionally; do not activate the localStorage components as a shortcut.

## Loading, errors and extension rules

- Route-level `account/loading.tsx` provides branded account skeletons.
- Wishlist components expose loading, empty, sync-error, and retry states.
- Maintain a minimum 44px mobile target and visible focus states.
- Keep private API responses no-store and server-side.
- Test authenticated, expired, logged-out, unconfigured, Shopify-outage, and account-switching states after every account change.

