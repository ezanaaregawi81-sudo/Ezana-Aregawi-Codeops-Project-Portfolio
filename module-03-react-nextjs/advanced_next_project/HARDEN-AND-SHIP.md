# Harden, Then Ship

Mini-project 19, hardened for keyboard-only use, phones and double taps, and made ready for Vercel. The steps, the per-environment variables, the checks and the rollback are below.

**How it was checked:**
- Runs against `next build && next start` in Chrome.
- A script pressed real **Tab / Enter / Escape** keys and typed, with no mouse at all.
- It ran on 9 pages: `/`, `/menu`, `/menu/doro-wat`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/kitchen` and `/kitchen/dashboard`.
- Each page was audited for focus rings, pointer-only elements and 44px targets at a 390px phone width.
- "Before" is the unchanged mini-project 19 code.

## Requirements

| | Before | Now |
|---|---|---|
| **No clickable divs:** buttons and links only | No pointer-only elements, but the category pills claimed `role="tab"` | Still none. The pills are links in a `<nav>` with `aria-current="page"` |
| **Visible focus everywhere** | The search box had **no visible focus** (`outline: none`); everything else had Chrome's thin default | A 3px dark-brown ring with a 3px offset on **all 155 Tab stops**. The search pill shows it with `:focus-within` |
| **Every function by keyboard alone** | At 390px wide, **Orders and Sign in ran off the right edge** of the header | The link row wraps onto a second line, with nothing off-screen and nothing to open. "Skip to content" is the first Tab stop |
| **Forms with onSubmit, submit disabled while pending** | `disabled={pending}` only: **two clicks in the same instant placed 2 orders** | `onSubmit={useSubmitOnce(pending)}` on checkout, cancel and sign-in, plus a server `requestId`: **1 order** |
| **Touch targets of at least 44px, nothing behind hover** | **84** controls under 44px. "Track this order" existed only as a hover tooltip | **0** under 44px (2 inline photo-credit links are exempt). The link now reads "AE-… · Track →" on screen |
| **Clean build, pre-flight checklist** | n/a | ✓ (below) |
| **Deployed, with variables per environment** | n/a | Ready. **Not deployed:** this needs the owner's Vercel account |
| **Post-deployment checks pass, in a private window** | n/a | `scripts/verify-deploy.mjs` plus the manual list. Against a local production build, **20 of 21 pass**: everything except HTTPS |

**Smaller fixes:**
- **Escape** in the menu search clears it in every browser (Chrome did it alone), with a visible "Esc clears" hint.
- **The favourites +/−** were 24px buttons named "-" and "+". They're now 44px, named "One fewer / One more favourite", with the count announced.
- **The Table Note label** now points at its input.
- **The payment choice** is a named group of `aria-pressed` buttons, picked with Enter. Radios would need arrow keys, and Enter on a radio submits the form.
- **Cancel order** was 15px text. It's now a 44px button.
- **Focus after errors:** after a failed checkout, focus goes to the first `aria-invalid` field, which is tied to its message by `aria-describedby`. After a failed sign-in, it goes to the email field.
- **Unknown dishes** return a real **404** (`dynamicParams = false`).

## Check yourself

**Can you place an order using only the keyboard, start to finish?**

Yes:
1. `/menu`: 10 Tabs to Doro Wat, then Enter.
2. Tab to **Add to Cart**, then Enter.
3. 8 Tabs to **Checkout**, then Enter.
4. Type the name and phone, type "K" for Kazanchis, then type the address.
5. Tab to **Place Order**, then Enter.

**Does a rapid double tap on Place Order create one order or two?**

**One.** Before:
- double Enter: 1 order
- touch double tap: 1 order
- **two simultaneous clicks: 2 orders**

Now all three place **1**. The server layer on its own, with the same `Idempotency-Key` three times (two at once), also makes **1**.

**Does the application work in a private window with no session?**

Yes:
- the home, menu, dish and sign-in pages load
- `/orders`, `/checkout` and `/kitchen` redirect to sign-in
- the APIs answer 401
- unknown URLs return 404

One trap: without `SESSION_SECRET`, all of that still works, and only **sign-in** fails ("SESSION_SECRET is missing or shorter than 32 characters. Locally: .env.local. On Vercel: …"). So signing in is the first manual check after a deploy.

**Is any secret visible in the JavaScript the browser downloads?**

No:
- **The local build:** `.next/static` contains the secret's value 0 times, the name `SESSION_SECRET` 0 times, and the signing code 0 times.
- **What a browser actually downloads:** `verify-deploy.mjs` pulled the **15** JavaScript files the pages load (626 KB) and found neither the name nor the value.
- **Why:** `lib/session.js` imports `server-only`, and there are no `NEXT_PUBLIC_` secrets.

**Does a shared link from the live URL render as a card?**

The pieces are verified: on a dish page there's `og:title`, `twitter:card = summary_large_image`, and an absolute `og:image` that loads as **200 image/png**.

The catch found on the way: the address used in those tags is fixed at **build** time.
- A build without the right address made cards that pointed at `localhost:3000`.
- `lib/site.js` now uses the Vercel build's own address: the production domain for Production, and each preview's own URL for Preview.
- `SITE_URL` is only needed for a custom domain.

After deploying, paste a dish URL into a chat app, or a preview tool such as opengraph.xyz, to see the card.

**Do you know how to roll back, without looking it up?**

Vercel → project → **Deployments** → the last good one → **⋯ → Promote to Production**. That's Instant Rollback: no rebuild, live in seconds.
- **CLI:** `vercel rollback`.
- **Roll forward again:** promote the newer deployment.
- **Variable changes don't roll back** with it. Those need a redeploy.

## Pre-flight checklist

| | |
|---|---|
| `npm run build` | ✓ No errors |
| `npm test` | ✓ 9 passing |
| `.env.example` documents every variable | ✓ `SESSION_SECRET` (required), `SITE_URL` (optional, custom domain only) |
| `.env.local` ignored | ✓ `.gitignore` line 48 |
| No secret in client JS | ✓ Locally and over HTTP |
| Missing secret noticed | ✓ Sign-in fails with a message naming where to set it |
| Real 404s | ✓ |
| Route table | ✓ Read below |

**The route table:**
- **○ static:** `/`, `/_not-found`, the site card, `robots.txt` and `sitemap.xml`.
- **● prerendered:** 12 dish pages and their card images.
- **ƒ on demand:** every API route, plus every page that reads the session: cart, checkout, orders and its `history.csv`, sign-in, kitchen and its dashboard. Also `/menu`, which reads the URL's query.
- **Proxy:** runs on `/checkout`, `/orders` and `/kitchen`.
- No personal page is static.

**Known limit:** orders, `requestId`s and revoked sessions live in server memory.
- On Vercel, separate function instances don't share it, so an order can disappear between requests.
- It's the course's in-memory design. A database would fix it.

## Ship it to Vercel

1. **Import the project:** vercel.com → **Add New → Project** → import `Ezana-Aregawi-Weldegiorgs-SQ7`.
2. **Root Directory:** `module-03-react-nextjs/advanced_next_project`. Framework: Next.js, with the default commands.
3. **Settings → Environment Variables:**

| | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | a fresh 43-character random value | **a different** fresh value | your own `.env.local` only |
| `SITE_URL` | only with a custom domain | unset (uses the preview's own URL) | unset (`http://localhost:3000`) |

   Make each secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.

4. **Deploy,** and put the production URL in the README.
5. **Redeploy after changing a variable.**

## After deploying: in a private window

**Script:** `SESSION_SECRET=<production value> node scripts/verify-deploy.mjs https://<app>.vercel.app`

**By hand:**

1. Sign in as `abebe@example.com` / `injera123`.
2. In DevTools → Application → Cookies, `ae_session` is **HttpOnly, Secure, SameSite=Lax**.
3. Order by keyboard only, pressing **Enter twice** on Place Order. My Orders shows **one** new order.
4. Track it: the map draws, the badge says **Live**, and it reaches **Delivered** in about 100 s.
5. At phone width, every header link is visible. In the menu search, type "tibs", then press Esc to clear it.
6. As `kitchen@addiseats.et` / `kitchen123`, the Dashboard loads. As a customer, `/kitchen` is a **404**.
7. Paste a dish URL into a chat app: it shows a card with the photo and price.
