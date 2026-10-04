import 'server-only';
import { computeTotals } from './pricing';

// In-memory order store, kept on globalThis so dev hot reloads don't wipe it.
// Orders are lost when the server restarts.
const store = globalThis.__addisEatsOrders ?? (globalThis.__addisEatsOrders = []);

// No real kitchen yet: an order works its way through these steps by itself,
// based on how many seconds ago it was placed. That's what the tracker page polls for.
export const ORDER_STEPS = ['placed', 'in-kitchen', 'on-the-way', 'delivered'];
const STEP_ENDS_AT = { placed: 20, 'in-kitchen': 50, 'on-the-way': 100 };

function refreshStatus(order) {
  if (!order || order.status === 'cancelled' || order.status === 'delivered') return order;
  const age = (Date.now() - Date.parse(order.placedAt)) / 1000;
  order.status = ORDER_STEPS.find((step) => !(step in STEP_ENDS_AT) || age < STEP_ENDS_AT[step]);
  return order;
}

export function createOrder({ ownerId, name, phone, area, notes, paymentMethod, items }) {
  const order = {
    id: `AE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
    ownerId,
    customer: { name, phone, area, notes },
    paymentMethod,
    items,
    ...computeTotals(items),
    status: 'placed',
    placedAt: new Date().toISOString(),
  };
  store.push(order);
  return order;
}

export function getOrderById(id) {
  return refreshStatus(store.find((order) => order.id === id));
}

export function cancelOrderById(id) {
  const order = getOrderById(id);
  if (order) order.status = 'cancelled';
  return order;
}

// What the public orders board may show: no owner id, phone or notes.
export function toPublicOrder(order) {
  return {
    id: order.id,
    firstName: order.customer.name.split(' ')[0],
    items: order.items.map(({ name, qty }) => ({ name, qty })),
    total: order.total,
    status: order.status,
    placedAt: order.placedAt,
  };
}

export function getPublicOrders() {
  return store.map((order) => toPublicOrder(refreshStatus(order))).reverse();
}

// The tracker page shows the owner their own order; only the session id is held back.
export function toCustomerOrder(order) {
  const { ownerId, ...visible } = order;
  return visible;
}
