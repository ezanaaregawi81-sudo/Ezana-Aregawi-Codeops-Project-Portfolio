import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import CheckoutForm from './CheckoutForm';

export const metadata = {
  title: 'Checkout',
  description: 'Enter your delivery address, choose Telebirr, CBE Birr or cash on delivery, and place your Addis Eats order.',
  robots: NO_INDEX,
};

// Layer 2: proxy.js already redirected signed-out visitors, but the page checks again while
// rendering, so it stays private even if the matcher is edited or the route is moved.
export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/checkout');

  return <CheckoutForm />;
}
