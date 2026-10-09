import { Suspense } from 'react';
import { getCategories, getDishPage } from '@/lib/dishes';
import { dishPageUrl, readPage } from '@/lib/swr-keys';
import DishListSkeleton from './DishListSkeleton';
import CategoryBar from './CategoryBar';
import ErrorSimulator from './ErrorSimulator';
import MenuExplorer from './MenuExplorer';

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const { category, page } = await searchParams;
  const activeCategory = category || 'All';
  const categories = getCategories();

  // Render the page the URL asks for and seed SWR with it under the same key the client
  // will use. A shared /menu?page=2 link then paints real dishes with no request on mount.
  const requestedPage = readPage(page);
  const initialKey = dishPageUrl(activeCategory, requestedPage);
  const initialPage = getDishPage(activeCategory, requestedPage);

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

      <CategoryBar categories={categories} activeCategory={activeCategory} />

      {/* MenuExplorer reads useSearchParams, so it gets its own Suspense boundary. */}
      <Suspense fallback={<DishListSkeleton />}>
        <MenuExplorer initialKey={initialKey} initialPage={initialPage} />
      </Suspense>
    </div>
  );
}
