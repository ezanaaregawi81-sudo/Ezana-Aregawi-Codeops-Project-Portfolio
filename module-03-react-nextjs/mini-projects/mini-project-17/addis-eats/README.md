# Making Addis Eats Findable

Mini-project 17 builds on mini-project 16:

- `metadataBase` from `SITE_URL`, a `%s · Addis Eats` title template, and a description of its own on every route
- `generateMetadata` for each dish, built from the dish record
- a site-wide 1200×630 `opengraph-image`, plus one generated for every dish
- schema.org `MenuItem` JSON-LD with the same name and ETB price the page shows
- `app/sitemap.js` built from the dish records, with signed-in routes left out (and disallowed in `app/robots.js`)
- canonical URLs on `/menu`, `/sign-in` and `/cart`, the routes that accept query parameters

What the page source shows for each route, and the "Check yourself" answers, are in **[SEO.md](./SEO.md)**. Set `SITE_URL` (see `.env.example`) before deploying.

---

# Making Addis Eats Fast (mini-project 16)

Mini-project 16 builds on mini-project 15:

- every image through `next/image`, with real `width`/`height`, a `sizes` that matches the layout, and alt text that describes the food
- `preload` (Next 16's replacement for `priority`) on exactly one image, with the one remote image host pinned in `next.config.mjs`
- the Google Fonts `@import` replaced by `next/font` (Inter and Fraunces)
- the third-party confetti script loaded with `next/script` and `lazyOnload`
- a committed `.env.example` that explains every variable, and a scan showing no secret reaches the browser bundle

What changed, what it did and what is still unmeasured is in **[PERF.md](./PERF.md)**.

## Setup for a fresh clone

```bash
npm install
cp .env.example .env.local   # then set SESSION_SECRET; the file says how to generate one
npm run build && npm start   # measure this, never `npm run dev`
```

`SESSION_SECRET` is the only variable, and it is server-only.

---

# Securing Addis Eats (mini-project 15)

Mini-project 15 builds on mini-project 14. It adds:

- sign-in and sign-out
- a signed, `httpOnly` / `secure` / `sameSite` session cookie, with one `getSession()` helper
- `proxy.js` guarding `/checkout`, `/orders` and `/kitchen`, and remembering where you were going in `next`
- ownership checks inside every action that writes
- a staff-only `/kitchen` order board

`/orders` is now **My Orders**, scoped to the signed-in account. The old public kitchen board moved to `/kitchen`.

Every protected route, its layers, what each layer proves, and the three attacks run against the app are in **[AUTH.md](./AUTH.md)**.

Sign in with `abebe@example.com` / `injera123`, `tirunesh@example.com` / `injera123`, or `kitchen@addiseats.et` / `kitchen123` (staff). `npm test` checks the `next` validator against crafted links.

> Next 16 renamed `middleware.js` to `proxy.js` (same API, Node runtime), so the "middleware" in the brief is `proxy.js` here.

---

# Live Data in Addis Eats (mini-project 14)

Mini-project 14 keeps the API and server actions from mini-project 13 and adds three client-side data features, built with [SWR](https://swr.vercel.app):

- **`/orders/[id]`**: an order tracker that is rendered on the server, then polls every 5 seconds.
- **`/menu` search**: debounced, and it never shows results for a query you've already typed past.
- **`/menu` paging**: a paged dish list that doesn't flash, with the page number in the URL.

Every query, its key, its refresh rule and the reasoning are in **[DATA.md](./DATA.md)**.

## What the network tab shows while typing

Open DevTools → Network → `Fetch/XHR` on `/menu` and type `kitfo` into the search box at normal speed:

- **One** `api/dishes/search?q=kitfo`, about 350ms after the last key. The SWR key comes from the debounced value, so the in-between keystrokes never become requests.
- Type slowly, pausing after each letter, and every pause sends a request. The route answers after a random 250–1100ms, so they often **finish out of order**. The list still only shows matches for what's in the box, and the caption is taken from the response.
- Delete everything and **nothing** is sent. An empty query is a `null` key, and the paged list comes back from the cache.
- Search for something you searched in the last minute and nothing is sent. It's answered from the cache (`dedupingInterval` 60s).
- Click **Next →** and there's one `api/menu?page=2`, and **no** `menu?_rsc=…` request (paging uses `history.pushState`). The current dishes stay, faded, until page 2 lands. Click **← Prev** and page 1 is back instantly from the cache.

On `/orders/<id>` (via **Track My Order** after checkout, or an order id on the board):

- **Nothing** on load, because the server already sent the order as `fallbackData`. Then one `api/orders/<id>` every 5s. That's one even though two components, the heading pill and the tracker, read that key.
- The requests stop once the order reaches **Delivered** (about 100s after ordering) or is cancelled.

## Check yourself

- **Does typing five characters fire one request or five?** One.
- **Does the order page show data immediately, with no spinner?** Yes. The status is in the server HTML, and SWR starts from it.
- **Do two components asking for the same key produce one network call?** Yes. `OrderStatusPill` and `LiveOrder` both use `useTrackedOrder(id)`, and there is one request per poll.
- **Does the list keep previous results visible while the next load runs?** Yes. `keepPreviousData` is on for paging and search, and the old list fades instead of disappearing.
- **Can you justify every `refreshInterval` and `staleTime` in one sentence?** Yes, see the table in [DATA.md](./DATA.md). In SWR, `staleTime` is `dedupingInterval`.

## Running locally

```bash
npm install
cp .env.example .env.local   # then put a real value in SESSION_SECRET
npm run dev
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Error shape

Every error — from a route handler or a server action — has the same shape:

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "Please correct the highlighted fields.", "fieldErrors": { "phone": "..." } } }
```

`fieldErrors` is only present on validation failures.

## Route handlers

| Endpoint | Method | Status codes |
|---|---|---|
| `/api/dishes` | `GET` | **200** — array of every dish |
| `/api/dishes/[id]` | `GET` | **200** — the dish · **404** `NOT_FOUND` — unknown id (never an empty 200) |
| `/api/menu?category=&page=` | `GET` | **200** — `{ category, dishes, page, pageCount, dishCount }`, 4 per page, pages past the end clamped |
| `/api/dishes/search?q=` | `GET` | **200** — `{ query, dishes, matchCount }`, random 250–1100ms delay on purpose |
| `/api/orders/[id]` | `GET` | **200** — your order · **401** `UNAUTHORIZED` — no valid session · **404** `NOT_FOUND` — missing or not yours |
| `/api/orders` | `POST` | **201** — the created order · **401** `UNAUTHORIZED` — not signed in · **400** `BAD_REQUEST` — body isn't JSON · **422** `VALIDATION_FAILED` — with `fieldErrors` |

Any other method on these paths gets Next's **405 Method Not Allowed**.

### `POST /api/orders` body

```json
{
  "name": "Abebe Bikila",
  "phone": "0911234567",
  "address": "Bole Atlas, near Medhanealem Church",
  "paymentMethod": "telebirr",
  "items": [{ "id": "kitfo", "qty": 2 }]
}
```

- `phone`: Ethiopian mobile, `09XXXXXXXX` or `+2519XXXXXXXX` (spaces/dashes ignored)
- `paymentMethod`: `telebirr` · `cbe` · `cash`
- `items`: dish ids from the menu, `qty` 1–20. Names and prices are taken from the
  server's menu; any `price` the client sends is ignored. Totals use the same
  delivery fee (100 ETB) and VAT (15%) as the cart page.

### Try it with curl

The order endpoints need a signed-in `ae_session` cookie now (copy it from DevTools → Application → Cookies and add `-b "ae_session=…"`). Without it they return `401`.

```bash
curl -i localhost:3000/api/dishes
curl -i localhost:3000/api/dishes/kitfo
curl -i localhost:3000/api/dishes/burger          # 404

# 422 with named field errors
curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"12345","address":"Bole Atlas","paymentMethod":"cash","items":[{"id":"kitfo","qty":1}]}'

# 201
curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"0911234567","address":"Bole Atlas","paymentMethod":"cash","items":[{"id":"kitfo","qty":1}]}'
```

## Server actions (`app/orders/actions.js`)

Server actions are POST endpoints too, but can't set an HTTP status, so each returns a
`status` field with the same meaning, and the UI branches on it.

| Action | Used by | `status` values |
|---|---|---|
| `placeOrder(prevState, formData)` | Checkout form via `useActionState` | **201** created · **422** with `fieldErrors` (and the submitted `values`, so the form refills) |
| `cancelOrder(prevState, formData)` | "Cancel order" button on `/orders` via `useActionState` | **200** cancelled · **401** no valid session · **403** not your order · **404** unknown order · **409** already cancelled, or already being prepared (`TOO_LATE`) |

Both call `revalidatePath('/orders')` after a successful write (so does `POST /api/orders`).

## How the pieces fit

| File | Role |
|---|---|
| `lib/order-schema.js` | **The one schema.** `validateOrder()` is used by `POST /api/orders` and `placeOrder`; `PAYMENT_METHODS` is used by the form. |
| `lib/api-errors.js` | Builds the shared error shape. |
| `lib/pricing.js` | Subtotal / delivery / VAT, shared by the cart page and the order store. |
| `lib/orders.js` | In-memory order store (`server-only`). Lost on restart. Orders step through `placed → in-kitchen → on-the-way → delivered` on a timer (20s / 50s / 100s). |
| `lib/fetcher.js` | The shared SWR fetcher; throws on non-OK responses. |
| `lib/swr-keys.js` | Builds every SWR key, for both the server's fallback and the client's hooks. |
| `lib/data-hooks.js` | Every client query and its refresh rules (`useTrackedOrder`, `useDishPage`, `useDishSearch`). |
| `lib/session.js` | The one session helper: signs, verifies, sets and revokes the `ae_session` cookie (`server-only`). The only place `SESSION_SECRET` is read. |
| `app/checkout/CheckoutForm.jsx` | `<form action={formAction}>` — no `fetch`, `pending` from `useActionState` drives the button. |
| `app/orders/page.js` | My Orders: dynamic, lists only `getOrdersByOwner(session.id)`. |
| `app/kitchen/page.js` | Staff-only order board (every order, with contact details). Role checked on the server. |

## Check yourself

- **Invalid phone with `curl -X POST` →** `422` with `fieldErrors.phone`.
- **Valid order →** `201`. **Unknown dish id →** `GET /api/dishes/burger` is `404 NOT_FOUND`, not an empty `200`
  (and an order containing `burger` is a `422` with `fieldErrors.items`).
- **Field errors after switching to the server action?** Yes — `placeOrder` returns
  `fieldErrors` plus the submitted `values`; the form shows the errors under each field
  and refills the inputs.
- **New order on the cached orders page?** `/orders` is prerendered and served with
  `x-nextjs-cache: HIT`. `revalidatePath('/orders')` after each write marks it stale,
  so the next request re-renders and the new order (or cancellation) shows immediately.
- **`cancelOrder` with someone else's id from the console?** The action re-checks
  everything on the server, regardless of which buttons the UI showed:
  - no cookie, or a hand-edited cookie (the HMAC signature fails) → `401 UNAUTHORIZED`
  - a valid session that isn't the order's owner → `403 FORBIDDEN`, nothing is written
  - the owner → `200`, then `409 ALREADY_CANCELLED` on a repeat
- **Any secret in the browser's JavaScript?** No. `SESSION_SECRET` lives only in
  `.env.local` (git-ignored), has no `NEXT_PUBLIC_` prefix, and is read only in
  `lib/session.js`, which imports `server-only` (importing it from a client component
  is a build error). Grepping `.next/static` for the secret's value finds nothing. The
  session cookie is `httpOnly`, so page scripts can't read it either.

See [BOUNDARY.md](./BOUNDARY.md) for the server/client component map.
