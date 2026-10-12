import { revalidatePath } from 'next/cache';
import { errorResponse } from '@/lib/api-errors';
import { validateOrder } from '@/lib/order-schema';
import { createOrder, toCustomerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';

// Not covered by proxy.js (its matcher is pages only), so it checks the session itself.
export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return errorResponse(401, 'UNAUTHORIZED', 'Please sign in to place an order.');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, 'BAD_REQUEST', 'Request body must be valid JSON.');
  }

  const result = validateOrder(body);
  if (!result.success) {
    return errorResponse(422, 'VALIDATION_FAILED', 'Please correct the highlighted fields.', {
      fieldErrors: result.fieldErrors,
    });
  }

  const order = createOrder({ ownerId: session.id, ...result.data });
  revalidatePath('/orders');

  return Response.json(toCustomerOrder(order), { status: 201 });
}
