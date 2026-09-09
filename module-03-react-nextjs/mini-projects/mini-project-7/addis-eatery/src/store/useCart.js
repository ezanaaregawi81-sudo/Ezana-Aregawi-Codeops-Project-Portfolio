import { useCartStore } from "./cartStore";

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartCount = () => useCartStore((state) => state.items.length);

export const useCartTotal = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.price, 0));

export const useAddToCart = () => useCartStore((state) => state.addItem);

export const useRemoveFromCart = () => useCartStore((state) => state.removeItem);

export const useClearCart = () => useCartStore((state) => state.clear);
