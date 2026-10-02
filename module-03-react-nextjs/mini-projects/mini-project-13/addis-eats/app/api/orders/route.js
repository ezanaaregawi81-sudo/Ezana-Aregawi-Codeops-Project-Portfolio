import { revalidatePath } from 'next/cache';
import { errorResponse } from '@/lib/api-errors';
import { validateOrder } from '@/lib/order-schema';
import { createOrder } from '@/lib/orders';
import { getOrCreateSession } from '@/lib/session';

export async function POST(request) {
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

  const session = await getOrCreateSession();
  const order = createOrder({ ownerId: session.id, ...result.data });
  revalidatePath('/orders');

  const { ownerId, ...publicFields } = order;
  return Response.json(publicFields, { status: 201 });
}
