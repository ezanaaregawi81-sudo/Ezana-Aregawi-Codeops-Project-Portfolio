# Live data: every query and why it refreshes the way it does

Where things live:

- `lib/fetcher.js`: the one fetcher. It's registered once in `app/Providers.jsx` with `<SWRConfig value={{ fetcher }}>`, so no query can skip it. A non-OK response is thrown as an `Error` with `status` and our API's error `code`, so SWR reports a 401 or 404 as `error` and never hands it back as data.
- `lib/swr-keys.js`: builds every key. The server pages use the same builders for their fallback data.
- `lib/data-hooks.js`: every `useSWR` call, with its options.

## The queries

| Hook | Key | Refresh rule | Reasoning (one line) |
|---|---|---|---|
| `useTrackedOrder(id, initialOrder)` | `/api/orders/<id>` | `fallbackData` from the server; `refreshInterval` **5000ms** until the status is `delivered` or `cancelled`, then **0**; default `dedupingInterval` (2s); revalidates on focus | The status changes by itself within seconds, so poll every 5s for as long as it can still change, and stop once it can't. |
| `useDishPage(category, page)` | `/api/menu?category=<c>&page=<n>` (no `category` for All) | No polling; `dedupingInterval` **60s**; `revalidateOnFocus: false`; `keepPreviousData: true`; keyed `fallback` from the server for the first page shown | The menu only changes on deploy or after the page's 60s `revalidate`, so any page fetched in the last minute is still correct. |
| `useDishSearch(query)` | `/api/dishes/search?q=<query>`, or **`null`** when the debounced query is empty | No polling; `dedupingInterval` **60s**; `revalidateOnFocus: false`; `keepPreviousData: true` | Same menu data, so the same 60s window. A null key means an empty box sends nothing. |

**`staleTime`** is what TanStack Query calls it. In SWR it's `dedupingInterval`: how long a key's last answer is reused before another request is allowed.

- **Order: 2s.** That's long enough to merge the two components on the tracking page into one request, and shorter than the 5s poll, so no update gets skipped.
- **Menu and search: 60s.** It matches `export const revalidate = 60` on `/menu`. Refetching sooner can't return anything newer.

## How each requirement is met

**Order status: rendered on the server, then polled** (`app/orders/[id]/`)

- `page.js` (server) checks the signed session cookie, loads the order and passes it to two client components: `OrderStatusPill` in the heading and `LiveOrder` below it.
- Both call `useTrackedOrder(id, initialOrder)`. Because of `fallbackData`, the first paint already shows the real status: no spinner, no request on mount.
- They share one key, so SWR shares one cache entry and dedupes. The network tab shows **one** `api/orders/<id>` every 5s, not two.

**Search that debounces and never shows the wrong results** (`app/menu/MenuExplorer.jsx`)

- `useDebounce(text, 350)`: the key only changes once typing stops, so `kitfo` fires one request, not five.
- The search route takes a random 250–1100ms, so answers can arrive out of order. That's harmless. Each answer is cached under its own key, and the component only reads the key for the current query, so a late `kit` answer never shows under `kitfo`.
- The caption uses `query` from the response, so "N matches for …" always describes the dishes under it.
- While the next answer is on its way (or the user is mid-word), the old results stay up, faded, with "updating…".

**Paged list that doesn't flash**

- `keepPreviousData: true`: on Next, the current page stays on screen (faded) until the next one arrives, instead of `data` going to `undefined` and the grid vanishing.
- The page number is in the URL (`/menu?category=Tibs&page=2`), so it can be linked and shared. The server renders that exact page and seeds it as keyed `fallback`. That's keyed so page 1 can never stand in for page 2, which plain `fallbackData` would do.
- Prev/Next use `history.pushState`. Next keeps `useSearchParams` in sync without fetching an RSC payload, so only `api/menu` requests appear. Back/Forward step through pages, and pages you've already visited come from the cache.
- One catch: `keepPreviousData` also returns the last search results when the key goes `null`. `MenuExplorer` decides what to show from the debounced query, not from `data`, so clearing the box goes straight back to the paged list.
