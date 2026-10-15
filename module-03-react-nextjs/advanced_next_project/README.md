# Addis Eats

An Ethiopian food-ordering app built with the Next.js 16 App Router. This is the finished version: the work of mini-projects 13–20 and days 38–44 in one app, built from that code and ready for Vercel.

## 🔗 Live URL

**Not deployed yet.** Deploying needs the project owner's Vercel account (steps below). Paste the production URL here once it's live:

> https://… .vercel.app

## Features

**For customers**
- 🍲 **Menu:** browse by category with paging, or search every dish as you type (Esc clears the box).
- 📄 **Dish pages:** photo, ingredients, spice level and price in ETB, with Add to Cart.
- 🛒 **Cart and checkout:** quantities, subtotal + 100 ETB delivery + 15% VAT, a neighbourhood and address, and payment by Telebirr, CBE Birr or cash on delivery.
- 🧾 **My Orders:** every order with its status, cancel until the kitchen starts, and **Download history (CSV)**.
- 🛵 **Live tracking:** a map of the courier and your drop-off, "Where's my food?" in words beside it, and a status that streams in from the server (Server-Sent Events) until it's delivered.

**For kitchen staff**
- 📋 **Kitchen Order Board:** every order, newest first.
- 📊 **Dashboard:** revenue by neighbourhood and orders per day over 14 days, each with its figures as a table, plus a sortable, paged order table.

**Demo accounts:** `abebe@example.com` / `injera123`, `tirunesh@example.com` / `injera123`, `kitchen@addiseats.et` / `kitchen123` (staff).

## How it's built

| Area | Highlights | Read more |
|---|---|---|
| Authentication | Signed `httpOnly` / `secure` / `sameSite` session cookie, proxy → page → action checks on every private route, data scoped to the verified account, staff-only kitchen, console attacks tested, one order per double tap | [AUTH.md](./AUTH.md) |
| Data | Server rendering seeded into SWR, debounced search, paging in the URL, a live order feed over SSE | [DATA.md](./DATA.md), [TRACKING.md](./TRACKING.md) |
| Performance | `next/image`, `next/font`, `next/script`, every image served from `public/`, budgets and measurements | [PERF.md](./PERF.md) |
| SEO | Per-route titles and descriptions, link-preview cards, MenuItem JSON-LD, sitemap, robots, canonical URLs | [SEO.md](./SEO.md) |
| Reports | Server-side aggregation, readable charts, accessible tables | [DASHBOARD.md](./DASHBOARD.md) |
| Accessibility and shipping | Keyboard-only use, visible focus, 44px targets, no double submits, pre-flight checklist, Vercel variables per environment, post-deploy checks, rollback | [HARDEN-AND-SHIP.md](./HARDEN-AND-SHIP.md) |
| Components | What runs on the server and what in the browser | [BOUNDARY.md](./BOUNDARY.md) |

## Checked on the final build (production build, Chrome)

- **Responsive:** 11 pages at 360, 390, 768, 1024 and 1440px wide (55 combinations): no sideways scrolling, nothing cut off at the edge.
  - **Header:** on a phone it wraps onto two rows.
  - **Narrow screens:** cart, checkout fields and dish buttons stack; the menu comes before the sidebar; on checkout, Place Order comes first.
- **Keyboard only:**
  - A whole order with Tab, Enter and typing.
  - A focus ring on all 155 Tab stops; no control under 44 × 44px; nothing reachable only by mouse.
- **Double tap on Place Order:** **one** order, whether by double Enter, two simultaneous clicks or a touch double tap.
- **Live tracking:**
  - Order placed → in the kitchen → on the way → delivered, over the live feed.
  - Leaving the page five times leaves 0 open connections, and there's no reconnect after delivery.
- **CSV:** a name with quotes and an address with a comma, quotes and a line break download exactly as typed.
- **Deploy checks:** `scripts/verify-deploy.mjs` against a local production build passes 20 of 21. The one left is HTTPS, which only the live URL can provide.
- **Secrets:** none in the 15 JavaScript files a browser downloads.
- **Build and tests:** `npm run build` has no errors; `npm test` has 9 passing.

## Run locally

```bash
npm install
cp .env.example .env.local   # then set SESSION_SECRET (the file shows how to generate one)
npm run build && npm start   # http://localhost:3000
npm test
```

## Ship it to Vercel

1. **Import the project:** vercel.com → **Add New → Project** → import this repository. Set **Root Directory** to `module-03-react-nextjs/advanced_next_project`. Framework: Next.js; keep the default commands.
2. **Settings → Environment Variables,** one environment at a time:

| | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | a fresh random value (32+ characters) | a **different** fresh value | your `.env.local` only |
| `SITE_URL` | only with a custom domain | unset: each preview uses its own URL | unset |

   Make each secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.

3. **Deploy.** After changing any variable, redeploy.
4. **Check it in a private window:**
   - Run `SESSION_SECRET=<production value> node scripts/verify-deploy.mjs https://<your-app>.vercel.app`.
   - Then do the manual list in [HARDEN-AND-SHIP.md](./HARDEN-AND-SHIP.md): sign in, order by keyboard with a double Enter, track it to delivered, open the dashboard, and paste a dish URL into a chat to see its card.
5. **Rolling back:** Deployments → the last good deployment → **⋯ → Promote to Production**, or `vercel rollback`. Variable changes don't roll back with it.

**Known limit.** Orders, `requestId`s and signed-out sessions live in server memory, by design for the course.
- Vercel may answer requests from different serverless instances, each with its own memory.
- So on the live site an order can vanish between requests, or its tracking page can 404.
- A single `npm start` process is fully reliable. A shared database (Postgres or Redis) is the real fix.
