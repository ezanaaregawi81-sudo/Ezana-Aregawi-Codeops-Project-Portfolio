const BASKET_KEY = 'habesha-table-basket';

export function getOrderBasket() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(BASKET_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to read order basket from localStorage:', error);
    return [];
  }
}

export function saveOrderBasket(items) {
  if (typeof window === 'undefined') {
    return [];
  }

  const normalizedItems = Array.isArray(items)
    ? items.map((item) => ({
        ...item,
        qty: Math.max(1, Number(item.qty) || 1),
      }))
    : [];

  window.localStorage.setItem(BASKET_KEY, JSON.stringify(normalizedItems));
  return normalizedItems;
}

export function addToBasket(dish) {
  const existingBasket = getOrderBasket();
  const existingItem = existingBasket.find((item) => item.id === dish.id);

  const nextBasket = existingItem
    ? existingBasket.map((item) =>
        item.id === dish.id ? { ...item, qty: item.qty + 1 } : item,
      )
    : [
        ...existingBasket,
        {
          id: dish.id,
          name: dish.name,
          price: Number(dish.price) || 0,
          qty: 1,
          image: dish.image || '🍽️',
          priceFormatted: dish.priceFormatted || `${Number(dish.price) || 0} ETB`,
        },
      ];

  return saveOrderBasket(nextBasket);
}

export function updateBasketItemQuantity(id, nextQty) {
  const updatedBasket = getOrderBasket().map((item) => {
    if (item.id !== id) return item;
    return { ...item, qty: Math.max(1, Number(nextQty) || 1) };
  });

  return saveOrderBasket(updatedBasket);
}

export function removeFromBasket(id) {
  const filteredBasket = getOrderBasket().filter((item) => item.id !== id);
  return saveOrderBasket(filteredBasket);
}

export function clearBasket() {
  return saveOrderBasket([]);
}
