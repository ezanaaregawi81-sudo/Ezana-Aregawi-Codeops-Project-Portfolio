# Addis Eats on Next.js

**Addis Eats** is an Ethiopian food-ordering app from Bole, Addis Ababa: browse the menu,
filter and search dishes, save favourites, build a cart, check out and pay with TeleBirr,
CBE Birr or cash, then follow the order's status.

This repository is the **Next.js Foundations Project** (CodeOps Module 3, Day 40). It rebuilds
the original Vite + React Router app ([addis-eats-woad.vercel.app](https://addis-eats-woad.vercel.app/))
on the App Router. Same product, look and data, but now with:

- file-based routing and nested layouts;
- a deliberate rendering strategy per route;
- server components that read their own data;
- client components only at the leaves;
- route handlers, server actions, server-side validation and ownership guards.

- **[STRATEGY.md](./STRATEGY.md)**: every route, its strategy and why, checked against the build.
- **[BOUNDARY.md](./BOUNDARY.md)**: every component, server or client, and why.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16.3.5 (App Router, Turbopack) |
| UI | React 19.2, plain CSS (the original app's design tokens) |
| Language | JavaScript |
| Data | In-memory data layer in `lib/` (swap for a database without touching pages) |
| Dependencies | `next`, `react`, `react-dom`, nothing else |

## Setup

```bash
npm install
cp .env.example .env.local      # then fill in both secrets
```

Generate each secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

### Environment variables

Both are **server-only**: there is no `NEXT_PUBLIC_` prefix, and they are read only in
`lib/secrets.js`, which imports `'server-only'`. `.env.local` is git-ignored.

| Variable | Used for |
|---|---|
| `SESSION_SECRET` | Signs the `ae_session` cookie (HMAC-SHA256) that owns orders. |
| `PAYMENT_WEBHOOK_SECRET` | Verifies the `x-addis-signature` header on `POST /api/payments/confirm`. |

## Running

```bash
npm run dev          # development, http://localhost:3000
npm run build        # production build (prints the rendering marker per route)
npm run start        # serve the production build
npm run start -- -p 3100   # on another port if 3000 is taken
```

## Folder structure

```
app/
├── layout.js                 root shell (server) + Providers (client)
├── page.js                   /            static landing + today's specials
├── not-found.js              404 page (unknown URLs, /menu/not-a-dish)
├── error.js                  error boundary for routes outside /menu
├── actions.js                server actions: placeOrder, cancelOrder
├── globals.css
├── menu/
│   ├── layout.js             category sidebar (nested layout)
│   ├── page.js               /menu        ISR 3600
│   ├── DishFilter.jsx        client: search, sort, category (wraps server cards)
│   ├── loading.js            skeleton inside the menu layout
│   ├── error.js              menu error boundary
│   └── [id]/page.js          /menu/kitfo  generateStaticParams + notFound()
├── cart/        page.js + CartView.jsx
├── wishlist/    page.js + WishlistGrid.jsx
├── checkout/    page.js + CheckoutForm.jsx
├── orders/[id]/ page.js + OrderStatus.jsx
└── api/
    ├── dishes/route.js            GET  /api/dishes
    ├── dishes/[id]/route.js       GET  /api/dishes/:id
    ├── orders/route.js            POST /api/orders
    ├── orders/[id]/route.js       GET  /api/orders/:id     (polling)
    └── payments/confirm/route.js  POST /api/payments/confirm (webhook)
components/   shared by more than one route
├── Providers.jsx  NavLinks.jsx  CategoryBar.jsx  AddToCartButton.jsx  WishlistButton.jsx   (client)
└── DishCard.jsx   DishList.jsx  CategoryList.jsx MenuToolbar.jsx                            (server / shared)
lib/          data layer and shared logic
├── dishes.js        dish data source              (server-only)
├── orders.js        order store + status timeline (server-only)
├── session.js       signed session cookie         (server-only)
├── secrets.js       the only env-secret reader    (server-only)
├── order-schema.js  the one validation schema     (shared)
├── pricing.js       totals, 60 ETB delivery        (shared)
├── cart-cookie.js   cart cookie format             (shared)
└── http.js          JSON error helper
```

## Routes

| Route | Rendering | What it does |
|---|---|---|
| `/` | Static `○` | Landing page with today's specials |
| `/menu` | ISR 1 h `○` | All dishes, category sidebar, search, sort |
| `/menu/[id]` | Static via params `●` | One dish, quantity, add to order, wishlist, related dishes |
| `/cart` | Client (static shell) | Order lines, quantities, running ETB total |
| `/wishlist` | Client (static shell) | Saved dishes |
| `/checkout` | Dynamic `ƒ` | Server-priced summary + checkout form → `placeOrder` |
| `/orders/[id]` | Dynamic `ƒ` | Owner-only confirmation, live status, cancel |

Reasons for each choice are in [STRATEGY.md](./STRATEGY.md).

## Data flow

| What | How | Why |
|---|---|---|
| Menu and dish data | Server components call `lib/dishes.js` | Read to render; no endpoint needed |
| Placing an order | `placeOrder` server action | A write from our own UI |
| Order status | `OrderStatus` polls `GET /api/orders/[id]` | Repeated, browser-triggered |
| Payment confirmation | `POST /api/payments/confirm` | Called by a provider we do not control |
| Cart | Client state, mirrored to the `ae_cart` cookie (ids + quantities only) | Private until checkout; the cookie lets the server read it with JavaScript off |

**Who calls `/api/dishes`?** Nothing in this app. Our pages read `lib/dishes.js` directly,
and fetching our own endpoint from a server component would be a wasted round trip. The
handler exists for outside callers: curl, a partner app, a future mobile client.

## API

Every error has the same shape: `{ "error": "<message>" }`, plus `fieldErrors` on
validation failures.

| Endpoint | Method | Status codes |
|---|---|---|
| `/api/dishes` | `GET` | **200** all dishes · `?category=Drinks` filters · **400** unknown category |
| `/api/dishes/:id` | `GET` | **200** the dish · **404** `{"error":"Dish not found"}`, never an empty 200 |
| `/api/orders` | `POST` | **201** order created (+ `Location`, sets `ae_session`) · **400** body is not JSON · **422** `fieldErrors` · **500** unexpected failure |
| `/api/orders/:id` | `GET` | **200** your order · **401** no/forged session · **403** someone else's order · **404** unknown order |
| `/api/payments/confirm` | `POST` | **200** marked paid (idempotent) · **400** bad JSON · **401** bad signature · **404** unknown order · **409** order cancelled · **422** missing fields |

Any other method gets **405 Method Not Allowed** from Next.js.

### `POST /api/orders` body

```json
{
  "name": "Almaz",
  "phone": "0912345678",
  "area": "Bole",
  "payment": "TeleBirr",
  "notes": "Blue gate",
  "items": [{ "id": "kitfo", "qty": 2 }]
}
```

### Payment webhook

```bash
BODY='{"orderId":"AE-1A2B3C4D","reference":"TB-778899"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" | cut -d' ' -f2)
curl -X POST localhost:3000/api/payments/confirm -H "x-addis-signature: $SIG" -d "$BODY"
```

## Validation

There is one schema, `lib/order-schema.js`, with the rules carried over from the original
checkout:

| Field | Rule |
|---|---|
| `name` | Required, ≤ 80 characters |
| `phone` | `^(?:\+251\|0)9\d{8}$` (spaces/dashes ignored), e.g. `0911234567`, `+251911234567` |
| `area` | One of Bole, Kazanchis, Megenagna, Piassa, CMC, Sarbet |
| `payment` | One of TeleBirr, CBE Birr, Cash on Delivery |
| `notes` | Optional, ≤ 300 characters |
| `items` | 1–20 lines; every id must exist on the menu; quantity a whole number 1–20 |

Where it runs:

- **Browser:** `CheckoutForm` runs `validateCustomer()` before submitting, for instant
  feedback with the message beside the field and focus moved to it.
- **Server:** `placeOrder` and `POST /api/orders` run `validateOrder()` again. That is the
  check that counts.
- **Prices:** never trusted. The server builds each order line from `lib/dishes.js`, so a
  client that sends `"price": 1` or `"total": 1` is still charged the menu price (verified
  below).

## Server actions (`app/actions.js`)

| Action | Called by | Result `status` |
|---|---|---|
| `placeOrder(prevState, formData)` | `CheckoutForm` via `useActionState`, or a plain HTML POST with JavaScript off | **422** + `fieldErrors` + the typed `values` · **500** · success → clears the cart cookie and `redirect('/orders/:id')` |
| `cancelOrder(formData)` | The "Cancel order" `<form>` on `/orders/[id]` | **200** · **401** no session · **403** not the owner · **404** unknown order · **409** too late (already on the way / cancelled) |

A server action is a public POST endpoint, so both treat every argument as untrusted:

- `placeOrder` reads the cart from the cookie, validates it, and prices it from the menu.
- `cancelOrder` checks the session and the order's owner itself. Hiding the button is not
  security.

## Security

- **Sessions:** the session cookie is `httpOnly`, `SameSite=Lax`, `Secure` in production,
  and HMAC-signed. Editing it to impersonate someone fails the signature check.
- **Order ownership:** checked inside `cancelOrder`, in `GET /api/orders/[id]`, and on the
  order page. Someone else's order id gets a 404 page, so ids can't be probed.
- **Webhook:** authenticated with a constant-time HMAC comparison.
- **Secrets:** only `lib/secrets.js` reads them, and it is marked `server-only`.
- **Error pages:** show no stack traces.

## Verification (production build: `npm run build && npm run start`)

### Build output

```
▲ Next.js 16.3.5 (Turbopack)
- Environments: .env.local
✓ Compiled successfully in 2.1s
✓ Generating static pages using 7 workers (26/26) in 1837ms
Route (app)                 Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ƒ /api/orders/[id]
├ ƒ /api/payments/confirm
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                           1h      1y
├   /menu/[id]
│ ├ ● /menu/doro-wat                1h      1y
│ ├ ● /menu/shiro-tegabino          1h      1y
│ ├ ● /menu/kitfo                   1h      1y
│ └ ● [+13 more paths]
├ ƒ /orders/[id]
└ ○ /wishlist
○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

Every marker matches [STRATEGY.md](./STRATEGY.md).

### curl

Run against `npm run start -- -p 3100` (port 3000 was in use on the test machine):

```console
$ curl localhost:3100/api/dishes | head -c 120
[{"id":"doro-wat","name":"Doro Wat","category":"Main","price":350,"emoji":"🍗",...     (16 dishes)

$ curl -i localhost:3100/api/dishes/not-a-dish
HTTP/1.1 404 Not Found
{"error":"Dish not found","id":"not-a-dish"}

$ curl -i "localhost:3100/api/dishes?category=Pizza"
HTTP/1.1 400 Bad Request
{"error":"Unknown category \"Pizza\"","categories":["Main","Vegetarian","Breakfast","Sides","Drinks","Dessert"]}

$ curl -i -X POST localhost:3100/api/orders -H "Content-Type: application/json" \
    -d '{"name":"Almaz","phone":"0912"}'
HTTP/1.1 422 Unprocessable Entity
{"error":"Validation failed","fieldErrors":{"phone":"Enter a valid Ethiopian phone (e.g., 0911234567 or +251911234567).","area":"Choose a delivery area.","payment":"Choose a payment method.","items":"Your cart is empty — add something tasty first."}}

$ curl -i -X POST localhost:3100/api/orders -H "Content-Type: application/json" -d 'not json'
HTTP/1.1 400 Bad Request
{"error":"Request body must be valid JSON"}

$ curl -i -X POST ... -d '{"name":"Almaz","phone":"0912345678","area":"Bole","payment":"TeleBirr","items":[{"id":"pizza","qty":1}]}'
HTTP/1.1 422 Unprocessable Entity
{"error":"Validation failed","fieldErrors":{"items":"\"pizza\" is not on the menu."}}

# client claims price 1 and total 1 — the server charges the menu price
$ curl -i -X POST ... -d '{"name":"Almaz","phone":"+251 912 345 678","area":"Bole","payment":"TeleBirr",
    "items":[{"id":"kitfo","qty":2,"price":1},{"id":"buna","qty":1}],"total":1}'
HTTP/1.1 201 Created
location: /api/orders/AE-16D87BAD
set-cookie: ae_session=<signed>; Path=/; Max-Age=2592000; Secure; HttpOnly; SameSite=lax
{"id":"AE-16D87BAD",...,"subtotal":900,"deliveryFee":60,"total":960,...}

$ curl localhost:3100/api/orders/AE-16D87BAD                 → 401 {"error":"Sign-in session required"}
$ curl -b other-visitor localhost:3100/api/orders/AE-16D87BAD → 403 {"error":"This order belongs to someone else"}
$ curl -X POST .../api/payments/confirm -H "x-addis-signature: deadbeef" → 401 {"error":"Invalid signature"}
$ curl -X POST .../api/payments/confirm -H "x-addis-signature: <valid>"  → 200 {"payment":{"status":"paid",...}}
$ curl localhost:3100/api/orders   (GET on a POST-only route)            → 405
```

### Attacking our own action

`cancelOrder` was called directly, with the exact React-encoded request a browser console
would send (`Next-Action` header):

| Caller | Result |
|---|---|
| Another visitor (valid session, not the owner) | `{"status":403,"error":"This order belongs to someone else"}`, order untouched |
| No session | `{"status":401,"error":"Sign-in session required"}` |
| Forged session cookie | `{"status":401,...}`, the signature check fails |
| Unknown order id | `{"status":404,"error":"Order not found"}` |
| The owner | `{"status":200}` |
| The owner, again | `{"status":409,"error":"An order that is cancelled can no longer be cancelled"}` |

### The six failure checks (production build, real Chrome)

| Do this | Result |
|---|---|
| Throttle to **Slow 3G** | `loading.js` renders inside the kept header and sidebar. `/menu` → `/menu/kitfo`: skeleton from 2.1 s until the dish arrives at 4.2 s (5/5 runs). Because the menu routes are static and fully prefetched, this only happens when a navigation outruns an unfinished prefetch. See [STRATEGY.md](./STRATEGY.md#loadingjs-on-a-static-route-measured-not-assumed). |
| **Throw inside the menu page** (`/menu?simulate=error`, a test hook in `DishFilter`) | `app/menu/error.js` renders "The menu didn't load" with **Try again**. Header, cart badge and category sidebar survive. |
| Open **`/menu/not-a-dish`** | **HTTP 404** and the not-found page. |
| Post an **invalid phone** | API: **422** + `fieldErrors.phone`. Form: the message appears beside the phone field, which gets focus and `aria-invalid`. |
| **JavaScript disabled**, submit checkout | Invalid phone → the server re-renders the form with the 422 message beside the field and the typed values kept. Valid → the `placeOrder` server action places the order and redirects to `/orders/AE-…` (total 670 ETB, priced on the server). |
| **Search the bundle** for secrets | 0 hits in `.next/static` for either secret's value or name, `createHmac`, `node:crypto` or `ownerId`. (The values appear only in Turbopack's local build cache, `.next/cache`, which is never served and is git-ignored.) |

The browser suite checked 46 assertions and **all 46 pass**, including:

- category, search and sort filtering;
- add to cart from a card and from the dish page;
- cart quantity changes and the running total;
- wishlist;
- checkout with JavaScript, redirect, and the cart being cleared;
- status polling;
- cancel;
- someone else's order returning 404;
- no horizontal overflow on every page at 375 px and 768 px.

### Bundle

See [BOUNDARY.md](./BOUNDARY.md#bundle-what-moved). First Load JS is ~138 kB gzip on `/menu`,
of which ~9.4 kB is our own code. Dish data and dish markup ship as HTML, not JavaScript.

## Assumptions and limitations

- **No database:** orders live in memory (`lib/orders.js`) and are lost on restart. Dishes
  are a module (`lib/dishes.js`), so ISR on `/menu` only becomes observable once that module
  reads a real data source. The page code would not change.
- **No login yet:** a session is an anonymous signed cookie created at first order; week 9
  adds real authentication. Clearing cookies loses access to past orders.
- **Simulated progress:** order status moves placed → preparing (20 s) → on the way (60 s)
  → delivered (120 s). Cancelling is allowed until the order is on the way.
- **Payments:** the webhook is real and signed, but nothing calls it except curl. There is
  no TeleBirr sandbox.
- **Test hook:** `/menu?simulate=error` deliberately throws, to demonstrate `error.js` on the
  production build.
- **Changed from the original app:**
  - dish URLs moved from `/dish/3` to `/menu/kitfo`;
  - the category `<select>` became the sidebar the brief asks for;
  - the order confirmation is a real, revisitable page (`/orders/[id]`) rather than
    navigation state.
