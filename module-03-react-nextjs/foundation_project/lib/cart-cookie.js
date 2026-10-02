// The cart lives in the browser. It is mirrored into a cookie (ids and quantities only,
// never prices) so the server can read it at checkout — including when JavaScript is
// off and the checkout form is a plain HTML POST.
//
// Shared: the client writes it, the server reads it. Nothing secret.

export const CART_COOKIE = 'ae_cart';
export const MAX_LINES = 20;
export const MAX_QTY = 20;

// Parse untrusted cookie text into [{ id, qty }]. Garbage becomes an empty cart.
export function parseCart(raw) {
  if (!raw) return [];
  let value;
  try {
    value = JSON.parse(decodeURIComponent(raw));
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];

  return value
    .filter((line) => line && typeof line.id === 'string' && Number.isInteger(line.qty) && line.qty > 0)
    .slice(0, MAX_LINES)
    .map((line) => ({ id: line.id.slice(0, 64), qty: Math.min(line.qty, MAX_QTY) }));
}

export function serializeCart(cart) {
  return encodeURIComponent(JSON.stringify(cart.map(({ id, qty }) => ({ id, qty }))));
}
