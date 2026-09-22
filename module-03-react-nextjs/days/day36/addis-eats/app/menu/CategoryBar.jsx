import Link from 'next/link';

export default function CategoryBar({ categories, activeCategory }) {
  return (
    <div className="category-bar" role="tablist" aria-label="Menu categories">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={cat === 'All' ? '/menu' : `/menu?category=${encodeURIComponent(cat)}`}
          role="tab"
          aria-selected={activeCategory === cat}
          className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
          id={`category-btn-${cat.toLowerCase().replace(/[^a-z0-random]/g, '')}`}
        >
          {cat === 'All' && '🍽️ '}
          {cat === 'Signature' && '👑 '}
          {cat === 'Fasting / Veggie' && '🌱 '}
          {cat === 'Tibs' && '🔥 '}
          {cat}
        </Link>
      ))}
    </div>
  );
}
