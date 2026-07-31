'use client';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
export function ProductCard({ product }: { product: Product }) { const [saved, setSaved] = useState(false); return <article className="product-card"><div className="product-image"><img src={`/api/images/${encodeURIComponent(product.image)}`} alt={product.title} /><button suppressHydrationWarning className="save-button" onClick={() => setSaved(!saved)} aria-label="Save item"><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button><Link className="quick-add" href={`/products/${product.handle}`}>View piece</Link></div><div className="product-meta"><div><h3>{product.title}</h3><p>{product.subtitle}</p></div><span>₹{product.price}</span></div></article>; }
