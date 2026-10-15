import { getDishes } from '@/lib/dishes';
import { SITE_URL } from '@/lib/site';

// /sitemap.xml: the public pages only, built from the real dish list. Cart, wishlist, checkout
// and orders belong to one visitor, so they're left out (and disallowed in robots.txt).
export default async function sitemap() {
  const dishes = await getDishes();
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/menu`, changeFrequency: 'daily', priority: 0.9 },
    ...dishes.map((dish) => ({ url: `${SITE_URL}/menu/${dish.id}`, changeFrequency: 'weekly', priority: 0.7 })),
  ];
}
