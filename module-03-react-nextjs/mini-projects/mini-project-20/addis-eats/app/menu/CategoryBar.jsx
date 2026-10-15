import Link from 'next/link';

export default function CategoryBar({ categories, activeCategory }) {
  return (
    // Links, each its own URL, in a <nav>; the current one is aria-current="page". It used to claim
    // role="tablist", which promises arrow-key tab behaviour plain links don't have.
    <nav className="category-bar" aria-label="Menu categories">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={cat === 'All' ? '/menu' : `/menu?category=${encodeURIComponent(cat)}`}
          aria-current={activeCategory === cat ? 'page' : undefined}
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
    </nav>
  );
}
