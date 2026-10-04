import { errorResponse } from '@/lib/api-errors';
import { getOrderById, toCustomerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';

// The tracker polls this, so every request must hit the store, never a cache.
export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse(401, 'UNAUTHORIZED', 'You need a session to track an order.');
  }

  const order = getOrderById(id);
  // Not yours looks exactly like not found, so order ids can't be probed.
  if (!order || order.ownerId !== session.id) {
    return errorResponse(404, 'NOT_FOUND', `No order with id "${id}".`);
  }

  return Response.json(toCustomerOrder(order));
}
