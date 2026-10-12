import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { DISH_PHOTO, getDishById, getAllDishes } from '@/lib/dishes';
import { absoluteUrl } from '@/lib/site';
import AddToCartButton from '../../AddToCartButton';

export async function generateStaticParams() {
  const dishes = getAllDishes();
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

// The dish's summary: the start of its description (shown in full on the page). Usually the
// first sentence; when that's too short to say much ("The iconic Ethiopian national dish."),
// the second sentence is added too.
function summaryOf(dish) {
  const sentences = dish.description.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [dish.description];
  return sentences[0].length < 60 && sentences[1] ? `${sentences[0]} ${sentences[1]}` : sentences[0];
}

// Built from the dish's name, price and summary, so each dish page has its own title and
// description, and they always match the page.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return { title: 'Dish not found' };

  const description = `${summaryOf(dish)} ${dish.priceFormatted} at Addis Eats.`;
  return {
    title: `${dish.name} · ${dish.priceFormatted}`,
    description,
    // The og:image is this folder's opengraph-image.js, a card made for this dish.
    openGraph: { title: `${dish.name} · ${dish.amharicName}`, description, url: `/menu/${dish.id}` },
  };
}

// schema.org MenuItem from the same `dish` the page renders: name is the h1, the offer's price is
// the {dish.priceFormatted} line ("<price> ETB"), description is the "About this Dish" text.
function menuItemJsonLd(dish) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: dish.name,
    alternateName: dish.amharicName,
    description: dish.description,
    url: absoluteUrl(`/menu/${dish.id}`),
    image: absoluteUrl(`/images/dishes/${dish.id}.jpg`),
    offers: { '@type': 'Offer', price: String(dish.price), priceCurrency: 'ETB' },
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
      {/* "<" is escaped so nothing in the JSON can close this script tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuItemJsonLd(dish)).replace(/</g, '\\u003c') }}
      />
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/menu" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} id="back-to-menu-link">
          &larr; Back to Full Menu
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Image
            src={`/images/dishes/${dish.id}.jpg`}
            alt={dish.name}
            {...DISH_PHOTO}
            sizes="240px"
            className="dish-thumb"
            style={{ width: '240px' }}
          />

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

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>About this Dish</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {dish.description}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Key Ingredients & Spices</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {dish.ingredients.map((ing, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                }}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

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
