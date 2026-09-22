import { headers } from 'next/headers';
import OrderForm from './OrderForm';

// Requirement 5: Forced dynamic rendering on checkout page.
// Read requirement: Reads request headers and per-request user session cookies to process order checkout.
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  // Read request headers to enforce dynamic per-request rendering
  const reqHeaders = await headers();

  return <OrderForm />;
}
