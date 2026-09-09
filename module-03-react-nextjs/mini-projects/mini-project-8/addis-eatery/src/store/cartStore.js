import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (dish) => set((state) => ({ items: [...state.items, dish] })),
      removeItem: (index) =>
        set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
      clear: () => set({ items: [] }),
    }),
    { name: "addis-eatery-cart" }
  )
);
