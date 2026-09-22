import Link from 'next/link';
import { getMenuItems } from '@/lib/menu-catalog';
import AddToOrderButton from './AddToOrderButton';

export default function HomePage() {
  const popularDishes = getMenuItems().filter((d) => d.popular).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="ht-hero">
        <span className="ht-tag ht-tag--accent" style={{ marginBottom: '1rem' }}>
          ✨ Premier Ethiopian Kitchen
        </span>
        <h1 className="ht-hero-title">
          Authentic Ethiopian Flavors,<br />Delivered Hot & Fresh
        </h1>
        <p className="ht-hero-subtitle">
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
            <h2 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '1.8rem', fontWeight: '700' }}>Popular Signature Dishes</h2>
            <p style={{ color: 'var(--ht-ink-soft)' }}>Handpicked favorites from our traditional kitchen</p>
          </div>
          <Link href="/menu" className="ht-btn ht-btn--secondary" style={{ fontSize: '0.9rem' }} id="home-view-all-link">
            View All Dishes &rarr;
          </Link>
        </div>

        <div className="ht-menu-grid">
          {popularDishes.map((dish) => (
            <div key={dish.id} className="ht-panel ht-dish-row">
              <div className="ht-dish-media">
                <span>{dish.image}</span>
                <span className="ht-tag ht-tag--accent" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  {dish.spiceLevel}
                </span>
              </div>
              <div className="ht-dish-body">
                <div className="ht-dish-head">
                  <h3 className="ht-dish-name">{dish.name}</h3>
                </div>
                <div className="ht-dish-amharic">{dish.amharicName}</div>
                <p className="ht-dish-desc">{dish.description}</p>

                <div className="ht-dish-foot">
                  <span className="ht-dish-price">{dish.priceFormatted}</span>
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
