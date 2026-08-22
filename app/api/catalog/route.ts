import { getCatalog, getCollectionProducts, getProduct, searchCatalog } from '@/lib/catalog/products';
import { hasShopifyStorefrontConfig } from '@/lib/shopify/config';

const responseHeaders = (source?: string) => ({
  'Cache-Control': 'no-store',
  'X-Catalog-Source': source ?? 'shopify',
});

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const country = params.get('country') ?? 'IN';

  try {
    const handle = params.get('handle');
    if (handle) {
      const product = await getProduct(handle, country);
      return product
        ? Response.json(product, { headers: responseHeaders(product.source) })
        : Response.json({ error: 'Product not found.' }, { status: 404 });
    }

    const collection = params.get('collection');
    const query = params.get('query');
    const sort = params.get('sort') ?? 'featured';
    const products = collection
      ? await getCollectionProducts(collection, country, sort)
      : query
        ? await searchCatalog(query, country)
        : await getCatalog(country, sort);

    return Response.json(products, { headers: responseHeaders(products[0]?.source ?? (hasShopifyStorefrontConfig() ? 'shopify' : 'fallback')) });
  } catch (error) {
    console.error('Shopify catalog request failed.', { message: error instanceof Error ? error.message : 'Unknown error' });
    return Response.json({ error: 'The House collection is temporarily unavailable.' }, { status: 503 });
  }
}
