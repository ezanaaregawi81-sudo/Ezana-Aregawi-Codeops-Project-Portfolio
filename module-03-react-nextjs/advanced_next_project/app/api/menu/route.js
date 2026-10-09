import { getDishPage } from '@/lib/dishes';
import { readPage } from '@/lib/swr-keys';

// GET /api/menu?category=Tibs&page=2 → { category, dishes, page, pageCount, dishCount }
export async function GET(request) {
  const params = request.nextUrl.searchParams;

  // Slow on purpose, so the gap between pages (what keepPreviousData covers) is visible.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return Response.json(getDishPage(params.get('category') || 'All', readPage(params.get('page'))));
}
