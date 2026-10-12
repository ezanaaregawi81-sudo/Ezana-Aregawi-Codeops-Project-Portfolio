// Birr amounts for the dashboard. Full ("ETB 1,235") for labels and tooltips, compact
// ("ETB 12.3K") where space is tight, like chart axes and bar labels.
const full = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', notation: 'compact', maximumFractionDigits: 1 });
// Plain digits with thousands separators, for table cells whose header already says "(ETB)":
// they paste into a spreadsheet as numbers, not as text.
const plain = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatETB = (amount) => full.format(amount);
export const formatETBCompact = (amount) => compact.format(amount);
export const formatNumber = (amount) => plain.format(amount);
