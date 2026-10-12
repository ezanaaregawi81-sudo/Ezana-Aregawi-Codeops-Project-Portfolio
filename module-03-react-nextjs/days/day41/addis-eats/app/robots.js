import { absoluteUrl } from '@/lib/site';

// /robots.txt: crawlers stay out of the cart and checkout (the exercise), the other signed-in
// pages and the API, and are pointed at the sitemap.
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/cart', '/checkout', '/orders', '/kitchen', '/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
