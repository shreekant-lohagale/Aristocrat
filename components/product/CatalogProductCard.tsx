'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { useStore } from '@/context/StoreProvider';
import type { CatalogProduct } from '@/types/commerce';
import { productImageSrc } from '@/lib/catalog/image';
import { isProductWishlisted, productWishlistAliases } from '@/lib/catalog/wishlist';

export function CatalogProductCard({ product }: { product: CatalogProduct }) {
  const { addToCart, formatPrice, toggleWishlist, wishlist } = useStore();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const saved = isProductWishlisted(wishlist, product);
  const purchasable = Boolean(product.shopifyVariantId && product.shopifyAvailableForSale);
  const needsOptions = (product.shopifyVariantCount ?? 0) > 1;
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const secondImage = product.images.find((entry) => entry !== product.image);
  const badges = [
    !product.inStock ? 'Sold out' : '',
    product.inStock && hasDiscount ? 'Sale' : '',
    product.inStock && product.isBestSeller ? 'Bestseller' : '',
    product.inStock && product.isNew ? 'New' : '',
  ].filter(Boolean).slice(0, 2);

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
    ? 'Sold out'
    : needsOptions
      ? 'Choose options'
      : added
        ? 'Added'
        : 'Add to bag';

  return (
    <motion.article className="catalog-card" whileHover={{ y: -2 }}>
      <div className="catalog-image">
        <Link className="catalog-image-link" href={`/products/${product.handle}`} aria-label={`View ${product.title}`}>
          <ImageWithLoader wrapperClassName="catalog-card__primary-image" src={productImageSrc(product.image)} alt={product.imageAlt ?? product.title} fill sizes="(max-width: 560px) 50vw, (max-width: 1023px) 50vw, (max-width: 1439px) 33vw, 25vw" />
          {secondImage && <ImageWithLoader wrapperClassName="catalog-card__secondary-image" src={productImageSrc(secondImage)} alt="" fill sizes="(max-width: 560px) 50vw, (max-width: 1023px) 50vw, (max-width: 1439px) 33vw, 25vw" />}
        </Link>
        {badges.length > 0 && <div className="catalog-badges">{badges.map((badge) => <span key={badge}>{badge}</span>)}</div>}
        <button type="button" className="heart-button" onClick={() => toggleWishlist(product.handle, productWishlistAliases(product))} aria-label={`Toggle ${product.title} wishlist`}>
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button type="button" className="catalog-add-button" onClick={add} disabled={!purchasable || added} aria-label={`${buttonLabel}: ${product.title}`}>
          {buttonLabel}
        </button>
      </div>
      <div className="catalog-meta">
        <Link href={`/products/${product.handle}`}><h3>{product.title}</h3></Link>
        <div><b>{formatPrice(product.price, product.currencyCode)}</b>{hasDiscount && <s>{formatPrice(product.compareAtPrice!, product.currencyCode)}</s>}</div>
      </div>
    </motion.article>
  );
}
