'use client';

import { Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, Ruler, Share2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CatalogProduct, ProductOptionValue, ProductVariant } from '@/types/commerce';
import { useStore } from '@/context/StoreProvider';
import { CheckoutButton } from '@/components/cart/CheckoutButton';
import { CatalogProductCard } from '@/components/product/CatalogProductCard';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { productImageSrc } from '@/lib/catalog/image';
import { isProductWishlisted, productWishlistAliases } from '@/lib/catalog/wishlist';
import { normalizeCollectionHandle } from '@/lib/catalog/collections';

const optionKey = (name: string) => name.trim().toLowerCase();

function initialSelections(product: CatalogProduct) {
  return Object.fromEntries(product.options.flatMap((option) => {
    const values = option.values.filter((value) => value !== 'Default Title');
    return values.length === 1 ? [[optionKey(option.name), values[0]]] : [];
  }));
}

function variantMatches(variant: ProductVariant, selections: Record<string, string>) {
  return variant.selectedOptions.every((option) => !selections[optionKey(option.name)] || selections[optionKey(option.name)] === option.value);
}

export function ProductDetails({ product: initialProduct, related }: { product: CatalogProduct; related: CatalogProduct[] }) {
  const { addToCart, country, formatPrice, wishlist, toggleWishlist } = useStore();
  const [product, setProduct] = useState(initialProduct);
  const [selections, setSelections] = useState<Record<string, string>>(() => initialSelections(initialProduct));
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [relatedProducts, setRelatedProducts] = useState(related);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/catalog?handle=${encodeURIComponent(initialProduct.handle)}&country=${country.code}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<CatalogProduct> : Promise.reject())
      .then(async (next) => {
        setProduct(next);
        setSelections((current) => Object.fromEntries(next.options.flatMap((option) => {
          const key = optionKey(option.name);
          const values = option.values.filter((value) => value !== 'Default Title');
          const value = values.includes(current[key]) ? current[key] : values.length === 1 ? values[0] : '';
          return value ? [[key, value]] : [];
        })));
        const relatedHandle = next.collectionHandles.find((entry) => !['new-arrivals', 'best-sellers', 'sale'].includes(entry)) ?? normalizeCollectionHandle(next.category);
        const relatedResponse = await fetch(`/api/catalog?collection=${encodeURIComponent(relatedHandle)}&country=${country.code}`, { signal: controller.signal });
        if (relatedResponse.ok) setRelatedProducts((await relatedResponse.json() as CatalogProduct[]).filter((entry) => entry.id !== next.id).slice(0, 4));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [country.code, initialProduct.handle]);

  useEffect(() => {
    if (!sizeGuideOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSizeGuideOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [sizeGuideOpen]);

  const selectableOptions = product.options.filter((option) => option.values.some((value) => value !== 'Default Title'));
  const selectionsComplete = selectableOptions.every((option) => Boolean(selections[optionKey(option.name)]));
  const variant = selectableOptions.length === 0
    ? product.variants.find((entry) => entry.availableForSale) ?? product.variants[0]
    : selectionsComplete
      ? product.variants.find((entry) => variantMatches(entry, selections))
      : undefined;
  const saved = isProductWishlisted(wishlist, product);
  const purchasable = Boolean(variant?.id && variant.availableForSale);
  const displayPrice = variant?.price ?? product.price;
  const compareAtPrice = variant?.compareAtPrice ?? product.compareAtPrice;
  const currencyCode = variant?.currencyCode ?? product.currencyCode;
  const images = [...new Set((product.images.length ? product.images : [product.image]).filter(Boolean))];
  const cartProduct = variant ? { ...product, price: variant.price, compareAtPrice: variant.compareAtPrice, currencyCode: variant.currencyCode, shopifyVariantId: variant.id, shopifyAvailableForSale: variant.availableForSale } : product;
  const tabs = [
    product.description || product.descriptionHtml ? { id: 'details', label: 'Product details', content: product.description } : null,
    product.fabricAndFit ? { id: 'fabric', label: 'Fabric & fit', content: product.fabricAndFit } : null,
    product.careInstructions ? { id: 'care', label: 'Care instructions', content: product.careInstructions } : null,
  ].filter((tab): tab is { id: string; label: string; content: string } => Boolean(tab));
  const sizeOption = selectableOptions.find((option) => optionKey(option.name) === 'size');
  const selectedTabId = tabs.some((tab) => tab.id === activeTab) ? activeTab : tabs[0]?.id;

  const valueAvailable = (option: ProductOptionValue, value: string) => product.variants.some((entry) => entry.availableForSale && entry.selectedOptions.every((selected) => {
    const key = optionKey(selected.name);
    if (key === optionKey(option.name)) return selected.value === value;
    return !selections[key] || selections[key] === selected.value;
  }));

  const add = () => {
    if (!purchasable || !variant) return;
    Array.from({ length: quantity }).forEach(() => addToCart(cartProduct, {
      size: selections.size,
      color: selections.color ?? selections.colour,
      variantId: variant.id,
    }));
  };

  const purchaseLabel = !product.inStock
    ? 'Sold out'
    : !selectionsComplete
      ? sizeOption && !selections.size ? 'Select a size' : 'Select options'
      : !purchasable
        ? 'Unavailable'
        : 'Add to bag';

  const scrollGallery = (direction: number) => galleryRef.current?.scrollBy({ left: galleryRef.current.clientWidth * 0.7 * direction, behavior: 'smooth' });
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <section className="product-view">
        <div className={`product-gallery ${images.length === 1 ? 'product-gallery--single' : ''}`}>
          <div ref={galleryRef} className="product-gallery__track" aria-label={`${product.title} image gallery`}>
            {images.map((entry, index) => <figure key={entry} className="product-gallery__image"><ImageWithLoader src={productImageSrc(entry)} alt={index === 0 ? product.imageAlt ?? product.title : `${product.title}, view ${index + 1}`} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 31vw" /></figure>)}
          </div>
          {images.length > 1 && <div className="product-gallery__controls"><button type="button" onClick={() => scrollGallery(-1)} aria-label="Previous product image"><ChevronLeft /></button><button type="button" onClick={() => scrollGallery(1)} aria-label="Next product image"><ChevronRight /></button></div>}
        </div>

        <article className="product-info">
          <p className="eyebrow">{product.productType || product.category}</p>
          <div className="product-title-row"><h1>{product.title}</h1><button type="button" onClick={() => toggleWishlist(product.handle, productWishlistAliases(product))} aria-label={saved ? 'Remove product from wishlist' : 'Add product to wishlist'}><Heart fill={saved ? 'currentColor' : 'none'} /></button></div>
          <div className="detail-price"><b>{formatPrice(displayPrice, currencyCode)}</b>{compareAtPrice && compareAtPrice > displayPrice && <s>{formatPrice(compareAtPrice, currencyCode)}</s>}</div>
          <div className="product-info__divider" />

          {selectableOptions.map((option) => {
            const key = optionKey(option.name);
            const values = option.values.filter((value) => value !== 'Default Title');
            if ((key === 'color' || key === 'colour') && values.length === 1) return <p className="product-option-note" key={option.name}><span>Colour</span>{values[0]}</p>;
            return <div className="product-option" key={option.name}><div className="product-option__heading"><p>{option.name}{selections[key] ? ` — ${selections[key]}` : ''}</p>{key === 'size' && <button type="button" onClick={() => setSizeGuideOpen(true)}><Ruler size={14} /> Size guide</button>}</div><div className={key === 'size' ? 'size-row' : 'swatches'}>{values.map((value) => { const available = valueAvailable(option, value); return <button type="button" key={value} disabled={!available} className={selections[key] === value ? 'selected' : ''} aria-pressed={selections[key] === value} onClick={() => setSelections((current) => ({ ...current, [key]: value }))}>{selections[key] === value && <Check size={12} aria-hidden="true" />}{value}</button>; })}</div></div>;
          })}

          {product.colors.length === 1 && !selectableOptions.some((option) => ['color', 'colour'].includes(optionKey(option.name))) && <p className="product-option-note"><span>Colour</span>{product.colors[0]}</p>}

          <div className="detail-actions"><div className="quantity"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span aria-label={`Quantity ${quantity}`}>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div><button type="button" className="add-button" onClick={add} disabled={!purchasable}>{purchaseLabel}</button></div>
          {purchasable && variant && <CheckoutButton className="buy-now" mode="buy-now" lines={[{ handle: product.handle, title: product.title, variantId: variant.id, quantity, size: selections.size, color: selections.color ?? selections.colour }]}>Buy now</CheckoutButton>}
          <p className="product-shipping-note">Shipping, duties and returns are calculated for your market at checkout.</p>
          {variant?.sku && <p className="product-style">Style: {variant.sku}</p>}

          {tabs.length > 0 && <div className="product-tabs"><div role="tablist" aria-label="Product information">{tabs.map((tab) => <button type="button" role="tab" aria-selected={selectedTabId === tab.id} key={tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</div>{tabs.map((tab) => selectedTabId === tab.id && <div role="tabpanel" key={tab.id}><p>{tab.content}</p></div>)}</div>}

          <div className="product-share"><span>Share</span><button type="button" onClick={copyLink}><Share2 size={15} />{copied ? 'Link copied' : 'Copy link'}</button></div>
        </article>
      </section>

      {relatedProducts.length > 0 && <section className="product-recommendations" aria-labelledby="recommendations-title"><p className="eyebrow">Continue the edit</p><h2 id="recommendations-title">You may also like</h2><div className="catalog-grid">{relatedProducts.map((item) => <CatalogProductCard key={item.id} product={item} />)}</div></section>}

      {sizeGuideOpen && <div className="size-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title"><button type="button" className="size-guide-dialog__scrim" aria-label="Close size guide" onClick={() => setSizeGuideOpen(false)} /><div className="size-guide-dialog__panel"><button type="button" className="size-guide-dialog__close" aria-label="Close size guide" onClick={() => setSizeGuideOpen(false)}><X /></button><p className="eyebrow">House guidance</p><h2 id="size-guide-title">Size guide</h2><p>Size guidance can vary by piece. Please review the available Shopify sizes for this design and contact the House if you need personalised assistance.</p></div></div>}
    </>
  );
}
