# Addis Eats — Sorting the Boundary

A Next.js App Router rebuild of the Addis Eats menu with deliberate server/client
component boundaries: data fetching and rendering happen on the server wherever
possible, and `"use client"` is pushed down to the smallest leaf that actually
needs interactivity.

## Bundle measurement: `/menu`

`next build` (Turbopack) no longer prints the classic "First Load JS" table, so
the numbers below were measured directly from each build's
`.next/server/app/menu/page_client-reference-manifest.js`: that manifest lists
every client-reference chunk the `/menu` route actually loads, on top of the
root-layout shared chunks. Root-layout chunks are identical in both builds, so
the delta below isolates the JS that `/menu` itself is responsible for.

| | Client modules pulled in by `/menu` | Route-specific client JS |
|---|---|---|
| **Before** | `MenuClientContainer.jsx` (which, by importing `DishList` directly, also inlined `DishList` + `AddToCartButton`'s wiring), `CategoryBar.jsx`, `SidebarWidget.jsx`, `ErrorSimulator.jsx`, `error.js` | 31,555 bytes (~30.8 KB) |
| **After** | `Providers.jsx`, `CartNavLink.jsx`, `AddToCartButton.jsx`, `SidebarWidget.jsx`, `ErrorSimulator.jsx`, `error.js` | 29,630 bytes (~28.9 KB) |

**~1.9 KB (~6%) less route-specific JS**, and qualitatively more important:
`DishList` — the component that renders every dish card — is no longer part of
the client bundle at all. In the "before" build it was being shipped to the
browser only because it was imported directly by a `"use client"` file
(`MenuClientContainer`), even though it never used `"use client"` itself.
`CategoryBar` also moved from a stateful client component to a Server
Component (`next/link`s driven by the `?category=` search param).

### Why the win looks small in bytes but isn't small in kind

Ethiopian dish data is tiny, so `DishList`'s own code was never going to be
huge. The real bug the refactor fixes is architectural, not size: any route
that later grows a bigger list, richer cards, or more dishes would previously
have shipped that growth to every visitor's browser, because it was on the
wrong side of a `"use client"` boundary. After the fix, that entire class of
regression is closed off — `DishList` physically cannot re-enter the client
bundle unless something explicitly re-imports it from a client component
again.

## Architecture

- `app/menu/page.js` is an `async` Server Component. It reads the `?category=`
  search param and filters the dish list *on the server*, then renders
  `CategoryBar` (server, plain links) and `DishList` (server) directly.
- `app/menu/[id]/page.js` is an `async` Server Component with no client
  fetching hooks.
- `app/Providers.jsx` is the app's one Client Component "shell": `app/layout.js`
  (server) passes the entire server-rendered tree into it via `children`, and
  it exposes a shared cart-item-count context so `AddToCartButton` and
  `app/cart/page.js` can update a live badge in the nav without prop-drilling
  or re-reading `localStorage` in every component.
- See [BOUNDARY.md](./BOUNDARY.md) for the full component-by-component
  breakdown and justification.

## Running locally

```bash
npm install
npm run dev
```
