'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type ImageWithLoaderProps = ImageProps & {
  wrapperClassName?: string;
};

export function ImageWithLoader({
  alt,
  className = '',
  onError,
  onLoad,
  wrapperClassName = '',
  ...props
}: ImageWithLoaderProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`image-with-loader ${wrapperClassName}`.trim()}>
      {state === 'loading' && <span className="image-with-loader__placeholder skeleton-shimmer" aria-hidden="true" />}
      {state === 'error' && <span className="image-with-loader__error">Image unavailable</span>}
      <Image
        {...props}
        alt={alt}
        className={`image-with-loader__image ${state === 'loaded' ? 'is-loaded' : ''} ${className}`.trim()}
        onLoad={(event) => {
          setState('loaded');
          onLoad?.(event);
        }}
        onError={(event) => {
          setState('error');
          onError?.(event);
        }}
      />
    </div>
  );
}
