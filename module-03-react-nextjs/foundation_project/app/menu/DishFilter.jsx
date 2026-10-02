'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuToolbar from '@/components/MenuToolbar';

// Client because search and sort are local UI state and the category comes from the
// URL. It does NOT render the dishes: the server-rendered DishList arrives as
// `children` and is only shown, hidden or reordered with CSS, so no dish markup or
// dish component code ships in this file's bundle.
//
// `index` is a tiny search index ({ id, category, text }) built on the server.
export default function DishFilter({ index, children }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');

  // Test hook for the error-boundary check: /menu?simulate=error throws during render
  // so app/menu/error.js can be seen on the production build.
  if (searchParams.get('simulate') === 'error') {
    throw new Error('Simulated menu failure (?simulate=error)');
  }

  const category = searchParams.get('category') ?? 'All';
  const needle = query.trim().toLowerCase();
  const visible = index.filter(
    (dish) => (category === 'All' || dish.category === category) && (!needle || dish.text.includes(needle)),
  );
  const visibleIds = new Set(visible.map((dish) => dish.id));
  const hiddenSelector = index
    .filter((dish) => !visibleIds.has(dish.id))
    .map((dish) => `#dish-${dish.id}`)
    .join(',');

  return (
    <>
      <MenuToolbar query={query} sort={sort} onQueryChange={setQuery} onSortChange={setSort} />
      <p className="result-count" role="status">
        {visible.length} dish{visible.length === 1 ? '' : 'es'} found
        {category !== 'All' && ` in ${category}`}
      </p>
      {hiddenSelector && <style>{`${hiddenSelector}{display:none}`}</style>}
      {visible.length === 0 && (
        <div className="empty-state">
          <p>No dishes match your search.</p>
        </div>
      )}
      <div data-sort={sort}>{children}</div>
    </>
  );
}
