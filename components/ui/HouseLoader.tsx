export function HouseLoader() {
  return (
    <div
      className="house-loader-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading House of Aristocrat"
    >
      <div className="house-speeder" aria-hidden="true">
        <span>
          <span />
          <span />
          <span />
          <span />
        </span>

        <div className="house-speeder__base">
          <span />
          <div className="house-speeder__face" />
        </div>
      </div>

      <div className="house-longfazers" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="house-loader-brand" aria-hidden="true">
        <span>House of Aristocrat</span>
        <small>Everyday Fashion</small>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
