export default function MenuLoading() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="ht-skeleton" style={{ height: '36px', width: '220px', marginBottom: '0.75rem' }}></div>
        <div className="ht-skeleton" style={{ height: '20px', width: '400px' }}></div>
      </div>

      {/* Skeleton Category Tabs */}
      <div className="ht-tab-row">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="ht-skeleton"
            style={{ height: '38px', width: '100px', borderRadius: '9999px', flexShrink: 0 }}
          ></div>
        ))}
      </div>

      {/* Skeleton Menu List */}
      <div className="ht-menu-list" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="ht-panel" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="ht-skeleton" style={{ height: '96px', width: '96px', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="ht-skeleton" style={{ height: '24px', width: '50%', marginBottom: '0.5rem' }}></div>
              <div className="ht-skeleton" style={{ height: '16px', width: '30%', marginBottom: '0.75rem' }}></div>
              <div className="ht-skeleton" style={{ height: '16px', width: '90%', marginBottom: '0.5rem' }}></div>
              <div className="ht-skeleton" style={{ height: '38px', width: '40%', marginTop: '0.75rem' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
