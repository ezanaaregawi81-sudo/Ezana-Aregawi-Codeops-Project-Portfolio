import { headers } from 'next/headers';
import CheckoutForm from './CheckoutForm';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const reqHeaders = await headers();

  return <CheckoutForm />;
}
