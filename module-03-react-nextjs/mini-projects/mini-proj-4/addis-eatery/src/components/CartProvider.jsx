import { createContext, useContext, useReducer, useMemo } from "react";
import { cartReducer } from "../hook/cartReducer";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const total = state.items.reduce((s, d) => s + d.price, 0);

  const value = useMemo(
    () => ({ items: state.items, dispatch, total }),
    [state.items, total]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartProvider;
