import { getDish } from '@/lib/dishes';
import { jsonError } from '@/lib/http';

// GET /api/dishes/:id — 200 with the dish, or an honest 404 (never an empty 200).
export async function GET(_request, { params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return jsonError(404, 'Dish not found', { id });
  }

  return Response.json(dish);
}
