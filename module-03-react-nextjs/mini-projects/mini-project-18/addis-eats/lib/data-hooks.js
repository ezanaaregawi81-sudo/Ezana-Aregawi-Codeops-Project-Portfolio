'use client';

import useSWR from 'swr';
import { dishPageUrl, dishSearchUrl, orderUrl } from './swr-keys';

// All client-side queries, with their refresh rules side by side. DATA.md explains each one.
// None of them passes a fetcher: they all inherit the shared one from <SWRConfig> in Providers.

export const ORDER_POLL_MS = 5_000;
const MENU_CACHE_MS = 60_000; // same window as the /menu page's `revalidate = 60`

const isSettled = (order) => order?.status === 'delivered' || order?.status === 'cancelled';

// Polls every 5s while the order can still move, and stops once it's delivered or cancelled.
export function useTrackedOrder(orderId, initialOrder) {
  return useSWR(orderUrl(orderId), {
    fallbackData: initialOrder,
    refreshInterval: (latest) => (isSettled(latest) ? 0 : ORDER_POLL_MS),
  });
}

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
