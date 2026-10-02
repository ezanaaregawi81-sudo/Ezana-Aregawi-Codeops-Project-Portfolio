import { Suspense } from 'react';
import { getCategories } from '@/lib/dishes';
import CategoryBar from '@/components/CategoryBar';
import CategoryList from '@/components/CategoryList';

// Nested layout for /menu and /menu/[id]: the category sidebar stays mounted while
// you move between the menu and a dish, and loading.js / error.js render beside it.
export default async function MenuLayout({ children }) {
  const categories = await getCategories();

  return (
    <div className="page menu-layout">
      <aside className="category-sidebar" aria-labelledby="category-heading">
        <h2 id="category-heading">Categories</h2>
        <nav aria-label="Menu categories">
          <Suspense fallback={<CategoryList categories={categories} />}>
            <CategoryBar categories={categories} />
          </Suspense>
        </nav>
      </aside>
      <div className="menu-layout__content">{children}</div>
    </div>
  );
}
