# House of Aristocrat

## Shopify catalog source

Shopify is the catalog source in production. Configure `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in both local development and Vercel Production. The legacy `VTBSJMYH_SHOPIFY_STORE_DOMAIN` and `VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN` names remain supported; do not define both naming schemes with different values.

Local fallback products are disabled by default so missing credentials cannot make localhost appear healthier than production. For an explicit local UI preview only, set `ENABLE_LOCAL_CATALOG_FALLBACK=true`. Production ignores that switch.

Collection routes use Shopify collection membership by canonical handle. Product types and tags do not implicitly place products in collections. `new-arrivals` uses its Shopify collection when published; until that collection exists, it intentionally shows the newest Shopify products rather than local data.

## Shopify hosted Customer Accounts

Shopify owns customer identity, including email verification, Google, Shop login, profile data, orders, addresses, and logout. The storefront does not keep an authentication state or attempt to determine whether a Shopify customer is signed in.

Set this non-secret Vercel variable from **Shopify Admin → Settings → Customer accounts → URL**:

```bash
SHOPIFY_CUSTOMER_ACCOUNT_URL=https://your-shopify-hosted-customer-account-url
```

The navbar account icon and `/account`, `/account/login`, `/account/orders`, `/account/addresses`, and `/account/profile` resolve to this same hosted destination. Shopify then opens the profile for an existing session or requests sign-in when needed. Do not guess or hardcode the URL.

The Storefront API remains separate and continues to power products, cart, and hosted checkout. `/account/wishlist` remains a local storefront feature.

Because Customer Account API access is unavailable on the current Shopify plan, the custom Next.js storefront cannot display authenticated customer state, names, orders, addresses, or profiles. When the Headless sales channel becomes available, a future integration can add those experiences without emulating a login state now.
