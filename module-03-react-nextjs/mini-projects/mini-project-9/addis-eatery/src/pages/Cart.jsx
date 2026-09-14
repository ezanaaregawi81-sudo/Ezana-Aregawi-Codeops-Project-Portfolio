import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartItems, useCartTotal, useRemoveFromCart } from "../store/useCart";

export default function Cart() {
  const items = useCartItems();
  const total = useCartTotal();
  const removeItem = useRemoveFromCart();
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Deliberate cart error for boundary testing.");
  }

  return (
    <section className="page menu">
      <div className="menu-header"><h2>Your Cart</h2><strong>{total.toFixed(2)} ETB</strong></div>
      <button type="button" className="secondary-btn error-probe" onClick={() => setShouldThrow(true)}>
        Trigger cart error
      </button>
      {items.length === 0 ? <p className="empty-state">Your cart is empty. <Link to="/menu">Explore the menu.</Link></p> : (
        <div className="checkout-panel">
          <ul className="checkout-items">
            {items.map((item, index) => <li key={`${item.id}-${index}`} className="checkout-item"><span className="checkout-item-name">{item.name}</span><span className="checkout-item-price">{item.price.toFixed(2)} ETB</span><button type="button" className="remove-btn" onClick={() => removeItem(index)}>Remove</button></li>)}
          </ul>
          <div className="checkout-total"><span>Total</span><strong>{total.toFixed(2)} ETB</strong></div>
          <Link className="primary-link" to="/checkout">Continue to checkout</Link>
        </div>
      )}
    </section>
  );
}