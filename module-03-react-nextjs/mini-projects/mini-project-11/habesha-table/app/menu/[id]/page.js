import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMenuItemById, getMenuItems } from '@/lib/menu-catalog';
import AddToOrderButton from '../../AddToOrderButton';

// Requirement 4: generateStaticParams on the dish route, producing one page per dish at build time.
export async function generateStaticParams() {
  const dishes = getMenuItems();
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getMenuItemById(id);
  if (!dish) return { title: 'Dish Not Found - Habesha Table' };

  return {
    title: `${dish.name} (${dish.amharicName}) - Habesha Table`,
    description: dish.description,
  };
}

export default async function DishDetailPage({ params }) {
  // Extract dish ID directly from component params (await params)
  const { id } = await params;
  const dish = getMenuItemById(id);

  // Trigger custom 404 page if dish is not found
  if (!dish) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back to Menu Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/menu" className="ht-btn ht-btn--secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} id="back-to-menu-link">
          &larr; Back to Full Menu
        </Link>
      </div>

      <div className="ht-panel" style={{ padding: '2.5rem' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div
            className="ht-dish-media"
            style={{ width: '160px', height: '160px', fontSize: '5rem', flex: 'none', margin: 0 }}
          >
            <span>{dish.image}</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="ht-tag ht-tag--accent">{dish.category}</span>
              <span className={`ht-tag ${dish.isFasting ? 'ht-tag--primary' : 'ht-tag--accent'}`}>
                {dish.isFasting ? 'Fasting 🌱' : 'Traditional 🥩'}
              </span>
              <span className="ht-tag ht-tag--danger">{dish.spiceLevel}</span>
            </div>

            <h1 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '2.4rem', fontWeight: '700', lineHeight: 1.2 }}>{dish.name}</h1>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--ht-accent-strong)', margin: '0.25rem 0 1rem' }}>
              {dish.amharicName}
            </h2>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--ht-accent-strong)' }}>
              {dish.priceFormatted}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--ht-border)', margin: '1.5rem 0' }} />

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>About this Dish</h3>
          <p style={{ color: 'var(--ht-ink-soft)', fontSize: '1.05rem', lineHeight: '1.7' }}>
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
                  borderRadius: 'var(--ht-radius-sm)',
                  background: 'var(--ht-surface-soft)',
                  border: '1px solid var(--ht-border)',
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
          <AddToOrderButton dish={dish} className="ht-btn ht-btn--primary" style={{ flex: 1, padding: '1rem' }} id="add-to-cart-btn">
            🛒 Add to Order
          </AddToOrderButton>
          <Link href="/checkout" className="ht-btn ht-btn--secondary" style={{ padding: '1rem 1.5rem' }} id="quick-checkout-btn">
            Quick Checkout &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
