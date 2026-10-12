import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getOrderById, toCustomerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import LiveOrder from './LiveOrder';
import OrderStatusPill from './OrderStatusPill';

export const metadata = {
  title: 'Track your order',
  description: 'Follow your Addis Eats order from the kitchen to your door. The status refreshes on its own every few seconds.',
  robots: NO_INDEX,
};

// Rendered on the server, so the current status is already in the HTML. Both client
// components start from it (fallbackData) and then share one polled SWR key.
export default async function TrackOrderPage({ params }) {
  const { id } = await params;

  // Layer 2: verified while rendering, not only in proxy.js. Someone else's order gets the
  // same 404 as one that doesn't exist, so order ids can't be probed.
  const session = await getSession();
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(`/orders/${id}`)}`);

  const order = getOrderById(id);
  if (!order || order.ownerId !== session.id) {
    notFound();
  }

  const initialOrder = toCustomerOrder(order);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <Link href="/orders" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        &larr; My Orders
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem 0 0.25rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Tracking {initialOrder.id}</h1>
        <OrderStatusPill orderId={initialOrder.id} initialOrder={initialOrder} />
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        This page checks for updates every few seconds. No need to refresh.
      </p>

      <LiveOrder orderId={initialOrder.id} initialOrder={initialOrder} />
    </div>
  );
}
