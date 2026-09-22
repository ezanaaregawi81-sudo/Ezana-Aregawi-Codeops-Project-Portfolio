# Component Boundary Map

Every component under `app/`, which side it renders on, and why.

## Server Components

| Component | Justification |
|---|---|
| `app/layout.js` | Root layout. Renders static nav markup and mounts `Providers`/`CartNavLink`; has no state or effects of its own. |
| `app/page.js` | Home page. Reads `getAllDishes()` directly at render time; no hooks needed. |
| `app/menu/layout.js` | Nested menu layout. Renders the static sidebar shell and quick-link `<Link>`s; only interactive piece (`SidebarWidget`) is isolated in its own file. |
| `app/menu/page.js` | Menu route. `async` component that reads `searchParams` and filters the dish list on the server, so the filtered HTML is what actually ships. |
| `app/menu/[id]/page.js` | Dish detail route. `async` component, reads `params` and looks up the dish directly — no client fetching. |
| `app/menu/DishList.jsx` | Pure presentational grid of dish cards built from server-provided data. Never imported by a client component, so it stays out of the client bundle entirely. |
| `app/menu/DishListSkeleton.jsx` | Static loading skeleton markup, no interactivity. |
| `app/menu/CategoryBar.jsx` | Category filter nav. Implemented as plain `next/link`s that navigate to `/menu?category=...`; the active pill is computed from the URL on the server, so no client state is needed. |
| `app/menu/loading.js` | Suspense fallback for the route segment; static markup. |
| `app/not-found.js` | Static 404 page. |
| `app/checkout/page.js` | `async` component that reads `headers()` and renders the (client) form; page shell itself has no state. |

## Client Components (`"use client"`)

| Component | Justification |
|---|---|
| `app/Providers.jsx` | Holds a `CartContext` (`useState`/`useEffect`) that reads `localStorage` via `lib/cart.js` and exposes a live cart item count + `refreshCart()` to the rest of the app, avoiding prop-drilling through every route. This is the app's **client shell**: `RootLayout` (server) passes the entire server-rendered tree — header nav, `{children}` page content, footer — into `Providers` as `children`. |
| `app/CartNavLink.jsx` | Reads `useCartContext()` to render a live "Cart (n)" badge in the nav; needs `useContext`, so it can't be a server component. |
| `app/AddToCartButton.jsx` | Leaf button. Needs `useState` for the transient "Added ✓" label and calls `refreshCart()` after mutating the cart — smallest possible boundary for that interactivity. |
| `app/menu/SidebarWidget.jsx` | Has its own `useState` counters and a controlled text input; interactivity is local to this widget only. |
| `app/menu/ErrorSimulator.jsx` | Uses `useSearchParams()` (a client-only hook) to conditionally render an error banner for demo purposes. |
| `app/menu/error.js` | Next.js requires route `error.js` boundaries to be Client Components. |
| `app/cart/page.js` | Nearly every element on this page is stateful (quantities, removal, live totals via `useMemo`), so the whole route is one client page rather than a shell around many tiny client leaves. |
| `app/checkout/CheckoutForm.jsx` | Controlled form fields need `useState`; kept separate from `app/checkout/page.js` so the page itself (which reads `headers()`) can stay a server component. |

## Notes

- No callback props are passed from a Server Component to a Client Component anywhere in the tree — Server Components only ever pass serializable data (`dish`, `dishes`, `categories`, `params`) down to Client Components.
- `DishList` is the component this refactor was built around: it used to be imported directly by a `"use client"` container (`MenuClientContainer`), which pulled it (and everything it touches, including `AddToCartButton`'s wiring) into the client bundle even though `DishList` itself never declared `"use client"`. Moving category filtering to the URL (read via `searchParams` in `app/menu/page.js`) removed the need for that client wrapper, so `DishList` is now server-only and never shipped to the browser.
