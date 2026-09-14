import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getTotal = (items) => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
const getTotalCount = (items) => items.reduce((sum, item) => sum + item.quantity, 0);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);

          if (!existingItem) {
            return state;
          }

          if (existingItem.quantity > 1) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
              ),
            };
          }

          return {
            items: state.items.filter((item) => item.id !== id),
          };
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => getTotal(get().items),
      getTotalCount: () => getTotalCount(get().items),
    }),
    {
      name: 'addis-eats-cart',
    },
  ),
);

export default useCartStore;
