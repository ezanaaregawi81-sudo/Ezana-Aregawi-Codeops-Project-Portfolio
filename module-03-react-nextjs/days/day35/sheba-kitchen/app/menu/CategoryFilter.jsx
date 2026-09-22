'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CategoryFilter({ categories }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <div className="sk-chip-row" role="tablist" aria-label="Filter dishes by category">
      <Link
        href="/menu"
        className={`sk-chip${!activeCategory ? ' sk-chip--active' : ''}`}
        aria-current={!activeCategory ? 'true' : undefined}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/menu?category=${encodeURIComponent(category)}`}
          className={`sk-chip${activeCategory === category ? ' sk-chip--active' : ''}`}
          aria-current={activeCategory === category ? 'true' : undefined}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
