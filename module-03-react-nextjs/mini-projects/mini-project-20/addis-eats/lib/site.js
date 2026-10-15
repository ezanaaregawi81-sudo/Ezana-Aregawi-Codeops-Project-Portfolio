// The site's public address, which metadataBase, canonical URLs, og:image tags, the sitemap and
// JSON-LD are built from. Read at BUILD time (the cards and the sitemap are prerendered), so a
// new value needs a redeploy. Not secret, but server-only like everything here.
//   1. SITE_URL, if set: only needed for a custom domain, and only on Production
//   2. On Vercel, the address of the build itself: Production → the production domain,
//      Preview → that preview's own URL (so a preview's link cards don't point at production)
//   3. http://localhost:3000 locally
const vercelAddress =
  process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;

export const SITE_URL = (process.env.SITE_URL || (vercelAddress && `https://${vercelAddress}`) || 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'Addis Eats';

// For pages that are personal (cart, checkout, orders) or staff-only: keep them out of search
// results. They are also left out of the sitemap, and the private ones are disallowed in robots.txt.
export const NO_INDEX = { index: false, follow: false };

export function absoluteUrl(path) {
  return new URL(path, `${SITE_URL}/`).toString();
}
