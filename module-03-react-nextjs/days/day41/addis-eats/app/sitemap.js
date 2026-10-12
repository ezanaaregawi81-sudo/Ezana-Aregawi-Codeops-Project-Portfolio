import { getAllDishes } from '@/lib/dishes';
import { absoluteUrl } from '@/lib/site';

// /sitemap.xml, built from the dish records: add a dish and it's listed on the next build.
// Only public pages. Left out: the signed-in pages (/checkout, /orders, /orders/[id], /kitchen)
// and the personal or not-worth-indexing ones (/cart, /sign-in).
export default function sitemap() {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/menu'), changeFrequency: 'weekly', priority: 0.9 },
    ...getAllDishes().map((dish) => ({ url: absoluteUrl(`/menu/${dish.id}`), changeFrequency: 'monthly', priority: 0.8 })),
  ];
}
