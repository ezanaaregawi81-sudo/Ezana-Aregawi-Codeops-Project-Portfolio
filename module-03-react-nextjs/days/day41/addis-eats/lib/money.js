// Birr amounts for the reports page: full ("ETB 1,235") for tables and tooltips, compact
// ("ETB 12.3K") for chart axis ticks, where space is tight.
const full = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'ETB',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatETB = (amount) => full.format(amount);
export const formatETBCompact = (amount) => compact.format(amount);
