'use client';

import { useEffect, useState } from 'react';
import { MAX_QTY } from '@/lib/cart-cookie';
import { formatETB } from '@/lib/pricing';
import { useShop } from './Providers';

// Client because it handles onClick and writes to the cart store.
// The price is only used for the button label; the server re-prices every order.
export default function AddToCartButton({ dishId, dishName, price, withQuantity = false }) {
  const { addToCart } = useShop();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  function handleAdd() {
    addToCart(dishId, withQuantity ? qty : 1);
    setAdded(true);
  }

  const status = (
    <span className="visually-hidden" role="status">
      {added ? `${dishName} added to cart` : ''}
    </span>
  );

  if (!withQuantity) {
    return (
      <>
        <button type="button" className={`btn btn--sm${added ? ' btn--added' : ''}`} onClick={handleAdd} aria-label={`Add ${dishName} to cart`}>
          {added ? 'Added ✓' : 'Add'}
        </button>
        {status}
      </>
    );
  }

  return (
    <>
      <div className="qty-stepper" role="group" aria-label="Quantity">
        <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>
          −
        </button>
        <span aria-live="polite">{qty}</span>
        <button type="button" onClick={() => setQty((value) => Math.min(MAX_QTY, value + 1))} aria-label="Increase quantity" disabled={qty >= MAX_QTY}>
          +
        </button>
      </div>
      <button type="button" className={`btn${added ? ' btn--added' : ''}`} onClick={handleAdd}>
        {added ? 'Added to Cart ✓' : `Add ${qty} to Cart — ${formatETB(price * qty)}`}
      </button>
      {status}
    </>
  );
}
