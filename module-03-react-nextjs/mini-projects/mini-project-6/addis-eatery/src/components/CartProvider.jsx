import { useReducer, useMemo } from "react";
import { cartReducer } from "../hook/cartReducer";
import { CartContext } from "./cartContext";

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

export default CartProvider;
