export default function MenuLoading() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="ht-skeleton" style={{ height: '36px', width: '220px', marginBottom: '0.75rem' }}></div>
        <div className="ht-skeleton" style={{ height: '20px', width: '400px' }}></div>
      </div>

      {/* Skeleton Category Bar */}
      <div className="ht-tab-row">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="ht-skeleton"
            style={{ height: '38px', width: '100px', borderRadius: '9999px', flexShrink: 0 }}
          ></div>
        ))}
      </div>

      {/* Skeleton Dish List */}
      <div className="ht-menu-grid" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="ht-panel ht-dish-row" style={{ height: '150px' }}>
            <div className="ht-skeleton" style={{ flex: '0 0 140px', borderRadius: 'var(--ht-radius-md)' }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <div className="ht-skeleton" style={{ height: '24px', width: '70%' }}></div>
              <div className="ht-skeleton" style={{ height: '16px', width: '40%' }}></div>
              <div className="ht-skeleton" style={{ height: '16px', width: '90%' }}></div>
              <div className="ht-skeleton" style={{ height: '38px', width: '100%', marginTop: 'auto' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
