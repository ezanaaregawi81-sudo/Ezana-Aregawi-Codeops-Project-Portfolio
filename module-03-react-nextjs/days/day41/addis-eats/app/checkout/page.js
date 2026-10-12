import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import CheckoutForm from './CheckoutForm';
import { NO_INDEX } from '@/lib/site';

export const metadata = {
  title: 'Checkout',
  description: 'Enter your delivery address, pick Telebirr, CBE Birr or cash on delivery, and place your Addis Eats order.',
  robots: NO_INDEX,
};

// proxy.js already redirected signed-out visitors, but the page checks again while
// rendering, so it stays private even if the matcher is edited or the route is moved.
export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/checkout');

  return <CheckoutForm />;
}
