# Making Addis Eats Findable: SEO.md

The brief's test is what shows up in the page source and in a link preview, not the code. So everything here was read from the HTML of a production build (`next build && next start`), with `SITE_URL=https://addis-eats.example` standing in for the real address.

## The base: `SITE_URL` and the root layout

- **`SITE_URL`** (documented in `.env.example`, read only in `lib/site.js`) is the public address. `metadataBase`, canonical links, `og:image`, the sitemap and the JSON-LD all build absolute URLs from it.
  - Set it to the production domain before deploying. Unset, it falls back to Vercel's production domain, then `http://localhost:3000`.
- **`app/layout.js`** sets:
  - `metadataBase`
  - a title template, `%s · Addis Eats`, with a default title
  - the default description
  - `openGraph.siteName`
  - `twitter:card = summary_large_image`

## Titles, descriptions and canonicals

| Route | `<title>` | Canonical | Indexed? |
| --- | --- | --- | --- |
| `/` | Addis Eats · Authentic Ethiopian food, delivered | `/` | yes |
| `/menu` | Full menu · Addis Eats | `/menu` | yes |
| `/menu?category=…` | e.g. Tibs dishes · Addis Eats | `/menu?category=Tibs` | yes |
| `/menu/[id]` | e.g. Special Kitfo · 480 ETB · Addis Eats | `/menu/[id]` | yes |
| `/cart` | Your cart · Addis Eats | `/cart` (drops `?add=`) | noindex |
| `/sign-in` | Sign in · Addis Eats | `/sign-in` (drops `?next=`) | noindex |
| `/checkout`, `/orders`, `/orders/[id]`, `/kitchen` | Checkout, My orders, Track your order, Kitchen order board | (none) | noindex, and disallowed in robots.txt |
| 404 | Not found · Addis Eats | (none) | noindex |

**Descriptions**
- **Every route has its own.** The three menu categories each describe their actual dishes.
  - e.g. "Beef tibs three ways: derek, special and zilzil…"
- **The cart's metadata lives in `app/cart/layout.js`**, because the cart page is a client component and can't export metadata.

**Dish metadata** (`generateMetadata` in `app/menu/[id]/page.js`) is built from the dish record:
- **Title:** name and price.
- **Description:** whole sentences of the dish's description while they fit, then its price, spice level and "fasting-friendly" where it applies, up to 160 characters. When the first sentence is short (Doro Wat's is 35 characters), part of the next is added, cut at a word.
- **`og:title`:** the English and Amharic names.

All 12 descriptions are different: 107 to 159 characters.

**Canonical on `/menu`:** it keeps only a real category and an existing page above 1, so `/menu?category=Tibs&page=9&simError=true&utm_source=x` → `https://addis-eats.example/menu?category=Tibs`.

## Link previews

- **Site-wide, `app/opengraph-image.js`:** a 1200×630 card in the site's own colours.
  - Cream background, the headline in Ezana's green, the terracotta accent.
  - The real platter photo from the home page hero (Wikimedia Commons, Shiefrallo, CC BY-SA 4.0), credited on the card.
- **Per dish, `app/menu/[id]/opengraph-image.js`:** a 1200×630 card generated for every dish at build time.
  - The rounded dish photo, the name, its category and spice tags, the first line of the description, and the price in ETB on a terracotta pill.
  - `generateImageMetadata` gives each card its own alt text, e.g. "Special Kitfo from Addis Eats, 480 ETB".
- **What the page source shows:** every page has `og:image` and `twitter:image` with absolute URLs, plus `og:image:width` 1200, `og:image:height` 630 and an alt.
- **Known limit:**
  - `ImageResponse` only makes PNGs. The site card is about 1.05 MB and the dish cards about 480 KB.
  - Facebook, X and Slack accept both. WhatsApp tends to drop preview images much over ~600 KB, so the site card may show without its image there.
  - A pre-rendered `opengraph-image.jpg` for the site card would fix it.

## Structured data

Each dish page carries `<script type="application/ld+json">` with a schema.org **MenuItem**:
- **Fields:** `name`, `alternateName` (Amharic), `description`, `url`, `image`, `suitableForDiet: VeganDiet` for fasting dishes, and an `Offer` with `price` and `priceCurrency: "ETB"`.
- **Same source as the page:** the name and price come from the same fields the page prints. Doro Wat: JSON-LD `450` `ETB`, page "450 ETB". Special Kitfo: `480` `ETB`, page "480 ETB".
- **Escaping:** `<` is escaped inside the JSON, so no value can close the script tag.

## Sitemap and robots

- **`app/sitemap.js` → `/sitemap.xml`:** built from `getAllDishes()` and `getCategories()`.
  - **Listed:** `/`, `/menu`, the three category pages and all 12 dishes, 17 absolute URLs.
  - **Not listed:** no route that needs signing in, and not the noindex `/cart` and `/sign-in` either.
  - **No `lastModified`:** the dish records don't track edits, and a guessed date would mislead.
- **`app/robots.js` → `/robots.txt`:** disallows `/checkout`, `/orders`, `/kitchen` and `/api/`, and points to the sitemap's absolute URL.
  - `/cart` and `/sign-in` stay fetchable so crawlers can read their noindex tag.

## Check yourself

- **Absolute URLs in every og:image tag?**
  - Yes, on all eight routes checked (home, menu, a category, two dishes, cart, sign-in, the 404): every one starts `https://addis-eats.example/`.
- **Two dish pages, two descriptions?**
  - Yes. All 12 are distinct.
- **Anything in the sitemap that needs signing in?**
  - No. Searching the XML for checkout, orders, kitchen, cart and sign-in finds 0.
- **JSON-LD price matches the page, in ETB?**
  - Yes: 450 / 480 ETB in both places on Doro Wat and Special Kitfo.
- **One h1 per page, describing it?**
  - One on every route checked. The menu's `h1` now names the category ("Tibs dishes") instead of always saying "Our Ethiopian Menu".
  - A dish page's `h1` is the dish name.
- **Would a dish link be worth opening in a group chat?**
  - The card has the dish photo, name, tags, a pitch line and the price.
  - The weak points:
    - the dish photos are generated stand-ins, not real food
    - the site card's file size may be too big for WhatsApp (see above)

## Not done here

- **No real production URL:** there's no deployment yet, so `SITE_URL` is a placeholder.
- **No preview-debugger check:** Facebook's Sharing Debugger or opengraph.xyz needs a public URL.
