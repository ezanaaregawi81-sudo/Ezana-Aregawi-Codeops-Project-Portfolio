import Link from 'next/link';
import { getMenuItems } from '@/lib/menu-catalog';
import AddToOrderButton from './AddToOrderButton';

export default function HomePage() {
  const popularDishes = getMenuItems().filter((d) => d.popular).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="ht-hero">
        <span className="ht-tag ht-tag--primary" style={{ marginBottom: '1rem' }}>
          ✨ Premier Ethiopian Kitchen
        </span>
        <h1 className="ht-hero__title">
          Authentic Ethiopian Flavors,<br />Delivered Hot & Fresh
        </h1>
        <p className="ht-hero__subtitle">
          Experience slow-simmered Doro Wat, spiced Kitfo, and rich Yetsom Beyaynetu prepared with traditional spices and fresh teff injera.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/menu" className="ht-btn ht-btn--primary" id="hero-menu-cta">
            Explore Full Menu 🍲
          </Link>
          <Link href="/cart" className="ht-btn ht-btn--secondary" id="hero-cart-cta">
            View Order Cart 🛒
          </Link>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Popular Signature Dishes</h2>
            <p style={{ color: 'var(--ht-ink-soft)' }}>Handpicked favorites from our traditional kitchen</p>
          </div>
          <Link href="/menu" className="ht-btn ht-btn--secondary" style={{ fontSize: '0.9rem' }} id="home-view-all-link">
            View All Dishes &rarr;
          </Link>
        </div>

        <div className="ht-menu-list">
          {popularDishes.map((dish) => (
            <div key={dish.id} className="ht-panel ht-dish-row">
              <div className="ht-dish-row__media">
                <span>{dish.image}</span>
              </div>
              <div className="ht-dish-row__body">
                <div className="ht-dish-row__title-line">
                  <h3 className="ht-dish-row__title">{dish.name}</h3>
                  <span className="ht-tag ht-tag--primary">{dish.spiceLevel}</span>
                </div>
                <div className="ht-dish-row__amharic">{dish.amharicName}</div>
                <p className="ht-dish-row__desc">{dish.description}</p>

                <div className="ht-dish-row__footer">
                  <span className="ht-dish-row__price">{dish.priceFormatted}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Link href={`/menu/${dish.id}`} className="ht-btn ht-btn--secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.875rem' }} id={`featured-view-${dish.id}`}>
                      View Details
                    </Link>
                    <AddToOrderButton dish={dish} className="ht-btn ht-btn--primary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem' }} id={`featured-add-${dish.id}`}>
                      Add to Order
                    </AddToOrderButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
