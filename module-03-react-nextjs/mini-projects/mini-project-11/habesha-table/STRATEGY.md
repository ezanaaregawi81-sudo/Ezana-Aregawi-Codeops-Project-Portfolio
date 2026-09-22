# Rendering Strategy (`STRATEGY.md`)

Why each route in **Habesha Table** renders the way it does.

---

## Route Strategy Matrix

| Route | File | Strategy | Reasoning |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | Static | The hero and the top three popular dishes are the same for every visitor, so building it once at compile time is strictly better than re-rendering it per request. |
| `/menu` | `app/menu/page.js` | ISR, `revalidate = 60` | The catalog is mostly stable but can change (new dish, price update), so a 60-second background revalidation window trades a small staleness window for static-page speed. |
| `/menu/[id]` | `app/menu/[id]/page.js` | Static, via `generateStaticParams` | The dish IDs are a fixed, known set at build time, so every detail page can be fully pre-rendered rather than computed on demand. |
| `/cart` | `app/cart/page.js` | Client-rendered | The basket lives in `localStorage`, which only exists in the browser — there's nothing meaningful to render on the server for this route. |
| `/checkout` | `app/checkout/page.js` | Forced dynamic (`dynamic = 'force-dynamic'`) | The page reads request headers on every hit to simulate per-session checkout data, which by definition can't be cached or pre-rendered. |
| Not found | `app/not-found.js` | Static | A generic fallback screen with no per-request data, so it's pre-built like any other static page. |

---

## Layout & Streaming Architecture

1. **Root layout** (`app/layout.js`)
   Owns the `<html>`/`<body>` shell, pulls in `globals.css` once, and renders a two-row header (brand and cart call-to-action on the first row, primary navigation on the second) plus the site footer around every route.

2. **Menu segment layout** (`app/menu/layout.js`)
   Splits the segment into a two-column rail: the routed page content renders first (left), and a sticky card-style rail renders second (right). The rail hosts `MenuSidebar.jsx`, a client component whose counter and text input persist across client-side navigations between `/menu` and any `/menu/[id]` — because the layout itself doesn't remount when only its children change, this state genuinely survives route transitions rather than being reset each time.

3. **Streaming the dish list** (`app/menu/page.js`)
   The rail and page header render immediately. The dish collection is fetched inside an async component and wrapped in `<Suspense fallback={<DishCollectionSkeleton />}>`, so the browser paints the shell first and the actual dish rows stream in once the (synchronous, but conceptually async-ready) data resolves.

4. **Segment-level loading and error boundaries**
   `app/menu/loading.js` provides the route's top-level loading skeleton for hard navigations, and `app/menu/error.js` is a client component that catches errors thrown anywhere in the menu segment (including the deliberate one thrown by `ErrorTrigger.jsx` when visiting `/menu?simError=true`) and offers a `reset()`-driven retry.
