'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SWRConfig } from 'swr';
import { useDishPage, useDishSearch } from '@/lib/data-hooks';
import { readPage } from '@/lib/swr-keys';
import { useDebounce } from '@/lib/use-debounce';
import DishList from './DishList';

// The server hands over the page it rendered as `fallback`, keyed by its URL. Being keyed,
// it can only stand in for that exact page, never for page 2 while page 2 is loading.
export default function MenuExplorer({ initialKey, initialPage }) {
  return (
    <SWRConfig value={{ fallback: { [initialKey]: initialPage } }}>
      <Explorer />
    </SWRConfig>
  );
}

// Writes ?page= with the History API. Next keeps useSearchParams in sync without fetching an
// RSC payload, so only /api/menu shows in the network tab, and the link stays shareable.
function goToPage(page) {
  const params = new URLSearchParams(window.location.search);
  page > 1 ? params.set('page', String(page)) : params.delete('page');
  const search = params.toString();
  window.history.pushState(null, '', search ? `?${search}` : window.location.pathname);
}

function Explorer() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const page = readPage(searchParams.get('page'));

  const [text, setText] = useState('');
  const query = useDebounce(text.trim());
  // True between a keystroke and the debounce settling: the results on screen are about to change.
  const typing = text.trim() !== query;

  const dishPage = useDishPage(category, page);
  const search = useDishSearch(query);

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="menu-search">
        <span aria-hidden="true">🔎</span>
        <input
          type="search"
          aria-label="Search the whole menu"
          placeholder="Search the whole menu, e.g. wat or ክትፎ"
          value={text}
          onChange={(event) => setText(event.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Decide from the query, not from data: keepPreviousData keeps returning old
          search results even after the key goes null. */}
      {query ? <SearchResults search={search} stale={typing || search.isLoading} /> : <PagedDishes dishPage={dishPage} />}
    </div>
  );
}

function SearchResults({ search, stale }) {
  const { data, error } = search;

  if (error) return <p role="alert" className="form-error">{error.message}</p>;
  if (!data) return <p className="state-text">Searching…</p>;

  return (
    <div className={stale ? 'live-list is-stale' : 'live-list'} aria-busy={stale}>
      {/* `query` comes from the response, so this label always describes the dishes below it. */}
      <p className="live-list-caption">
        {data.matchCount} match{data.matchCount === 1 ? '' : 'es'} for “{data.query}”{stale && ' · updating…'}
      </p>
      <DishList dishes={data.dishes} />
    </div>
  );
}

function PagedDishes({ dishPage }) {
  const { data, error, isLoading } = dishPage;

  if (error) return <p role="alert" className="form-error">{error.message}</p>;
  if (!data) return <p className="state-text">Loading dishes…</p>;

  return (
    <div className={isLoading ? 'live-list is-stale' : 'live-list'} aria-busy={isLoading}>
      <DishList dishes={data.dishes} />

      {data.pageCount > 1 && (
        <nav className="pager" aria-label="Menu pages">
          <button type="button" className="btn btn-secondary" disabled={data.page === 1} onClick={() => goToPage(data.page - 1)}>
            &larr; Prev
          </button>
          <span>
            Page {data.page} of {data.pageCount}
            {isLoading && ' · loading…'}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={data.page === data.pageCount}
            onClick={() => goToPage(data.page + 1)}
          >
            Next &rarr;
          </button>
        </nav>
      )}
    </div>
  );
}
