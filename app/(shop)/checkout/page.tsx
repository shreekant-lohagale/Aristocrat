import { redirect } from 'next/navigation';
import { getShopifyCart } from '@/lib/shopify/cart';

export default async function CheckoutPage() {
  const cart = await getShopifyCart();
  if (cart?.totalQuantity && cart.checkoutUrl) redirect(cart.checkoutUrl);
  redirect('/cart');
}
