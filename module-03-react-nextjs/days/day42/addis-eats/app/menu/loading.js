export default function MenuLoading() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="skeleton" style={{ height: '36px', width: '220px', marginBottom: '0.75rem' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '400px' }}></div>
      </div>

      <div className="category-bar">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '32px', width: '90px', borderRadius: '9999px', flexShrink: 0 }}
          ></div>
        ))}
      </div>

      <div className="dish-grid" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card dish-card">
            <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '18px', width: '40%' }}></div>
              <div className="skeleton" style={{ height: '14px', width: '25%' }}></div>
            </div>
            <div className="skeleton" style={{ height: '36px', width: '110px' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
