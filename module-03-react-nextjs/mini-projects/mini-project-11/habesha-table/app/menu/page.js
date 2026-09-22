import { Suspense } from 'react';
import { getMenuItems, getMenuCategories } from '@/lib/menu-catalog';
import DishCollectionSkeleton from './DishCollectionSkeleton';
import MenuBrowser from './MenuBrowser';
import ErrorTrigger from './ErrorTrigger';

// Requirement 3: The menu route on a justified revalidate window, marked static in the build.
// Justification: Dishes and prices update periodically in background, so a 60-second ISR window is optimal.
export const revalidate = 60;

// Requirement 6: Streamed component rendering behind instantly loaded layout sidebar
async function StreamedMenuList() {
  const allDishes = getMenuItems();
  const categories = getMenuCategories();

  return <MenuBrowser allDishes={allDishes} categories={categories} />;
}

export default function MenuPage() {
  return (
    <div>
      {/* Top Header & Test Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            Our Ethiopian Menu
          </h1>
          <p style={{ color: 'var(--ht-ink-soft)' }}>
            Traditional recipes crafted with authentic berbere, kibbeh, and teff injera.
          </p>
        </div>

        <Suspense fallback={null}>
          <ErrorTrigger />
        </Suspense>
      </div>

      {/* Requirement 6: Suspense boundary streaming the dish list behind instantly rendered sidebar */}
      <Suspense fallback={<DishCollectionSkeleton />}>
        <StreamedMenuList />
      </Suspense>
    </div>
  );
}
