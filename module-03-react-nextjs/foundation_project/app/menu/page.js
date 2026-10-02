import { Suspense } from 'react';
import { getDishes } from '@/lib/dishes';
import DishList from '@/components/DishList';
import MenuToolbar from '@/components/MenuToolbar';
import DishFilter from './DishFilter';

// ISR: the menu changes a few times a day, so up to an hour of staleness is fine.
// This page reads no cookies, headers or searchParams — the category filter is read
// on the client by DishFilter — so it stays prerendered.
export const revalidate = 3600;

export const metadata = { title: 'Menu' };

export default async function MenuPage() {
  const dishes = await getDishes();

  // Server component reads the data directly: no fetch to our own /api/dishes.
  const list = <DishList dishes={dishes} withRanks />;
  const index = dishes.map((dish) => ({
    id: dish.id,
    category: dish.category,
    text: `${dish.name} ${dish.description} ${dish.tags.join(' ')}`.toLowerCase(),
  }));

  return (
    <>
      <section className="hero">
        <h1>Taste of Addis, delivered.</h1>
        <p>Authentic Ethiopian dishes made fresh — order from our full menu below.</p>
      </section>

      {/* The prerendered HTML holds the full, unfiltered menu; DishFilter takes over
          once the browser knows the URL. Without JavaScript you still see every dish. */}
      <Suspense
        fallback={
          <>
            <MenuToolbar />
            <p className="result-count">{dishes.length} dishes found</p>
            <div data-sort="default">{list}</div>
          </>
        }
      >
        <DishFilter index={index}>{list}</DishFilter>
      </Suspense>
    </>
  );
}
