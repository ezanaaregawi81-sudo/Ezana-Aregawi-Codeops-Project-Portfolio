# Day 43: Live tracking, shared formatting and a CSV download

New on top of day 42:
- a courier map on the tracking page
- a live status stream (Server-Sent Events) in place of the 5-second SWR poll
- `lib/format.js`, which prints every price and time
- a CSV download on the kitchen reports page

All of it was tested in Chrome on `next build && next start`.

**Try it:**
1. Sign in as `abebe@example.com` / `injera123` and place an order.
2. Open **My Orders**, then click the order id. It runs from "Order placed" to "Delivered" in 100 seconds.
3. For the CSV, sign in as `kitchen@addiseats.et` / `kitchen123` and open **Kitchen Reports**.

## The exercises

| # | Exercise | Where |
|---|---|---|
| 1 | Map as a dynamic client component, `ssr: false`, sized placeholder | `app/orders/[id]/CourierMap.jsx`, loaded from `LiveOrder.jsx` |
| 2 | Courier and delivery markers, view fitted to both, repeated in text | `CourierMap.jsx`, `lib/courier.js`, the list under the map |
| 3 | Stream route handler with correct SSE framing | `app/api/orders/[id]/events/route.js` |
| 4 | `EventSource`, seeded from the server, closed on unmount | `LiveOrder.jsx`, `page.js` |
| 5 | Connection indicator, stream closed on delivery | The badge at the top of the tracker; the `end` event |
| 6 | `lib/format.js` with `etb`, `when` and `relative`, used everywhere | `lib/format.js` (+ `format.test.mjs`) |
| 7 | CSV export, tested with awkward values | `app/kitchen/reports/export.csv/route.js`, `lib/csv.js` (+ `csv.test.mjs`) |

## 1. A map that only loads in the browser

- Leaflet uses `window` as soon as it's imported, so `CourierMap` is loaded with `next/dynamic(..., { ssr: false })`.
- **The server HTML has a placeholder** (`courier-map-waiting`, a striped box reading "Loading the map…") and no Leaflet markup.
- **The placeholder and the map share the `.courier-map` class, which is 340px tall.**
  - Measured in the browser: 340px for the placeholder, then 340px for the map. Nothing moves when the map appears.
- **Leaflet's code is a separate chunk.** It's only downloaded on the tracking page, and other pages don't carry it.
- **The map is created once and removed on unmount** with `map.remove()`.

## 2. Two markers, both always in view, and the same thing in words

- **The markers:** **🛵 Courier** and **📍 Drop-off**, drawn as small HTML labels.
  - Leaflet's default pin images can't find their PNGs after bundling.
  - The words also mean the map doesn't depend on colour.
- **Fitting the view:** every update moves both markers and calls `fitBounds` on the pair, with `padding: [56, 56]` and `maxZoom: 15`.
  - Checked at the kitchen, on the way, and delivered. Both labels were inside the map each time.
- **When the courier arrives,** both points are the same. The courier's label sits above its point and the drop-off's below, so they stack instead of covering each other (see the delivered screenshot check).
- **The list under the map says the same thing in words.** For example:

  > 🛵 **Courier:** Riding towards Megenagna (about 5.1 km to go)
  > 📍 **Drop-off:** Megenagna, your delivery area
  > ⏱️ **Expected:** 21:37, any moment now

  It's part of the server HTML, so it's there without JavaScript, if the map tiles fail, and for screen readers. The map's `aria-label` points to it.
- **Where the positions come from:** no rider app exists yet, so `lib/courier.js` derives the position from the order's own timer.
  - **Placed and in the kitchen:** at the kitchen, Mexico Square.
  - **On the way:** moving in a straight line to the centre of the customer's area.
  - **Delivered:** at the drop-off.
  - The areas are rough neighbourhood centres, not real addresses.

## 3. The stream: `GET /api/orders/:id/events`

- **The response:** a `ReadableStream` sent as `text/event-stream; charset=utf-8`, with `Cache-Control: no-cache, no-transform` and `X-Accel-Buffering: no`. It runs on the Node runtime and is never cached.
- **The first bytes, as the browser received them:**

```
retry: 4000

id: 1
event: step
data: {"id":"AE-MV70ULFM-835","customer":{…},"status":"placed","courier":{…},"serverTime":"…"}

```

- **The framing rules:**
  - Each message is `field: value` lines ended by an **empty line**. Without that empty line, the browser never fires the event.
  - `id` numbers the messages, so a reconnect sends `Last-Event-ID`.
  - `event` names the listener.
  - `data` is one line of JSON.
  - `retry` sets the reconnect delay.
- **The messages:**
  - **`step`:** the order moved to a new step.
  - **`move`:** sent every 2 s in between, as the courier moves.
  - **`: still here`:** a comment line every 15 s, so idle proxies don't cut the connection.
  - **`end`:** after the final snapshot. Then the server closes the stream itself.
  - One test order received 4 `step`, 47 `move` and 1 `end`.
- **Access is checked before streaming starts:**
  - Signed out → **401**; someone else's order → **404**. Both are JSON errors, not streams.
  - An error status also stops `EventSource` from retrying.
- **A closed tab:** `request.signal`'s `abort` clears the server's timers.

## 4. EventSource, seeded from the server

