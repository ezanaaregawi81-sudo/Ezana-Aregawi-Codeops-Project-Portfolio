'use client';

import { useState } from 'react';
import { addToBasket } from '@/lib/order-basket';

export default function AddToOrderButton({ dish, className, style, id, children }) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToBasket(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={style} id={id}>
      {added ? 'Added ✓' : children}
    </button>
  );
}
