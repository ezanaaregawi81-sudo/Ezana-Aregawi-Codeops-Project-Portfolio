// Shared by the cart page (display) and the server (the amount actually charged).
// No secrets here, so both sides may import it.
export const DELIVERY_FEE = 60;

// `lines` are [{ price, qty }]. On the server the prices always come from the menu,
// never from the browser.
export function computeTotals(lines) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const deliveryFee = lines.length > 0 ? DELIVERY_FEE : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export function formatETB(amount) {
  return `${amount.toLocaleString('en-US')} ETB`;
}
