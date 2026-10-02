import Link from 'next/link';
import { cookies } from 'next/headers';
import { CART_COOKIE, parseCart } from '@/lib/cart-cookie';
import { findDish } from '@/lib/dishes';
import { computeTotals, formatETB } from '@/lib/pricing';
import CheckoutForm from './CheckoutForm';

export const metadata = { title: 'Checkout' };

// Dynamic, and correctly so: it reads the visitor's cart cookie on every request.
// The order summary is priced on the server from the menu, so what the customer sees
// here is exactly what placeOrder will charge.
export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const lines = parseCart(cookieStore.get(CART_COOKIE)?.value)
    .map((line) => ({ dish: findDish(line.id), qty: line.qty }))
    .filter((line) => line.dish)
    .map(({ dish, qty }) => ({ id: dish.id, name: dish.name, price: dish.price, qty }));

  if (lines.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Checkout</h1>
        <div className="empty-state">
          <p>Your cart is empty — add something tasty first.</p>
          <Link href="/menu" className="btn">
            Browse the Menu
          </Link>
        </div>
      </div>
    );
  }

  const { subtotal, deliveryFee, total } = computeTotals(lines);

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <div className="cart-layout">
        <CheckoutForm total={total} />

        <aside className="summary-card" aria-labelledby="checkout-summary-heading">
          <h2 id="checkout-summary-heading">Order Summary</h2>
          <ul className="summary-items">
            {lines.map((line) => (
              <li key={line.id}>
                <span>
                  {line.qty} × {line.name}
                </span>
                <span>{formatETB(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatETB(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{formatETB(deliveryFee)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span>{formatETB(total)}</span>
          </div>
          <Link href="/cart" className="link-back" style={{ margin: '0.75rem 0 0' }}>
            ← Edit cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
