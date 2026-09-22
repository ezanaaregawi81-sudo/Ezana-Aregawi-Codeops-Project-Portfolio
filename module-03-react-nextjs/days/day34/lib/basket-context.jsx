'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const BasketContext = createContext(null);
const STORAGE_KEY = 'sheba-kitchen-basket';

export function BasketProvider({ children }) {
  const [lines, setLines] = useState([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // One-time sync from localStorage (an external store with no window
      // to render from on the server), so this can't be a lazy useState
      // initializer without causing a server/client hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setLines(JSON.parse(stored));
    } catch {
      // localStorage unavailable or corrupt - start with an empty basket
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // localStorage unavailable - basket just won't persist across reloads
    }
  }, [lines]);

  function addLine(dish) {
    setLines((current) => {
      const found = current.find((line) => line.id === dish.id);
      if (found) {
        return current.map((line) =>
          line.id === dish.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
    });
  }

  function removeLine(id) {
    setLines((current) => current.filter((line) => line.id !== id));
  }

  function setLineQuantity(id, quantity) {
    setLines((current) => {
      if (quantity <= 0) return current.filter((line) => line.id !== id);
      return current.map((line) => (line.id === id ? { ...line, quantity } : line));
    });
  }

  function emptyBasket() {
    setLines([]);
  }

  const lineCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.quantity * line.price, 0);

  return (
    <BasketContext.Provider
      value={{ lines, addLine, removeLine, setLineQuantity, emptyBasket, lineCount, subtotal }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}
