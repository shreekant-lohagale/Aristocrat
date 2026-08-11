import { getShopifyConfig } from './config';

type ShopifyGraphQLError = { message: string };
type ShopifyResponse<T> = { data?: T; errors?: ShopifyGraphQLError[] };

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}, options: { cache?: RequestCache } = {}): Promise<T> {
  const { endpoint, storefrontAccessToken } = getShopifyConfig();
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': storefrontAccessToken },
      body: JSON.stringify({ query, variables }),
      cache: options.cache ?? 'no-store',
    });
  } catch {
    throw new Error('Shopify Storefront connection failed.');
  }

  if (!response.ok) throw new Error(`Shopify Storefront connection failed with status ${response.status}.`);
  const payload = await response.json() as ShopifyResponse<T>;
  if (payload.errors?.length) throw new Error(`Shopify Storefront request failed: ${payload.errors.map((error) => error.message).join('; ')}`);
  if (!payload.data) throw new Error('Shopify Storefront returned no data.');
  return payload.data;
}
