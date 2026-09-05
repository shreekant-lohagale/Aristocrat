'use client';

import { useState } from 'react';
import { BuyNowButton } from '@/components/ui/BuyNowButton';
import { InlineLoader } from '@/components/ui/InlineLoader';
import type { CartLine } from '@/types/commerce';
import type { CheckoutLineInput } from '@/types/checkout';
import { useStore } from '@/context/StoreProvider';

type CheckoutButtonProps = {
  lines: CartLine[] | CheckoutLineInput[];
  mode?: 'cart' | 'buy-now';
  className?: string;
  onStart?: () => void;
  children?: React.ReactNode;
  priceLabel?: string;
};

function toInput(line: CartLine | CheckoutLineInput): CheckoutLineInput {
  return 'product' in line
    ? {
        handle: line.product.handle,
        title: line.product.title,
        variantId: line.variantId ?? line.product.shopifyVariantId,
        quantity: line.quantity,
        size: line.size,
        color: line.color,
      }
    : line;
}

export function CheckoutButton({ lines, mode = 'cart', className, onStart, children, priceLabel }: CheckoutButtonProps) {
  const { country } = useStore();
  const unavailable = lines.some((line) => !toInput(line).variantId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const checkout = async () => {
    if (!lines.length) {
      setError('Your bag is empty.');
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);
    setPending(true);
    setError('');
    onStart?.();

    try {
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: lines.map(toInput), mode, country: country.code }),
        signal: controller.signal,
      });
      const data = await response.json() as { checkoutUrl?: string; error?: string };
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error ?? 'Checkout is temporarily unavailable. Please try again.');
      window.location.assign(data.checkoutUrl);
    } catch (checkoutError) {
      const message = checkoutError instanceof DOMException && checkoutError.name === 'AbortError'
        ? 'Checkout preparation timed out. Please try again.'
        : checkoutError instanceof Error
          ? checkoutError.message
          : 'Checkout is temporarily unavailable. Please try again.';
      setError(message);
      setPending(false);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  return (
    <div className="checkout-action">
      {mode === 'buy-now'
        ? <BuyNowButton onClick={checkout} disabled={unavailable} pending={pending} priceLabel={priceLabel} />
        : <button type="button" className={className ?? 'add-button'} onClick={checkout} disabled={pending || unavailable} aria-busy={pending}>
            {unavailable ? 'Currently unavailable' : pending ? <><InlineLoader label="Preparing checkout" />Preparing checkout…</> : children ?? 'Proceed to checkout'}
          </button>}
      {error && <p className="checkout-error" role="alert">{error}</p>}
    </div>
  );
}
