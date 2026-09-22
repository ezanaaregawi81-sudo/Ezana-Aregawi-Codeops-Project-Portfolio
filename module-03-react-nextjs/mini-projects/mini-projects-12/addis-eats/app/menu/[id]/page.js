import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDishById, getAllDishes } from '@/lib/dishes';
import AddToCartButton from '../../AddToCartButton';

export async function generateStaticParams() {
  const dishes = getAllDishes();
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return { title: 'Dish Not Found - Addis Eats' };

  return {
    title: `${dish.name} (${dish.amharicName}) - Addis Eats`,
    description: dish.description,
  };
}

export default async function DishDetailPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back to Menu Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/menu" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} id="back-to-menu-link">
          &larr; Back to Full Menu
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div
            className="dish-icon-header"
            style={{ width: '160px', height: '160px', fontSize: '5rem', margin: 0, flexShrink: 0 }}
          >
            <span>{dish.image}</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">{dish.category}</span>
              <span className={`badge ${dish.isFasting ? 'badge-green' : 'badge-gold'}`}>
                {dish.isFasting ? 'Fasting 🌱' : 'Traditional 🥩'}
              </span>
              <span className="badge badge-red">{dish.spiceLevel}</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }}>{dish.name}</h1>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', margin: '0.25rem 0 1rem' }}>
              {dish.amharicName}
            </h2>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
              {dish.priceFormatted}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>About this Dish</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {dish.description}
          </p>
        </div>

        {/* Ingredients List */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Key Ingredients & Spices</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {dish.ingredients.map((ing, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                }}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <AddToCartButton dish={dish} className="btn btn-primary" style={{ flex: 1, padding: '1rem' }} id="add-to-cart-btn">
            🛒 Add to Cart
          </AddToCartButton>
          <Link href="/checkout" className="btn btn-secondary" style={{ padding: '1rem 1.5rem' }} id="quick-checkout-btn">
            Quick Checkout &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
