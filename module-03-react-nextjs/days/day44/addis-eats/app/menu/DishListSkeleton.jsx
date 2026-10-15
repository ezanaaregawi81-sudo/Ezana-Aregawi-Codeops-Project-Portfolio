export default function DishListSkeleton() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: '140px', height: '36px', borderRadius: 'var(--radius-full)' }} />
      </div>

      <div className="dish-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="card dish-card">
            <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '18px', width: '40%' }} />
              <div className="skeleton" style={{ height: '14px', width: '25%' }} />
            </div>
            <div className="skeleton" style={{ height: '36px', width: '110px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
