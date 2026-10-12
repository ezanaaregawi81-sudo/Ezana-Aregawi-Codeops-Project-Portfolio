import Link from 'next/link';
import { formatETB } from '@/lib/money';
import { getAllOrders } from '@/lib/orders';
import { ordersInRange, pageOfOrders, readTableParams, summarizeByDay } from '@/lib/reports';
import { loadSampleOrders } from './actions';
import OrdersChart from './OrdersChart';
import OrderTable from './OrderTable';
import RevenueChart from './RevenueChart';

export const metadata = { title: 'Kitchen Reports - Addis Eats' };

// layout.js has already checked that this is a signed-in staff member.
//
// Four states, each reachable from the address bar for testing:
//   empty      no orders in the last 14 days      a fresh server, or ?state=empty
//   loading    loading.js while this renders      ?state=loading (3 s delay)
//   error      error.js with "Try again"          ?state=error
//   populated  everything below                   once orders exist
export default async function ReportsPage({ searchParams }) {
  const params = await searchParams;
  if (params.state === 'loading') await new Promise((resolve) => setTimeout(resolve, 3000));
  if (params.state === 'error') throw new Error('Forced error for testing (?state=error).');

  // Aggregate here, on the server. The chart components receive `summary.days`, 14 rows of
  // { key, label, revenue, orders }, and nothing about individual orders or customers.
  const now = new Date();
  const orders = params.state === 'empty' ? [] : ordersInRange(getAllOrders(), now);
  const summary = summarizeByDay(orders, now);

  if (orders.length === 0) {
    return <EmptyState rangeLabel={summary.rangeLabel} forced={params.state === 'empty'} />;
  }

  const tableParams = readTableParams(params);
  const table = pageOfOrders(orders, tableParams);
  const hrefFor = ({ sort, dir, page }) => `/kitchen/reports?${new URLSearchParams({ sort, dir, page: String(page) })}`;
  const average = summary.totalOrders ? Math.round(summary.totalRevenue / summary.totalOrders) : 0;

  return (
    <div className="reports">
      <ReportsHeader rangeLabel={summary.rangeLabel} />

      <dl className="report-stats">
        <div className="card">
          <dt>Revenue</dt>
          <dd>{formatETB(summary.totalRevenue)}</dd>
        </div>
        <div className="card">
          <dt>Orders</dt>
          <dd>{summary.totalOrders}</dd>
        </div>
        <div className="card">
          <dt>Average order</dt>
          <dd>{formatETB(average)}</dd>
        </div>
      </dl>

      <section className="card report-card" aria-labelledby="revenue-title">
        <h2 id="revenue-title" className="report-title">
          Revenue per day, {summary.rangeLabel} <span>(ETB, delivery and VAT included)</span>
        </h2>
        <RevenueChart days={summary.days} />
      </section>

      <section className="card report-card" aria-labelledby="orders-title">
        <h2 id="orders-title" className="report-title">
          Orders per day, {summary.rangeLabel} <span>(number of orders)</span>
        </h2>
        <OrdersChart days={summary.days} />

        {/* The figures behind both charts, as text. A screen reader can't read the SVG, and anyone
            can use it for exact values, so it's a visible table rather than a hidden one. */}
        <details className="chart-table" open>
          <summary>Show the figures as a table</summary>
          <div className="table-wrap">
            <table className="report-table">
              <caption>Orders and revenue (ETB) per day, {summary.rangeLabel}. Cancelled orders are not counted.</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col" className="num">Orders</th>
                  <th scope="col" className="num">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {summary.days.map((day) => (
                  <tr key={day.key}>
                    <th scope="row">
                      <time dateTime={day.key}>{day.label}</time>
                    </th>
                    <td className="num">{day.orders}</td>
                    <td className="num">{formatETB(day.revenue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td className="num">{summary.totalOrders}</td>
                  <td className="num">{formatETB(summary.totalRevenue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </section>

      <section className="card report-card" aria-labelledby="table-title">
        <h2 id="table-title" className="report-title">
          All orders, {summary.rangeLabel}
        </h2>
        <OrderTable {...table} sort={tableParams.sort} dir={tableParams.dir} rangeLabel={summary.rangeLabel} hrefFor={hrefFor} />
      </section>
    </div>
  );
}

function ReportsHeader({ rangeLabel }) {
  return (
    <header className="reports-header">
      <Link href="/kitchen" className="back-link">← Kitchen Order Board</Link>
      <h1>Kitchen Reports</h1>
      <p>The last 14 days, {rangeLabel}, in Addis Ababa time.</p>
    </header>
  );
}

// Written before the charts: what the page says when there's nothing to chart yet.
function EmptyState({ rangeLabel, forced }) {
  return (
    <div className="reports">
      <ReportsHeader rangeLabel={rangeLabel} />
      <div className="state-container">
        <div className="state-icon">📊</div>
        <h2 className="state-title">No orders in the last 14 days</h2>
        <p className="state-text">
          The revenue and order charts fill in as orders arrive. Orders are kept in memory, so restarting the server
          clears them.
        </p>
        {forced ? (
          <p className="state-text">
            This is the forced empty state (<code>?state=empty</code>). <Link href="/kitchen/reports">Show the real data</Link>
          </p>
        ) : (
          <form action={loadSampleOrders}>
            <button type="submit" className="btn btn-primary">Load 14 days of sample orders</button>
          </form>
        )}
      </div>
    </div>
  );
}
