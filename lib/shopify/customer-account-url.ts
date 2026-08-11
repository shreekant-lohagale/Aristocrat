export function getHostedCustomerAccountUrl() {
  const value = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL?.trim();
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.toString() : null; } catch { return null; }
}
