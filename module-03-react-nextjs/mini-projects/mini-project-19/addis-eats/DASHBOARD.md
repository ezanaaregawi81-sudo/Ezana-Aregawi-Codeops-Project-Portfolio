# The Addis Eats Dashboard: DASHBOARD.md

The staff dashboard lives at `/kitchen/dashboard`. Sign in as `kitchen@addiseats.et` / `kitchen123` and open **📊 Dashboard** from the Kitchen Order Board.

Everything here was checked in a real browser on `next build && next start`.

## First, a neighbourhood on each order

A free-text address ("Bole Atlas, near…") can't be grouped into a chart, so orders now carry a proper neighbourhood:

- **Checkout:** a **Neighbourhood** dropdown with the fixed list in `lib/order-schema.js` (`NEIGHBOURHOODS`), next to a street-and-landmark field.
- **Validation:** `validateOrder` accepts only names on that list, so `placeOrder` and `POST /api/orders` both require one. The README's API examples include `"area"`.
- **Storage:** it's saved as `customer.area` and shown on the kitchen board.

## The requirements

| Requirement | How it's met |
|---|---|
| Aggregate on the server; only summarised rows cross | `lib/dashboard.js` (`server-only`) runs in the server page. The browser gets **6** neighbourhood rows and **14** day rows for the charts, plus the **10** order rows of the current table page. |
| Charts as client leaves on a server page, each with a heading, a unit and a fixed height | Only `NeighbourhoodChart.jsx` and `OrdersOverTimeChart.jsx` are client components. Headings: "Revenue by neighbourhood, 29 Sept – 12 Oct 2026 (ETB)" and "Orders per day, … (number of orders)". Both frames are a fixed 300px. |
| Each chart's data also in a table | An open "Show the figures as a table" under each chart, captioned, with a total row |
| Tables from `table` / `caption` / `thead` / `th scope` | All three: caption, thead, `scope` on every header and row header, and no `div`s inside |
| Sorting and paging in the URL, paging with `Link` | `?sort=…&dir=…&page=N`. Header links sort (`aria-sort` only on the active column), and a `<nav>` of `<Link>`s pages, with `aria-current="page"` on the current one |
| Loading, empty and error states, all demonstrable | `?state=loading`, `?state=empty` (or a fresh server, which shows **Load 14 days of sample orders**), `?state=error` (with **Try again**) |

## Check yourself

- **Does every bar chart axis start at zero?**
  - Yes. Both charts use `domain={[0, 'auto']}`, and the bar chart's bottom tick reads **ETB 0**.
- **Can you read every chart with the colour removed?**
  - Yes, checked with Chrome's no-colour (achromatopsia) emulation.
  - Every bar carries its value ("ETB 36.9K" on Bole down to "ETB 6.7K" on Sarbet), and every day on the line carries its order count.
  - There's one series per chart, the axes show their units, and the table below repeats the numbers.
- **How many rows cross the network?**
  - **30**: 6 + 14 summary rows in the page payload for the charts, and 10 table rows.
  - Not the 96 orders in the range, and no phone number appears anywhere in the page.
- **Does the table survive a copy into a spreadsheet?**
  - Yes. Copied, the header row is `Order | Placed | Customer | Neighbourhood | Status | Items | Total (ETB)`, and a row is `AE-SMV59AXK01 | 2026-10-12 15:57 | Mekdes Haile | Megenagna | delivered | 1 | 652`.
  - It survives because:
    - each value has its own cell
    - totals are plain numbers under an "(ETB)" header
    - times are in a format a spreadsheet reads as a date-time
    - the sort arrows are CSS, so they don't get copied
- **Can you link someone straight to page three sorted by total?**
  - Yes: `/kitchen/dashboard?sort=total&dir=desc&page=3`. In a fresh signed-in tab it shows "sorted by total, descending. Page 3 of 10".
- **What does a brand-new customer see on the orders page?**
  - "No orders yet", then a line on what will appear and when cancelling is still possible, and a **Browse the Menu** button.
  - The heading is now an `h2`, directly under the page's `h1`.

## Access

- **Signed out:** a real **307** to sign-in.
- **A customer:** a real **404**.
- **How:** the check sits in `app/kitchen/dashboard/layout.js`, above `loading.js`. A check inside the page would only run after the skeleton had already been streamed with a 200.
- **Sample data:** the load action checks the staff role again.
