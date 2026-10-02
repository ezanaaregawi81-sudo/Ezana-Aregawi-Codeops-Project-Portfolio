# Rendering Strategy

Every route in Addis Eats, the strategy it uses, and the one line of reasoning behind it.
The **Build** column is copied from `next build` (Next.js 16.3.5), not from intent — see
[Checked against the build](#checked-against-the-build).

## The table

| Route | Strategy | Build | Reason |
|---|---|---|---|
| `/` | **Static** | `○` | Same landing page and specials for every visitor; nothing request-specific. |
| `/menu` | **ISR, `revalidate = 3600`** | `○ 1h` | Dishes change a few times a day, so an hour of staleness is fine and every visitor gets cached HTML. |
| `/menu/[id]` | **Static via params** (`generateStaticParams`, `dynamicParams = false`, `revalidate = 3600`) | `●` ×16, `1h` | All dish ids are known at build time; same freshness as `/menu` so the two never disagree on a price for more than an hour. |
| `/cart` | **Client** (static shell) | `○` | The cart is private to this browser tab, so its contents render on the client. |
| `/wishlist` | **Client** (static shell) | `○` | Same reason as the cart: the wishlist lives in this browser only. |
| `/checkout` | **Dynamic** + server action | `ƒ` | Reads the visitor's cart cookie on every request, and `placeOrder` is validated and guarded on the server. |
| `/orders/[id]` | **Dynamic** | `ƒ` | Reads the session cookie to prove the order belongs to this visitor. |
| `/api/dishes`, `/api/dishes/[id]` | Route handler | `ƒ` | For outside callers only (curl, partner apps). Our own pages read the data directly. |
| `/api/orders` | Route handler (`POST`) | `ƒ` | Order intake for non-browser clients; same schema as the server action. |
| `/api/orders/[id]` | Route handler (`GET`) | `ƒ` | Polled by the order page every 5 s: a repeated, browser-triggered read. |
| `/api/payments/confirm` | Route handler (`POST`) | `ƒ` | Called by the payment provider, which we do not control. |
| Unknown URL / `/menu/not-a-dish` | `not-found.js` | `○ /_not-found` | Real HTTP 404 and a friendly page inside the normal shell. |

## The five questions, route by route

| Route | Who is asking? | How stale may it be? | Ids known? | Reads a cookie? | Private to one tab? |
|---|---|---|---|---|---|
| `/` | Nobody in particular | Until the next deploy | — | No | No |
| `/menu` | Nobody in particular | 1 hour | — | No | No (the *filter* is per-visitor, so it runs on the client) |
| `/menu/[id]` | Nobody in particular | 1 hour | **Yes**, all 16 | No | No |
| `/cart` | One visitor | Must be live | — | No (reads it in the browser) | **Yes** |
| `/wishlist` | One visitor | Must be live | — | No | **Yes** |
| `/checkout` | One visitor | Must be live | — | **Yes**: `ae_cart` | Yes, but the server has to price it |
| `/orders/[id]` | The order's owner | Must be live | No (created at runtime) | **Yes**: `ae_session` | Yes |

## Decisions worth explaining

### `/menu` stays static even though it filters

The category filter is in the URL (`/menu?category=Drinks`), but reading `searchParams` in
`app/menu/page.js` would make the whole route dynamic (`ƒ`) and break ISR. So:

- the server page renders **every** dish once, and its HTML is cached for an hour;
- `CategoryBar` (sidebar) and `DishFilter` (search + sort) read the URL with
  `useSearchParams()` **on the client**, inside `<Suspense>` boundaries;
- `DishFilter` never re-renders a dish. It receives the server-rendered `DishList` as
  `children` and hides or reorders cards with CSS (`display: none` per id, CSS `order` for
  sorting, with ranks precomputed on the server).

Without JavaScript the prerendered fallback shows the full, unfiltered menu.

### Routes I changed my mind about

1. **`/menu/[id]` — from "static, never revalidated" to `revalidate = 3600` + `dynamicParams = false`.**
   - *Revalidation:* writing down "how stale may it be?" made the mismatch obvious. `/menu`
     refreshes hourly, so a dish page built once per deploy could show an older price than
     the menu card linking to it.
   - *`dynamicParams = false`:* the first production check of `/menu/not-a-dish` returned
     **HTTP 200** with the not-found UI. On-demand rendering starts streaming inside
     `app/menu/loading.js`'s Suspense boundary, so by the time `notFound()` throws, the
     200 status has already been sent (Next can only add `noindex`). All ids are known at
     build time, so unknown ids are now rejected with a real **404** before rendering.
     `notFound()` stays in the page as a guard.
2. **`/checkout` — placeholder `○` to `ƒ`.** In step 1 it built as static. Once it read the cart
   cookie it became dynamic, which is correct: it must price *this* visitor's cart.
3. **The cart moved from `localStorage` (the Vite app) to a cookie.** It is still client state,
   but the cookie lets the server read it at checkout, so the order can be placed with
   JavaScript disabled.

### What the root layout deliberately does *not* do

`app/layout.js` reads no cookies or headers. Reading the cart cookie there (for example, to
server-render the badge) would turn **every** route dynamic. The badge comes from
`Providers` on the client instead.

### `loading.js` on a static route: measured, not assumed

`app/menu/loading.js` renders inside the menu layout (header, cart badge and sidebar stay
mounted). Because `/menu` and `/menu/[id]` are prerendered, Next.js prefetches their *entire*
payload as soon as a link is visible. Navigation is then instant and no skeleton is needed.
The loading UI appears when a navigation outruns a prefetch that never completed.

Measured on the production build in Chrome (Slow 3G, prefetch blocked, 5 runs each,
`MutationObserver` on the document):

| Navigation | `loading.js` shown | Page ready |
|---|---|---|
| `/menu` → `/menu/kitfo` (inside the menu layout) | 2.09–2.10 s, **5/5 runs** | 4.24–4.27 s |
| `/cart` → `/menu` (entering the menu segment) | 4.23–4.24 s, **5/5 runs**, ~60 ms flash | 4.28–4.29 s |

Between the dish click and the dish page, the skeleton fills the content column for about
2 seconds while the sidebar and header stay put. When entering the menu segment from
outside it, Next only learns the loading boundary from the same response that carries the
page, so it barely flashes. That is the expected trade-off of making `/menu` static rather
than dynamic: a dynamic page would show the skeleton for longer, but every visitor would
wait for a server render.

## Checked against the build

```
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

Line by line against the table above: every marker matches. Next.js 16 prints `ƒ` where
older versions printed `λ` for dynamic routes.
