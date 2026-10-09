# Making Addis Eats Fast: PERF.md

Mini-project 16 makes four changes to the images, fonts and third-party script, and checks the environment setup.

**Read this first:** the timing metrics (LCP, INP, TBT) for this version are **not measured**.
- **Why:** the machine was on battery with the CPU throttled, and a control run of an already-measured app came out about 5× slower than before. Timings taken then would have measured the laptop, not the code, so I didn't record them.
- **What's below:** only measurements that don't depend on CPU speed: bytes, image sizes, request counts, markup and configuration, and CLS.
- **To fill in the timings:** plug the machine in, then run Lighthouse on `npm run build && npm start` with mobile throttling.

## The starting point

Mini-project 15 showed emoji instead of photos and loaded no third-party script. I first added both the way they usually arrive, and that is the baseline:

- **Hero photo:** a real photo hotlinked from Wikimedia Commons at full size, 3264×2448 and **3.0 MB**, as a plain `<img>`.
  - *Injera, Ethiopian's traditional food* by Shiefrallo, CC BY-SA 4.0. The credit under the hero is required by that licence.
- **Dish photos:** a 1200×900 photo per dish (~275 KB each, `public/images/dishes/`), as plain `<img>`, in place of the emoji boxes.
  - They are generated stand-ins (a gradient plus the dish name).
  - Their alt text describes the dish each one stands in for, so it will be right when real photos replace them. The hero's alt text describes exactly what's in the photo.
