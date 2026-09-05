# Storefront context

[Back to the project README](../README.md)

`StoreProvider.tsx` is the active global browser-state boundary. The root layout installs one instance around the entire application.

## Responsibilities

| State | Persistence/source | Notes |
| --- | --- | --- |
| Country/market | `mahera-country` localStorage key | Supports IN, US, CA, GB and AU |
| Cart | `mahera-cart` localStorage key | Variant/size/colour-aware browser cart |
| Anonymous wishlist | `hoa-anonymous-wishlist` | Migrates the legacy `mahera-wishlist` key |
| Authenticated wishlist | Shopify Customer metafield `custom.wishlist` | Read/written through `/account/api/wishlist` |
| Customer status | Response from wishlist API | `null`, authenticated, or unauthenticated; not a full customer record |

`StoreProvider` also exposes price formatting, cart totals, optimistic wishlist actions, and wishlist loading/error state.

## Initialization and data flow

On browser hydration it restores country and cart state. Saved cart lines are normalized to include variant and line identifiers. Once hydrated, a market change refetches each unique cart product through `/api/catalog` so current Shopify variant price and availability metadata replace stale saved data.

Wishlist initialization reads the anonymous list first, then probes the authenticated wishlist endpoint:

- `401`: remain anonymous and use localStorage.
- Authenticated: merge remote + anonymous values, deduplicate, persist the merge, and clear anonymous values.
- Network/API error: retain the local list visibly and expose an error state.

Authenticated writes are serialized through a promise queue. On failure, the provider attempts a remote recovery; it does not silently pretend a failed optimistic write succeeded.

## Synchronization

- `BroadcastChannel('hoa-wishlist')` announces authenticated changes to other tabs.
- The `hoa-wishlist-sync` storage key provides a storage-event fallback.
- Anonymous tabs listen to changes to `hoa-anonymous-wishlist`.
- Returning a tab to the foreground refreshes the customer wishlist.
- Cross-device synchronization occurs through the Shopify metafield, not browser messaging.

After logout/session loss, the provider changes to anonymous mode and reads the anonymous key. It does not write the previous customer's remote list into anonymous storage.

## Adding shared state safely

1. Confirm the state genuinely needs application-wide ownership.
2. Choose one authoritative source and document any local cache separately.
3. Keep the initial server/client markup deterministic to avoid hydration errors.
4. Validate and migrate persisted values; browser storage may contain stale schemas.
5. Memoize actions and provider values where practical.
6. Avoid adding frequently changing UI state to this context: every consumer can rerender when its value changes.
7. Add multi-tab behavior only when the feature requires it, and clean up all event/channel listeners.

## Warnings and limitations

- Cart and country do not currently synchronize across tabs; cart is not customer/cross-device state.
- Static rates are only used for non-Shopify fallback prices. Shopify currency amounts should not be converted again.
- `customerAuthenticated` is inferred through the wishlist endpoint and is not a replacement for server-side `getCustomerAccountState()`.
- `CartProvider.tsx` is an unused legacy count provider. Do not wire new code to it.
- Never read Customer Account token cookies in this client context; they must remain HttpOnly.

