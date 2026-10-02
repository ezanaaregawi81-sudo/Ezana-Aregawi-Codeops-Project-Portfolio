import { jsonError } from '@/lib/http';
import { getOrder, toCustomerView } from '@/lib/orders';
import { getSession } from '@/lib/session';

// GET /api/orders/:id — polled by the OrderStatus client component on the order page.
// A browser-triggered, repeated read is what a route handler is for. Only the session
// that placed the order may read it.
export async function GET(_request, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return jsonError(401, 'Sign-in session required');
  }

  const order = await getOrder(id);
  if (!order) {
    return jsonError(404, 'Order not found');
  }

  if (order.ownerId !== session.id) {
    return jsonError(403, 'This order belongs to someone else');
  }

  return Response.json(toCustomerView(order), { headers: { 'Cache-Control': 'no-store' } });
}
