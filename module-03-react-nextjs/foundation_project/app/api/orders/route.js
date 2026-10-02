import { findDish } from '@/lib/dishes';
import { jsonError } from '@/lib/http';
import { validateOrder } from '@/lib/order-schema';
import { createOrder, toCustomerView } from '@/lib/orders';
import { getOrCreateSession } from '@/lib/session';

// POST /api/orders — for clients other than our own checkout form (which uses the
// placeOrder server action). Same schema, same server-side pricing.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Request body must be valid JSON');
  }

  const result = validateOrder(body, { findDish });
  if (!result.success) {
    return jsonError(422, 'Validation failed', { fieldErrors: result.fieldErrors });
  }

  try {
    const session = await getOrCreateSession();
    const order = await createOrder({ ownerId: session.id, ...result.data });
    return Response.json(toCustomerView(order), {
      status: 201,
      headers: { Location: `/api/orders/${order.id}` },
    });
  } catch (error) {
    console.error('POST /api/orders failed', error);
    return jsonError(500, 'Could not place the order. Please try again.');
  }
}
