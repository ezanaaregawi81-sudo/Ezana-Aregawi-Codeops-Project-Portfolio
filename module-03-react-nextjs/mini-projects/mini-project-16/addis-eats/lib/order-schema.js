import { getDishById } from './dishes';

// The one order schema, used by POST /api/orders, the placeOrder server action,
// and the checkout form (for its payment options). No secrets in here: it's safe
// to ship to the browser.

export const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr 📲' },
  { id: 'cbe', name: 'CBE Birr 🏦' },
  { id: 'cash', name: 'Cash on Delivery 💵' },
];

// Ethiopian mobile number: 09XXXXXXXX or +2519XXXXXXXX (spaces and dashes ignored).
const PHONE_PATTERN = /^(?:\+251|0)9\d{8}$/;

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateOrder(input) {
  const body = input && typeof input === 'object' ? input : {};
  const fieldErrors = {};

  const name = text(body.name);
  const phone = text(body.phone).replace(/[\s-]/g, '');
  const address = text(body.address);
  const paymentMethod = text(body.paymentMethod);

  if (!name) {
    fieldErrors.name = 'Name is required.';
  } else if (name.length < 2) {
    fieldErrors.name = 'Name must be at least 2 characters.';
  }

  if (!phone) {
    fieldErrors.phone = 'Phone is required.';
  } else if (!PHONE_PATTERN.test(phone)) {
    fieldErrors.phone = 'Enter an Ethiopian mobile number, e.g. 0911234567 or +251911234567.';
  }

  if (!address) {
    fieldErrors.address = 'Delivery address is required.';
  } else if (address.length < 5) {
    fieldErrors.address = 'Please give a more specific address.';
  }

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

  return { success: true, data: { name, phone, address, paymentMethod, items } };
}
