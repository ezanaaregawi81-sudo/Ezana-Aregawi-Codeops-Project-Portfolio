import 'server-only';

// Everything the reports page computes from raw orders. Server only: the browser gets a
// two-week daily summary and the rows of one table page, never the order objects themselves.

export const REPORT_DAYS = 14;
export const PAGE_SIZE = 10;
const TIME_ZONE = 'Africa/Addis_Ababa';

const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
const shortDay = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'short' });
const longDay = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'short', year: 'numeric' });
const dateTime = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const daysAgo = (now, n) => new Date(now.getTime() - n * 86_400_000);

// The 14 Addis Ababa calendar days ending today, oldest first.
function reportDays(now) {
  return Array.from({ length: REPORT_DAYS }, (_, i) => {
    const date = daysAgo(now, REPORT_DAYS - 1 - i);
    return { key: dayKey.format(date), label: shortDay.format(date) };
  });
}

// Orders placed inside the report's 14 days, any status.
export function ordersInRange(orders, now = new Date()) {
  const days = reportDays(now);
  const first = days[0].key;
  const last = days[days.length - 1].key;
  return orders.filter((order) => {
    const key = dayKey.format(new Date(order.placedAt));
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
    const day = byKey.get(dayKey.format(new Date(order.placedAt)));
    if (!day) continue;
    day.revenue += order.total;
    day.orders += 1;
  }

  return {
    days,
    rangeLabel: `${shortDay.format(daysAgo(now, REPORT_DAYS - 1))} – ${longDay.format(now)}`,
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

export function pageOfOrders(orders, { sort, dir, page }) {
  const value = COLUMNS[sort].value;
  const sorted = [...orders].sort((a, b) => {
    const diff = value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
    // Equal values keep a fixed newest-first order, so a row never jumps between pages.
    return (dir === 'asc' ? diff : -diff) || Date.parse(b.placedAt) - Date.parse(a.placedAt);
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);

  // Only the columns the table shows. No phone numbers, notes or owner ids.
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((o) => ({
    id: o.id,
    placed: dateTime.format(new Date(o.placedAt)),
    placedIso: o.placedAt,
    customer: o.customer.name,
    area: o.customer.area,
    status: o.status,
    items: COLUMNS.items.value(o),
    total: o.total,
  }));
  return { rows, page: current, pageCount, totalRows: sorted.length };
}
