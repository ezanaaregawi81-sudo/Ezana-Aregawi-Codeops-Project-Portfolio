import Link from 'next/link';
import { ordersByDay, ordersInRange, pageOfOrders, readTableParams, reportRange, revenueByNeighbourhood } from '@/lib/dashboard';
import { formatETB, formatNumber } from '@/lib/money';
import { getAllOrders } from '@/lib/orders';
import { NO_INDEX } from '@/lib/site';
import { loadSampleOrders } from './actions';
import NeighbourhoodChart from './NeighbourhoodChart';
import OrdersOverTimeChart from './OrdersOverTimeChart';
import OrderTable from './OrderTable';

export const metadata = {
  title: 'Dashboard',
  description: 'Staff dashboard: Addis Eats revenue by neighbourhood and orders per day for the last 14 days, with every order in a sortable table.',
  robots: NO_INDEX,
};

// layout.js has already checked for a signed-in staff member.
//
// The four states, each one forceable from the address bar:
//   loading    loading.js, while this renders       ?state=loading (adds 3 s)
//   empty      no orders in the last 14 days        a fresh server, or ?state=empty
//   error      error.js, with Try again             ?state=error
//   populated  everything below                     once there are orders
export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  if (params.state === 'loading') await new Promise((resolve) => setTimeout(resolve, 3000));
  if (params.state === 'error') throw new Error('Forced error for testing (?state=error).');

  // The aggregation happens here, on the server. The two chart components receive only the
  // summarised rows; the order table receives one page of display rows.
  const now = new Date();
  const range = reportRange(now);
  const orders = params.state === 'empty' ? [] : ordersInRange(getAllOrders(), now);
  if (orders.length === 0) return <EmptyState rangeLabel={range.label} forced={params.state === 'empty'} />;

  const byArea = revenueByNeighbourhood(orders);
  const byDay = ordersByDay(orders, now);
  const tableParams = readTableParams(params);
  const table = pageOfOrders(orders, tableParams);
  const hrefFor = ({ sort, dir, page }) => `/kitchen/dashboard?${new URLSearchParams({ sort, dir, page: String(page) })}`;
  const revenue = byArea.reduce((sum, row) => sum + row.revenue, 0);
  const counted = byArea.reduce((sum, row) => sum + row.orders, 0);

  return (
    <div className="dashboard">
      <Header rangeLabel={range.label} />

      <dl className="dashboard-stats">
        <div className="card"><dt>Revenue</dt><dd>{formatETB(revenue)}</dd></div>
        <div className="card"><dt>Orders</dt><dd>{counted}</dd></div>
        <div className="card"><dt>Average order</dt><dd>{formatETB(counted ? Math.round(revenue / counted) : 0)}</dd></div>
      </dl>

      <section className="card dashboard-card" aria-labelledby="area-title">
        <h2 id="area-title" className="dashboard-title">
          Revenue by neighbourhood, {range.label} <span>(ETB)</span>
        </h2>
        <NeighbourhoodChart rows={byArea} />
        <DataTable
          caption={`Revenue (ETB) and orders by neighbourhood, ${range.label}. Cancelled orders are not counted.`}
          columns={['Neighbourhood', 'Orders', 'Revenue (ETB)']}
          rows={byArea.map((row) => [row.area, row.orders, formatNumber(row.revenue)])}
          total={['Total', counted, formatNumber(revenue)]}
        />
      </section>

      <section className="card dashboard-card" aria-labelledby="time-title">
        <h2 id="time-title" className="dashboard-title">
          Orders per day, {range.label} <span>(number of orders)</span>
        </h2>
        <OrdersOverTimeChart days={byDay} />
        <DataTable
          caption={`Orders and revenue (ETB) per day, ${range.label}. Cancelled orders are not counted.`}
          columns={['Day', 'Orders', 'Revenue (ETB)']}
          rows={byDay.map((day) => [<time key={day.key} dateTime={day.key}>{day.key}</time>, day.orders, formatNumber(day.revenue)])}
          total={['Total', counted, formatNumber(revenue)]}
        />
      </section>

      <section className="card dashboard-card" aria-labelledby="orders-title">
        <h2 id="orders-title" className="dashboard-title">
          All orders, {range.label}
        </h2>
        <OrderTable {...table} sort={tableParams.sort} dir={tableParams.dir} rangeLabel={range.label} hrefFor={hrefFor} />
      </section>
    </div>
  );
}

// The figures behind a chart, as a table: for screen readers, for anyone who can't see the SVG,
// and for exact values. Visible (in an open <details>), not hidden.
function DataTable({ caption, columns, rows, total }) {
  return (
    <details className="chart-data" open>
      <summary>Show the figures as a table</summary>
      <div className="table-wrap">
        <table className="report-table">
          <caption>{caption}</caption>
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th key={column} scope="col" className={i > 0 ? 'num' : undefined}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([first, ...rest], r) => (
              <tr key={r}>
                <th scope="row">{first}</th>
                {rest.map((cell, c) => <td key={c} className="num">{cell}</td>)}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{total[0]}</th>
              {total.slice(1).map((cell, c) => <td key={c} className="num">{cell}</td>)}
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}

function Header({ rangeLabel }) {
  return (
    <header className="dashboard-header">
      <Link href="/kitchen" className="back-link">← Kitchen Order Board</Link>
      <h1>Dashboard</h1>
      <p>The last 14 days, {rangeLabel}, in Addis Ababa time.</p>
    </header>
  );
}

// Built first: what the page says when there is nothing to chart yet.
function EmptyState({ rangeLabel, forced }) {
  return (
    <div className="dashboard">
      <Header rangeLabel={rangeLabel} />
      <div className="state-container">
        <div className="state-icon">📊</div>
        <h2 className="state-title">No orders in the last 14 days</h2>
        <p className="state-text">
          Revenue by neighbourhood and orders per day appear here as orders come in. Orders are kept in memory, so a server
          restart clears them.
        </p>
        {forced ? (
          <p className="state-text">
            This is the forced empty state (<code>?state=empty</code>). <Link href="/kitchen/dashboard">Show the real data</Link>
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
