'use client';

import { ShoppingBag } from 'lucide-react';
import { InlineLoader } from '@/components/ui/InlineLoader';
import styles from './BuyNowButton.module.css';

type BuyNowButtonProps = {
  disabled?: boolean;
  pending?: boolean;
  priceLabel?: string;
  onClick: () => void;
};

export function BuyNowButton({ disabled = false, pending = false, priceLabel, onClick }: BuyNowButtonProps) {
  const accessibleLabel = priceLabel ? `Buy now for ${priceLabel}` : 'Buy now';

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={disabled || pending}
      aria-label={pending ? 'Preparing checkout' : accessibleLabel}
      aria-busy={pending}
    >
      {priceLabel && <span className={styles.tooltip} role="tooltip">{priceLabel}</span>}
      <span className={styles.content}>
        {pending
          ? <span className={styles.label}><InlineLoader label="Preparing checkout" />Preparing checkout…</span>
          : <><span className={styles.label}>Buy Now</span><span className={styles.icon} aria-hidden="true"><ShoppingBag size={18} strokeWidth={1.5} /></span></>}
      </span>
    </button>
  );
}
