import { getAllDishes, getCategories } from '@/lib/dishes';
import { absoluteUrl } from '@/lib/site';

// /sitemap.xml, generated from the real dish records: add a dish to lib/dishes.js and it
// appears here on the next build. Only public, indexable pages are listed:
// - left out because they need signing in: /checkout, /orders, /orders/[id], /kitchen
// - left out because they're noindex and different for every visitor: /cart, /sign-in
// No lastModified: the records don't say when a dish changed, and a made-up date is worse than none.
export default function sitemap() {
  const categories = getCategories().filter((category) => category !== 'All');

  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/menu'), changeFrequency: 'weekly', priority: 0.9 },
    // Each category filter is its own canonical page (see app/menu/page.js).
    ...categories.map((category) => ({
      url: absoluteUrl(`/menu?${new URLSearchParams({ category })}`),
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
    ...getAllDishes().map((dish) => ({
      url: absoluteUrl(`/menu/${dish.id}`),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];
}
