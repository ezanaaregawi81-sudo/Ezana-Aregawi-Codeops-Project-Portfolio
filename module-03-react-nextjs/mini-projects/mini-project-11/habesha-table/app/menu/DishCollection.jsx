import Link from 'next/link';
import AddToOrderButton from '../AddToOrderButton';

export default function DishCollection({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="ht-empty-state">
        <div className="ht-empty-icon">🍽️</div>
        <h3 className="ht-empty-title">No Dishes Found</h3>
        <p className="ht-empty-text">There are no menu items matching the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="ht-menu-grid">
      {dishes.map((dish) => (
        <div key={dish.id} className="ht-panel ht-dish-row">
          <div className="ht-dish-media">
            <span style={{ fontSize: '3rem' }}>{dish.image}</span>
            <span
              className={`ht-tag ${dish.isFasting ? 'ht-tag--primary' : 'ht-tag--accent'}`}
              style={{ position: 'absolute', top: '12px', right: '12px' }}
            >
              {dish.isFasting ? 'Fasting 🌱' : 'Traditional'}
            </span>
          </div>

          <div className="ht-dish-body">
            <div className="ht-dish-head">
              <h3 className="ht-dish-name">{dish.name}</h3>
            </div>
            <div className="ht-dish-amharic">{dish.amharicName}</div>
            <p className="ht-dish-desc">{dish.description}</p>

            <div className="ht-dish-foot">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="ht-dish-price">{dish.priceFormatted}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--ht-ink-soft)' }}>
                  {dish.spiceLevel}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Link
                  href={`/menu/${dish.id}`}
                  className="ht-btn ht-btn--secondary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.875rem' }}
                  id={`dish-link-${dish.id}`}
                >
                  View Details
                </Link>
                <AddToOrderButton
                  dish={dish}
                  className="ht-btn ht-btn--primary"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem' }}
                  id={`dish-add-${dish.id}`}
                >
                  Add to Order
                </AddToOrderButton>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
