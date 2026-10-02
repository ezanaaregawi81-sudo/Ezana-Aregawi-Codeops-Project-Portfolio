import { getCategories, getDishes } from '@/lib/dishes';
import { jsonError } from '@/lib/http';

// GET /api/dishes[?category=Main]
// For callers outside our pages (a partner app, curl). Our own pages never call this:
// server components read lib/dishes.js directly.
export async function GET(request) {
  const category = new URL(request.url).searchParams.get('category');
  const dishes = await getDishes();

  if (category === null) {
    return Response.json(dishes);
  }

  const categories = await getCategories();
  if (!categories.some((known) => known.name === category)) {
    return jsonError(400, `Unknown category "${category}"`, { categories: categories.map((known) => known.name) });
  }

  return Response.json(dishes.filter((dish) => dish.category === category));
}
