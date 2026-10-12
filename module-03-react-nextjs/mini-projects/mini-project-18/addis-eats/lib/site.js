// The site's public address, used for metadataBase, canonical URLs, the sitemap and JSON-LD,
// all of which must be absolute. Set SITE_URL to the production URL when deploying (see
// .env.example). It isn't secret, but it is read on the server only, like everything here.
//   1. SITE_URL, if set
//   2. Vercel's production domain, if deployed there
//   3. http://localhost:3000 for local development
export const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = 'Addis Eats';

// For pages that are personal (cart, checkout, orders) or staff-only: keep them out of search
// results. They are also left out of the sitemap, and the private ones are disallowed in robots.txt.
export const NO_INDEX = { index: false, follow: false };

export function absoluteUrl(path) {
  return new URL(path, `${SITE_URL}/`).toString();
}
