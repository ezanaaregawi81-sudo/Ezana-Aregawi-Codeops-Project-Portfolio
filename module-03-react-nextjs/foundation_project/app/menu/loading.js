// Shown inside app/menu/layout.js (the sidebar and the site header stay put) while
// the menu or a dish page is on its way — e.g. on a slow connection.
export default function MenuLoading() {
  return (
    <div role="status" aria-label="Loading the menu">
      <span className="visually-hidden">Loading the menu…</span>
      <div className="hero" aria-hidden="true">
        <div className="skeleton" style={{ height: '2.4rem', width: 'min(420px, 80%)', margin: '0 auto 0.75rem' }} />
        <div className="skeleton" style={{ height: '1.1rem', width: 'min(520px, 90%)', margin: '0 auto' }} />
      </div>
      <div className="toolbar" aria-hidden="true">
        <div className="skeleton" style={{ height: '2.8rem', flex: '1 1 260px' }} />
        <div className="skeleton" style={{ height: '2.6rem', width: '170px' }} />
      </div>
      <div className="dish-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton skeleton-card__media" />
            <div className="skeleton-card__body">
              <div className="skeleton" style={{ height: '1.1rem', width: '70%' }} />
              <div className="skeleton" style={{ height: '0.9rem', width: '45%' }} />
              <div className="skeleton" style={{ height: '1.9rem', width: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
