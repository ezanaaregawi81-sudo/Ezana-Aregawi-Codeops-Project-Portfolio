import { getDishById } from './dishes';

// The Day 33 checkout rules, now enforced on the server. Used by POST /api/orders and
// the placeOrder server action; the checkout form uses AREA_OPTIONS and PAYMENT_METHODS.
// No secrets in here, so it is safe to ship to the browser.

export const AREA_OPTIONS = ['Bole', 'Kazanchis', 'Megenagna', 'Piassa'];

export const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr 📲' },
  { id: 'cbe', name: 'CBE Birr 🏦' },
  { id: 'cash', name: 'Cash on Delivery 💵' },
];

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateOrder(input) {
  const body = input && typeof input === 'object' ? input : {};
  const fieldErrors = {};

  const name = text(body.name);
  const phone = text(body.phone);
  const area = text(body.area);
  const notes = text(body.notes);
  const paymentMethod = text(body.paymentMethod);

  // Day 33 rules
  if (!name) {
    fieldErrors.name = 'Name is required.';
  }

  if (!phone) {
    fieldErrors.phone = 'Phone is required.';
  } else if (!/^\d{10}$/.test(phone)) {
    fieldErrors.phone = 'Phone must be 10 digits.';
  }

  if (!area || !AREA_OPTIONS.includes(area)) {
    fieldErrors.area = 'Please select a delivery area.';
  }

  // Added for the server: the payment choice and the cart itself.
  if (!PAYMENT_METHODS.some((method) => method.id === paymentMethod)) {
    fieldErrors.paymentMethod = 'Choose a payment method.';
  }

  // Only ids and quantities are trusted from the client; names and prices come from the menu.
  const items = [];
  if (!Array.isArray(body.items) || body.items.length === 0) {
    fieldErrors.items = 'Your cart is empty.';
  } else {
    for (const item of body.items) {
      const dish = getDishById(item?.id);
      const qty = Number(item?.qty);
      if (!dish) {
        fieldErrors.items = `Unknown dish "${item?.id}".`;
        break;
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        fieldErrors.items = `Quantity for ${dish.name} must be between 1 and 20.`;
        break;
      }
      items.push({ id: dish.id, name: dish.name, price: dish.price, qty });
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return { success: true, data: { name, phone, area, notes, paymentMethod, items } };
}
