# Performance: PERF.md

## Budget

Standard Lighthouse 13, mobile, on a production build, with the laptop **plugged in**. Medians: 3 runs before, 5 after.

| Budget | Target | `/` before → after | `/menu` before → after | `/menu/[id]` before → after | Met? |
|---|---|---|---|---|---|
| Lighthouse performance score | ≥ 90 | 90 → **92** | 82 → **89** | 90 → **92** | Two of three. `/menu` is one point short. |
| Largest Contentful Paint (simulated) | < 2.5 s | 3.16 → **2.99 s** | 3.80 → **3.59 s** | 3.42 → **3.21 s** | **No** (see below) |
| Largest Contentful Paint (observed, unthrottled) | (context) | **0.32 s** | **0.63 s** | **0.44 s** | n/a |
| Cumulative Layout Shift | < 0.1 | 0 → **0** | 0 → **0** | 0 → **0** | **Yes** |
| Total Blocking Time | < 200 ms | 214 → **188 ms** | 301 → **140 ms** | 141 → **110 ms** | **Yes** |
| Page weight | < 500 KB | 457 → **428 KB** | 451 → **422 KB** | 327 → **298 KB** | **Yes** |

- **"Before"** is the app as it stood after mini-projects 16 and 17.
- **Noise:** run-to-run variation is about ±0.3 s on LCP and ±3 on the score. `/menu` scored 90 in a 3-run check of the same code and 89 in the final 5-run median.

## How it was measured

- **Build:** `npm run build && npm start`, never `npm run dev`.
- **Lighthouse settings:** the default mobile config, which emulates a mid-range phone and simulates slow 4G and a 4× slower CPU. That's the setup "Lighthouse score" usually means.
- **Power:** the earlier attempt during mini-project 16 ran on battery (CPU throttled, about 5× slower) and was discarded. These numbers are all from the plugged-in machine.
- **Cooldown:** each build was followed by a 30 s pause before measuring.

## What changed, and what each change did

**1. The first dish photo on `/menu` no longer lazy-loads.**
- **The bug:** on a phone the cards stack, and the first photo becomes a full-width strip, which is the page's LCP element. Lighthouse found it **lazy-loaded**, the classic LCP mistake.
- **The fix:** the first card's `<Image>` now has `loading="eager"` and `fetchPriority="high"` (the Next 16 docs' advice for an LCP image). Every other photo stays lazy.
- **Effect:** the photo now downloads at high priority and is done by 0.10 s in the trace. The simulated LCP barely moved (3.80 → 3.79 s), because what holds the page back is the first render, not the photo (below).
- It's kept because it's correct: an LCP image should never be lazy.

**2. Fraunces without its optical-size axis.**
- **What changed:** both web fonts are preloaded by `next/font`. Fraunces with the `opsz` axis was 66 KB; without it, **37 KB**.
- **Effect:** about 30 KB less on every page, and `/menu` went **86 → 90** in the same 3-run setup.
- **The trade-off:** headings lose a little optical fine-tuning at large sizes.

## Why LCP is still above 2.5 s

- **The pages do paint fast.** In the unthrottled trace Lighthouse records, LCP happens at **0.32 s** on the home page, 0.44 s on a dish and 0.63 s on the menu, the same moment as first paint.
- **The 3 s is Lighthouse's *simulation*.** It works out how long that paint would take on slow 4G and a 4× slower CPU, and charges it for everything that started loading before the paint.
- **What it charges for:** on `/menu`, that's **36 requests** before first paint:
  - every page's ~155 KB (gzipped) of React and Next.js runtime
  - two preloaded fonts
  - the CSS
  - the menu's client components (search, paging, sidebar widget)
- **The next step:** ship less JavaScript to the public pages, for example turning the menu's client widgets and the header's session check into islands that load after paint. That's a structural change I didn't make blind.

## What earlier work did (mini-project 16)

Those numbers are bytes and requests, which don't depend on CPU speed, so they still stand:

| Change | Effect |
|---|---|
| Every `<img>` → `next/image` with real `width`/`height` and `sizes` | Home page weight **3,986 KB → 339 KB**. The 3.0 MB hero arrives on a phone as a 42 KB WebP, and each dish thumbnail goes from ~275 KB to 3.6 KB. |
| Google Fonts `@import` → `next/font` (Inter and Fraunces) | No requests to Google. CLS stays 0, because the preloaded fonts have size-matched fallbacks. |
| Blocking third-party `<script>` → `next/script lazyOnload` | Off the critical path. A slow CDN can't hold back first paint. |
| Remote image host pinned in `remotePatterns` | Unlisted hosts and other folders get 400, so `/_next/image` isn't an open proxy |

## Bundle check

Every file in `.next/static` was searched after the final build. None contains the `SESSION_SECRET` value, demo passwords, password hashes, `scryptSync`, `createHmac` or `ownerId`, and no variable uses `NEXT_PUBLIC_`.
