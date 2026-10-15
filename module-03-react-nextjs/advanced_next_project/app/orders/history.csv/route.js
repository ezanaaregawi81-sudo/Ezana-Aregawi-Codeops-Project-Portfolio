import { errorResponse } from '@/lib/api-errors';
import { toCsv } from '@/lib/csv';
import { when } from '@/lib/format';
import { getOrdersByOwner } from '@/lib/orders';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// One row per order, newest first, the same list My Orders shows. The cells most likely to hold
// commas, quotes or line breaks are the free-text ones (name, address and the dish list), and
// lib/csv.js quotes those. Money is bare numbers under "(ETB)" headers, so a spreadsheet can
// total them.
const COLUMNS = [
  { header: 'Order', cell: (o) => o.id },
  { header: 'Ordered (Addis Ababa)', cell: (o) => when(o.placedAt, 'sheet') },
  { header: 'Status', cell: (o) => o.status },
  { header: 'Name', cell: (o) => o.customer.name },
  { header: 'Neighbourhood', cell: (o) => o.customer.area },
  { header: 'Address', cell: (o) => o.customer.address },
  { header: 'Paid with', cell: (o) => o.paymentMethod },
  { header: 'Dishes', cell: (o) => o.items.map((item) => `${item.qty} × ${item.name}`).join(', ') },
  { header: 'Subtotal (ETB)', cell: (o) => o.subtotal },
  { header: 'Delivery (ETB)', cell: (o) => o.deliveryFee },
  { header: 'VAT (ETB)', cell: (o) => o.tax },
  { header: 'Total (ETB)', cell: (o) => o.total },
];

// GET /orders/history.csv. proxy.js has already sent signed-out visitors to sign-in, but the
// handler checks for itself too. The owner id comes from the session, never from the URL, so
// there is no way to ask for someone else's history.
export async function GET() {
  const session = await getSession();
  if (!session) return errorResponse(401, 'UNAUTHORIZED', 'Sign in to download your order history.');

  const csv = toCsv(COLUMNS, getOrdersByOwner(session.id));

  // ﻿ first (a byte-order mark): Excel then reads the file as UTF-8, so "×" and Amharic
  // names come through intact.
  return new Response(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="my-addis-eats-orders-${when(Date.now(), 'key')}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
