# Securing Addis Eats

Mini-project 15 adds accounts to Addis Eats: sign-in and sign-out, a signed session cookie, a proxy that guards the private pages, ownership checks on every write, and a staff-only kitchen. The last section covers three attacks I ran against the app and what happened.

Demo accounts (also listed on `/sign-in`):

| Email | Password | Role |
| --- | --- | --- |
| `abebe@example.com` | `injera123` | customer |
| `tirunesh@example.com` | `injera123` | customer |
| `kitchen@addiseats.et` | `kitchen123` | staff |

## The session

**`lib/session.js`** is the only session helper. `proxy.js`, every private page, every server action and every route handler goes through it. Nothing else reads the `ae_session` cookie or knows its format.

- **Value:** `<payload>.<signature>`. The payload is base64url JSON: `{ id, name, role, sid, exp }`. The signature is HMAC-SHA256 with `SESSION_SECRET`, compared with `timingSafeEqual`. The payload is **readable** by whoever holds the cookie, but changing it breaks the signature.
- **Flags:**
  - `httpOnly`: page scripts can't read it.
  - `secure`: HTTPS only. Browsers treat `http://localhost` as secure.
  - `sameSite: 'lax'`: not sent on cross-site POSTs.
  - `path: '/'`.
  - `maxAge`: 8 hours, the same as the signed `exp`.
- **`getSession()`** returns `{ id, name, role, sid }` or `null`. It returns `null` for a missing, tampered, malformed, expired or signed-out cookie.
- **Sign-out:** `destroySession()` deletes the cookie **and** adds its `sid` to a revoked set. Deleting the cookie only removes it from *this* browser. Without the revoked set, a copy of the cookie (from a shared computer, say) would keep working until `exp` (see attack 3). The set is in memory, like the order store, so a restart forgets it.

## The layers

| Layer | Where | What it proves |
| --- | --- | --- |
| 1. Proxy | `proxy.js`, matcher `/checkout/:path*`, `/orders/:path*`, `/kitchen/:path*` | This page request carried a valid, unexpired, not-signed-out cookie. If not, it redirects to `/sign-in?next=<path+query>`. It knows nothing about roles or ownership, and doesn't run at all outside the matcher. |
| 2. Page | `getSession()` at the top of each private page, while rendering | The same thing again, on the page itself. The page stays private even if the matcher is edited or the page is moved. This is also where roles are checked (`/kitchen`). |
| 3. Action / handler | `getSession()` inside every server action and route handler that reads or writes an order | The caller is signed in **and** owns the record. Server actions and `/api/*` are POST/GET endpoints anyone can call directly. `/api/*` isn't in the matcher, so this is the only check there. |
| Query scoping | `lib/orders.js` | `getOrdersByOwner(session.id)` and `order.ownerId !== session.id` always use the id from the verified cookie, never an id taken from the URL, the body or a form field. |

## Every protected route

| Route | 1. Proxy | 2. Page / handler check | 3. Ownership / role | Failure |
| --- | --- | --- | --- | --- |
| `/checkout` | ✓ | `getSession()` → redirect | — | 307 → `/sign-in?next=/checkout` |
| `placeOrder` action | via `/checkout` | `getSession()` → 401 | Owner = `session.id`, not a form field | `{ status: 401 }` |
| `/orders` | ✓ | `getSession()` → redirect | Lists `getOrdersByOwner(session.id)` only | 307 → sign-in |
| `cancelOrder` action | via `/orders` | `getSession()` → 401 | `order.ownerId === session.id` → else 403 | `{ status: 401 / 403 / 404 / 409 }` |
| `/orders/[id]` | ✓ | `getSession()` → redirect | Not the owner → `notFound()` | 307 → sign-in · 404 |
| `/kitchen` | ✓ | `getSession()` → redirect | `role === 'staff'` → else `notFound()` | 307 → sign-in · 404 |
| `GET /api/orders/[id]` | ✗ (not matched) | `getSession()` → 401 | Not the owner → 404 | 401 · 404 |
| `POST /api/orders` | ✗ (not matched) | `getSession()` → 401 | Owner = `session.id` | 401 |
| `GET /api/session` | ✗ | Returns `{ name, role }` or `null` | — | Display only, for the header |

