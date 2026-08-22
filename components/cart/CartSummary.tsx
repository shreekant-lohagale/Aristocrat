'use client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreProvider';
import { CheckoutButton } from './CheckoutButton';

export function CartSummary() {
  const { cart, cartCount, formatPrice, subtotal } = useStore();
  if (!cart.length) return <div className="cart-page-empty"><ShoppingBag size={28} /><p className="lede">Your bag is empty.</p><Link className="button" href="/collections">Continue shopping</Link></div>;
  return <aside className="cart-summary"><p>{cartCount} {cartCount === 1 ? 'piece' : 'pieces'} selected</p><div><span>Subtotal</span><b>{formatPrice(subtotal, cart[0]?.product.currencyCode)}</b></div><CheckoutButton lines={cart} /></aside>;
}
