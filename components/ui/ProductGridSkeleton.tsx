import { ProductCardSkeleton } from './ProductCardSkeleton';
import { SectionLoader } from './SectionLoader';

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid-skeleton">
      <SectionLoader label="Loading the edit..." />
      <div className="catalog-grid">
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
