import { getShopifyConfig } from './config';

type ShopifyGraphQLError = { message: string };
type ShopifyResponse<T> = { data?: T; errors?: ShopifyGraphQLError[] };

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}, options: { cache?: RequestCache } = {}): Promise<T> {
  const { endpoint, storefrontAccessToken } = getShopifyConfig();
  const operation = query.match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/)?.[1] ?? 'AnonymousOperation';
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': storefrontAccessToken },
      body: JSON.stringify({ query, variables }),
      cache: options.cache ?? 'no-store',
    });
  } catch {
    throw new Error(`Shopify Storefront network request failed: ${operation}.`);
  }

  if (!response.ok) throw new Error(`Shopify Storefront request failed: ${operation}; status=${response.status}.`);
  const payload = await response.json() as ShopifyResponse<T>;
  if (payload.errors?.length) throw new Error(`Shopify Storefront GraphQL request failed: ${operation}; errors=${payload.errors.map((error) => error.message).join('; ')}`);
  if (!payload.data) throw new Error(`Shopify Storefront returned no data: ${operation}.`);
  return payload.data;
}
