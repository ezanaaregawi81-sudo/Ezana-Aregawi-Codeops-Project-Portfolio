import { absoluteUrl } from '@/lib/site';

// /robots.txt. The private routes (they need a session, or a staff role) are disallowed, and so
// is the API. /cart and /sign-in stay crawlable on purpose: they carry a noindex robots meta tag,
// and a crawler can only see that tag on a page it's allowed to fetch.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/orders', '/kitchen', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
