# Habesha Table

**Habesha Table** is an Ethiopian restaurant ordering demo built on the Next.js App Router. It's a small, focused example of file-system routing, dynamic route segments, colocated (non-routable) helper components, segment-level loading and error boundaries, static generation via `generateStaticParams`, and a custom 404 page.

---

## Route map

Every URL the app serves, and the file that produces it:

| URL Route | Source File | Route Type | What it does |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | Static Route | Landing page with hero banner and a short list of popular dishes |
| `/menu` | `app/menu/page.js` | Segment Route | Full menu with category tabs and a link to trigger the error boundary |
| `/menu/[id]` | `app/menu/[id]/page.js` | Dynamic Route | Single-dish detail page (e.g. `/menu/kitfo`, `/menu/doro-wat`) |
| `/cart` | `app/cart/page.js` | Static Route | Order basket contents and price breakdown |
| `/checkout` | `app/checkout/page.js` | Static Route | Delivery address form and payment method selection |
| *Not Found / 404* | `app/not-found.js` | Global 404 | Shown for any unmatched route or an explicit `notFound()` call |

## Colocated components and segment UI

These files live inside route folders but are **not** routes themselves — Next.js only treats specially-named files (`page.js`, `layout.js`, `loading.js`, `error.js`, `not-found.js`) as routable.

| File | Purpose | Reachable as a URL? |
| :--- | :--- | :--- |
| `app/menu/DishCollection.jsx` | Renders the list of menu items with pricing and action buttons | No — `/menu/DishCollection` 404s |
| `app/menu/CategoryTabs.jsx` | Category filter tab row | No — `/menu/CategoryTabs` 404s |
| `app/menu/loading.js` | Skeleton UI shown while the `/menu` segment loads | Not a URL — it's a Next.js loading boundary |
| `app/menu/error.js` | Client-side error boundary (`"use client"`) with a reset handler | Not a URL — it's a Next.js error boundary |

## Running it locally

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

## Manual verification checklist

- **Async dynamic params**: `app/menu/[id]/page.js` awaits its params (`const { id } = await params`) before looking up the dish.
- **Colocation holds up**: hitting `/menu/DishCollection` or `/menu/CategoryTabs` directly returns the 404 page, confirming they aren't routes.
- **Error boundary**: visiting `/menu?simError=true` throws inside the segment and is caught by `app/menu/error.js`.
- **Custom 404**: visiting `/menu/some-unknown-dish` calls `notFound()` and renders `app/not-found.js`.
