import { shopifyFetch } from './shopify';

const CONNECTION_QUERY = `
  query ShopifyConnectionTest {
    shop { name }
    products(first: 5) { nodes { id title handle } }
  }
`;

type ConnectionResponse = { shop: { name: string }; products: { nodes: Array<{ id: string; title: string; handle: string }> } };

export async function verifyShopifyConnection() {
  const data = await shopifyFetch<ConnectionResponse>(CONNECTION_QUERY, {}, { cache: 'no-store' });
  return { shopName: data.shop.name, productCount: data.products.nodes.length };
}
