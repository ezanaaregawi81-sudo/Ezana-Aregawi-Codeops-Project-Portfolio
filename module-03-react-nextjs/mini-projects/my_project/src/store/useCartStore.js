import { create } from "zustand";

const STORAGE_KEY = "auramarket_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        items = [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            brand: product.brand,
            stock: product.stock,
            quantity,
          },
        ];
      }
      saveCart(items);
      return { items };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      saveCart(items);
      return { items };
    });
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      const items = state.items
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      saveCart(items);
      return { items };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
