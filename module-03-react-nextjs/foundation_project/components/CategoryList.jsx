import Link from 'next/link';

// Pure markup with no hooks and no directive, so it can render on either side:
// as the prerendered fallback in app/menu/layout.js (server) and inside CategoryBar
// (client) once the URL is known.
export default function CategoryList({ categories, active = null }) {
  const total = categories.reduce((sum, category) => sum + category.count, 0);
  const items = [{ name: 'All', count: total }, ...categories];

  return (
    <ul className="category-list">
      {items.map((category) => {
        const isActive = category.name === active;
        const href = category.name === 'All' ? '/menu' : `/menu?category=${encodeURIComponent(category.name)}`;
        return (
          <li key={category.name}>
            <Link href={href} scroll={false} className="category-btn" data-active={isActive} aria-current={isActive ? 'true' : undefined}>
              <span>{category.name}</span>
              <span className="category-btn__count">
                {category.count}
                <span className="visually-hidden"> dishes</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
