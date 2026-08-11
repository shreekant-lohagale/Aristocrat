import { cookies } from 'next/headers';
import { shopifyFetch } from './shopify';
import type { CheckoutLineInput } from '@/types/checkout';

const CART_COOKIE = 'shopifyCartId';
const CART_FINGERPRINT_COOKIE = 'shopifyCartFingerprint';
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 };

type SelectedOption = { name: string; value: string };
type ShopifyVariant = { id: string; availableForSale: boolean; selectedOptions: SelectedOption[] };
type ShopifyProduct = { title: string; variants: { nodes: ShopifyVariant[] } };
type CartLine = { id: string; quantity: number; merchandise: { id: string; title: string; availableForSale: boolean; product: { title: string; handle: string } } };
type CartWarning = { code: string; message: string };
type CartUserError = { field: string[] | null; message: string };
export type ShopifyCart = { id: string; checkoutUrl: string; totalQuantity: number; cost: { subtotalAmount: { amount: string; currencyCode: string }; totalAmount: { amount: string; currencyCode: string } }; lines: { nodes: CartLine[] } };
type CartResponse = { cart: ShopifyCart | null };
type CartMutationResult = { cart: ShopifyCart | null; userErrors: CartUserError[]; warnings: CartWarning[] };
type CartMutationResponse = { cartCreate?: CartMutationResult; cartLinesAdd?: CartMutationResult; cartLinesRemove?: CartMutationResult };
type ProductResponse = { product: ShopifyProduct | null };
type ProductsResponse = { products: { nodes: ShopifyProduct[] } };

const CART_FIELDS = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id title availableForSale product { title handle } } } } }`;
const CART_QUERY = `query CartForCheckout($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
const PRODUCT_QUERY = `query ProductForCheckout($handle: String!) { product(handle: $handle) { title variants(first: 100) { nodes { id availableForSale selectedOptions { name value } } } } }`;
const PRODUCTS_BY_TITLE_QUERY = `query ProductsForCheckout($query: String!) { products(first: 10, query: $query) { nodes { title variants(first: 100) { nodes { id availableForSale selectedOptions { name value } } } } } }`;
const CREATE_CART = `mutation CreateCartForCheckout($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { field message } warnings { code message } } }`;
const ADD_LINES = `mutation AddCartLinesForCheckout($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } warnings { code message } } }`;
const REMOVE_LINES = `mutation RemoveCartLinesForCheckout($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { field message } warnings { code message } } }`;

function fingerprint(lines: CheckoutLineInput[]) { return JSON.stringify([...lines].map((line) => ({ ...line, handle: line.handle.trim().toLowerCase(), quantity: Math.max(1, Math.floor(line.quantity)) })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))); }
function normalizeTitle(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function optionNameMatches(name: string, target: 'size' | 'color') { const normalized = name.trim().toLowerCase(); return target === 'color' ? normalized === 'color' || normalized === 'colour' : normalized === target; }
function checkoutHost(url: string) { try { return new URL(url).hostname; } catch { return null; } }
function logCartState(operation: string, cart: ShopifyCart | null) { console.info('Shopify cart checkout state', { operation, totalQuantity: cart?.totalQuantity ?? 0, hasCheckoutUrl: Boolean(cart?.checkoutUrl), checkoutHost: cart?.checkoutUrl ? checkoutHost(cart.checkoutUrl) : null }); }
function inspectMutation(operation: string, result: CartMutationResult | undefined) { if (result?.warnings.length) console.warn('Shopify cart warnings', { operation, warnings: result.warnings.map((warning) => ({ code: warning.code, message: warning.message })) }); if (result?.userErrors.length) { console.error('Shopify cart mutation failed', { operation, errors: result.userErrors.map((error) => ({ field: error.field, message: error.message })) }); throw new Error('One or more selected pieces are unavailable. Please review your bag and try again.'); } if (!result?.cart) throw new Error('Shopify did not return an updated cart.'); logCartState(operation, result.cart); return result.cart; }

async function saveCart(cart: ShopifyCart, nextFingerprint?: string) { const store = await cookies(); store.set(CART_COOKIE, cart.id, COOKIE_OPTIONS); if (nextFingerprint) store.set(CART_FINGERPRINT_COOKIE, nextFingerprint, COOKIE_OPTIONS); }

export async function getShopifyCart() { const store = await cookies(); const id = store.get(CART_COOKIE)?.value; if (!id) return null; try { const cart = (await shopifyFetch<CartResponse>(CART_QUERY, { id })).cart; if (!cart) { store.delete(CART_COOKIE); store.delete(CART_FINGERPRINT_COOKIE); return null; } logCartState('query', cart); return cart; } catch (error) { console.error('Unable to retrieve Shopify cart.', error); return null; } }

async function resolveProduct(line: CheckoutLineInput) {
  const byHandle = await shopifyFetch<ProductResponse>(PRODUCT_QUERY, { handle: line.handle.trim() });
  if (byHandle.product || !line.title) return byHandle.product;
  const query = `title:"${line.title.replace(/"/g, '\\"')}"`;
  const byTitle = await shopifyFetch<ProductsResponse>(PRODUCTS_BY_TITLE_QUERY, { query });
  return byTitle.products.nodes.find((product) => normalizeTitle(product.title) === normalizeTitle(line.title ?? '')) ?? null;
}

async function resolveLines(lines: CheckoutLineInput[]) { return Promise.all(lines.map(async (line) => { const handle = line.handle.trim(); if (!handle || !Number.isFinite(line.quantity) || line.quantity < 1) throw new Error('Your bag contains an invalid item.'); const product = await resolveProduct(line); const variants = product?.variants.nodes.filter((variant) => variant.availableForSale) ?? []; const variant = variants.find((candidate) => { const sizeMatches = !line.size || candidate.selectedOptions.some((option) => optionNameMatches(option.name, 'size') && option.value === line.size); const colorMatches = !line.color || candidate.selectedOptions.some((option) => optionNameMatches(option.name, 'color') && option.value === line.color); return sizeMatches && colorMatches; }) ?? variants[0]; if (!variant) { console.error('Shopify variant resolution failed.', { handle, title: line.title ?? null }); throw new Error('This piece is unavailable for Shopify checkout. Please select another item.'); } return { merchandiseId: variant.id, quantity: Math.max(1, Math.floor(line.quantity)) }; })); }

export async function prepareShopifyCheckout(lines: CheckoutLineInput[], mode: 'cart' | 'buy-now' = 'cart') { if (!lines.length) throw new Error('Your bag is empty.'); const signature = fingerprint(lines); const store = await cookies(); const existing = await getShopifyCart(); if (mode === 'cart' && existing?.totalQuantity && store.get(CART_FINGERPRINT_COOKIE)?.value === signature) return existing; const resolvedLines = await resolveLines(lines); if (!existing) { const data = await shopifyFetch<CartMutationResponse>(CREATE_CART, { lines: resolvedLines }); const cart = inspectMutation('cartCreate', data.cartCreate); await saveCart(cart, mode === 'cart' ? signature : undefined); return cart; } if (mode === 'cart' && existing.lines.nodes.length) { const removed = await shopifyFetch<CartMutationResponse>(REMOVE_LINES, { cartId: existing.id, lineIds: existing.lines.nodes.map((line) => line.id) }); inspectMutation('cartLinesRemove', removed.cartLinesRemove); } const data = await shopifyFetch<CartMutationResponse>(ADD_LINES, { cartId: existing.id, lines: resolvedLines }); const cart = inspectMutation('cartLinesAdd', data.cartLinesAdd); await saveCart(cart, mode === 'cart' ? signature : undefined); return cart; }
