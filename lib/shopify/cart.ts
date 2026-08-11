import { cookies } from 'next/headers';
import { shopifyFetch } from './shopify';
import type { CheckoutLineInput } from '@/types/checkout';

const CART_COOKIE = 'shopifyCartId';
const CART_FINGERPRINT_COOKIE = 'shopifyCartFingerprint';
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 };

type SelectedOption = { name: string; value: string };
type CartLine = { id: string; quantity: number; merchandise: { id: string; title: string } };
export type ShopifyCart = { id: string; checkoutUrl: string; totalQuantity: number; cost: { subtotalAmount: { amount: string; currencyCode: string }; totalAmount: { amount: string; currencyCode: string } }; lines: { nodes: CartLine[] } };
type CartResponse = { cart: ShopifyCart | null };
type CartMutationResult = { cart: ShopifyCart | null; userErrors: { field: string[] | null; message: string }[] };
type CartMutationResponse = { cartCreate?: CartMutationResult; cartLinesAdd?: CartMutationResult; cartLinesRemove?: CartMutationResult };
type ProductResponse = { product: { variants: { nodes: { id: string; availableForSale: boolean; selectedOptions: SelectedOption[] }[] } } | null };

const CART_FIELDS = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id title } } } }`;
const CART_QUERY = `query CartForCheckout($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
const PRODUCT_QUERY = `query ProductForCheckout($handle: String!) { product(handle: $handle) { variants(first: 100) { nodes { id availableForSale selectedOptions { name value } } } } }`;
const CREATE_CART = `mutation CreateCartForCheckout($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { field message } } }`;
const ADD_LINES = `mutation AddCartLinesForCheckout($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } } }`;
const REMOVE_LINES = `mutation RemoveCartLinesForCheckout($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { field message } } }`;

function fingerprint(lines: CheckoutLineInput[]) { return JSON.stringify([...lines].map((line) => ({ ...line, handle: line.handle.trim().toLowerCase(), quantity: Math.max(1, Math.floor(line.quantity)) })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))); }
function optionNameMatches(name: string, target: 'size' | 'color') { const normalized = name.trim().toLowerCase(); return target === 'color' ? normalized === 'color' || normalized === 'colour' : normalized === target; }
function cartError(errors: { message: string }[]) { if (errors.length) throw new Error(errors.map((error) => error.message).join('; ')); }

async function saveCart(cart: ShopifyCart, nextFingerprint?: string) { const store = await cookies(); store.set(CART_COOKIE, cart.id, COOKIE_OPTIONS); if (nextFingerprint) store.set(CART_FINGERPRINT_COOKIE, nextFingerprint, COOKIE_OPTIONS); }

export async function getShopifyCart() { const store = await cookies(); const id = store.get(CART_COOKIE)?.value; if (!id) return null; try { return (await shopifyFetch<CartResponse>(CART_QUERY, { id })).cart; } catch (error) { console.error('Unable to retrieve Shopify cart.', error); return null; } }

async function resolveLines(lines: CheckoutLineInput[]) { return Promise.all(lines.map(async (line) => { const handle = line.handle.trim(); if (!handle || !Number.isFinite(line.quantity) || line.quantity < 1) throw new Error('Your bag contains an invalid item.'); const data = await shopifyFetch<ProductResponse>(PRODUCT_QUERY, { handle }); const variants = data.product?.variants.nodes.filter((variant) => variant.availableForSale) ?? []; const variant = variants.find((candidate) => { const sizeMatches = !line.size || candidate.selectedOptions.some((option) => optionNameMatches(option.name, 'size') && option.value === line.size); const colorMatches = !line.color || candidate.selectedOptions.some((option) => optionNameMatches(option.name, 'color') && option.value === line.color); return sizeMatches && colorMatches; }) ?? variants[0]; if (!variant) throw new Error(`This piece is currently unavailable in Shopify: ${handle}.`); return { merchandiseId: variant.id, quantity: Math.max(1, Math.floor(line.quantity)) }; })); }

export async function prepareShopifyCheckout(lines: CheckoutLineInput[], mode: 'cart' | 'buy-now' = 'cart') { if (!lines.length) throw new Error('Your bag is empty.'); const signature = fingerprint(lines); const store = await cookies(); const existing = await getShopifyCart(); if (mode === 'cart' && existing?.totalQuantity && store.get(CART_FINGERPRINT_COOKIE)?.value === signature) return existing; const resolvedLines = await resolveLines(lines); if (!existing) { const data = await shopifyFetch<CartMutationResponse>(CREATE_CART, { lines: resolvedLines }); const result = data.cartCreate; cartError(result?.userErrors ?? []); if (!result?.cart) throw new Error('Shopify did not return a cart.'); await saveCart(result.cart, mode === 'cart' ? signature : undefined); return result.cart; } if (mode === 'cart' && existing.lines.nodes.length) { const removed = await shopifyFetch<CartMutationResponse>(REMOVE_LINES, { cartId: existing.id, lineIds: existing.lines.nodes.map((line) => line.id) }); cartError(removed.cartLinesRemove?.userErrors ?? []); } const data = await shopifyFetch<CartMutationResponse>(ADD_LINES, { cartId: existing.id, lines: resolvedLines }); const result = data.cartLinesAdd; cartError(result?.userErrors ?? []); if (!result?.cart) throw new Error('Shopify did not return an updated cart.'); await saveCart(result.cart, mode === 'cart' ? signature : undefined); return result.cart; }
