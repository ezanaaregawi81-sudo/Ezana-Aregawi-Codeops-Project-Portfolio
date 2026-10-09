import { getDishById } from '@/lib/dishes';
import { errorResponse } from '@/lib/api-errors';

export async function GET(_request, { params }) {
  const { id } = await params;
  const dish = getDishById(id);

  if (!dish) {
    return errorResponse(404, 'NOT_FOUND', `No dish with id "${id}".`);
  }

  return Response.json(dish);
}
