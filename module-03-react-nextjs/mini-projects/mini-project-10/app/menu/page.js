'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { getMenuItems, getMenuCategories } from '@/lib/menu-catalog';
import CategoryTabs from './CategoryTabs';
import DishCollection from './DishCollection';

export default function MenuPage({ searchParams }) {
  // Handle async searchParams in Next.js 15
  const resolvedSearchParams = searchParams ? use(Promise.resolve(searchParams)) : {};

  // Trigger error simulation if requested via query param ?error=true or ?simError=true
  if (resolvedSearchParams?.error === 'true' || resolvedSearchParams?.simError === 'true') {
    throw new Error('Simulated Menu Error: Triggered via query parameter (?simError=true) for testing error.js boundary!');
  }

  const [activeCategory, setActiveCategory] = useState('All');
  const allDishes = getMenuItems();
  const categories = getMenuCategories();

  const filteredDishes =
    activeCategory === 'All'
      ? allDishes
      : allDishes.filter((d) => d.category === activeCategory);

  return (
    <div>
      {/* Top Header & Simulation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Our Ethiopian Menu
          </h1>
          <p style={{ color: 'var(--ht-ink-soft)' }}>
            Traditional recipes crafted with authentic berbere, kibbeh, and teff injera.
          </p>
        </div>

        {/* Simulation Controls for Requirements Verification */}
        <div className="ht-toolbar">
          <span style={{ fontSize: '0.8rem', color: 'var(--ht-ink-faint)' }}>Test States:</span>
          <Link href="/menu?simError=true" className="ht-simlink" id="sim-error-link">
            ⚠️ Trigger Error UI
          </Link>
        </div>
      </div>

      {/* Category Selection Filter Component (Colocated) */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Dish Collection Component (Colocated) */}
      <DishCollection dishes={filteredDishes} />
    </div>
  );
}
