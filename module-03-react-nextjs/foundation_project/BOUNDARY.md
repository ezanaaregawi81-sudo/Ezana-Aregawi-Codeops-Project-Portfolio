# Server / Client Boundary

Every component, which side it runs on, and why. The rule: **server first, client last.**
Everything is a server component unless something forces `"use client"`: state, an event
handler, a browser API or a client-only hook.

Verify it yourself:

```bash
grep -rlE "^['\"]use client['\"]" app components lib   # 12 files, listed below
grep -rlE "^['\"]use server['\"]" app lib              # app/actions.js only
```

No `page.js` or `layout.js` file contains `"use client"`.

## Server components

| Component | File | Why it stays on the server |
|---|---|---|
| `RootLayout` | `app/layout.js` | Static shell (header, footer). Passes the whole page into `Providers` as `children`. Reads no cookies, so it doesn't make every route dynamic. |
| `HomePage` | `app/page.js` | Awaits `getSpecials()` directly; pure markup. |
| `MenuLayout` | `app/menu/layout.js` | Awaits `getCategories()`; renders the sidebar shell. |
| `MenuPage` | `app/menu/page.js` | Awaits `getDishes()` and builds the small search index. Reads no `searchParams`, so it stays ISR. |
| `DishPage` | `app/menu/[id]/page.js` | Awaits the dish and related dishes; `generateStaticParams`, `notFound()`. |
| `CartPage` | `app/cart/page.js` | Reads the public menu once and passes it to `CartView` as a prop. No fetch in the browser. |
| `WishlistPage` | `app/wishlist/page.js` | Renders every dish card once; `WishlistGrid` decides which are visible. |
| `CheckoutPage` | `app/checkout/page.js` | Reads the cart cookie and prices the summary from the menu. The customer sees the server's numbers. |
| `OrderPage` | `app/orders/[id]/page.js` | Reads the session, checks ownership, renders the confirmation and a plain server-action `<form>` to cancel. |
| `NotFound` | `app/not-found.js` | Static 404 markup. |
| `MenuLoading` | `app/menu/loading.js` | Static skeleton markup. |
| `DishList` | `components/DishList.jsx` | Markup only; computes the sort ranks on the server. |
| `DishCard` | `components/DishCard.jsx` | Markup only. Its two buttons are the client leaves. |
| `CategoryList` | `components/CategoryList.jsx` | Pure, hook-free markup, rendered on the server as the prerendered sidebar fallback. |
| `MenuToolbar` | `components/MenuToolbar.jsx` | Pure, hook-free markup, rendered on the server (disabled) as the prerendered fallback. |

`CategoryList` and `MenuToolbar` have no directive, so they render on whichever side imports
them: on the server as fallbacks, and inside `CategoryBar` / `DishFilter` on the client.

## Client components (12)

| Component | File | Why it must run in the browser |
|---|---|---|
| `Providers` | `components/Providers.jsx` | Holds the cart and wishlist state (context + `useState`) and syncs it to a cookie and `localStorage`. Receives server content as `children`. |
| `NavLinks` | `components/NavLinks.jsx` | Active link needs `usePathname()`; badges need the cart/wishlist counts from `Providers`. The brand and the rest of the header stay server-rendered. |
| `CategoryBar` | `components/CategoryBar.jsx` | The selected category lives in the URL, and a layout never receives `searchParams`. Reading it on the client is what keeps `/menu` static. |
| `DishFilter` | `app/menu/DishFilter.jsx` | Search text and sort order are local UI state; the category comes from `useSearchParams()`. Wraps the server `DishList` as `children` and only hides or reorders it with CSS. |
| `AddToCartButton` | `components/AddToCartButton.jsx` | `onClick`, writes to the cart store; the dish page's quantity stepper is local state. |
| `WishlistButton` | `components/WishlistButton.jsx` | `onClick`, reads/writes the wishlist store. |
| `CartView` | `app/cart/CartView.jsx` | The cart contents are private to the browser and every control changes them. |
| `WishlistGrid` | `app/wishlist/WishlistGrid.jsx` | The wishlist is private to the browser; wraps server-rendered cards as `children` and hides the unsaved ones. |
| `CheckoutForm` | `app/checkout/CheckoutForm.jsx` | `useActionState` for the pending flag and the action's field errors, plus instant validation. Still a real `<form action>`, so it works without JavaScript. |
| `OrderStatus` | `app/orders/[id]/OrderStatus.jsx` | Polls `GET /api/orders/[id]` every 5 s (`setInterval` + `fetch`) and calls `router.refresh()` when the status changes. |
| `MenuError` | `app/menu/error.js` | Next.js requires error boundaries to be client components. |
| `RootError` | `app/error.js` | Same: the error boundary for routes outside `/menu`. |

