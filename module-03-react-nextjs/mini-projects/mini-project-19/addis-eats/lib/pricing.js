export const DELIVERY_FEE = 100;
export const VAT_RATE = 0.15;

// Shared by the cart page (display) and the orders code (the price actually charged).
export function computeTotals(items) {
  const subtotal = items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0), 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const tax = Math.round(subtotal * VAT_RATE);
  return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax };
}
