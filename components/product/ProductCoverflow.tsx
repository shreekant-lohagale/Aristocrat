'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { useStore } from '@/context/StoreProvider';
import { productImageSrc } from '@/lib/catalog/image';
import { isProductWishlisted, productWishlistAliases } from '@/lib/catalog/wishlist';
import type { CatalogProduct } from '@/types/commerce';

type ProductCoverflowProps = {
  products: CatalogProduct[];
  reducedMotion?: boolean;
};

type DragState = {
  id: number;
  startX: number;
  startY: number;
  startPosition: number;
  lastPosition: number;
  lastTime: number;
  velocity: number;
  horizontal: boolean;
  moved: boolean;
};

export function ProductCoverflow({ products, reducedMotion = false }: ProductCoverflowProps) {
  const { addToCart, formatPrice, toggleWishlist, wishlist } = useStore();
  const router = useRouter();
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const cardWidthRef = useRef(0);
  const mobileRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);
  const [addedHandle, setAddedHandle] = useState<string | null>(null);
  const count = products.length;
  const loop = count > 2;

  const indexAt = useCallback((position: number) => {
    if (!count) return 0;
    return ((Math.round(position) % count) + count) % count;
  }, [count]);

  const distanceFromSelected = useCallback((index: number) => {
    const direct = Math.abs(index - selected);
    return loop ? Math.min(direct, count - direct) : direct;
  }, [count, loop, selected]);

  const clampPosition = useCallback((position: number) => (
    loop ? position : Math.max(0, Math.min(count - 1, position))
  ), [count, loop]);

  const paint = useCallback(() => {
    const width = cardWidthRef.current;
    if (!width || !count) return;

    const mobile = mobileRef.current;
    const pitch = width * (mobile ? 0.94 : 1.08);
    const rotate = reducedMotion ? 0 : mobile ? 11 : 25;
    const depth = reducedMotion ? 0 : mobile ? 0.14 : 0.34;
    const position = positionRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let offset = index - position;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, 0.68);
      const tilt = Math.min(rotate * ramp, 64) * Math.sign(offset);
      const scale = Math.max(mobile ? 0.88 : 0.84, 1 - distance * (mobile ? 0.065 : 0.08));
      const ringEdge = loop && count > 2
        ? Math.min(1, Math.max(0, (count / 2 - distance) / 0.42))
        : 1;
      const opacity = Math.max(0, 1 - distance * (mobile ? 0.15 : 0.1)) * ringEdge;

      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(100 - Math.round(distance * 10));
      card.style.pointerEvents = distance < 1.35 ? 'auto' : 'none';
    });
  }, [count, loop, reducedMotion]);

  const settle = useCallback((target: number) => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    targetRef.current = target;
    const targetIndex = indexAt(target);
    selectedRef.current = targetIndex;
    setSelected(targetIndex);

    if (reducedMotion) {
      positionRef.current = target;
      paint();
      animationRef.current = null;
      return;
    }

    const step = () => {
      const remaining = target - positionRef.current;
      if (Math.abs(remaining) < 0.0005) {
        positionRef.current = target;
        paint();
        animationRef.current = null;
        return;
      }
      positionRef.current += remaining * 0.17;
      paint();
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  }, [indexAt, paint, reducedMotion]);

  const nudge = useCallback((amount: number) => {
    settle(clampPosition(Math.round(targetRef.current) + amount));
  }, [clampPosition, settle]);

  const goTo = useCallback((index: number) => {
    const target = loop
      ? index + Math.round((targetRef.current - index) / count) * count
      : index;
    settle(clampPosition(target));
  }, [clampPosition, count, loop, settle]);

  useEffect(() => {
    positionRef.current = 0;
    targetRef.current = 0;
    selectedRef.current = 0;
    setSelected(0);
    cardRefs.current = cardRefs.current.slice(0, count);
  }, [count]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const firstCard = cardRefs.current[0];
      if (!firstCard) return;
      cardWidthRef.current = firstCard.offsetWidth;
      mobileRef.current = frame.offsetWidth <= 768;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
  }, []);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (count < 2 || (event.target as HTMLElement).closest('button')) return;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: positionRef.current,
      lastPosition: positionRef.current,
      lastTime: performance.now(),
      velocity: 0,
      horizontal: false,
      moved: false,
    };
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.horizontal) {
      if (Math.abs(deltaX) < 7 && Math.abs(deltaY) < 7) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      drag.horizontal = true;
    }

    event.preventDefault();
    const pitch = cardWidthRef.current * (mobileRef.current ? 0.94 : 1.08);
    if (!pitch) return;
    const nextPosition = clampPosition(drag.startPosition - deltaX / pitch);
    const now = performance.now();
    drag.velocity = ((nextPosition - drag.lastPosition) / Math.max(now - drag.lastTime, 1)) * 1000;
    drag.lastPosition = nextPosition;
    drag.lastTime = now;
    drag.moved = Math.abs(deltaX) > 9;
    positionRef.current = nextPosition;
    const nextSelected = indexAt(nextPosition);
    if (nextSelected !== selectedRef.current) {
      selectedRef.current = nextSelected;
      setSelected(nextSelected);
    }
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    suppressClickRef.current = drag.moved;
    const carried = drag.horizontal ? Math.max(-1.5, Math.min(1.5, drag.velocity * 0.16)) : 0;
    settle(clampPosition(Math.round(positionRef.current + carried)));
  };

  const interceptClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  if (!count) return null;
  const active = products[Math.min(selected, count - 1)];
  const activeSaved = isProductWishlisted(wishlist, active);
  const activePurchasable = Boolean(active.shopifyVariantId && active.shopifyAvailableForSale);
  const activeNeedsOptions = (active.shopifyVariantCount ?? 0) > 1;
  const activeDiscount = Boolean(active.compareAtPrice && active.compareAtPrice > active.price);
  const activeAdded = addedHandle === active.handle;

  const addActive = () => {
    if (!activePurchasable || activeAdded) return;
    if (activeNeedsOptions) {
      router.push(`/products/${active.handle}`);
      return;
    }
    addToCart(active);
    setAddedHandle(active.handle);
    window.setTimeout(() => setAddedHandle(null), 1600);
  };

  return (
    <div className={`product-coverflow ${count === 1 ? 'product-coverflow--single' : ''}`} role="region" aria-roledescription="carousel" aria-label="New Arrivals products">
      <div className="product-coverflow__viewport">
        <div
          ref={frameRef}
          className="product-coverflow__frame"
          tabIndex={0}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={interceptClick}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); nudge(-1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); nudge(1); }
          }}
        >
          <div className="product-coverflow__stage">
            {products.map((product, index) => (
              <article
                key={product.id}
                ref={(node) => { cardRefs.current[index] = node; }}
                className={`product-coverflow__card ${index === selected ? 'is-active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${product.title}`}
                aria-hidden={distanceFromSelected(index) > 2 ? true : undefined}
              >
                <Link
                  href={`/products/${product.handle}`}
                  className="product-coverflow__image-link"
                  draggable={false}
                  tabIndex={index === selected ? 0 : -1}
                  onDragStart={(event) => event.preventDefault()}
                  onClick={(event) => {
                    if (index === selected) return;
                    event.preventDefault();
                    goTo(index);
                  }}
                  aria-label={index === selected ? `View ${product.title}` : `Select ${product.title}`}
                >
                  <ImageWithLoader
                    src={productImageSrc(product.image)}
                    alt={product.imageAlt ?? product.title}
                    fill
                    draggable={false}
                    sizes="(max-width: 768px) 72vw, (max-width: 1200px) 30vw, 340px"
                  />
                </Link>
                {index === selected && (
                  <button
                    type="button"
                    className="product-coverflow__heart"
                    onClick={() => toggleWishlist(product.handle, productWishlistAliases(product))}
                    aria-label={`${isProductWishlisted(wishlist, product) ? 'Remove' : 'Add'} ${product.title} ${isProductWishlisted(wishlist, product) ? 'from' : 'to'} wishlist`}
                  >
                    <Heart size={18} fill={isProductWishlisted(wishlist, product) ? 'currentColor' : 'none'} aria-hidden="true" />
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button type="button" className="product-coverflow__nav product-coverflow__nav--previous" onClick={() => nudge(-1)} disabled={!loop && selected === 0} aria-label="Previous product"><ChevronLeft aria-hidden="true" /></button>
            <button type="button" className="product-coverflow__nav product-coverflow__nav--next" onClick={() => nudge(1)} disabled={!loop && selected === count - 1} aria-label="Next product"><ChevronRight aria-hidden="true" /></button>
          </>
        )}
      </div>

      <div className="product-coverflow__details" key={active.handle} aria-live="polite">
        <Link href={`/products/${active.handle}`}><h3>{active.title}</h3></Link>
        <div className="product-coverflow__price">
          <b>{formatPrice(active.price, active.currencyCode)}</b>
          {activeDiscount && <s>{formatPrice(active.compareAtPrice!, active.currencyCode)}</s>}
        </div>
        <div className="product-coverflow__actions">
          <Link href={`/products/${active.handle}`}>View product</Link>
          <button type="button" onClick={addActive} disabled={!activePurchasable || activeAdded}>
            {!activePurchasable ? 'Sold out' : activeNeedsOptions ? 'Choose options' : activeAdded ? 'Added' : 'Add to bag'}
          </button>
        </div>
        <button
          type="button"
          className="product-coverflow__caption-wishlist"
          onClick={() => toggleWishlist(active.handle, productWishlistAliases(active))}
          aria-label={`${activeSaved ? 'Remove' : 'Add'} ${active.title} ${activeSaved ? 'from' : 'to'} wishlist`}
        >
          <Heart size={15} fill={activeSaved ? 'currentColor' : 'none'} aria-hidden="true" /> {activeSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      {count > 1 && (
        <div className="product-coverflow__pagination" aria-label="Choose a product">
          {products.map((product, index) => <button key={product.id} type="button" className={index === selected ? 'is-active' : ''} aria-current={index === selected ? 'true' : undefined} aria-label={`Go to ${product.title}`} onClick={() => goTo(index)} />)}
        </div>
      )}
    </div>
  );
}
