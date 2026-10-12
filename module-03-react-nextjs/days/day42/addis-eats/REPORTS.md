# Kitchen Reports (Day 41)

`/kitchen/reports` gives staff three things:
- **Revenue chart:** revenue per day for the last 14 days, as bars.
- **Orders chart:** orders per day for the same 14 days, as a line.
- **Order table:** sortable and paged.

Sign in as `kitchen@addiseats.et` / `kitchen123` and use **📊 Reports** on the Kitchen Order Board.

## How each exercise is done

| # | Exercise | How |
| --- | --- | --- |
| 0 | Empty state first | `EmptyState` in `page.js`. A fresh server has no orders (they live in memory), so the page says so and offers **Load 14 days of sample orders** (`actions.js`, staff-checked, loads once). |
| 1 | Aggregate in a server component, pass only the summary | `summarizeByDay` in `lib/reports.js` (`server-only`) runs inside the page. `RevenueChart` and `OrdersChart` receive `days`: 14 rows of `{ key, label, revenue, orders }`. |
| 2 | Revenue bar chart, fixed height, ETB ticks | `RevenueChart.jsx` in a `.chart-frame` that is always 300px tall, so `ResponsiveContainer` has a size before any chart code runs. The y-axis uses `formatETBCompact` ("ETB 9K"); the tooltip uses `formatETB` ("ETB 8,714"). Revenue is the order total, delivery fee and VAT included, and the heading says so. |
| 3 | Orders-per-day line chart, heading names range and unit | "Orders per day, 26 Sept – 9 Oct 2026 (number of orders)". Whole numbers only on the axis. |
| 4 | The same data in a table beneath | "Show the figures as a table" under the line chart: `<caption>`, `<th scope="row">` days, right-aligned figures and a total row. Open by default, so it's there for screen readers and for anyone after exact numbers. |
| 5 | Order table with real markup, right-aligned totals, caption | `OrderTable.js`: `<caption>` (count, range, sort and page), `<th scope="col">`, the order id as `<th scope="row">`, `<time dateTime>`, and `tabular-nums`, right-aligned items and totals, with zebra rows to follow a row across. |
| 6 | Sorting via searchParams, aria-sort on the active header | `?sort=placed\|customer\|status\|items\|total&dir=asc\|desc`. Each header is a link: the active column flips, and the others start in their natural order. Only the sorted column's `<th>` carries `aria-sort`. Anything unknown in the URL falls back to the default. |
| 7 | Paging with Link elements, and the four states | `?page=N`, 10 rows a page, inside `<nav aria-label="Order table pages">`. The current page has `aria-current="page"`, and Previous/Next turn into plain text at the ends. A page past the end shows the last page. The states are below. |

## The four states, and how to force each

| State | URL | Shows |
| --- | --- | --- |
| Empty | a fresh server, or `?state=empty` | Why it's empty, plus the sample-data button (or a link back, when forced) |
| Loading | `?state=loading` (3 s delay) | `loading.js`: skeleton stats and chart frames the same size as the real ones, with `aria-busy` and a `role="status"` line |
| Error | `?state=error` | `error.js`: "The reports couldn't be loaded", **Try again** (`reset`) and the error's reference digest. Production hides the real message. |
| Populated | normal use | Stat cards, both charts, the daily table and the order table |

## Notes

- **The access check is in `layout.js`.** With `loading.js` on this route, Next streams the skeleton immediately with a 200, so a `redirect()` / `notFound()` in the page would happen mid-stream. The layout runs before the loading boundary, so signed-out visitors get a real **307** to sign-in and customers a real **404**, both checked against `next start`.
- **Nothing private reaches the browser.** The page payload's chart props are only the daily summary. Customer phone numbers and owner ids appear nowhere in the page.
- **Cancelled orders.** They appear in the order table with a red badge, but are not counted in revenue, order counts or the charts. That's why the stat says 85 orders while the table lists 91.
- **Days are Addis Ababa calendar days** (`Africa/Addis_Ababa`).
