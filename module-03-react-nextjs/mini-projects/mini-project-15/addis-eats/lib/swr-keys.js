// Every SWR key the app uses is built here. The server pages build their fallback keys with
// the same functions, so seeded data lands on exactly the key the client asks for.

export const orderUrl = (orderId) => `/api/orders/${encodeURIComponent(orderId)}`;

export function dishPageUrl(category, page) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  params.set('page', String(page));
  return `/api/menu?${params}`;
}

// An empty query returns null, and a null key tells SWR not to fetch.
export const dishSearchUrl = (query) => (query ? `/api/dishes/search?q=${encodeURIComponent(query)}` : null);

export function readPage(raw) {
  const page = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}
