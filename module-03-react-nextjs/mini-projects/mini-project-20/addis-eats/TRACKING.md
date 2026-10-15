# Tracking a Delivery: TRACKING.md

The tracking page at `/orders/[id]` now has:
- a Leaflet map with the courier and your drop-off point
- a "Where's my food?" panel beside the map that says the same thing in words
- a live status over Server-Sent Events, starting from the server's render

`lib/format.js` formats every price and time in the app. **Download history (CSV)** on My Orders saves your order history in a form that survives awkward data.

All checks below ran in Chrome on `next build && next start`.

**Try it:**
1. Sign in as `abebe@example.com` / `injera123` and place an order.
2. Open it from **My Orders**. It goes from "Order placed" to "Delivered" in 100 seconds.

## Requirements

| Requirement | How it's met |
|---|---|
| Map loaded with `ssr: false`, stylesheet imported, explicit height, attribution kept | **Loading:** `LiveOrder.jsx` loads `CourierMap.jsx` with `next/dynamic(..., { ssr: false })`.<br>**Stylesheet:** `CourierMap.jsx` imports `leaflet/dist/leaflet.css`.<br>**Height:** the placeholder and the map share `.courier-map { height: 340px }`.<br>**Attribution:** the tile layer keeps "© OpenStreetMap contributors" in the corner. |
| The same delivery information as text beside the map | **"Where's my food?"**, on the left of the map (above it on a phone): one sentence, then the drop-off, expected time, order time and last update. |
| A stream route handler using `data: ` and two newlines | `app/api/orders/[id]/events/route.js`. Each message is `id: …\nevent: …\ndata: {json}\n\n`. |
| An EventSource seeded from server data, closed on unmount, with a visible state | **Seeded:** `page.js` passes `toTrackedOrder(order)` as `initialOrder`.<br>**Closed on unmount:** the effect returns `() => events.close()`.<br>**Visible state:** the badge reads Connecting… / Live / Reconnecting… / Offline / Tracking ended. |
| `lib/format.js` exporting `etb`, `when` and `relative`, each built once | Every `Intl.NumberFormat`, `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` is created once at module level (`whole`, `short`, `FORMATS`, `words`) and reused. No call constructs a new one. |
| CSV export that correctly quotes commas, quotes and newlines | `lib/csv.js` (RFC 4180) and `app/orders/history.csv/route.js`. It's tested in `lib/csv.test.mjs` and on a real download (below). |

## How it fits together

**`lib/courier.js`** puts the courier on the map. No rider app sends GPS yet, so the position follows the order's own timer:
- **Placed and in the kitchen:** at the kitchen, Mexico Square.
- **On the way:** along a straight line to the centre of the customer's neighbourhood.
- **Delivered:** in the neighbourhood.

The neighbourhood is a rough centre point, never the typed address. The same file writes the sentence for the panel, for example "Your courier is riding towards Megenagna and is about 4.9 km away."

**`CourierMap.jsx`:**
- **Created once, removed on unmount.** The map is built once and removed with `map.remove()`.
- **The markers** are two labels, **🛵 Courier** and **📍 Drop-off**, instead of Leaflet's default pin images, which can't find their PNGs once bundled.
  - The words tell them apart, so the map doesn't depend on colour.
  - The courier's label sits above its point and the drop-off's below, so they stack on arrival.
  - Both markers use `keyboard: false`. They do nothing when activated, so they shouldn't be tab stops; the details are already in the text.
- **Every update** calls `fitBounds` on both points (`padding: [56, 56]`, `maxZoom: 15`). Both labels were inside the map at all three checkpoints: placed, on the way and delivered.

**The stream:**
- **Headers:** `text/event-stream; charset=utf-8`, `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`, on the Node runtime with `force-dynamic`.
- **What the browser received first:**

```
retry: 4000

id: 1
event: step
data: {"id":"AE-MV73J5BW-697","customer":{"name":"Tigist \"Titi\" Alemu",…},"status":"placed","courier":{…},"serverTime":"…"}

```

- **Why two newlines:** the first newline ends the `data:` line, and the second leaves the blank line that ends the message. The test confirmed that every message ends in `\n\n`.
- **The messages:**
  - **`step`:** a new step.
  - **`move`:** every 2 s in between.
  - **A `: still here` comment** every 15 s.
  - **`end`:** after the final snapshot. Then the server closes the stream.
- **Access:** signed out → **401**; someone else's order → **404**. Both are JSON, sent before any stream starts.

**`LiveOrder.jsx`:**
- **The client side of `end`:** on `end` it calls `events.close()` itself. Otherwise `EventSource` would treat the server's close as a dropped line and reconnect every 4 s.
- **Finished orders:** an order that has already finished never opens a stream.
- **Times:** every snapshot carries `serverTime`, and "Ordered Tue 13 Oct, 22:50 (1 minute ago)" is worked out from it, so the server HTML and the hydrated page say the same thing.
- **What it replaced:** the old `useTrackedOrder` poll, `orderUrl` and the separate `OrderStatusPill` are gone. The pill is part of `LiveOrder` now.

**`lib/format.js`:**

| Call | Prints |
|---|---|
| `etb(450)` | `450 ETB` (the number, then ETB, as the menu always wrote it) |
| `etb(36900, { compact: true })` | `36.9K ETB` (chart ticks and bar labels) |
| `etb(1434, { bare: true })` | `1,434` (table cells under a "(ETB)" header) |
| `when(date)` | `Tue 13 Oct, 22:50`. Other formats: `'time'`, `'day'`, `'dayYear'`, `'key'` (`2026-10-13`), `'sheet'` (`2026-10-13 22:50`) |
| `relative(date, now)` | `2 minutes ago`, `any moment now`, `yesterday` |

