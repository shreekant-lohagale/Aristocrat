const storefrontApiVersion = '2026-07';

const storeDomain = () => process.env.SHOPIFY_STORE_DOMAIN?.trim() || process.env.VTBSJMYH_SHOPIFY_STORE_DOMAIN?.trim();
const storefrontToken = () => process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() || process.env.VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

export function hasShopifyStorefrontConfig() {
  return Boolean(storeDomain() && storefrontToken());
}

export function getShopifyStoreDomain() {
  const configuredDomain = storeDomain();
  return configuredDomain ? configuredDomain.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
}

export function hasDevelopmentCatalogFallback() {
  return process.env.NODE_ENV !== 'production' && process.env.ENABLE_LOCAL_CATALOG_FALLBACK === 'true';
}

export function getShopifyConfig() {
  const configuredDomain = storeDomain();
  const storefrontAccessToken = storefrontToken();
  if (!configuredDomain || !storefrontAccessToken) throw new Error('Shopify Storefront is not configured: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  const domain = configuredDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return {
    storefrontAccessToken,
    endpoint: `https://${domain}/api/${storefrontApiVersion}/graphql.json`,
  };
}

export { storefrontApiVersion };
