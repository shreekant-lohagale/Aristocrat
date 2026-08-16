export function SectionLoader({ label = 'Loading the edit...' }: { label?: string }) {
  return (
    <div className="section-loader" role="status" aria-live="polite">
      <span className="section-loader__line" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
