# Addis Eats Gets an API

The server half of Addis Eats, living in the same Next.js App Router project as the
pages: a dishes API with a dynamic segment, an orders endpoint that validates with the
same schema the checkout form uses, the checkout rewritten as a server action with
pending state and cache revalidation, and a `cancelOrder` authorisation check that
can't be bypassed by hiding a button.

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
| `/api/orders` | `POST` | **201** — the created order (sets the `ae_session` cookie) · **400** `BAD_REQUEST` — body isn't JSON · **422** `VALIDATION_FAILED` — with `fieldErrors` |

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
| `cancelOrder(prevState, formData)` | "Cancel order" button on `/orders` via `useActionState` | **200** cancelled · **401** no valid session · **403** not your order · **404** unknown order · **409** already cancelled |

Both call `revalidatePath('/orders')` after a successful write (so does `POST /api/orders`).

## How the pieces fit

| File | Role |
|---|---|
| `lib/order-schema.js` | **The one schema.** `validateOrder()` is used by `POST /api/orders` and `placeOrder`; `PAYMENT_METHODS` is used by the form. |
| `lib/api-errors.js` | Builds the shared error shape. |
| `lib/pricing.js` | Subtotal / delivery / VAT, shared by the cart page and the order store. |
| `lib/orders.js` | In-memory order store (`server-only`). Lost on restart. |
| `lib/session.js` | Signed session cookie (`server-only`), the only place `SESSION_SECRET` is read. |
| `app/checkout/CheckoutForm.jsx` | `<form action={formAction}>` — no `fetch`, `pending` from `useActionState` drives the button. |
| `app/orders/page.js` | **Static, cached** kitchen order board (`○` in `next build`). Shows only first name, items, total, status — no phone, address or owner id. |

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
