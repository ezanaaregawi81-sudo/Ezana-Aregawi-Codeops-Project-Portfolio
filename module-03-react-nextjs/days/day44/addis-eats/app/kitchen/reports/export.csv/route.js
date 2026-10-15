import { errorResponse } from '@/lib/api-errors';
import { toCsv } from '@/lib/csv';
import { when } from '@/lib/format';
import { getAllOrders } from '@/lib/orders';
import { CSV_COLUMNS, ordersInRange, readTableParams, sortOrders } from '@/lib/reports';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// GET /kitchen/reports/export.csv?sort=total&dir=desc
// Route handlers skip layout.js, so the reports layout's staff check doesn't cover this file;
// it makes the same check itself.
export async function GET(request) {
  const session = await getSession();
  if (!session) return errorResponse(401, 'UNAUTHORIZED', 'Sign in as kitchen staff to download orders.');
  if (session.role !== 'staff') return errorResponse(404, 'NOT_FOUND', 'Not found.');

  const now = new Date();
  const orders = sortOrders(
    ordersInRange(getAllOrders(), now),
    readTableParams(Object.fromEntries(request.nextUrl.searchParams)),
  );

  // ﻿ (a byte-order mark) tells Excel the file is UTF-8, so "×" and Amharic text survive.
  return new Response(`﻿${toCsv(CSV_COLUMNS, orders)}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="addis-eats-orders-${when(now, 'key')}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