**What it replaced:**
- **`lib/money.js`:** deleted.
- **The hand-typed `priceFormatted: '450 ETB'`** on all 12 dishes.
- **Every `` `${total} ETB` ``:** cart, checkout, My Orders, the kitchen board and the tracker.
- **The dashboard's four `Intl.DateTimeFormat`s.**
- **`toLocaleTimeString()`:** the server's zone, not Addis Ababa's.

Page titles and preview cards use it too.

## Check yourself

**Does the build succeed, and does the page avoid jumping when the map appears?**
- **Build:** `next build` succeeds. (One attempt failed downloading the Google fonts, a network blip; the retry passed.)
- **Placeholder vs map:** the striped placeholder measured **340px**, and the map that replaced it **340px**.
- **Layout shift:** the page's cumulative layout shift, measured from the first byte with a `PerformanceObserver`, was **0.0002** (good is under 0.1).
- **Stylesheet:** Leaflet's stylesheet was confirmed loaded.

**Navigate away from the tracking page five times: how many connections are open?**
- **None.** I went My Orders → order → ← My Orders five times (client-side navigation, where a missing cleanup would leak).
- **Chrome's network log:** **5** `EventSource` requests, **0** still open.
- **The server's own count:**

```
[events] AE-MV73J5BW-697 opened, 1 open
[events] AE-MV73J5BW-697 closed (browser left), 0 open
… five times …
[events] AE-MV73J5BW-697 opened, 1 open
[events] AE-MV73J5BW-697 closed (delivered), 0 open
```

- **The last pair** is the delivery, where the server closed the stream on purpose. 8 s later there were **0** new requests, and the badge read "Tracking ended".

**Is every price and time going through the shared format module?**
- **Yes.** No `toLocale…`, `new Intl`, `priceFormatted`, `formatETB` or hand-built `` `… ETB` `` is left in `app/` or `lib/` outside `lib/format.js`.
- **What the pages printed:**
  - menu: "450 ETB"
  - dish title: "Doro Wat (Traditional Chicken Stew) · 450 ETB · Addis Eats"
  - My Orders: "Ordered Tue 13 Oct, 22:50, 2 minutes ago"
  - kitchen board: "22:54, just now"
  - dashboard: "618 ETB", with table cells as bare "618" under "Total (ETB)"
- **Tests:** `lib/format.test.mjs` pins the outputs, Addis Ababa time included.

**Does the CSV survive a value containing a comma and a quotation mark?**
- **Yes, and a line break too.** I placed an order with:
  - name **`Tigist "Titi" Alemu`**
  - address **`Megenagna, behind Zefmesh Mall, "green gate"`** on one line, then **`flat 4`** on the next
- **The download:**

```
Order,Ordered (Addis Ababa),Status,Name,Neighbourhood,Address,Paid with,Dishes,Subtotal (ETB),Delivery (ETB),VAT (ETB),Total (ETB)
AE-MV73J5BW-697,2026-10-13 22:50,delivered,"Tigist ""Titi"" Alemu",Megenagna,"Megenagna, behind Zefmesh Mall, ""green gate""
flat 4",telebirr,"2 × Doro Wat (Traditional Chicken Stew), 1 × Shiro Tegabere",1160,100,174,1434
```

- **Read back by an independent RFC 4180 parser:**
  - 2 rows, **12 cells each**
  - the name and the address came back **exactly as typed**, line break included
  - the dish list, which also has commas, stayed in one cell
- **The file itself:**
  - it starts with a UTF-8 byte-order mark (`EF BB BF`)
  - it's sent as `text/csv; charset=utf-8` and `attachment`
  - it holds only the signed-in customer's orders: the other test customer's download didn't contain this one, and signed out, `proxy.js` redirects to sign-in
- **Formula guard:** text cells starting with `=`, `+`, `-` or `@` get a leading `'`, so a spreadsheet can't run them as formulas.

**Can someone who cannot see the map still find where their order is?**
- **Yes.** In Chrome's accessibility tree (what a screen reader reads), right after the step list come:
  - the region "Where's my food?"
  - its heading
  - "Your food is at the Addis Eats kitchen, Mexico Square, about 5.1 km from you. A courier sets off once it's ready."
  - Drop-off, Expected and Ordered
- **The map region's label** says the same information is written out beside it.
- **Announcements:** the sentence is an `aria-live="polite"` region and the badge is `role="status"`, so changes are read out without moving focus.
- **Keyboard:** pressing Tab goes through the nav, ← My Orders, the map (which pans with the arrow keys), the zoom buttons and the attribution links. It no longer stops on the markers.
- **Without JavaScript:** the panel is in the server HTML, so it works before the map's code loads.

## Limits

- **The courier is simulated:** a straight line on the demo timer, between rough neighbourhood centres.
- **The session is checked when the stream opens.** Signing out elsewhere doesn't cut a running stream; it ends at delivery or when the page closes.
- **Orders are kept in memory,** so a stream only works on the server instance that holds the order.
  - On serverless hosting, each stream also counts against the function time limit (about 100 s here).
- **OpenStreetMap's public tiles** are fine for a class project. Production would need a tile provider.
