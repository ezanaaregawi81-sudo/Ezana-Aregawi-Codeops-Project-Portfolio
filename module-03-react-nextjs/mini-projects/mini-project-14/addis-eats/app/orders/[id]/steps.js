export const STEPS = [
  { id: 'placed', label: 'Order placed', icon: '🧾' },
  { id: 'in-kitchen', label: 'In the kitchen', icon: '🔥' },
  { id: 'on-the-way', label: 'On the way', icon: '🛵' },
  { id: 'delivered', label: 'Delivered', icon: '✅' },
];

export function stepLabel(status) {
  if (status === 'cancelled') return 'Cancelled';
  return STEPS.find((step) => step.id === status)?.label ?? status;
}
