import { Suspense } from 'react';
import { getAllDishes, getCategories } from '@/lib/dishes';
import DishListSkeleton from './DishListSkeleton';
import DishList from './DishList';
import CategoryBar from './CategoryBar';
import ErrorSimulator from './ErrorSimulator';
import MenuSearch from './MenuSearch';

export const revalidate = 60;

async function StreamedMenuList({ activeCategory }) {
  const allDishes = getAllDishes();
  const filteredDishes =
    activeCategory === 'All'
      ? allDishes
      : allDishes.filter((dish) => dish.category === activeCategory);

  return <DishList dishes={filteredDishes} />;
}

export default async function MenuPage({ searchParams }) {
  const { category } = await searchParams;
  const activeCategory = category || 'All';
  const categories = getCategories();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Our Ethiopian Menu
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Traditional recipes crafted with authentic berbere, kibbeh, and teff injera.
          </p>
        </div>

        <Suspense fallback={null}>
          <ErrorSimulator />
        </Suspense>
      </div>

      {/* MenuSearch reads useSearchParams, so it needs its own Suspense boundary. The category
          view is passed in as children and stays server-rendered; it shows while the box is empty. */}
      <Suspense fallback={<DishListSkeleton />}>
        <MenuSearch>
          <CategoryBar categories={categories} activeCategory={activeCategory} />

          <Suspense fallback={<DishListSkeleton />} key={activeCategory}>
            <StreamedMenuList activeCategory={activeCategory} />
          </Suspense>
        </MenuSearch>
      </Suspense>
    </div>
  );
}
