'use server';

import { revalidatePath } from 'next/cache';
import { errorBody } from '@/lib/api-errors';
import { validateOrder } from '@/lib/order-schema';
import { cancelOrderById, createOrder, getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/session';

// A server action can't set an HTTP status, so each one returns a `status` field with
// the same meaning as the matching route handler's response. The UI branches on it.

// Every action that writes checks the session itself. proxy.js guarded the page the form was
// on, but a server action is a public POST endpoint that can be called without loading it.
export async function placeOrder(_prevState, formData) {
  const session = await getSession();
  if (!session) {
    return { status: 401, ...errorBody('UNAUTHORIZED', 'Please sign in to place an order.') };
  }

  const values = {
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    address: formData.get('address') ?? '',
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

  // The owner is whoever the verified cookie says, never a field from the form.
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
    return { status: 401, ...errorBody('UNAUTHORIZED', 'Please sign in to cancel an order.') };
  }

  const order = getOrderById(orderId);
  if (!order) {
    return { status: 404, ...errorBody('NOT_FOUND', `No order with id "${orderId}".`) };
  }

  // Ownership: a valid session isn't enough, it has to be *this order's* session.
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
