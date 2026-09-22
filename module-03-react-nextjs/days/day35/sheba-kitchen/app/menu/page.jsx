import { Suspense } from 'react';
import { catalog } from '../../lib/dishes';
import CategoryFilter from './CategoryFilter';
import MenuResults from './MenuResults';

export const revalidate = 60;

const categories = [...new Set(catalog.map((dish) => dish.category))];

export default function MenuPage() {
  return (
    <div>
      <div className="sk-shell-header">
        <span className="sk-kicker">Menu</span>
        <h1 className="sk-title">Our dishes</h1>
        <p className="sk-subtitle">Pick a category, tap a dish to see details, and add it to your basket.</p>
      </div>
      <Suspense fallback={<div className="sk-chip-row" />}>
        <CategoryFilter categories={categories} />
      </Suspense>
      <Suspense fallback={<div className="sk-skeleton" style={{ height: '180px', borderRadius: 'var(--sk-r-md)' }} />}>
        <MenuResults dishes={catalog} />
      </Suspense>
    </div>
  );
}
