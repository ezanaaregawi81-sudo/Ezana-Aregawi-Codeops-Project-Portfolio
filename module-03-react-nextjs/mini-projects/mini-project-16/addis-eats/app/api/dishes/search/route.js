import { searchDishes } from '@/lib/dishes';

// GET /api/dishes/search?q=tibs → { query, dishes, matchCount }
export async function GET(request) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  // A random 250–1100ms delay, so answers can arrive out of order. The UI must still only
  // show results for the query currently in the box.
  await new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 850));

  return Response.json(searchDishes(q));
}
