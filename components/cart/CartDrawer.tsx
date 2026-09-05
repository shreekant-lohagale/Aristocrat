'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreProvider';
import { CheckoutButton } from './CheckoutButton';
import { productImageSrc } from '@/lib/catalog/image';
import { drawerRight, overlayFade } from '@/lib/motion';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, cartCount, formatPrice, subtotal, updateQuantity, removeFromCart } = useStore();
  const reducedMotion = useReducedMotion();
  const subtotalCurrency = cart[0]?.product.currencyCode;
  return <AnimatePresence initial={false}>{open && <><motion.button className="drawer-scrim" aria-label="Close bag" onClick={onClose} variants={overlayFade} initial={reducedMotion ? false : 'hidden'} animate="visible" exit="exit" /><motion.aside className="cart-drawer" data-lenis-prevent variants={drawerRight} initial={reducedMotion ? false : 'hidden'} animate="visible" exit="exit"><header><div><p className="eyebrow">Your selection</p><h2>Shopping bag ({cartCount})</h2></div><button onClick={onClose} aria-label="Close bag"><X /></button></header>{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} /><p>Your bag is waiting for a beautiful piece.</p><Link className="button" href="/collections" onClick={onClose}>Explore collection</Link></div> : <><div className="cart-lines"><AnimatePresence initial={false}>{cart.map((line) => <motion.article layout={!reducedMotion} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 18 }} key={line.lineId}><img src={productImageSrc(line.product.image)} alt="" /><div><h3>{line.product.title}</h3><p>{formatPrice(line.product.price, line.product.currencyCode)}</p><div className="quantity"><button onClick={() => updateQuantity(line.lineId, -1)}><Minus size={13} /></button><span>{line.quantity}</span><button onClick={() => updateQuantity(line.lineId, 1)}><Plus size={13} /></button></div></div><button className="remove-line" onClick={() => removeFromCart(line.lineId)} aria-label="Remove item"><Trash2 size={16} /></button></motion.article>)}</AnimatePresence></div><footer><div><span>Subtotal</span><b>{formatPrice(subtotal, subtotalCurrency)}</b></div><CheckoutButton lines={cart} /></footer></>}</motion.aside></>}</AnimatePresence>;
}

