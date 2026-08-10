import { BackButton } from '@/components/common/BackButton';

export default function CheckoutPage() { return <main className="page shell"><BackButton href="/cart" label="Back to Bag" /><p className="eyebrow">Secure checkout</p><h1>Checkout</h1><p className="lede">You will be redirected to Shopify Checkout when your cart is connected.</p></main>; }
