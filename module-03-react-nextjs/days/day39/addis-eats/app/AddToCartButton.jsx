'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart';
import { useCartContext } from './Providers';

export default function AddToCartButton({ dish, className, style, id, children }) {
  const [added, setAdded] = useState(false);
  const { refreshCart } = useCartContext();

  const handleClick = () => {
    addToCart(dish);
    refreshCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={style} id={id}>
      {added ? 'Added ✓' : children}
    </button>
  );
}
