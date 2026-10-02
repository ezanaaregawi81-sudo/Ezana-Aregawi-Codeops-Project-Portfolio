'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CART_COOKIE, MAX_QTY, parseCart, serializeCart } from '@/lib/cart-cookie';

// Client because it holds state: the cart and the wishlist are private to this browser.
// app/layout.js (a server component) passes the whole server-rendered page in as
// `children`, so wrapping the app in this provider does not turn the pages into
// client components.

const ShopContext = createContext(null);
const WISHLIST_KEY = 'addis_eats_wishlist_v2';

function readCartCookie() {
  const entry = document.cookie.split('; ').find((part) => part.startsWith(`${CART_COOKIE}=`));
  return parseCart(entry ? entry.slice(CART_COOKIE.length + 1) : '');
}

function writeCartCookie(cart) {
  document.cookie =
    cart.length > 0
      ? `${CART_COOKIE}=${serializeCart(cart)}; path=/; max-age=2592000; samesite=lax`
      : `${CART_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

function readWishlist() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(WISHLIST_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export default function Providers({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  // The cart cookie is the source of truth. Re-read it on every navigation so a
  // server-side change (placeOrder clears it) shows up in the header badge.
  useEffect(() => {
    setCart(readCartCookie());
  }, [pathname]);

  useEffect(() => {
    setWishlist(readWishlist());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeCartCookie(cart);
  }, [cart, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // Storage can be unavailable (private mode); the wishlist then lasts for this visit.
    }
  }, [wishlist, loaded]);

  const addToCart = useCallback((id, qty = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) => (line.id === id ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY) } : line));
      }
      return [...current, { id, qty: Math.min(qty, MAX_QTY) }];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setCart((current) =>
      qty <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, qty: Math.min(qty, MAX_QTY) } : line)),
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((current) => current.filter((line) => line.id !== id));
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((current) => (current.includes(id) ? current.filter((wished) => wished !== id) : [...current, id]));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((sum, line) => sum + line.qty, 0),
      wishlist,
      loaded,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
    }),
    [cart, wishlist, loaded, addToCart, updateQty, removeFromCart, toggleWishlist],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within <Providers>');
  return context;
}
