# House of Aristocrat

## Shopify hosted Customer Accounts

This storefront uses Shopify’s hosted Customer Accounts for customer sign-in, Google, Shop, email verification, profile management, orders, addresses, and logout. The account icon leads to the branded `/account/login` page, whose CTA navigates to the Shopify-hosted account URL.

Set this non-secret Vercel variable from **Shopify Admin → Settings → Customer accounts → URL**:

```bash
SHOPIFY_CUSTOMER_ACCOUNT_URL=https://your-shopify-hosted-customer-account-url
```

Do not guess or hardcode this URL. The Storefront API configuration remains separate and continues to power products, cart, and hosted checkout.

When the store can use Shopify’s Headless sales channel, this project can later add a custom Customer Account API experience inside Next.js. Until then, `/account`, `/account/orders`, `/account/addresses`, and `/account/profile` redirect to Shopify-hosted Customer Accounts. `/account/wishlist` remains a local storefront feature.

After hosted account sign-in is verified, old Auth.js Vercel variables (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`) can be removed manually. Do not remove them automatically.
