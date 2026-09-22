import Link from 'next/link';
import AddToOrderButton from '../AddToOrderButton';

export default function DishCollection({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="ht-state">
        <div className="ht-state__icon">🍽️</div>
        <h3 className="ht-state__title">No Dishes Found</h3>
        <p className="ht-state__text">There are no menu items matching the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="ht-menu-list">
      {dishes.map((dish) => (
        <div key={dish.id} className="ht-panel ht-dish-row">
          <div className="ht-dish-row__media">
            <span>{dish.image}</span>
          </div>

          <div className="ht-dish-row__body">
            <div className="ht-dish-row__title-line">
              <h3 className="ht-dish-row__title">{dish.name}</h3>
              <span className={`ht-tag ${dish.isFasting ? 'ht-tag--fasting' : 'ht-tag--primary'}`}>
                {dish.isFasting ? 'Fasting 🌱' : 'Traditional'}
              </span>
            </div>
            <div className="ht-dish-row__amharic">{dish.amharicName}</div>
            <p className="ht-dish-row__desc">{dish.description}</p>

            <div className="ht-dish-row__footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="ht-dish-row__price">{dish.priceFormatted}</span>
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
