import { NO_INDEX } from '@/lib/site';

// The cart page is a client component, and client components can't export metadata, so the
// cart's metadata lives in this layout instead.
// The cart is different for every visitor (it's in their browser), so it's kept out of search
// results. The canonical URL drops ?add=, which the "Add to cart" links use.
export const metadata = {
  title: 'Your cart',
  description: 'Everything in your Addis Eats cart, with quantities you can change and the delivery fee and 15% VAT added up before checkout.',
  alternates: { canonical: '/cart' },
  robots: NO_INDEX,
};

export default function CartLayout({ children }) {
  return children;
}
