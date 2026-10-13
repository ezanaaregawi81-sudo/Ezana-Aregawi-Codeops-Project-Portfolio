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
          <div key={idx} className="card dish-card" style={{ height: '160px' }}>
            <div className="skeleton" style={{ flex: '0 0 140px', borderRadius: 'var(--radius-md)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: '0.6rem' }}>
              <div className="skeleton" style={{ height: '24px', width: '50%' }} />
              <div className="skeleton" style={{ height: '16px', width: '30%' }} />
              <div className="skeleton" style={{ height: '40px', width: '140px', marginTop: 'auto' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
