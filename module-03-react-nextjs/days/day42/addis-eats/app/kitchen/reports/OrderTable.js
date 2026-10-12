import Link from 'next/link';
import { formatETB } from '@/lib/money';
import { COLUMNS } from '@/lib/reports';

// Server component. Plain <table> markup driven entirely by the URL: sorted and paged views can
// be bookmarked, Back works, and none of it needs JavaScript.
export default function OrderTable({ rows, sort, dir, page, pageCount, totalRows, rangeLabel, hrefFor }) {
  const direction = dir === 'asc' ? 'ascending' : 'descending';
  return (
    <>
      <div className="table-wrap">
        <table className="report-table">
          <caption>
            {totalRows} orders placed {rangeLabel}, sorted by {COLUMNS[sort].label.toLowerCase()}, {direction}. Page {page} of {pageCount}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Order</th>
              {Object.entries(COLUMNS).map(([key, column]) => {
                const active = key === sort;
                const nextDir = active ? (dir === 'asc' ? 'desc' : 'asc') : column.firstDir;
                return (
                  <th
                    key={key}
                    scope="col"
                    className={column.numeric ? 'num' : undefined}
                    // aria-sort only on the column the rows are actually sorted by.
                    aria-sort={active ? direction : undefined}
                  >
                    {/* A new sort starts again at page 1. */}
                    <Link href={hrefFor({ sort: key, dir: nextDir, page: 1 })} className="sort-link">
                      {column.label}
                      <span aria-hidden="true" className="sort-arrow">{active ? (dir === 'asc' ? '↑' : '↓') : '⇅'}</span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="order-id">{row.id}</th>
                <td>
                  <time dateTime={row.placedIso}>{row.placed}</time>
                </td>
                <td>
                  {row.customer}
                  <span className="cell-note">{row.area}</span>
                </td>
                <td>
                  <span className={`badge ${row.status === 'cancelled' ? 'badge-red' : 'badge-green'}`}>{row.status}</span>
                </td>
                <td className="num">{row.items}</td>
                <td className="num">{formatETB(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <nav className="pagination" aria-label="Order table pages">
          {page > 1 ? (
            <Link href={hrefFor({ sort, dir, page: page - 1 })} rel="prev">← Previous</Link>
          ) : (
            <span aria-disabled="true">← Previous</span>
          )}
          <ol>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                {n === page ? (
                  <span aria-current="page">{n}</span>
                ) : (
                  <Link href={hrefFor({ sort, dir, page: n })} aria-label={`Page ${n}`}>{n}</Link>
                )}
              </li>
            ))}
          </ol>
          {page < pageCount ? (
            <Link href={hrefFor({ sort, dir, page: page + 1 })} rel="next">Next →</Link>
          ) : (
            <span aria-disabled="true">Next →</span>
          )}
        </nav>
      )}
    </>
  );
}
