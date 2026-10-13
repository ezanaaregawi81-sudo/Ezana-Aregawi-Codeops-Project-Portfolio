import { searchDishes } from '@/lib/dishes';

// GET /api/dishes/search?q=tibs&page=2
export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const q = params.get('q') ?? '';
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);

  // Slow it down a little on purpose so loading states are visible in the UI and network tab.
  await new Promise((resolve) => setTimeout(resolve, 700));

  return Response.json(searchDishes(q, page));
}
