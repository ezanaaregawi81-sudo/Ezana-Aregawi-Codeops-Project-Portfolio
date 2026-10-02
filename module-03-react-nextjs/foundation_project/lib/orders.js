import 'server-only';
import { randomBytes } from 'node:crypto';
import { computeTotals } from './pricing';

// Order data source. An in-memory Map kept on globalThis so dev hot reloads don't
// wipe it; orders are lost when the server restarts. Replace the functions below
// with database calls and nothing else in the app needs to change.
const store = globalThis.__addisEatsOrders ?? (globalThis.__addisEatsOrders = new Map());

// Kitchen progress is simulated from the time since the order was placed.
export const ORDER_STEPS = [
  { status: 'placed', label: 'Order placed', afterSeconds: 0 },
  { status: 'preparing', label: 'Preparing', afterSeconds: 20 },
  { status: 'on_the_way', label: 'On the way', afterSeconds: 60 },
  { status: 'delivered', label: 'Delivered', afterSeconds: 120 },
];

// Cancelling is allowed until the rider has left.
const CANCELLABLE = new Set(['placed', 'preparing']);

function currentStatus(order, now = Date.now()) {
  if (order.cancelledAt) return 'cancelled';
  const elapsed = (now - Date.parse(order.placedAt)) / 1000;
  let status = 'placed';
  for (const step of ORDER_STEPS) if (elapsed >= step.afterSeconds) status = step.status;
  return status;
}

function snapshot(order) {
  const status = currentStatus(order);
  return { ...order, status, cancellable: CANCELLABLE.has(status) };
}

// `items` must already be validated and priced from the menu (see lib/order-schema.js).
export async function createOrder({ ownerId, customer, items }) {
  const id = `AE-${randomBytes(4).toString('hex').toUpperCase()}`;
  const order = {
    id,
    ownerId,
    customer,
    items,
    ...computeTotals(items),
    payment: { method: customer.payment, status: customer.payment === 'Cash on Delivery' ? 'due_on_delivery' : 'awaiting_payment' },
    placedAt: new Date().toISOString(),
    cancelledAt: null,
  };
  store.set(id, order);
  return snapshot(order);
}

export async function getOrder(id) {
  const order = store.get(id);
  return order ? snapshot(order) : null;
}

export async function cancelOrder(id) {
  const order = store.get(id);
  if (!order) return null;
  order.cancelledAt = new Date().toISOString();
  return snapshot(order);
}

export async function markPaid(id, reference) {
  const order = store.get(id);
  if (!order) return null;
  order.payment = { ...order.payment, status: 'paid', reference, paidAt: new Date().toISOString() };
  return snapshot(order);
}

// What a customer may see about their own order: no owner id.
export function toCustomerView(order) {
  const { ownerId, ...rest } = order;
  return rest;
}
