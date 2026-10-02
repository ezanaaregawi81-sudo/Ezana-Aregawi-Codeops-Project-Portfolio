// The one order schema. The checkout form runs validateCustomer() in the browser for
// instant feedback; the placeOrder server action and POST /api/orders run
// validateOrder() again on the server, which is the check that actually counts.
//
// Shared by client and server, so it must stay free of secrets and server-only imports.
// Dish lookups are passed in by the server caller.

import { MAX_LINES, MAX_QTY } from './cart-cookie';

// Rules carried over from the original Addis Eats checkout.
export const PHONE_PATTERN = /^(?:\+251|0)9\d{8}$/;
export const AREAS = ['Bole', 'Kazanchis', 'Megenagna', 'Piassa', 'CMC', 'Sarbet'];
export const PAYMENT_METHODS = ['TeleBirr', 'CBE Birr', 'Cash on Delivery'];
export const NOTES_MAX = 300;

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Customer fields only — what the browser can check before submitting.
export function validateCustomer(input) {
  const body = input && typeof input === 'object' ? input : {};
  const fieldErrors = {};

  const name = text(body.name);
  const phone = text(body.phone).replace(/[\s-]/g, '');
  const area = text(body.area);
  const payment = text(body.payment);
  const notes = text(body.notes);

  if (!name) {
    fieldErrors.name = 'Please enter your name.';
  } else if (name.length > 80) {
    fieldErrors.name = 'Name must be 80 characters or fewer.';
  }

  if (!PHONE_PATTERN.test(phone)) {
    fieldErrors.phone = 'Enter a valid Ethiopian phone (e.g., 0911234567 or +251911234567).';
  }

  if (!AREAS.includes(area)) {
    fieldErrors.area = 'Choose a delivery area.';
  }

  if (!PAYMENT_METHODS.includes(payment)) {
    fieldErrors.payment = 'Choose a payment method.';
  }

  if (notes.length > NOTES_MAX) {
    fieldErrors.notes = `Notes must be ${NOTES_MAX} characters or fewer.`;
  }

  return { fieldErrors, customer: { name, phone, area, payment, notes } };
}

// Full order: customer fields plus the cart lines. `findDish(id)` comes from the server's
// data layer and is the only source of names and prices — any price the client sends
// is ignored.
export function validateOrder(input, { findDish }) {
  const { fieldErrors, customer } = validateCustomer(input);

  const rawItems = input && typeof input === 'object' ? input.items : undefined;
  const items = [];

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    fieldErrors.items = 'Your cart is empty — add something tasty first.';
  } else if (rawItems.length > MAX_LINES) {
    fieldErrors.items = `An order can have at most ${MAX_LINES} different dishes.`;
  } else {
    for (const line of rawItems) {
      const dish = typeof line?.id === 'string' ? findDish(line.id) : null;
      const qty = Number(line?.qty);
      if (!dish) {
        fieldErrors.items = `"${String(line?.id).slice(0, 40)}" is not on the menu.`;
        break;
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        fieldErrors.items = `Quantity for ${dish.name} must be a whole number from 1 to ${MAX_QTY}.`;
        break;
      }
      const existing = items.find((item) => item.id === dish.id);
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, MAX_QTY);
      } else {
        items.push({ id: dish.id, name: dish.name, emoji: dish.emoji, price: dish.price, qty });
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }
  return { success: true, data: { customer, items } };
}
