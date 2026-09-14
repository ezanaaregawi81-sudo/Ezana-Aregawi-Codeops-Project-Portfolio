function RouteSkeleton() {
  return (
    <div className="route-skeleton" aria-busy="true" aria-live="polite">
      <div className="skeleton-block skeleton-title" />
      <div className="skeleton-block skeleton-line" />
      <div className="skeleton-block skeleton-line short" />
    </div>
  );
}

export default RouteSkeleton;
