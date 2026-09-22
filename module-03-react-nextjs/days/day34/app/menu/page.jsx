import { catalog } from '../../lib/dishes';
import CategoryFilter from './CategoryFilter';
import DishGrid from './DishGrid';

const categories = [...new Set(catalog.map((dish) => dish.category))];

// Simulates a data fetch so loading.jsx has something to show, and lets
// error.jsx be verified on demand via the ?error=true query param.
async function loadMenu(simulateError) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (simulateError) {
    throw new Error('Failed to load the menu. Please try again.');
  }

  return catalog;
}

export default async function MenuPage({ searchParams }) {
  const { error, category } = await searchParams;
  const menu = await loadMenu(error === 'true');
  const visibleDishes = category ? menu.filter((dish) => dish.category === category) : menu;

  return (
    <div className="sk-shell">
      <div className="sk-shell-header">
        <span className="sk-kicker">Menu</span>
        <h1 className="sk-title">Our dishes</h1>
        <p className="sk-subtitle">Pick a category, tap a dish to see details, and add it to your basket.</p>
      </div>
      <CategoryFilter categories={categories} activeCategory={category} />
      {visibleDishes.length > 0 ? (
        <DishGrid dishes={visibleDishes} />
      ) : (
        <div className="sk-empty">
          <span className="sk-empty-icon" aria-hidden="true">
            🍽️
          </span>
          <h2 style={{ fontSize: '1.1rem' }}>No dishes in this category</h2>
          <p className="sk-subtitle">Try a different category.</p>
        </div>
      )}
    </div>
  );
}
