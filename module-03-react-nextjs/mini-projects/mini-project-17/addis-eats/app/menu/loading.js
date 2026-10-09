export default function MenuLoading() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="skeleton" style={{ height: '36px', width: '220px', marginBottom: '0.75rem' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '400px' }}></div>
      </div>

      {/* Skeleton Category Bar */}
      <div className="category-bar">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '38px', width: '100px', borderRadius: '9999px', flexShrink: 0 }}
          ></div>
        ))}
      </div>

      {/* Skeleton Dish Grid */}
      <div className="dish-grid" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
            <div className="skeleton" style={{ height: '120px', width: '100%', marginBottom: '1rem' }}></div>
            <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '0.5rem' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '1rem' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '0.5rem' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: 'auto' }}></div>
            <div
              className="skeleton"
              style={{ height: '38px', width: '100%', marginTop: '1rem' }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
