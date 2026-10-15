# Day 44: Deploying Addis Eats

## 5. The route table (`npm run build`, Next 16)

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes, /api/dishes/[id], /api/dishes/search
├ ƒ /api/orders, /api/orders/[id], /api/orders/[id]/events
├ ƒ /api/session
├ ƒ /cart
├ ƒ /checkout
├ ƒ /kitchen
├ ƒ /kitchen/reports
├ ƒ /kitchen/reports/export.csv
├ ƒ /menu
├   /menu/[id]
│ ├ ● /menu/doro-wat
│ ├ ● /menu/kitfo
│ ├ ● /menu/beyaynetu
│ └ ● [+7 more paths]
├ ƒ /orders
├ ƒ /orders/[id]
└ ƒ /sign-in

ƒ Proxy (Middleware)
```

**What it says:**
- **○ static:** `/` is built once and served from the CDN.
- **● prerendered:** the 10 dish pages.
  - `menu/[id]` now has `dynamicParams = false`, so any other id is a **real 404**.
  - Before, it was a 200 "soft 404": `loading.js` streamed before `notFound()` ran.
- **ƒ on demand:**
  - Everything that reads the session cookie: checkout, orders, kitchen and sign-in.
  - Every API route.
  - `/menu`, whose search and category live in the URL.
  - `/cart`, which still reads `searchParams` (left over from an earlier exercise). Harmless: the cart itself is in the browser's localStorage.
  - No private page is static, so a CDN can never hand one person's orders to someone else.
- **Proxy (middleware):** `proxy.js` runs only on `/checkout` and `/orders`. The kitchen pages check the staff role themselves.
- **Next 16's table doesn't print sizes.** The tracking map's Leaflet code is its own chunk, loaded with `ssr: false`, so it isn't part of the page's first load.

## Pre-flight checklist

| | Result |
|---|---|
| `npm run build` | ✓ No errors |
| `npm test` | ✓ 9 passing (safe redirects, `lib/format.js`, `lib/csv.js`) |
| Environment variables documented | ✓ One: `SESSION_SECRET` (32+ characters), in `.env.example` with the command to generate it |
| `.env.local` ignored by git | ✓ `.gitignore` line 48 |
| Secret kept out of the browser | ✓ `.next/static` contains the secret's value 0 times, the name `SESSION_SECRET` 0 times, and the signing code (`createHmac` / `scryptSync`) 0 times. `lib/session.js` imports `server-only` |
| A missing secret can't go unnoticed | ✓ Tested with `.env.local` removed. `/` and `/menu` still loaded, and **sign-in failed** with "SESSION_SECRET is missing or shorter than 32 characters…". The message now says where to set it on Vercel; it used to mention only `.env.local` |
| Real 404s | ✓ Unknown dish and unknown page both return 404 (`app/not-found.js`) |
| Keyboard and touch | ✓ ACCESSIBILITY.md |
| Signed-out checks, locally | ✓ `node scripts/verify-deploy.mjs http://localhost:3000`: 14 of 15 pass. The one failure is "served over HTTPS", which only a deployment can pass |

**Known risk: everything is in memory.** Orders, `requestId`s and revoked sessions live in one server's memory.
- On Vercel, requests can land on different function instances, so an order may vanish, or its tracking page may 404.
- That's the course's in-memory choice. A real fix needs a database (Vercel Postgres, Upstash Redis…).
- The live feed holds a function open for up to about 100 s per order, inside Vercel's default limit.

## 6. Vercel, with every variable per environment

The app is in a sub-folder of the course repo, so the project's **Root Directory** must point at it.

1. **Import the project.** vercel.com → **Add New → Project** → import `Ezana-Aregawi-Weldegiorgs-SQ7`.
2. **Root Directory:** `module-03-react-nextjs/days/day44/addis-eats`. Framework preset: Next.js. Keep the default build and install commands.
3. **Settings → Environment Variables:** add `SESSION_SECRET` **once per environment, each with its own value.**

| `SESSION_SECRET` | Value |
|---|---|
| **Production** | a fresh 43-character random string |
| **Preview** | a different fresh one, so preview deployments can't mint production cookies |
| **Development** | none on Vercel: it stays in your own `.env.local` (`vercel env pull` can fetch one) |

   Make each value with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.

4. **Deploy.** Note the production URL.
5. **Redeploy after any variable change.** Deployments → ⋯ → Redeploy: a running deployment keeps the values it started with.

**CLI equivalent:**
- `vercel link`
- `vercel env add SESSION_SECRET production`
- `vercel env add SESSION_SECRET preview`
- `vercel --prod`

## 7. After deploying: checks on the live URL, in a private window

A private window starts with no cookies and no cache, like a first-time visitor.

**Scripted (signed out):**

```
node scripts/verify-deploy.mjs https://<your-app>.vercel.app
```

It checks:
- HTTPS
- the home, menu and dish pages
- real 404s
- redirects to sign-in from `/orders`, `/checkout` and `/kitchen`
- 401s from the order API, the live feed and the CSV download
- the session API reporting nobody signed in
- immutable caching of build files

**By hand, in a private window:**

1. **Sign in** as `abebe@example.com` / `injera123`. This is the step that fails if `SESSION_SECRET` is missing.
2. **Check the session cookie** in DevTools → Application → Cookies: `ae_session` must be **HttpOnly, Secure, SameSite=Lax**.
3. **Place an order by keyboard only,** and press Enter twice on **Place Order**. My Orders must show **one** new order.
4. **Track it:** the map draws, the badge reads **Live**, and about 100 s later it reaches **Delivered** with "Tracking ended". A 404 or a status going backwards means the in-memory limit above.
5. **Escape in the menu search:** type "tibs", then Esc. The box empties.
6. **Staff view:** sign out, then sign in as `kitchen@addiseats.et` / `kitchen123`. Open the Order Board → 📊 Reports → ⬇️ Download CSV.
7. **Customer blocked:** as a customer, `/kitchen` must be a **404**.

**Status:** not deployed from this machine. There's no Vercel CLI or account here, and publishing is the owner's step. Against the local production build, `verify-deploy.mjs` passes everything except HTTPS.
