'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCart } from '@/lib/cart';

const CartContext = createContext({ itemCount: 0, refreshCart: () => {} });

export function useCartContext() {
  return useContext(CartContext);
}

export default function Providers({ children }) {
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = () => {
    const items = getCart();
    setItemCount(items.reduce((sum, item) => sum + Number(item.qty || 0), 0));
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return <CartContext.Provider value={{ itemCount, refreshCart }}>{children}</CartContext.Provider>;
}
