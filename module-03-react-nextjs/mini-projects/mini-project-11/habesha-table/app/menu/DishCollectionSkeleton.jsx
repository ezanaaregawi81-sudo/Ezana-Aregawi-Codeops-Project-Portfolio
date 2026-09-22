export default function DishCollectionSkeleton() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="ht-skeleton" style={{ width: '120px', height: '36px', borderRadius: 'var(--ht-radius-full)' }} />
        <div className="ht-skeleton" style={{ width: '100px', height: '36px', borderRadius: 'var(--ht-radius-full)' }} />
        <div className="ht-skeleton" style={{ width: '140px', height: '36px', borderRadius: 'var(--ht-radius-full)' }} />
      </div>

      <div className="ht-menu-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="ht-panel ht-dish-row" style={{ height: '150px' }}>
            <div className="ht-skeleton" style={{ flex: '0 0 140px', borderRadius: 'var(--ht-radius-md)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <div className="ht-skeleton" style={{ height: '24px', width: '70%' }} />
              <div className="ht-skeleton" style={{ height: '16px', width: '40%' }} />
              <div className="ht-skeleton" style={{ height: '38px', width: '100%', marginTop: 'auto' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
