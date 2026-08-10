# House of Aristocrat

## Google sign-in

Authentication uses Auth.js with Google OAuth. Copy `.env.example` to `.env.local` and provide private credentials. Never commit `.env.local`.

In Google Cloud Console, configure the OAuth client as a **Web application**:

- Development JavaScript origin: `http://localhost:3000`
- Development redirect URI: `http://localhost:3000/api/auth/callback/google`
- Production JavaScript origin: `https://<your-vercel-domain>`
- Production redirect URI: `https://<your-vercel-domain>/api/auth/callback/google`

Replace `<your-vercel-domain>` with the actual deployed domain before launch. Auth.js protects `/account`, `/account/orders`, and `/account/addresses`; Shopify customer-account linking remains a future integration.
