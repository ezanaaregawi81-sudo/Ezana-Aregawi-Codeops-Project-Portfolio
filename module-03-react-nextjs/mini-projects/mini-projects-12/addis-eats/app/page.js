import Link from 'next/link';
import { getAllDishes } from '@/lib/dishes';
import AddToCartButton from './AddToCartButton';

export default function HomePage() {
  const popularDishes = getAllDishes().filter((d) => d.popular).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
          ✨ Premier Ethiopian Kitchen
        </span>
        <h1 className="hero-title">
          Authentic Ethiopian Flavors,<br />Delivered Hot & Fresh
        </h1>
        <p className="hero-subtitle">
          Experience slow-simmered Doro Wat, spiced Kitfo, and rich Yetsom Beyaynetu prepared with traditional spices and fresh teff injera.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary" id="hero-menu-cta">
            Explore Full Menu 🍲
          </Link>
          <Link href="/cart" className="btn btn-secondary" id="hero-cart-cta">
            View Order Cart 🛒
          </Link>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Popular Signature Dishes</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Handpicked favorites from our traditional kitchen</p>
          </div>
          <Link href="/menu" className="btn btn-secondary" style={{ fontSize: '0.9rem' }} id="home-view-all-link">
            View All Dishes &rarr;
          </Link>
        </div>

        <div className="dish-grid">
          {popularDishes.map((dish) => (
            <div key={dish.id} className="card dish-card">
              <div className="dish-icon-header">
                <span>{dish.image}</span>
                <span className="badge badge-gold" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  {dish.spiceLevel}
                </span>
              </div>
              <div className="dish-info">
                <div className="dish-title-row">
                  <h3 className="dish-title">{dish.name}</h3>
                </div>
                <div className="dish-amharic">{dish.amharicName}</div>
                <p className="dish-desc">{dish.description}</p>

                <div className="dish-footer">
                  <span className="dish-price">{dish.priceFormatted}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Link href={`/menu/${dish.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.875rem' }} id={`featured-view-${dish.id}`}>
                      View Details
                    </Link>
                    <AddToCartButton dish={dish} className="btn btn-primary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem' }} id={`featured-add-${dish.id}`}>
                      Add to Cart
                    </AddToCartButton>
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
