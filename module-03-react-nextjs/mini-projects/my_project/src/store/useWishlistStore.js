import { create } from "zustand";

const STORAGE_KEY = "auramarket_wishlist";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export const useWishlistStore = create((set, get) => ({
  items: load(),

  isWished: (id) => get().items.some((i) => i.id === id),

  toggle: (product) => {
    set((state) => {
      const exists = state.items.some((i) => i.id === product.id);
      const items = exists
        ? state.items.filter((i) => i.id !== product.id)
        : [
            ...state.items,
            {
              id: product.id,
              title: product.title,
              thumbnail: product.thumbnail,
              price: product.price,
              discountPercentage: product.discountPercentage,
              brand: product.brand,
              stock: product.stock,
            },
          ];
      save(items);
      return { items };
    });
  },

  remove: (id) => {
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      save(items);
      return { items };
    });
  },
}));
