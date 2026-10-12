import 'server-only';
import { NEIGHBOURHOODS } from './order-schema';

// Everything the dashboard works out from raw orders, on the server. What crosses to the browser
// is the result: 6 neighbourhood rows and 14 day rows for the charts, and 10 rows for the table
// page. Never the full order list, and never a phone number or owner id.

export const REPORT_DAYS = 14;
export const PAGE_SIZE = 10;
const TIME_ZONE = 'Africa/Addis_Ababa';

const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
const shortDay = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'short' });
const longDay = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'short', year: 'numeric' });
// "2026-10-09 15:03": unambiguous, sorts as text, and a spreadsheet reads it as a date-time.
const sheetTime = new Intl.DateTimeFormat('sv-SE', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

const daysAgo = (now, n) => new Date(now.getTime() - n * 86_400_000);
// A cancelled order earned nothing, so it's left out of every chart total.
const counts = (order) => order.status !== 'cancelled';

export function reportRange(now = new Date()) {
  const days = Array.from({ length: REPORT_DAYS }, (_, i) => {
    const date = daysAgo(now, REPORT_DAYS - 1 - i);
    return { key: dayKey.format(date), label: shortDay.format(date) };
  });
  return { days, label: `${shortDay.format(daysAgo(now, REPORT_DAYS - 1))} – ${longDay.format(now)}` };
}

// Orders placed inside the 14-day range, any status.
export function ordersInRange(orders, now = new Date()) {
  const { days } = reportRange(now);
  return orders.filter((order) => {
    const key = dayKey.format(new Date(order.placedAt));
    return key >= days[0].key && key <= days[days.length - 1].key;
  });
}

// One row per neighbourhood, busiest first: { area, revenue, orders }.
export function revenueByNeighbourhood(orders) {
  const rows = new Map(NEIGHBOURHOODS.map((area) => [area, { area, revenue: 0, orders: 0 }]));
  for (const order of orders) {
    const row = rows.get(order.customer.area);
    if (!row || !counts(order)) continue;
    row.revenue += order.total;
    row.orders += 1;
  }
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue || a.area.localeCompare(b.area));
}

// One row per day in the range, oldest first: { key, label, orders, revenue }.
export function ordersByDay(orders, now = new Date()) {
  const days = reportRange(now).days.map((day) => ({ ...day, orders: 0, revenue: 0 }));
  const byKey = new Map(days.map((day) => [day.key, day]));
  for (const order of orders) {
    const day = byKey.get(dayKey.format(new Date(order.placedAt)));
    if (!day || !counts(order)) continue;
    day.orders += 1;
    day.revenue += order.total;
  }
  return days;
}

// The order table's sortable columns. Only these keys are accepted from ?sort=.
export const COLUMNS = {
  placed: { label: 'Placed', value: (o) => Date.parse(o.placedAt), firstDir: 'desc' },
  customer: { label: 'Customer', value: (o) => o.customer.name.toLowerCase(), firstDir: 'asc' },
  area: { label: 'Neighbourhood', value: (o) => o.customer.area ?? '', firstDir: 'asc' },
  status: { label: 'Status', value: (o) => o.status, firstDir: 'asc' },
  items: { label: 'Items', value: (o) => o.items.reduce((n, item) => n + Number(item.qty || 0), 0), firstDir: 'desc', numeric: true },
  total: { label: 'Total (ETB)', noun: 'total', value: (o) => o.total, firstDir: 'desc', numeric: true },
};

// Anything odd in the URL falls back to a sensible default instead of erroring.
export function readTableParams(searchParams) {
  const sort = Object.hasOwn(COLUMNS, searchParams.sort) ? searchParams.sort : 'placed';
  const dir = searchParams.dir === 'asc' || searchParams.dir === 'desc' ? searchParams.dir : COLUMNS[sort].firstDir;
  const page = Math.max(1, Number.parseInt(searchParams.page, 10) || 1);
  return { sort, dir, page };
}

export function pageOfOrders(orders, { sort, dir, page }) {
  const value = COLUMNS[sort].value;
  const sorted = [...orders].sort((a, b) => {
    const diff = value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
    // Ties fall back to newest first, so no row moves between pages from one load to the next.
    return (dir === 'asc' ? diff : -diff) || Date.parse(b.placedAt) - Date.parse(a.placedAt);
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((o) => ({
    id: o.id,
    placed: sheetTime.format(new Date(o.placedAt)),
    placedIso: o.placedAt,
    customer: o.customer.name,
    area: o.customer.area ?? '—',
    status: o.status,
    items: COLUMNS.items.value(o),
    total: o.total,
  }));
  return { rows, page: current, pageCount, totalRows: sorted.length };
}
