'use client';

import Link from 'next/link';
import { Eye, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { useStore } from '@/context/StoreProvider';
import type { CatalogProduct } from '@/types/commerce';

export function CatalogProductCard({ product }: { product: CatalogProduct }) {
  const { addToCart, formatPrice, toggleWishlist, wishlist } = useStore();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const saved = wishlist.includes(product.id);
  const purchasable = Boolean(product.shopifyVariantId && product.shopifyAvailableForSale);
  const needsOptions = (product.shopifyVariantCount ?? 0) > 1;
  const discount = Math.round((1 - product.price / product.compareAtPrice) * 100);

  const add = () => {
    if (!purchasable || added) return;
    if (needsOptions) {
      router.push(`/products/${product.handle}`);
      return;
    }

    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const buttonLabel = !purchasable
    ? 'Currently unavailable'
    : needsOptions
      ? 'Choose options'
      : added
        ? 'Added'
        : 'Add to bag';

  return (
    <motion.article className="catalog-card" whileHover={{ y: -5 }}>
      <div className="catalog-image">
        <ImageWithLoader
          src={`/api/assets?file=${encodeURIComponent(product.image)}`}
          alt={product.title}
          fill
          sizes="(max-width: 560px) 50vw, (max-width: 960px) 33vw, 25vw"
        />
        <span className="discount-badge">{discount}% off</span>
        <button type="button" className="heart-button" onClick={() => toggleWishlist(product.id)} aria-label={`Toggle ${product.title} wishlist`}>
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <div className="card-actions">
          <Link href={`/products/${product.handle}`} aria-label={`Quick view ${product.title}`}><Eye size={17} /></Link>
        </div>
        <button type="button" className="catalog-add-button" onClick={add} disabled={!purchasable || added} aria-label={`${buttonLabel}: ${product.title}`}>
          {buttonLabel}
        </button>
      </div>
      <div className="catalog-meta">
        <Link href={`/products/${product.handle}`}><h3>{product.title}</h3></Link>
        <p className="rating"><Star size={13} fill="currentColor" /> {product.rating.toFixed(1)} <span>({product.reviewCount})</span></p>
        <div><b>{formatPrice(product.price)}</b><s>{formatPrice(product.compareAtPrice)}</s></div>
      </div>
    </motion.article>
  );
}