- **Third-party script:** [canvas-confetti](https://github.com/catdad/canvas-confetti) from jsDelivr as a blocking `<script>` in `<head>`, fired by "Add to Cart".

The fonts were already a problem: `globals.css` started with a Google Fonts `@import` for Inter (5 weights) and Fraunces (5 weights).

## Results that don't depend on CPU speed

| | Baseline | After `next/image` | Final |
| --- | --- | --- | --- |
| Home page weight (Lighthouse, mobile) | **3,986 KB** | 339 KB | **455 KB** |
| Hero download on a phone | 3.0 MB JPEG (3264×2448) | 42 KB WebP (640w) | 42 KB WebP |
| One dish thumbnail | ~275 KB JPEG (1200×900) | 3.6 KB WebP | 3.6 KB WebP |
| Requests to `fonts.googleapis.com` / `gstatic.com` | yes | yes | **none** |
| Blocking third-party `<script>` in `<head>` | 1 | 1 | **0** |
| Image preloads in the home HTML | 0 | 0 | **1** (the hero) |
| CLS (every run) | 0 | 0 | 0 |

**Overall page weight: −89% (3,986 KB → 455 KB).**

## What each change did

**1. `<img>` → `next/image`: −3,647 KB.**
- **What changed:** every image has its real `width`/`height`, a `sizes` that matches how wide it shows, and descriptive alt text.
  - hero: `(max-width: 1200px) calc(100vw - 5rem), 1120px`
  - dish cards: `(max-width: 620px) calc(100vw - 6rem), 140px`, a 140px column that becomes a full-width strip on phones
  - dish page: `160px`
- **Why it's so much smaller:** Next resizes and converts on the server. A phone gets the hero as 42 KB instead of 3.0 MB, and each thumbnail as 3.6 KB instead of ~275 KB. Shown at 140px, a 1200px photo was 99% wasted pixels.
- **Remote host:** `next.config.mjs` lists the one remote host, pinned to protocol, host and folder: `https://upload.wikimedia.org/wikipedia/commons/9/96/**`. Checked:
  - an unlisted host gets **400**
  - another folder on the same Wikimedia host gets **400**
  - so `/_next/image` can't be used as an open proxy

**2. `preload` on exactly one image.**
- **What changed:** Next 16 replaced `priority` with `preload`. It's on the hero only, the largest image above the fold.
- **Checked:** the home HTML has exactly **one** `<link rel="preload" as="image">`. The hero has no `loading="lazy"`; the 3 dish photos keep it.

**3. Google Fonts `@import` → `next/font`: CLS 0, no third-party font requests, but +116 KB.**
- **What changed:** Inter and Fraunces are now self-hosted from our own origin, with fallbacks sized to their metrics. Fraunces keeps its optical-size axis, as the old `@import` requested. The home HTML makes no requests to Google.
- **The cost:** the final page is 116 KB heavier than after step 1, and the fonts account for all of it. `next/font` *preloads* both variable font files: Fraunces with the `opsz` axis is 67 KB, and Inter is 48 KB.
  - The old `@import` let the browser fetch only the weights actually on screen.
  - The preload is what keeps text from shifting when fonts arrive (CLS 0).
  - If weight matters more than optical sizing, dropping `axes: ['opsz']` from Fraunces would shrink its file.

**4. Blocking `<script>` → `next/script` `lazyOnload`.**
- **What changed:** confetti loads once the browser is idle after `load`. Checked: `window.confetti` is a function about 1 s after load, and "Add to Cart" calls `window.confetti?.()` in case it hasn't arrived.
- **Effect:** the home page no longer waits on jsDelivr. A slow or failed CDN can't stop first paint any more.

## Check yourself

**Did LCP improve, and can you name the single change that did most of it?**
- **Not measured on this version** (see the top of this file). The early runs, taken while the machine was overloaded, did show something worth knowing.
- **The LCP element switches:** usually it was the 3.1rem headline. In one run the full-size 3 MB hero finished late, became the LCP element, and LCP jumped to 23 s.
- **What that means:** if LCP improves, `next/image` will be the main cause, because it takes the 3 MB file out of the running. But it should be measured, not assumed.

**Does the page still jump as it loads? If so, what is not reserving space?**
- **No:** CLS was 0 in every run, before and after.
- **Why:** every image now has `width`/`height`, the photo boxes have fixed CSS sizes, and the fonts have size-matched fallbacks. Nothing loads in without its space reserved.

**Are you measuring `npm start`, throttled, not `npm run dev`?**
- The page-weight numbers come from Lighthouse on `next build && next start` with mobile throttling. The timing metrics need that same setup on a machine that isn't on battery.

**Can a stranger clone the repository and know which variables to set?**
- **Yes.** `.env.example` is committed and explains its one variable, `SESSION_SECRET`: what it signs, that it's server-only, its minimum length, and the command to generate one.
- The README's "Setup for a fresh clone" says to copy it to `.env.local`.

**Is there anything in the browser bundle you would not want published?**
- **No.** I searched every file in `.next/static` after the final build:

  | Searched for | Files containing it |
  | --- | --- |
  | The actual `SESSION_SECRET` value | 0 |
  | The name `SESSION_SECRET` | 0 |
  | Demo passwords (`injera123`, `kitchen123`) | 0 |
  | `passwordHash`, `scryptSync`, `createHmac` | 0 |
  | User ids | 0 |
  | `ownerId` | 0 |

- **`NEXT_PUBLIC_`:** no variable uses it.

## Environment files

| File | Committed? |
| --- | --- |
| `.env.example` | **Yes**, no values |
| `.env` | Ignored |
| `.env.local` | Ignored |
| `.env.production.local` | Ignored |
| `.env.staging.local` | Ignored |

The rule is `.env*` with `!.env.example` in `.gitignore`, checked with `git check-ignore`.

## Where things are

| File | What changed |
| --- | --- |
| `next.config.mjs` | `images.remotePatterns`: the one pinned Wikimedia folder |
| `lib/dish-photos.js` | Photo size, card `sizes`, `src` and alt text for every dish photo (safe for client components) |
| `app/page.js` | Remote hero with `preload` and the photo credit, plus card photos |
| `app/menu/DishList.jsx`, `app/menu/[id]/page.js` | Dish photos instead of emoji |
| `app/layout.js` | `next/font` Inter and Fraunces, and confetti through `next/script` `lazyOnload` |
| `app/globals.css` | `@import` removed, font variables from `next/font`, `.dish-photo`, `.hero-image`, `.hero-credit` |
| `app/AddToCartButton.jsx` | `window.confetti?.()` on click |
| `.env.example`, `README.md` | Every variable explained, plus setup for a fresh clone |
