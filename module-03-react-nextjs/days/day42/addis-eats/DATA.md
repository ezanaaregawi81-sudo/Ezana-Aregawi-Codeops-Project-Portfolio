# Day 38: Fetching data on the client with SWR

Server components still render every page first. SWR is only used where the browser needs data that changes after the page has loaded: a live order status, and search results that follow what you type.

## The shared fetcher (`lib/fetcher.js`)

All `useSWR` calls use one `fetcher`. `fetch()` resolves even for a 404 or 500, so the fetcher checks `response.ok` and throws an `Error` with `status` and the API's error `code` on it. Without that, SWR would treat an error body as if it were data.

## Order tracking: `/orders/[id]`

| | |
|---|---|
| Server part | `app/orders/[id]/page.js` reads the session cookie and the order, and calls `notFound()` if it isn't yours |
| Client part | `app/orders/[id]/LiveOrder.jsx` |
| Key | `/api/orders/<id>` |
| Options | `fallbackData: initialOrder`, `refreshInterval: 5000` |
| API | `GET /api/orders/[id]`: 401 without a session, 404 if the order is missing or someone else's |

**Before, with an effect and state:**

```jsx
const [order, setOrder] = useState(initialOrder);
const [error, setError] = useState(null);

useEffect(() => {
  let stopped = false;
  const load = () =>
    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed'))))
      .then((data) => !stopped && setOrder(data))
      .catch((err) => !stopped && setError(err));
  const timer = setInterval(load, 5000);
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}, [orderId]);
```

**After:**

```jsx
const { data: order, error } = useSWR(`/api/orders/${orderId}`, fetcher, {
  fallbackData: initialOrder,
  refreshInterval: 5000,
});
```

Both `useState`s, the effect, the interval and the "stopped" flag are gone. SWR also revalidates when the tab gets focus again, and stops polling when the component unmounts.

- **Polling.** Orders move `placed → in-kitchen → on-the-way → delivered` by themselves (20s / 50s / 100s after ordering, see `lib/orders.js`). With `refreshInterval: 5000` the network tab shows `api/orders/<id>` every 5 seconds and the stepper follows along.
- **`fallbackData`.** The server page already has the order, so it passes it in. The first paint shows the real status with no loading state, and there's no request on mount.

## Menu search: `/menu`

| | |
|---|---|
| Component | `app/menu/MenuSearch.jsx` (wraps the server-rendered category list) |
| Key | `/api/dishes/search?q=<term>&page=<n>`, or `null` when the term is empty |
| Options | `keepPreviousData: true` |
| API | `GET /api/dishes/search` returns `{ query, dishes, page, pageCount, matchCount }`, 3 per page, with 700ms of added delay |

- **Debounce.** `useDebounce(text, 350)` only updates the term 350ms after the last keystroke. The key is built from the debounced term, so typing `tibs` makes one request instead of four.
- **Null key.** An empty box gives a `null` key, and SWR fetches nothing. The normal category view (server-rendered, passed in as `children`) shows instead.
- **`keepPreviousData`.** Without it, `data` goes back to `undefined` every time the key changes, so the list vanished and reappeared between searches. With it, the previous results stay on screen, faded, until the new ones arrive. It also keeps returning old data after the box is cleared, which is why the component checks `key` before showing results.
- **Paging.** The page is in the URL (`/menu?q=signature&page=2`) and is part of the SWR key, so each page is cached on its own and the link can be shared. Prev/Next use `history.pushState` and typing uses `history.replaceState`. Next.js keeps `useSearchParams` in sync with both and doesn't make a server request, so only the API calls show up in the network tab.
