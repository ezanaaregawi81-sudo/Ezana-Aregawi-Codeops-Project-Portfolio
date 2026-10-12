const CART_KEY = 'addis-eats-cart';

export function getCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to read cart from localStorage:', error);
    return [];
  }
}

export function saveCart(items) {
  if (typeof window === 'undefined') {
    return [];
  }

  const normalizedItems = Array.isArray(items)
    ? items.map((item) => ({
        ...item,
        qty: Math.max(1, Number(item.qty) || 1),
      }))
    : [];

  window.localStorage.setItem(CART_KEY, JSON.stringify(normalizedItems));
  return normalizedItems;
}

export function addToCart(dish) {
  const existingCart = getCart();
  const existingItem = existingCart.find((item) => item.id === dish.id);

  const nextCart = existingItem
    ? existingCart.map((item) =>
        item.id === dish.id ? { ...item, qty: item.qty + 1 } : item,
      )
    : [
        ...existingCart,
        {
          id: dish.id,
          name: dish.name,
          price: Number(dish.price) || 0,
          qty: 1,
          image: dish.image || '🍽️',
          priceFormatted: dish.priceFormatted || `${Number(dish.price) || 0} ETB`,
        },
      ];

  return saveCart(nextCart);
}

export function updateItemQuantity(id, nextQty) {
  const updatedCart = getCart().map((item) => {
    if (item.id !== id) return item;
    return { ...item, qty: Math.max(1, Number(nextQty) || 1) };
  });

  return saveCart(updatedCart);
}

export function removeFromCart(id) {
  const filteredCart = getCart().filter((item) => item.id !== id);
  return saveCart(filteredCart);
}

export function clearCart() {
  return saveCart([]);
}
