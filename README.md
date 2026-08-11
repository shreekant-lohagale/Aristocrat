# House of Aristocrat

## Shopify Customer Accounts

Customer identity is being migrated to Shopify Customer Accounts. Auth.js remains installed only as a temporary fallback until the Shopify production flow is verified.

Required **server-only** Vercel variables:

```bash
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET=
SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET=
SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL=https://house-of-aristocrat.vercel.app/api/customer-auth/callback
```

The implementation uses Shopify discovery on the configured shop domain by default. Optional endpoint overrides are supported only when Shopify provides them:

```bash
SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZATION_URL=
SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL=
SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL=
SHOPIFY_CUSTOMER_ACCOUNT_API_URL=
NEXT_PUBLIC_SITE_URL=https://house-of-aristocrat.vercel.app
```

In Shopify Admin, enable Customer Account API access for the Headless sales channel, configure the callback URL above, and allow the storefront production origin. Shopify manages email, Google, and Shop sign-in. Do not add a second Google OAuth callback to this application.

For local development, use an HTTPS tunnel (for example ngrok) and set `SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL` to its `/api/customer-auth/callback` URL. Plain `http://localhost` callbacks are not supported.

Do not remove `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, or `AUTH_SECRET` from Vercel until Shopify login, callback, account data, logout, and checkout have all been verified in production.

## Shopify Storefront connection

The Storefront client reads only `VTBSJMYH_SHOPIFY_STORE_DOMAIN` and `VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN` on the server. They are provided by the Vercel Shopify integration and are not exposed to the browser.
