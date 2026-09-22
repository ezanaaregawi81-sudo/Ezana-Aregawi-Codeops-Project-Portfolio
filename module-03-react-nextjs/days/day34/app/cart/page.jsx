'use client';

import Link from 'next/link';
import { useBasket } from '../../lib/basket-context';

export default function CartPage() {
  const { lines, removeLine, setLineQuantity, emptyBasket, subtotal } = useBasket();

  if (lines.length === 0) {
    return (
      <div className="sk-shell">
        <div className="sk-shell-header">
          <span className="sk-kicker">Cart</span>
          <h1 className="sk-title">Your basket</h1>
        </div>

        <div className="sk-empty">
          <span className="sk-empty-icon" aria-hidden="true">
            🛒
          </span>
          <h2 style={{ fontSize: '1.1rem' }}>Your basket is empty</h2>
          <p className="sk-subtitle">Head back to the menu to add a few dishes.</p>
          <Link href="/menu" className="sk-btn sk-btn--solid" style={{ marginTop: '1rem' }}>
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sk-shell" style={{ maxWidth: '640px' }}>
      <div className="sk-shell-header">
        <span className="sk-kicker">Cart</span>
        <h1 className="sk-title">Your basket</h1>
      </div>

      <div className="sk-basket-list">
        {lines.map((line) => (
          <div key={line.id} className="sk-basket-row">
            <div className="sk-basket-info">
              <span className="sk-menu-row-name">{line.name}</span>
              <span className="sk-menu-row-tag">${line.price.toFixed(2)} each</span>
            </div>

            <div className="sk-stepper">
              <button
                type="button"
                className="sk-stepper-btn"
                onClick={() => setLineQuantity(line.id, line.quantity - 1)}
                aria-label={`Decrease ${line.name} quantity`}
              >
                −
              </button>
              <span className="sk-stepper-value">{line.quantity}</span>
              <button
                type="button"
                className="sk-stepper-btn"
                onClick={() => setLineQuantity(line.id, line.quantity + 1)}
                aria-label={`Increase ${line.name} quantity`}
              >
                +
              </button>
            </div>

            <div className="sk-basket-total">
              <span className="sk-menu-row-price">${(line.price * line.quantity).toFixed(2)}</span>
              <button type="button" className="sk-btn sk-btn--plain" onClick={() => removeLine(line.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sk-panel" style={{ marginTop: '1.5rem' }}>
        <div className="sk-fact-row" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <span className="sk-fact-label">Subtotal</span>
          <span style={{ fontWeight: 800 }}>${subtotal.toFixed(2)}</span>
        </div>
        <div className="sk-actions">
          <Link href="/checkout" className="sk-btn sk-btn--solid">
            Go to checkout
          </Link>
          <button type="button" className="sk-btn sk-btn--plain" onClick={emptyBasket}>
            Clear basket
          </button>
        </div>
      </div>
    </div>
  );
}
