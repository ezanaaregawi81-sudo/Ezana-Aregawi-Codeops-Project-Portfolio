'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useDebounce } from '@/lib/use-debounce';
import DishList from './DishList';

// Keeps ?q= and ?page= in the address bar so a results page can be bookmarked or shared.
// The History API updates useSearchParams without a server round trip (no RSC request).
function syncUrl(query, page, mode) {
  const params = new URLSearchParams(window.location.search);
  query ? params.set('q', query) : params.delete('q');
  page > 1 ? params.set('page', String(page)) : params.delete('page');
  const search = params.toString();
  window.history[mode](null, '', search ? `?${search}` : window.location.pathname);
}

// `children` is the server-rendered category list. It shows whenever the search box is empty.
export default function MenuSearch({ children }) {
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get('q') ?? '');
  const query = useDebounce(text.trim());
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  // Empty query → null key → SWR sends no request at all.
  const key = query ? `/api/dishes/search?q=${encodeURIComponent(query)}&page=${page}` : null;
  const { data, error, isLoading } = useSWR(key, fetcher, { keepPreviousData: true });

  // keepPreviousData would keep returning the last results after the box is cleared, so gate on the key.
  const results = key ? data : null;

  function onType(event) {
    setText(event.target.value);
    syncUrl(event.target.value.trim(), 1, 'replaceState');
  }

  return (
    <div>
      <div className="menu-search">
        <span aria-hidden="true">🔎</span>
        <input
          type="search"
          aria-label="Search dishes"
          placeholder="Search dishes, e.g. tibs or ሽሮ"
          value={text}
          onChange={onType}
          autoComplete="off"
        />
      </div>

      {!key ? (
        children
      ) : error ? (
        <p role="alert" className="form-error">{error.message}</p>
      ) : !results ? (
        <p className="state-text">Searching…</p>
      ) : (
        <div className={isLoading ? 'search-results is-stale' : 'search-results'} aria-busy={isLoading}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {results.matchCount} match{results.matchCount === 1 ? '' : 'es'} for “{results.query}”
            {isLoading && ' · loading…'}
          </p>

          <DishList dishes={results.dishes} />

          {results.pageCount > 1 && (
            <div className="pager">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={results.page === 1}
                onClick={() => syncUrl(query, results.page - 1, 'pushState')}
              >
                &larr; Prev
              </button>
              <span>
                {results.page} / {results.pageCount}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={results.page === results.pageCount}
                onClick={() => syncUrl(query, results.page + 1, 'pushState')}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
