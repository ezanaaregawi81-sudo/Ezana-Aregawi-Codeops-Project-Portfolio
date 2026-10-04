'use server';

import { revalidatePath } from 'next/cache';
import { errorBody } from '@/lib/api-errors';
import { validateOrder } from '@/lib/order-schema';
import { cancelOrderById, createOrder, getOrderById } from '@/lib/orders';
import { getOrCreateSession, getSession } from '@/lib/session';

// A server action can't set an HTTP status, so each one returns a `status` field with
// the same meaning as the matching route handler's response. The UI branches on it.

export async function placeOrder(_prevState, formData) {
  const values = {
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    area: formData.get('area') ?? '',
    notes: formData.get('notes') ?? '',
    paymentMethod: formData.get('paymentMethod') ?? '',
  };

  let items = [];
  try {
    items = JSON.parse(formData.get('items') ?? '[]');
  } catch {
    // An unparseable cart is reported as an empty one by the schema below.
  }

  const result = validateOrder({ ...values, items });
  if (!result.success) {
    return {
      status: 422,
      ...errorBody('VALIDATION_FAILED', 'Please correct the highlighted fields.', {
        fieldErrors: result.fieldErrors,
      }),
      values,
    };
  }

  const session = await getOrCreateSession();
  const order = createOrder({ ownerId: session.id, ...result.data });
  revalidatePath('/orders');

  return { status: 201, order: { id: order.id, total: order.total, name: order.customer.name } };
}

// Server actions are public POST endpoints: anyone can call this with any orderId,
// whether or not a Cancel button was shown to them. So every check happens here.
export async function cancelOrder(_prevState, formData) {
  const orderId = String(formData.get('orderId') ?? '');

  const session = await getSession();
  if (!session) {
    return { status: 401, ...errorBody('UNAUTHORIZED', 'You need a session to cancel an order.') };
  }

  const order = getOrderById(orderId);
  if (!order) {
    return { status: 404, ...errorBody('NOT_FOUND', `No order with id "${orderId}".`) };
  }

  if (order.ownerId !== session.id) {
    return { status: 403, ...errorBody('FORBIDDEN', 'You can only cancel your own orders.') };
  }

  if (order.status === 'cancelled') {
    return { status: 409, ...errorBody('ALREADY_CANCELLED', 'This order is already cancelled.') };
  }

  if (order.status !== 'placed') {
    return { status: 409, ...errorBody('TOO_LATE', 'This order is already being prepared.') };
  }

  cancelOrderById(order.id);
  revalidatePath('/orders');
  return { status: 200 };
}
