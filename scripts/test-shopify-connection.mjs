const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim() || process.env.VTBSJMYH_SHOPIFY_STORE_DOMAIN?.trim();
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() || process.env.VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
const apiVersion = '2026-07';

if (!domain || !token) {
  console.error('Shopify connection test skipped: Shopify Storefront environment variables are not available locally.');
  process.exitCode = 1;
} else {
  const endpoint = `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/${apiVersion}/graphql.json`;
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token }, body: JSON.stringify({ query: 'query ShopifyConnectionTest { shop { name } products(first: 5) { nodes { id title handle } } }' }) });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) throw new Error('Shopify Storefront connection failed.');
    console.log(`Shop connected: ${payload.data.shop.name}`);
    console.log(`Products fetched: ${payload.data.products.nodes.length}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Shopify Storefront connection failed.');
    process.exitCode = 1;
  }
}
