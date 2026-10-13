import 'server-only';
import { when } from './format';

// Everything the reports page computes from raw orders. Server only: the browser gets a
// two-week daily summary and the rows of one table page, never the order objects themselves.

export const REPORT_DAYS = 14;
export const PAGE_SIZE = 10;
// Days are Addis Ababa calendar days: when(date, 'key') in lib/format.js.

const daysAgo = (now, n) => new Date(now.getTime() - n * 86_400_000);

// The 14 Addis Ababa calendar days ending today, oldest first.
function reportDays(now) {
  return Array.from({ length: REPORT_DAYS }, (_, i) => {
    const date = daysAgo(now, REPORT_DAYS - 1 - i);
    return { key: when(date, 'key'), label: when(date, 'day') };
  });
}

// Orders placed inside the report's 14 days, any status.
export function ordersInRange(orders, now = new Date()) {
  const days = reportDays(now);
  const first = days[0].key;
  const last = days[days.length - 1].key;
  return orders.filter((order) => {
    const key = when(order.placedAt, 'key');
    return key >= first && key <= last;
  });
}

// Revenue (order totals, delivery and VAT included) and order count per day. Cancelled orders
// brought in nothing, so they're left out of both.
export function summarizeByDay(orders, now = new Date()) {
  const days = reportDays(now).map((day) => ({ ...day, revenue: 0, orders: 0 }));
  const byKey = new Map(days.map((day) => [day.key, day]));

  for (const order of orders) {
    if (order.status === 'cancelled') continue;
    const day = byKey.get(when(order.placedAt, 'key'));
    if (!day) continue;
    day.revenue += order.total;
    day.orders += 1;
  }

  return {
    days,
    rangeLabel: `${when(daysAgo(now, REPORT_DAYS - 1), 'day')} – ${when(now, 'dayYear')}`,
    totalRevenue: days.reduce((sum, day) => sum + day.revenue, 0),
    totalOrders: days.reduce((sum, day) => sum + day.orders, 0),
  };
}

// Sortable columns of the order table. Only these keys are accepted from ?sort=.
export const COLUMNS = {
  placed: { label: 'Placed', value: (o) => Date.parse(o.placedAt), firstDir: 'desc' },
  customer: { label: 'Customer', value: (o) => o.customer.name.toLowerCase(), firstDir: 'asc' },
  status: { label: 'Status', value: (o) => o.status, firstDir: 'asc' },
  items: { label: 'Items', value: (o) => o.items.reduce((n, item) => n + Number(item.qty || 0), 0), firstDir: 'desc', numeric: true },
  total: { label: 'Total', value: (o) => o.total, firstDir: 'desc', numeric: true },
};

// Anything unexpected in the URL falls back to a sensible default rather than erroring.
export function readTableParams(searchParams) {
  const sort = Object.hasOwn(COLUMNS, searchParams.sort) ? searchParams.sort : 'placed';
  const dir = searchParams.dir === 'asc' || searchParams.dir === 'desc' ? searchParams.dir : COLUMNS[sort].firstDir;
  const page = Math.max(1, Number.parseInt(searchParams.page, 10) || 1);
  return { sort, dir, page };
}

// The table and the CSV export both sort through here, so the file matches the screen.
export function sortOrders(orders, { sort, dir }) {
  const value = COLUMNS[sort].value;
  return [...orders].sort((a, b) => {
    const diff = value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
    // Equal values keep a fixed newest-first order, so a row never jumps between pages.
    return (dir === 'asc' ? diff : -diff) || Date.parse(b.placedAt) - Date.parse(a.placedAt);
  });
}

export function pageOfOrders(orders, { sort, dir, page }) {
  const sorted = sortOrders(orders, { sort, dir });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);

  // Only the columns the table shows. No phone numbers, notes or owner ids.
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((o) => ({
    id: o.id,
    placed: when(o.placedAt),
    placedIso: o.placedAt,
    customer: o.customer.name,
    area: o.customer.area,
    status: o.status,
    items: COLUMNS.items.value(o),
    total: o.total,
  }));
  return { rows, page: current, pageCount, totalRows: sorted.length };
}

// The CSV download: one row per order in the 14 days, every page at once. Names, notes and the
// list of dishes are free text, so they're the cells most likely to hold commas and quotes; see
// lib/csv.js for how those are written. Amounts are bare numbers under "(ETB)" headers so a
// spreadsheet can add them up. Phone numbers stay out: a revenue report doesn't need them.
export const CSV_COLUMNS = [
  { header: 'Order', cell: (o) => o.id },
  { header: 'Placed (Addis Ababa)', cell: (o) => when(o.placedAt, 'sheet') },
  { header: 'Customer', cell: (o) => o.customer.name },
  { header: 'Area', cell: (o) => o.customer.area },
  { header: 'Notes', cell: (o) => o.customer.notes },
  { header: 'Payment', cell: (o) => o.paymentMethod },
  { header: 'Status', cell: (o) => o.status },
  { header: 'Dishes', cell: (o) => o.items.map((item) => `${item.qty} × ${item.name}`).join(', ') },
  { header: 'Subtotal (ETB)', cell: (o) => o.subtotal },
  { header: 'Delivery (ETB)', cell: (o) => o.deliveryFee },
  { header: 'VAT (ETB)', cell: (o) => o.tax },
  { header: 'Total (ETB)', cell: (o) => o.total },
];
