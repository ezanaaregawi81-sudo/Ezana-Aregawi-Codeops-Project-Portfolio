import { Suspense } from 'react';
import { getCategories, getDishPage } from '@/lib/dishes';
import { dishPageUrl, readPage } from '@/lib/swr-keys';
import DishListSkeleton from './DishListSkeleton';
import CategoryBar from './CategoryBar';
import ErrorSimulator from './ErrorSimulator';
import MenuExplorer from './MenuExplorer';

export const revalidate = 60;

const CATEGORY_BLURBS = {
  Signature: 'House favourites: doro wat, special kitfo, key wat, gomen be siga and chechebsa',
  'Fasting / Veggie': 'Meat- and dairy-free dishes for fasting days: shiro, misir wat, atkilt wat and the yetsom beyaynetu combo',
  Tibs: 'Beef tibs three ways: derek, special and zilzil, seared with onion, rosemary and chili',
};

// /menu accepts ?category= and ?page= (and testers add ?simError=, sharers add utm tags), so one
// list can live at many URLs. The canonical URL keeps only what changes the content: a real
// category, and an existing page number above 1.
export async function generateMetadata({ searchParams }) {
  const { category, page } = await searchParams;
  const realCategory = getCategories().includes(category) && category !== 'All' ? category : null;
  const { page: realPage } = getDishPage(realCategory ?? 'All', readPage(page));

  const query = new URLSearchParams();
  if (realCategory) query.set('category', realCategory);
  if (realPage > 1) query.set('page', String(realPage));

  return {
    title: realCategory ? `${realCategory} dishes` : 'Full menu',
    description: realCategory
      ? `${CATEGORY_BLURBS[realCategory]}. Prices in ETB, delivered across Addis Ababa by Addis Eats.`
      : 'Every Addis Eats dish in one place, from doro wat and kitfo to tibs and fasting platters, with prices in ETB and spice levels.',
    // No `openGraph` here: it would replace the inherited one and lose the site-wide og:image.
    alternates: { canonical: query.size ? `/menu?${query}` : '/menu' },
  };
}

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
          {/* One h1, naming what this URL shows: the full menu or one category of it. */}
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {activeCategory === 'All' ? 'Our Ethiopian Menu' : `${activeCategory} dishes`}
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