Everything else (`/`, `/menu`, `/menu/[id]`, `/cart`, `/sign-in`, `/api/dishes*`, `/api/menu`) is public, so the proxy never runs on it.

**The `next` parameter** is checked by `lib/safe-next.js` in two places: the sign-in page, before it reaches the form, and the `signIn` action, because the hidden field can be edited. A valid value starts with `/`, but not `//` or `/\`, and has no control characters. Anything else becomes `/orders`. `npm test` runs `lib/safe-next.test.mjs` against a list of crafted values.

**The header** hides the Kitchen link from customers, but that's convenience, not security. The check that matters is in `app/kitchen/page.js`.

## Three attacks against my own app

I ran all three against `next build && next start` with a Node script. It signs in by posting the real sign-in form, the same request a browser makes with JavaScript off, then replays and edits the requests.

### 1. Open redirect through `next`

**Attack:** send someone `/sign-in?next=https://evil.example`. After a real sign-in on our domain, they land on a look-alike site.

| Tried | Result |
| --- | --- |
| `?next=https://evil.example` | Hidden field rendered as `/orders` |
| `?next=//evil.example` (protocol-relative) | `/orders` |
| `?next=/%09/evil.example` (a tab, which browsers strip) | `/orders` |
| `?next=/\evil.example` | Next normalises it to `/evil.example`, a path on our own site, so it's harmless |
| Sign-in page loaded normally, then the hidden `next` field edited to `https://evil.example`, or to `//evil.example`, before submitting | `303 → /orders` both times |

**Held.** Absolute URLs are refused at the page *and* in the action. Before the action check existed, editing the hidden field would have been the way around the page check.

### 2. Read or cancel another account's order

**Attack:** sign in as Tirunesh and go after Abebe's order `AE-…`.

| Tried | Result |
| --- | --- |
| `GET /api/orders/<abebe's id>` | `404`, the same as an id that doesn't exist, so ids can't be probed |
| Open `/orders/<abebe's id>` | `404` |
| Look for it on `/orders` | Not listed, because the query is `getOrdersByOwner(session.id)` |
| Take the Cancel form from Tirunesh's own `/orders` page, swap `orderId` for Abebe's and submit | `cancelOrder` returned `403 "You can only cancel your own orders."`, and Abebe's order is still `placed` |
| Call `cancelOrder` with no cookie at all (`Next-Action` header, as the browser sends it) | `307 → /sign-in`. The proxy stopped it, and the action's own 401 check is there if the matcher ever changes |

**Held.** The Cancel button only appears on your own orders, but that isn't what protects them. The action re-reads the session and compares `ownerId` itself.

### 3. Forge or reuse the session cookie

**Attack:** the payload is readable base64url JSON. Edit it, or keep a copy after signing out.

| Tried | Result |
| --- | --- |
| Tirunesh (customer) opens `/kitchen` | `404` |
| Payload edited to `"role":"staff"`, signature kept | Signature fails, so the session is treated as signed out: `307 → /sign-in?next=/kitchen` |
| Payload edited to `"id":"u-abebe"`, then `GET` Abebe's order | `401` |
| The real staff account opens `/kitchen` | `200`, both customers' orders listed |
| Abebe signs out (`signOut` action, as the header button sends it), then the old cookie value is replayed on `/orders` | Sign-out cleared the cookie, and the replayed value got `307 → /sign-in`, because its `sid` is revoked |

**Held.** The signature stops forgery. The replay test is why the cookie carries a `sid`. A signed cookie with no server-side state can't be "un-signed", so deleting it from the browser alone would have left any copied value working for up to 8 hours. The revoked set lives in memory, so in production it would move to the same database as the sessions.

## What this doesn't cover

- Accounts are hard-coded in `lib/users.js`, with no sign-up, password reset or rate limiting on `/sign-in`.
- Sessions, orders and the revoked set are all in memory, so a server restart clears them.
- The kitchen can view orders but can't change them. Order statuses still advance on a timer.
