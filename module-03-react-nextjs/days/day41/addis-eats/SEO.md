# Metadata and SEO (Day 41)

Each exercise was checked by viewing the source of the **running** page (`next build && next start`, with `SITE_URL=https://addis-eats.example` as a stand-in production address), not by reading the code.

| # | Exercise | Where | Seen in the page source |
|---|---|---|---|
| 1 | `metadataBase` and a title template in the root layout, with a default title | `app/layout.js`. The address is read once in `lib/site.js` (`SITE_URL`). | `/` → "Addis Eats · Authentic Ethiopian food, delivered"; `/menu` → "Full menu · Addis Eats". Every `og:image` is absolute. |
| 2 | A title of its own and a description written for a person on every static route | `metadata` exports on `/`, `/menu`, `/checkout`, `/orders`, `/orders/[id]`, `/kitchen`, `/sign-in` and the 404; `/cart` via `app/cart/layout.js` (its page is a client component). The old "… - Addis Eats" titles were replaced, since the template now adds the suffix. | 8 public routes checked: every one has a title and description, all different |
| 3 | `generateMetadata` on the dish route from the name, price and summary | `app/menu/[id]/page.js`. The summary is the opening of the dish's description, which the page shows in full; when the first sentence is very short, the second is added. | "Special Kitfo · 480 ETB · Addis Eats". All 10 dish descriptions are different. |
| 4 | A site-wide `opengraph-image`, then one per dish with `ImageResponse` | `app/opengraph-image.js`, `app/menu/[id]/opengraph-image.js` | 1200×630 everywhere. The site card shows three popular dishes with their ETB prices. Each dish card shows the photo, category, summary and price, with its own alt text. |
| 5 | MenuItem JSON-LD from the same dish object the page renders | `menuItemJsonLd(dish)` in `app/menu/[id]/page.js` | `MenuItem name="Special Kitfo" price=480 ETB`: the same as the page's `h1` and its "480 ETB". The JSON-LD description is the "About this Dish" text, word for word. |
| 6 | `app/sitemap.js` from the dishes, without the private routes | `app/sitemap.js` | `/`, `/menu` and all 10 dishes, all absolute. **0** of `/checkout`, `/orders`, `/kitchen`, `/cart` and `/sign-in`. |
| 7 | `robots.js` disallowing `/cart` and `/checkout`, pointing at the sitemap | `app/robots.js` | `Disallow: /cart`, `Disallow: /checkout` (also `/orders`, `/kitchen` and `/api/`), and `Sitemap: https://addis-eats.example/sitemap.xml` |

## Notes

- **`SITE_URL`:** documented in `.env.example`. Set it to the real address when deploying; until then, absolute URLs fall back to Vercel's domain, then localhost.
- **Private pages:** `/checkout`, `/orders` and `/kitchen` redirect signed-out visitors to sign-in. Their metadata also says `noindex`.
