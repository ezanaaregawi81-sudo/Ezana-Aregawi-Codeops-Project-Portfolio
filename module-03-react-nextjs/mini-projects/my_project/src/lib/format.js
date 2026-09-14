export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function discountedPrice(price, discountPercentage) {
  return price - (price * discountPercentage) / 100;
}

export function estimateDeliveryDate(daysFromNow = 5) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function generateOrderId() {
  return `AM-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 9000 + 1000
  )}`;
}
