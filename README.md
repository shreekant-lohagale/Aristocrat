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

The navbar account icon opens the branded `/account` dashboard. Secure actions from that dashboard, together with `/account/login`, `/account/orders`, `/account/addresses`, and `/account/profile`, resolve to the configured Shopify-hosted destination. Shopify then opens the account for an existing session or requests sign-in when needed. Do not guess or hardcode the URL.

The Storefront API remains separate and continues to power products, cart, and hosted checkout. `/account/wishlist` remains a local storefront feature.

Because Customer Account API access is unavailable on the current Shopify plan, the custom Next.js dashboard does not display authenticated customer state, names, orders, addresses, or profiles. It renders the existing device-local wishlist and delegates private account data and session actions to Shopify. When Customer Account API access becomes available, those sections can be progressively enhanced without replacing Shopify authentication.
