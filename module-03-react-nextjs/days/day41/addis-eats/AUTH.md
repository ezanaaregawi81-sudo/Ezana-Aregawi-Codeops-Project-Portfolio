# Sign-in and sessions in Addis Eats (Day 39)

Demo accounts: `abebe@example.com` / `injera123`, `tirunesh@example.com` / `injera123`, `kitchen@addiseats.et` / `kitchen123` (staff).

Copy `.env.example` to `.env.local` and fill in `SESSION_SECRET` before running. The cookie can't be signed without it.

## The exercises, and where each one lives

| # | Exercise | Where |
| --- | --- | --- |
| 1 | `getSession` reads and verifies the cookie | `lib/session.js`. The cookie is `<payload>.<HMAC signature>`. `getSession()` returns `{ id, name, role, sid }`, or `null` if the cookie is missing, tampered with, expired or signed out. |
| 2 | Cookie set on sign-in with `httpOnly`, `secure`, `sameSite`, `maxAge` | `createSession()` in `lib/session.js`, called by the `signIn` action in `app/sign-in/actions.js`. `maxAge` is 8 hours, matching the signed expiry. |
| 3 | Middleware on `/checkout` and `/orders` only | `proxy.js` (Next 16 renamed `middleware.js` to `proxy.js`). Matcher: `['/checkout/:path*', '/orders/:path*']`. |
| 4 | `next` carries the destination | The proxy redirects to `/sign-in?next=<path+query>`, and `signIn` redirects back there. |
| 5 | Reject a `next` that doesn't start with `/` | `lib/safe-next.js`, used on the sign-in page and again in `signIn`. It also rejects `//…`, `/\…` and control characters. `npm test` runs the crafted links. |
| 6 | Orders scoped to the session | `getOrdersByOwner(session.id)` on `/orders`. The tracker page, API and `cancelOrder` all compare `order.ownerId` to `session.id`. |
| 7 | Staff role and `/kitchen`, checked server-side | `app/kitchen/page.js` checks `session.role === 'staff'` before reading any order. It isn't in the proxy matcher, so the page does both checks itself. The header only *shows* the Kitchen link to staff. |

`/orders` used to be a public board of everyone's orders. It's now "My Orders", and the full board is `/kitchen`.

## Breaking it (run against `next build && next start`)

| Tried | Result |
| --- | --- |
| Signed out, open `/orders/AE-1?x=1` | `307 → /sign-in?next=%2Forders%2FAE-1%3Fx%3D1`. After sign-in, `303` back to `/orders/AE-1?x=1` |
| `/menu` signed out | `200`. The proxy doesn't run there |
| `POST /api/orders` signed out | `401` |
| `/sign-in?next=https://evil.example` and `?next=//evil.example` | Hidden `next` field rendered as `/orders` |
| Hidden `next` edited to `https://evil.example` before submitting | Redirected to `/orders` |
| Tirunesh opens Abebe's order (`/orders/<id>`, `/api/orders/<id>`) | `404` on both, the same as an id that doesn't exist |
| Tirunesh submits her own Cancel form with Abebe's order id swapped in | `403 "You can only cancel your own orders."`, and the order stays `placed` |
| Customer opens `/kitchen` | `404` |
| Signed out, open `/kitchen` | `307 → /sign-in?next=/kitchen`, from the page itself, not the proxy |
| Cookie payload edited to `"role":"staff"` | Signature fails, so the session counts as signed out |
| Old cookie replayed after sign-out | `307 → /sign-in`. Sign-out revokes the session's `sid` |