### Why 12, not 3–5

The brief's sketch has three client components because its version of the app has three
interactive things. The original Addis Eats has more, and the rebuild keeps all of them:
search, sort, a wishlist, quantity steppers, plus order-status polling from the brief's
data-flow table. Every one of the 12 is a **leaf**:

- none is a page or a layout;
- `DishFilter` and `WishlistGrid` wrap server-rendered cards as `children` instead of
  importing `DishCard`, so no dish markup component ships to the browser;
- two are error boundaries that Next.js requires to be client components.

**Considered and rejected:**

- Making `/cart` a client page. A server page that passes the catalogue down keeps the menu
  data out of a fetch.
- A client `DishCard`. The buttons are the only interactive parts, so only they are client
  components.
- Wrapping the cancel button in a client component. It is a plain server-action `<form>`.

## Composition pairs (client wrapping server content)

| Client wrapper | Server content passed as `children` |
|---|---|
| `Providers` | The entire app from `RootLayout` |
| `DishFilter` | `DishList` → `DishCard` ×16 (rendered once on the server) |
| `WishlistGrid` | `DishList` → `DishCard` ×16 |

## What crosses the boundary (props from server to client)

Only serialisable data, never functions:

| Client component | Props from the server |
|---|---|
| `AddToCartButton` | `dishId`, `dishName`, `price` (label only — the server re-prices every order) |
| `WishlistButton` | `dishId`, `dishName`, `variant` |
| `CategoryBar` | `categories` (`[{ name, count }]`) |
| `DishFilter` | `index` (`[{ id, category, text }]`) |
| `CartView` | `catalog` (`{ id: { name, price, emoji, color } }`) |
| `WishlistGrid` | `ids` |
| `CheckoutForm` | `total` (button label only) |
| `OrderStatus` | `orderId`, `initialStatus`, `steps` |

The one function that crosses is a **server action** (`placeOrder`, `cancelOrder` from
`app/actions.js`). That is the only kind of function allowed to.

## Server-only modules

`lib/dishes.js`, `lib/orders.js`, `lib/session.js` and `lib/secrets.js` import
`'server-only'`, so importing any of them from a client component is a **build error**.
The modules shared by both sides contain no secrets:

- `lib/order-schema.js` (the validation rules)
- `lib/pricing.js`
- `lib/cart-cookie.js`

## Bundle: what moved

Measured on `next start` (gzip, `nomodule` polyfills excluded):

| | First Load JS | Our application code in it |
|---|---|---|
| Original Vite SPA, every route | 84.8 kB | All 16 dishes, every page and component |
| `/menu` on Next.js | 138.1 kB | ~9.4 kB: the client leaves (~7.7 kB shared) + `DishFilter` (~1.7 kB) |
| `/` on Next.js | 136.4 kB | ~7.7 kB of shared client leaves |

The total is **higher**, honestly. The App Router runtime (RSC client, router, prefetching) is
bigger than React Router. What changed is *whose* code ships:

- dish data, `DishCard`, `DishList`, the landing page and every description are absent from
  `.next/static` (checked with `grep`);
- the menu arrives as finished HTML, and works with JavaScript off;
- adding dishes no longer grows the bundle.
