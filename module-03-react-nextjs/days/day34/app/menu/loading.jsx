export default function MenuLoading() {
  return (
    <div className="sk-shell">
      <div className="sk-shell-header">
        <span className="sk-kicker">Menu</span>
        <h1 className="sk-title">Our dishes</h1>
      </div>

      <div className="sk-chip-row">
        <span className="sk-skeleton" style={{ width: '70px', height: '28px', borderRadius: '999px' }} />
        <span className="sk-skeleton" style={{ width: '90px', height: '28px', borderRadius: '999px' }} />
        <span className="sk-skeleton" style={{ width: '60px', height: '28px', borderRadius: '999px' }} />
      </div>

      <div className="sk-menu-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="sk-menu-row" style={{ gap: '0.75rem' }}>
            <span className="sk-skeleton" style={{ width: '44px', height: '44px', borderRadius: 'var(--sk-r-sm)' }} />
            <span className="sk-skeleton" style={{ width: '55%', height: '1.1rem' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
