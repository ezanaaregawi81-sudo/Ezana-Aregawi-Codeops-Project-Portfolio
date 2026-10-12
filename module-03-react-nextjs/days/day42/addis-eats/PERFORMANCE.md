# Performance in Addis Eats (Day 40)

Measure first, then change one thing at a time and measure again. Every step below is compared with the starting numbers.

## The starting point

Day 39 showed emoji instead of photos, used the system font stack and loaded no third-party scripts, so exercises 2–5 had nothing to work on. Day 40 first adds them the way they usually arrive:

- **Photos:** a 1800×1350 hero banner at the top of `/`, plus a 1200×900 photo per dish. The dish photos replace the emoji boxes on the home cards, the menu list and each dish page. All are plain `<img>` with no dimensions.
  - They live in `public/images/`. They're generated stand-ins (gradient + grain + the dish name), but real JPEGs with real weight: 604 KB for the hero, ~275 KB per dish.
  - The thumbnails only ever show at 120px (240px on the dish page), so the browser downloads 1200px files to show them tiny.
- **Font:** the heading font (Fraunces, used by `.hero-title` and `.dish-title` through `--font-heading`) loaded with a Google Fonts `<link>` in `<head>`.
- **Third-party script:** [canvas-confetti](https://github.com/catdad/canvas-confetti) from jsDelivr as a plain blocking `<script>` in `<head>`. "Add to Cart" fires it.

The hero is a 4:3 banner placed *above* the headline. My first version put a 2:1 image under the buttons. On a phone it was then smaller than the two-line headline, so the headline was the LCP element and step 3 would have had no image to act on. On wide screens the banner is capped at 360px tall (`object-fit: cover`) so the headline stays above the fold. That cap never kicks in at the 412px test width, so it doesn't change any number below.

Day 40 also adjusts the palette a little: the accent goes from burnt orange `#b5541f` to a deeper berbere red `#a8432a` (glows, borders and the dark hover shade follow), with small shifts to the page background, card hover, border and green. These changes were in place before the first measurement, so they don't affect any step's numbers.

## How it was measured

- **Tool:** Lighthouse 13 against `next build && next start`, with the user-flow API driving the installed Chrome.
- **Throttling:** mobile (412×823), slow 4G (150 ms RTT, ~1.6 Mbps down), CPU 4× slower, applied for real (DevTools throttling).
- **LCP, CLS, TBT, page weight:** a cold navigation to `/`.
- **INP:** a timespan that clicks "🛒 Add to Cart" on `/menu/doro-wat`.
- **Dish LCP:** a navigation to `/menu/doro-wat`.
- **Runs:** 5 per step, reporting the **median**. Each build was followed by a 60 s pause, because measuring straight after `next build` (while the machine is still busy) gives inflated, noisy numbers.

## Results

| Step | Perf | LCP | CLS | INP | TBT | Page weight | Dish LCP |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Baseline | 64 | **10.32 s** | 0.0004 | 117 ms | 213 ms | 1,666 KB | 1.35 s |
| 2. `next/image` | 83 | **3.19 s** | 0.0004 | 120 ms | 293 ms | 298 KB | 1.93 s |
| 3. `preload` on the hero only | 89 | **2.52 s** | 0.0004 | 118 ms | 261 ms | 299 KB | 1.89 s |
| 4. `next/font` | 88 | **2.72 s** | **0** | 119 ms | 216 ms | 268 KB | 1.91 s |
| 5. `next/script` `lazyOnload` | 87 | **2.71 s** | 0 | 136 ms | 247 ms | 270 KB | 1.95 s |

**Overall: LCP 10.32 s → 2.71 s, page weight 1,666 KB → 270 KB, CLS 0.0004 → 0, Lighthouse performance score 64 → 87.**

## What each change did

**2. `<img>` → `next/image`: LCP −7.1 s, −1,368 KB.**
- **What changed:** every image now has its real `width`/`height` and a `sizes` that says how wide it really shows:
  - hero: `(max-width: 1080px) calc(100vw - 5rem), 1000px`
  - thumbnails: `120px` (the dish page: `240px`)
- **Why it's faster:** a phone now gets the 640px hero (9.6 KB WebP) instead of the 604 KB, 1800px JPEG. Each thumbnail is ~1.4 KB instead of ~275 KB. Loading the hero went from 9.6 s to 0.7 s.
- **One cost:** `next/image` lazy-loads by default, so the dish page's photo now waits. Dish LCP went from 1.35 s to 1.93 s. The brief allows priority on one image only, and that is the home hero.

**3. `preload` on the hero only: LCP −0.67 s.**
- **What changed:** Next 16 deprecated `priority` in favour of `preload`, which does the same job. It puts a `<link rel="preload" as="image">` with the hero's `srcset`/`sizes` in `<head>`, so the download starts before the `<img>` is parsed. Only the hero has it; the other images stay lazy.
- **Effect:** LCP now equals FCP, so the hero is there on the first frame.

**4. Font `<link>` → `next/font`: CLS 0.0004 → 0, −31 KB, but LCP +0.2 s.**
- **What changed:** Fraunces is now self-hosted from our own origin (zero requests to Google), and its Georgia fallback is sized to match. The small shift the font swap used to cause is gone.
- **The cost:** `next/font` *preloads* the 36 KB font, which shares the throttled connection with the hero before first paint. 36 KB at ~1.6 Mbps is about 0.18 s, matching the slowdown (+150–200 ms in all 5 runs, so not noise).
- **What I tried:** turning the preload off.

  | | LCP | CLS |
  | --- | --- | --- |
  | Google Fonts `<link>` (step 3) | 2.52 s | 0.0004 |
  | `next/font`, preloaded (kept) | 2.72 s | **0** |
  | `next/font`, `preload: false` | 2.58 s | **0.015** |

  Without the preload, the font arrives after first paint and the swap shifts the headings about 40 times as much as before. Every result here is still "good" (LCP under 2.5 s is the target; CLS under 0.1). The exercise was to make CLS better, so the preload stays and the 0.2 s is the price.

**5. Blocking `<script>` → `next/script` `lazyOnload`: no change on a healthy network, but a single point of failure removed.**
- **Healthy network:** LCP was 2.72 s before and 2.71 s after. The 10.8 KB script downloads alongside everything else, so it is never the slowest thing.
- **Slow CDN:** with jsDelivr delayed by 5 s (no other throttling, 3 runs):

  | | First paint |
  | --- | --- |
  | Blocking `<script>` in `<head>` | **5.46 s, 5.40 s, 5.41 s**: blank page until the CDN answers |
  | `next/script` `lazyOnload` | **0.26 s, 0.27 s, 0.36 s** |

- **Confetti still works:** `window.confetti` is a function about 1 s after load, and the button calls `window.confetti?.()` in case it hasn't arrived yet.

**INP** stayed between 117 and 136 ms in every round. None of these changes touch what the "Add to Cart" click runs.

## 6. Environment files

Already correct from Day 39, so nothing changed:
- **`.env.example`:** committed, with `SESSION_SECRET=` empty and how to generate one.
- **`.gitignore`:** `.env*` with `!.env.example`, which ignores every real env file and keeps the template. Checked with `git check-ignore`:

  | File | Ignored? |
  | --- | --- |
  | `.env` | ignored |
  | `.env.local` | ignored |
  | `.env.development.local` | ignored |
  | `.env.production.local` | ignored |
  | `.env.staging.local` | ignored |
  | `.env.example` | **not** ignored, as intended |

  `git ls-files` confirms no `.env.local` has ever been committed.

## Where things are

| File | What changed |
| --- | --- |
| `lib/dishes.js` | `DISH_PHOTO` (real photo size), shared by every dish image |
| `app/page.js` | Hero banner with `preload`, plus card thumbnails |
| `app/menu/DishList.jsx`, `app/menu/[id]/page.js` | Dish photos in place of the emoji boxes |
| `app/layout.js` | `next/font` Fraunces (`--font-display`) and `next/script` confetti |
| `app/globals.css` | Palette tweaks, `--font-heading`, `.hero-image`, `.dish-thumb` |
| `app/AddToCartButton.jsx` | Fires `window.confetti?.()` on click |
