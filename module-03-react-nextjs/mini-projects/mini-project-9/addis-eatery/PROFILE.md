# Profile

This project was updated to isolate route failures and defer non-critical checkout and receipt code until it is needed.

| Change | Before | After | Measurement |
|---|---:|---:|---|
| Lazy-load checkout and receipt routes | Checkout and receipt code was bundled into the main app entry and loaded on every visit | Checkout split into 2.66 kB and receipt into 0.76 kB lazy chunks | Builds now emit separate route chunks, reducing startup work for the critical menu/cart path |

## Notes
- Menu and cart sections now render a fallback UI instead of taking down the whole app when a local error occurs.
- The checkout and receipt pages load via `Suspense` while a skeleton placeholder is shown.
- A modal adds quick-view behavior with `createPortal`, Escape-to-close, and focus trapping for keyboard users.
