export function ProductCardSkeleton() {
  return (
    <article className="product-card-skeleton" aria-hidden="true">
      <div className="product-card-skeleton__image skeleton-shimmer" />
      <div className="product-card-skeleton__line product-card-skeleton__line--title skeleton-shimmer" />
      <div className="product-card-skeleton__line product-card-skeleton__line--meta skeleton-shimmer" />
      <div className="product-card-skeleton__line product-card-skeleton__line--price skeleton-shimmer" />
    </article>
  );
}
