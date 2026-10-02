'use client';

import Link from 'next/link';
import { useShop } from '@/components/Providers';
import { computeTotals, formatETB } from '@/lib/pricing';

// Client because the cart is private to this browser: the lines come from the cart
// store and every button changes it. The server page passes the public catalogue
// (name, price, emoji) as a prop, so nothing here fetches.
export default function CartView({ catalog }) {
  const { cart, loaded, updateQty, removeFromCart } = useShop();

  if (!loaded) {
    return <p className="result-count">Loading your cart…</p>;
  }

  const lines = cart.filter((line) => catalog[line.id]).map((line) => ({ ...catalog[line.id], id: line.id, qty: line.qty }));

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <p>Your cart is empty.</p>
        <Link href="/menu" className="btn">
          Browse the Menu
        </Link>
      </div>
    );
  }

  const { subtotal, deliveryFee, total } = computeTotals(lines);

  return (
    <div className="cart-layout">
      <ul className="cart-list" aria-label="Items in your cart">
        {lines.map((line) => (
          <li key={line.id} className="cart-item">
            <div className="cart-item__media" style={{ background: line.color }} aria-hidden="true">
              <span>{line.emoji}</span>
            </div>
            <div className="cart-item__info">
              <Link href={`/menu/${line.id}`}>
                <strong>{line.name}</strong>
              </Link>
              <p className="price">{formatETB(line.price)}</p>
            </div>
            <div className="qty-stepper" role="group" aria-label={`Quantity of ${line.name}`}>
              <button type="button" onClick={() => updateQty(line.id, line.qty - 1)} aria-label={`Decrease ${line.name} quantity`}>
                −
              </button>
              <span>{line.qty}</span>
              <button type="button" onClick={() => updateQty(line.id, line.qty + 1)} aria-label={`Increase ${line.name} quantity`} disabled={line.qty >= 20}>
                +
              </button>
            </div>
            <p className="line-total">{formatETB(line.price * line.qty)}</p>
            <button type="button" className="remove-btn" onClick={() => removeFromCart(line.id)} aria-label={`Remove ${line.name} from cart`}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <aside className="summary-card" aria-labelledby="summary-heading">
        <h2 id="summary-heading">Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatETB(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>{formatETB(deliveryFee)}</span>
        </div>
        <div className="summary-row summary-row--total" aria-live="polite">
          <span>Total</span>
          <span>{formatETB(total)}</span>
        </div>
        <Link href="/checkout" className="btn btn--block">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
