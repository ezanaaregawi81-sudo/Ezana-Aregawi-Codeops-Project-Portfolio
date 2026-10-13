import Link from 'next/link';
import { COLUMNS } from '@/lib/dashboard';
import { etb } from '@/lib/format';

// Server component: a real <table> (caption, thead, th scope), sorted and paged by the URL.
// Built to survive a copy-paste into a spreadsheet: one value per cell, totals as plain numbers
// under a "Total (ETB)" header, times as "2026-10-09 15:03", and the sort arrows drawn by CSS so
// they aren't copied into the header text.
export default function OrderTable({ rows, sort, dir, page, pageCount, totalRows, rangeLabel, hrefFor }) {
  const direction = dir === 'asc' ? 'ascending' : 'descending';
  return (
    <>
      <div className="table-wrap">
        <table className="report-table">
          <caption>
            {totalRows} orders placed {rangeLabel}, sorted by {COLUMNS[sort].noun ?? COLUMNS[sort].label.toLowerCase()}, {direction}. Page {page} of {pageCount}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Order</th>
              {Object.entries(COLUMNS).map(([key, column]) => {
                const active = key === sort;
                const nextDir = active ? (dir === 'asc' ? 'desc' : 'asc') : column.firstDir;
                return (
                  <th key={key} scope="col" className={column.numeric ? 'num' : undefined} aria-sort={active ? direction : undefined}>
                    {/* A new sort starts again from page 1. */}
                    <Link href={hrefFor({ sort: key, dir: nextDir, page: 1 })} className={`sort-link${active ? ` sorted-${dir}` : ''}`}>
                      {column.label}
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
                <td>{row.customer}</td>
                <td>{row.area}</td>
                <td>{row.status}</td>
                <td className="num">{row.items}</td>
                <td className="num">{etb(row.total, { bare: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <nav className="pagination" aria-label="Order table pages">
          {page > 1 ? <Link href={hrefFor({ sort, dir, page: page - 1 })} rel="prev">← Previous</Link> : <span aria-disabled="true">← Previous</span>}
          <ol>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                {n === page ? <span aria-current="page">{n}</span> : <Link href={hrefFor({ sort, dir, page: n })} aria-label={`Page ${n}`}>{n}</Link>}
              </li>
            ))}
          </ol>
          {page < pageCount ? <Link href={hrefFor({ sort, dir, page: page + 1 })} rel="next">Next →</Link> : <span aria-disabled="true">Next →</span>}
        </nav>
      )}
    </>
  );
}
