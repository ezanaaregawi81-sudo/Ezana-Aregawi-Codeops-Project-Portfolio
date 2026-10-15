import { SITE_URL } from '@/lib/site';

// /robots.txt: crawl the menu, skip anything personal and the API.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/cart', '/wishlist', '/checkout', '/orders/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
