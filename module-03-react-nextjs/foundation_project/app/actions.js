'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CART_COOKIE, parseCart } from '@/lib/cart-cookie';
import { findDish } from '@/lib/dishes';
import { validateOrder } from '@/lib/order-schema';
import { cancelOrder as cancelOrderRecord, createOrder, getOrder } from '@/lib/orders';
import { getOrCreateSession, getSession } from '@/lib/session';

// Server actions are public POST endpoints: anyone can call them with any arguments,
// with or without our UI. So every input is re-validated and every guard runs here.
// They cannot set an HTTP status, so each result carries a `status` field with the
// same meaning as the matching route handler's response.

function field(formData, name) {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

// Called by the checkout form through useActionState: (previousState, formData).
// Works without JavaScript too — the form then posts as plain HTML.
export async function placeOrder(_previousState, formData) {
  const values = {
    name: field(formData, 'name'),
    phone: field(formData, 'phone'),
    area: field(formData, 'area'),
    payment: field(formData, 'payment'),
    notes: field(formData, 'notes'),
  };

  // The cart comes from the cart cookie, not from a hidden form field, so the same
  // code path serves JavaScript and no-JavaScript submissions. Its ids and quantities
  // are still untrusted: validateOrder checks them and prices come from the menu.
  const cookieStore = await cookies();
  const items = parseCart(cookieStore.get(CART_COOKIE)?.value);

  const result = validateOrder({ ...values, items }, { findDish });
  if (!result.success) {
    return {
      status: 422,
      error: result.fieldErrors.items ?? 'Please fix the highlighted fields.',
      fieldErrors: result.fieldErrors,
      values,
    };
  }

  let order;
  try {
    const session = await getOrCreateSession();
    order = await createOrder({ ownerId: session.id, ...result.data });
  } catch (error) {
    console.error('placeOrder failed', error);
    return { status: 500, error: 'We could not place your order. Please try again.', fieldErrors: {}, values };
  }

  cookieStore.delete(CART_COOKIE);
  revalidatePath(`/orders/${order.id}`);
  // redirect() throws, so it must stay outside the try/catch above.
  redirect(`/orders/${order.id}`);
}

// Called by the "Cancel order" form on /orders/[id] with (formData). The button is
// only shown to the owner, but hiding a button is not security: the session and
// ownership are checked here, on every call.
export async function cancelOrder(formData) {
  const orderId = field(formData, 'orderId');

  const session = await getSession();
  if (!session) {
    return { status: 401, error: 'Sign-in session required' };
  }

  const order = await getOrder(orderId);
  if (!order) {
    return { status: 404, error: 'Order not found' };
  }

  if (order.ownerId !== session.id) {
    return { status: 403, error: 'This order belongs to someone else' };
  }

  if (!order.cancellable) {
    return { status: 409, error: `An order that is ${order.status.replace('_', ' ')} can no longer be cancelled` };
  }

  await cancelOrderRecord(order.id);
  revalidatePath(`/orders/${order.id}`);
  return { status: 200 };
}
