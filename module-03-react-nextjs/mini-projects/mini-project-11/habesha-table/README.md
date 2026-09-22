# Habesha Table (Next.js App Router)

**Habesha Table** is an Ethiopian restaurant ordering demo built on the Next.js App Router. It layers a persistent, stateful segment layout, a chosen mix of rendering strategies (static, ISR, forced dynamic), React Suspense streaming, and full static-parameter pre-rendering on top of the file-system router.

---

## Route Map

| URL | File | Rendering | Why |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | Static | The landing hero and featured dishes never depend on request data, so it's pre-rendered at build time. |
| `/menu` | `app/menu/page.js` | ISR (`revalidate = 60`) | Dishes and prices change occasionally, so a 60-second revalidation window keeps the page static-fast while staying reasonably fresh. |
| `/menu/[id]` | `app/menu/[id]/page.js` | SSG via `generateStaticParams` | Every dish ID is known ahead of time, so all detail pages are pre-built. |
| `/cart` | `app/cart/page.js` | Client-rendered shell | Reads and writes the basket from `localStorage`, so the numbers only make sense in the browser. |
| `/checkout` | `app/checkout/page.js` | Forced dynamic (`dynamic = 'force-dynamic'`) | Reads request headers per visit to simulate a live checkout session. |
| Not found | `app/not-found.js` | Static | Custom 404 for unmatched routes or an explicit `notFound()` call. |

---

## Layout & Streaming Notes

- **Root layout** (`app/layout.js`) owns `<html>`/`<body>`, loads `globals.css`, and renders the two-row header (brand + cart action on top, primary nav below) and the footer for every route.
- **Menu segment layout** (`app/menu/layout.js`) renders the routed page content first and a sticky rail (`MenuSidebar.jsx`) to its right. The rail keeps its own client state (a favorites counter and a note field) across navigation between `/menu` and `/menu/[id]`, which demonstrates that nested layouts don't remount on child navigation.
- **Streaming** (`app/menu/page.js`) wraps the dish list in `<Suspense fallback={<DishCollectionSkeleton />}>` so the rail and page chrome paint immediately while the dish data streams in behind it.
- **Error and loading boundaries**: `app/menu/loading.js` supplies the route-level skeleton, and `app/menu/error.js` catches thrown errors from `ErrorTrigger.jsx` (visit `/menu?simError=true` to trigger it) and offers a reset button.

See `STRATEGY.md` for the reasoning behind each rendering choice.

---

## Project Structure Highlights

- `lib/menu-catalog.js` — the `MENU_ITEMS` data set plus `getMenuItems`, `getMenuItemById`, and `getMenuCategories` helpers.
- `lib/order-basket.js` — `localStorage`-backed basket helpers (`getOrderBasket`, `saveOrderBasket`, `addToBasket`, `updateBasketItemQuantity`, `removeFromBasket`, `clearBasket`).
- `app/AddToOrderButton.jsx` — shared client button used on the home page, menu list, and dish detail page.
- `app/menu/CategoryTabs.jsx`, `DishCollection.jsx`, `DishCollectionSkeleton.jsx`, `MenuBrowser.jsx`, `MenuSidebar.jsx`, `ErrorTrigger.jsx` — the colocated pieces that make up the interactive menu browsing experience.
- `app/checkout/OrderForm.jsx` — the client-side checkout form extracted from the checkout route.

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build and run the production bundle:
   ```bash
   npm run build
   npm start
   ```

---

## Verification Checklist

- [x] Root layout renders the shared header/footer chrome and imports global styles once.
- [x] The menu segment layout keeps `MenuSidebar.jsx` state alive while navigating within `/menu/*`.
- [x] `/menu` opts into ISR with `export const revalidate = 60`.
- [x] `/menu/[id]` pre-renders every dish via `generateStaticParams`.
- [x] `/checkout` forces dynamic rendering with `export const dynamic = 'force-dynamic'` and reads request headers.
- [x] The menu list streams behind a `Suspense` boundary with a dedicated skeleton fallback.
- [x] `STRATEGY.md` documents the rendering strategy and rationale for every route.
