# Rendering notes

What each route renders as, so the build output can be checked against it.

| Route | Strategy | Marker |
| --- | --- | --- |
| `/` | Static | `○` |
| `/home` | Static | `○` |
| `/cart` | Static | `○` |
| `/checkout` | Dynamic (reads cookies) | `ƒ` |
| `/menu` | Static + ISR, revalidate 60s | `○` with `1m` revalidate |
| `/menu/[id]` | Static, pre-built per dish (`generateStaticParams`) | `●` |

## Why these revalidate windows

- `/menu` revalidate = 60s — the catalog changes occasionally (a price or
  name tweak), so a short window surfaces edits within a minute without a
  full redeploy, while still serving cached output on nearly every request.
- `/menu/[id]` has no revalidate export — each dish page is pre-built once
  via `generateStaticParams` and only changes on redeploy, so there's
  nothing to revalidate on a timer.
- `/checkout` is fully dynamic — it reads a per-visitor cookie, so it has to
  run on every request rather than serve cached HTML.

## `/menu` and the "streamed" sidebar

`/menu` reads the `category` and `error` query params. Doing that directly
in a server page component would force the whole route to render per
request, which defeats the static/ISR goal above. To keep `/menu` static,
the query-param logic lives in two client components (`CategoryFilter`,
`MenuResults`) that call `useSearchParams()`, each wrapped in `<Suspense>`.

Because of that, Next resolves those `<Suspense>` fallbacks *at build
time* — there's no real request to read params from — so the fallback
markup (chip-row skeleton, menu-list skeleton) is what actually ships in
the static HTML. The real content swaps in client-side once hydration
reads the real URL, plus a 1s `setTimeout` in `MenuResults` so the swap is
visible.

So the rail-before-dishes effect on `/menu` is a client-side
hydration/timer effect, not genuine per-request server streaming (a static
page has nothing left to stream once it's built). Real per-request
Suspense streaming still shows up through `app/menu/loading.jsx`, which
Next displays during a client-side navigation into `/menu` while the RSC
payload is still in flight — that part *is* affected by connection speed.
