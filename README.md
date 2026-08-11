# House of Aristocrat

## Google sign-in

Authentication uses Auth.js with Google OAuth. Copy `.env.example` to `.env.local` and provide private credentials. Never commit `.env.local`.

In Google Cloud Console, configure the OAuth client as a **Web application**:

- Development JavaScript origin: `http://localhost:3000`
- Development redirect URI: `http://localhost:3000/api/auth/callback/google`
- Production JavaScript origin: `https://<your-vercel-domain>`
- Production redirect URI: `https://<your-vercel-domain>/api/auth/callback/google`

Replace `<your-vercel-domain>` with the actual deployed domain before launch. Auth.js protects `/account`, `/account/orders`, and `/account/addresses`; Shopify customer-account linking remains a future integration.

## Shopify Storefront connection

The Storefront client reads only `VTBSJMYH_SHOPIFY_STORE_DOMAIN` and `VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN` on the server. They are provided by the Vercel Shopify integration in Preview and Production; they are not exposed to the browser.

For local development, after linking the Vercel project, pull Development environment variables with:

```bash
vercel env pull .env.local --environment=development
npm run test:shopify
```

The test prints only the connected shop name and the number of fetched products. Do not commit `.env.local`.
