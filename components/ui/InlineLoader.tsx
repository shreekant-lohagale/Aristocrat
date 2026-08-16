type InlineLoaderProps = {
  label?: string;
  className?: string;
};

export function InlineLoader({ label = 'Loading', className = '' }: InlineLoaderProps) {
  return (
    <span className={`inline-loader ${className}`.trim()} role="status">
      <span className="inline-loader__mark" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
