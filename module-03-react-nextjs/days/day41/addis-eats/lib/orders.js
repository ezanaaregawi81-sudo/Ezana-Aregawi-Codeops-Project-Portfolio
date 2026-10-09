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

// One account's orders, newest first. The owner id must come from getSession(), never from
// the URL or a form field: that's what stops one account listing another's orders.
export function getOrdersByOwner(ownerId) {
  return store
    .filter((order) => order.ownerId === ownerId)
    .map(refreshStatus)
    .reverse();
}

// Adds finished orders from the past (the reports page's sample history). They keep their own
// placedAt and a final status, so refreshStatus() leaves them alone.
export function addHistoricOrders(orders) {
  store.push(...orders);
  store.sort((a, b) => Date.parse(a.placedAt) - Date.parse(b.placedAt));
}

// Every order, newest first. Only the staff-only /kitchen pages may call this.
export function getAllOrders() {
  return store.map(refreshStatus).reverse();
}

// What the owner (or the kitchen) sees: everything except the owner's account id.
export function toCustomerOrder(order) {
  const { ownerId, ...visible } = order;
  return visible;
}
