import Link from 'next/link';
import AddToCartButton from '../AddToCartButton';

export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="state-container">
        <div className="state-icon">🍽️</div>
        <h3 className="state-title">No Dishes Found</h3>
        <p className="state-text">There are no menu items matching the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <div key={dish.id} className="card dish-card">
          <div className="dish-icon-header">
            <span style={{ fontSize: '3.5rem' }}>{dish.image}</span>
            <span
              className={`badge ${dish.isFasting ? 'badge-green' : 'badge-gold'}`}
              style={{ position: 'absolute', top: '12px', right: '12px' }}
            >
              {dish.isFasting ? 'Fasting 🌱' : 'Traditional'}
            </span>
          </div>

          <div className="dish-info">
            <div className="dish-title-row">
              <h3 className="dish-title">{dish.name}</h3>
            </div>
            <div className="dish-amharic">{dish.amharicName}</div>
            <p className="dish-desc">{dish.description}</p>

            <div className="dish-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="dish-price">{dish.priceFormatted}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {dish.spiceLevel}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Link
                  href={`/menu/${dish.id}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.875rem' }}
                  id={`dish-link-${dish.id}`}
                >
                  View Details
                </Link>
                <AddToCartButton
                  dish={dish}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem' }}
                  id={`dish-add-${dish.id}`}
                >
                  Add to Cart
                </AddToCartButton>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
