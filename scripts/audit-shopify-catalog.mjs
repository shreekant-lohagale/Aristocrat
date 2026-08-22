const domain = process.env.VTBSJMYH_SHOPIFY_STORE_DOMAIN?.trim();
const token = process.env.VTBSJMYH_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
const apiVersion = '2026-07';

if (!domain || !token) {
  console.error('Shopify catalog audit cannot run: pull the two VTBSJMYH_SHOPIFY_* variables into .env.local first.');
  process.exitCode = 1;
} else {
  const endpoint = `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/${apiVersion}/graphql.json`;
  const query = `query CatalogAudit($country: CountryCode!) @inContext(country: $country) {
    products(first: 100, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id handle title availableForSale productType
        priceRange { minVariantPrice { amount currencyCode } }
        options { name values }
        variants(first: 100) { nodes { id title availableForSale selectedOptions { name value } price { amount currencyCode } } }
        collections(first: 20) { nodes { handle title } }
      }
    }
    collections(first: 100) { nodes { handle title products(first: 1) { nodes { id } } } }
  }`;
  const expectedTitles = [
    'Black Sleeveless Maxi Dress', 'Black Printed Lehenga Set', 'Blue Patchwork Kurta',
    'Black Polka Red Lehenga Set', 'White Embroidered Kurta', 'Magenta Kurta Set',
    'Red & Green Chaniya Choli', 'Slate Ruffled Kurta', 'Turquoise Ruffled Kurta',
    'Black Floral Kurta', 'Multicolor Chaniya Choli Set', 'Mustard Embroidered Kurta Set',
  ];

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query, variables: { country: 'IN' } }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) {
      throw new Error(payload.errors?.map((error) => error.message).join('; ') || `HTTP ${response.status}`);
    }

    const products = payload.data.products.nodes;
    const returnedTitles = new Set(products.map((product) => product.title));
    console.log(JSON.stringify({
      productCount: products.length,
      products: products.map((product) => ({
        title: product.title,
        handle: product.handle,
        availableForSale: product.availableForSale,
        price: product.priceRange.minVariantPrice,
        options: product.options,
        variants: product.variants.nodes,
        collections: product.collections.nodes,
      })),
      collections: payload.data.collections.nodes,
      missingExpectedProducts: expectedTitles.filter((title) => !returnedTitles.has(title)),
    }, null, 2));
  } catch (error) {
    console.error(`Shopify catalog audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exitCode = 1;
  }
}
