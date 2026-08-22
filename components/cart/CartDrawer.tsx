'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreProvider';
import { CheckoutButton } from './CheckoutButton';
import { productImageSrc } from '@/lib/catalog/image';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, cartCount, formatPrice, subtotal, updateQuantity, removeFromCart } = useStore();
  const subtotalCurrency = cart[0]?.product.currencyCode;
  return <AnimatePresence>{open && <><motion.button className="drawer-scrim" aria-label="Close bag" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.aside className="cart-drawer" data-lenis-prevent initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1] }}><header><div><p className="eyebrow">Your selection</p><h2>Shopping bag ({cartCount})</h2></div><button onClick={onClose} aria-label="Close bag"><X /></button></header>{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} /><p>Your bag is waiting for a beautiful piece.</p><Link className="button" href="/collections" onClick={onClose}>Explore collection</Link></div> : <><div className="cart-lines">{cart.map((line) => <article key={line.lineId}><img src={productImageSrc(line.product.image)} alt="" /><div><h3>{line.product.title}</h3><p>{formatPrice(line.product.price, line.product.currencyCode)}</p><div className="quantity"><button onClick={() => updateQuantity(line.lineId, -1)}><Minus size={13} /></button><span>{line.quantity}</span><button onClick={() => updateQuantity(line.lineId, 1)}><Plus size={13} /></button></div></div><button className="remove-line" onClick={() => removeFromCart(line.lineId)} aria-label="Remove item"><Trash2 size={16} /></button></article>)}</div><footer><div><span>Subtotal</span><b>{formatPrice(subtotal, subtotalCurrency)}</b></div><CheckoutButton lines={cart} /></footer></>}</motion.aside></>}</AnimatePresence>;
}

