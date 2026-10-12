import { NO_INDEX } from '@/lib/site';

// The cart page is a client component and can't export metadata, so its title and description
// are set here. A cart is different for every visitor, so it stays out of search results.
export const metadata = {
  title: 'Your cart',
  description: 'Everything in your Addis Eats cart, with quantities you can change and the delivery fee and 15% VAT added up before checkout.',
  robots: NO_INDEX,
};

export default function CartLayout({ children }) {
  return children;
}
