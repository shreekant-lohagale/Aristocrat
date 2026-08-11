const storefrontApiVersion = '2026-07';

function getRequiredEnvironment(name: 'VTBSJMYH_SHOPIFY_STORE_DOMAIN' | 'VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Shopify Storefront is not configured: missing ${name}.`);
  return value;
}

export function hasShopifyStorefrontConfig() {
  return Boolean(process.env.VTBSJMYH_SHOPIFY_STORE_DOMAIN?.trim() && process.env.VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim());
}

export function getShopifyConfig() {
  const domain = getRequiredEnvironment('VTBSJMYH_SHOPIFY_STORE_DOMAIN').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const storefrontAccessToken = getRequiredEnvironment('VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  return {
    storefrontAccessToken,
    endpoint: `https://${domain}/api/${storefrontApiVersion}/graphql.json`,
  };
}

export { storefrontApiVersion };