- **`page.js` (a server component)** builds the first snapshot with `toTrackedOrder(order)` and passes it to `LiveOrder` as `initialOrder`. The first paint is already correct, with no loading flash.
- **`LiveOrder` opens the stream in an effect** and replaces its state with each `step` or `move` message.
- **Unmount closes it.** The effect returns `() => events.close()`.
  - Checked by opening an order and clicking **← My Orders**: closed went from 0 to 1.
- **A delivered or cancelled order never opens a stream.** Revisiting the delivered order: EventSource opened **0** times.
- **One clock:**
  - Every snapshot carries `serverTime`, and "Ordered … (2 minutes ago)" is computed from it.
  - Times are always Addis Ababa time, so the server HTML and the hydrated page agree.
  - No hydration warnings appeared.

## 5. Connection badge, and a deliberate close

- **The badge** at the top of the tracker uses `role="status"`, so screen readers announce changes. It shows words plus a small light; the words carry the meaning:
  - **Connecting…**
  - **Live** (green, blinking unless reduced motion is on)
  - **Reconnecting…** (`readyState` is CONNECTING after an error, so the browser is retrying)
  - **Offline: reload to try again** (`readyState` is CLOSED; the browser gave up, e.g. on a 401 or 404)
  - **Tracking ended**
- **On `end`, the page calls `events.close()` itself.**
  - If it waited for the server to close, `EventSource` would treat that as a dropped connection and reconnect every 4 s, indefinitely.
  - Checked: 8 s after delivery, the page had still opened only one connection, and the badge read "Tracking ended".

## 6. `lib/format.js`

| Call | Prints |
|---|---|
| `etb(1235)` | `1,235 ETB` (the menu's existing style: the number, then ETB, with a non-breaking space) |
| `etb(36900, { compact: true })` | `36.9K ETB`, for chart ticks |
| `when(date)` | `Tue 13 Oct, 14:05` |
| `when(date, 'time')` / `'day'` / `'dayYear'` | `14:05` / `13 Oct` / `13 Oct 2026` |
| `when(date, 'key')` | `2026-10-13`: the Addis Ababa calendar day, used to group orders by day |
| `when(date, 'sheet')` | `2026-10-13 14:05`, which a spreadsheet reads as a date-time |
| `relative(date, now)` | `4 minutes ago`, `in 2 minutes`, `just now`, `any moment now`, `yesterday` |

**What it replaced:**
- **`lib/money.js`:** deleted.
- **`priceFormatted: '450 ETB'`:** this string was typed by hand into every dish. It's gone from `lib/dishes.js` and `lib/cart.js`.
- **The hand-built `` `${total} ETB` `` strings:** they were on the cart, checkout, orders, kitchen and tracker pages.
- **The four `Intl.DateTimeFormat`s in `lib/reports.js`.**
- **`toLocaleTimeString()` on the kitchen board:** it used the server's time zone. The board now shows e.g. "21:33, 2 minutes ago".

After the change, the reports page prints "8,714 ETB" like the rest of the site, not "ETB 8,714". A search finds no `toLocale…`, `new Intl` or hand-written `ETB` amount outside `lib/format.js`.

## 7. CSV download, and the awkward-values test

**The button:**
- **⬇️ Download CSV · N orders** sits next to the "All orders" heading.
- It's a plain `<a download>` link to `/kitchen/reports/export.csv`, carrying the table's `sort` and `dir`.
- The route replies with `Content-Disposition: attachment; filename="addis-eats-orders-2026-10-13.csv"`.
- The file holds every order in the 14 days, in the table's order, not only the visible page.

**Access:** route handlers don't run `layout.js`, so the route checks the staff role itself. Signed out → **401**; a customer → **404**.

**`lib/csv.js`:**
- **Quoting:** a cell containing a comma, a double quote or a line break goes inside double quotes, and quotes inside it are doubled. Rows end in CRLF.
- **The BOM:** the file starts with a UTF-8 byte-order mark (`EF BB BF`, checked in the response bytes), so Excel shows "×" correctly.
- **Formula protection:** text starting with `=`, `+`, `-` or `@` gets a leading `'`, so a spreadsheet won't run it as a formula.
- **The columns:** amounts are bare numbers under "(ETB)" headers: subtotal, delivery, VAT and total. Phone numbers are left out.

**The awkward-values test:** I placed an order as **`Tigist "Titi" Alemu`** with the note **`Gate 2, blue door`**, then downloaded the file. That order's row:

```
AE-MV70RJI3-643,2026-10-13 21:33,"Tigist ""Titi"" Alemu",Megenagna,"Gate 2, blue door",telebirr,delivered,"2 × Doro Wat (Traditional Chicken Stew), 1 × Shiro Tegabere",1160,100,174,1434
```

- **Read back with a separate CSV parser:**
  - Every row has 12 cells.
  - The name comes back as `Tigist "Titi" Alemu`.
  - The note comes back as `Gate 2, blue door`, one cell, not split at the comma.
  - The dish list has commas too, and it also stays in one cell.
- **`npm test` covers the same cases without a server.** `lib/csv.test.mjs` adds a line break and formula-looking text.

## Known limits

- **The courier is simulated:** a straight line on a demo timer between approximate points.
- **The session is checked when the stream opens, not on every message.** Signing out elsewhere doesn't cut a stream that's already open; it ends at delivery or when the tab closes.
- **Orders are in memory,** so a stream only works on the server instance that holds the order.
  - On serverless hosting, each stream also counts against the function's time limit. It's at most about 100 s here.
- **The map tiles come from OpenStreetMap's public server,** which suits a class project. Production would need a tile provider.
