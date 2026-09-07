import React, { createContext, useContext, useReducer, useMemo } from 'react';
import cartReducer, { INITIAL_CART_STATE } from '../reducers/cartReducer';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE);

  // Derived state calculations
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  }, [items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  /*
   * EXERCISE 6: Memoize the provider value with useMemo.
   * EXPLANATION:
   * Wrapping the context value in `useMemo` ensures that the context object reference 
   * remains identical across renders unless `items`, `dispatch`, `total`, or `totalCount` change.
   * WITHOUT useMemo, every time `CartProvider` re-renders (due to parent updates or unrelated state), 
   * a brand new object literal `{ items, dispatch, total, totalCount }` is created. This forces 
   * ALL consuming components wrapped in `useContext(CartContext)` to re-render, even if the 
   * actual cart items and totals have not changed!
   */
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
