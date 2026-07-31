const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? '2025-01';

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

/** Server-only Storefront API client. Keep Admin API calls in server actions. */
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain || !token) throw new Error('Shopify Storefront API is not configured. Add credentials to .env.local.');
  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`Shopify request failed: ${response.status}`);
  const payload = (await response.json()) as GraphQLResponse<T>;
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join(', '));
  if (!payload.data) throw new Error('Shopify returned an empty response.');
  return payload.data;
}

export const productQuery = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) { id handle title descriptionHtml availableForSale featuredImage { url altText width height } }
  }
`;
