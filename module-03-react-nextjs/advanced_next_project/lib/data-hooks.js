'use client';

import useSWR from 'swr';
import { dishPageUrl, dishSearchUrl } from './swr-keys';

// All client-side queries, with their refresh rules side by side. DATA.md explains each one.
// None of them passes a fetcher: they all inherit the shared one from <SWRConfig> in Providers.
// The order tracker used to be here (a 5s poll); since mini-project 19 it follows a live
// Server-Sent Events stream instead (TRACKING.md).

const MENU_CACHE_MS = 60_000; // same window as the /menu page's `revalidate = 60`

// One page of dishes. Holds the old page on screen while the next one loads.
export function useDishPage(category, page) {
  return useSWR(dishPageUrl(category, page), {
    keepPreviousData: true,
    dedupingInterval: MENU_CACHE_MS,
    revalidateOnFocus: false,
  });
}

// Whole-menu search. Pass an already-debounced query; '' becomes a null key (no request).
export function useDishSearch(query) {
  return useSWR(dishSearchUrl(query), {
    keepPreviousData: true,
    dedupingInterval: MENU_CACHE_MS,
    revalidateOnFocus: false,
  });
}
