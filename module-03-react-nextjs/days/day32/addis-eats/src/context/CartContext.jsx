import React, { createContext, useContext, useReducer, useMemo } from 'react';
import cartReducer, { INITIAL_CART_STATE } from '../reducers/cartReducer';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const value = useMemo(() => ({
    items,
    dispatch,
    total,
    totalCount,
    addToCart: (item) => dispatch({ type: 'ADD', payload: item }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE', payload: { id } }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  }), [items, dispatch, total, totalCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

export default CartContext;
