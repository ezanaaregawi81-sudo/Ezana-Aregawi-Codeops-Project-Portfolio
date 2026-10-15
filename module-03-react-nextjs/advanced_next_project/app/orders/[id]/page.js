import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { toTrackedOrder } from '@/lib/courier';
import { getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import LiveOrder from './LiveOrder';

export const metadata = {
  title: 'Track your order',
  description: 'Follow your Addis Eats order from the kitchen to your door, on a map and in words, with live updates.',
  robots: NO_INDEX,
};

// Rendered on the server, so the step, the courier sentence and the map's placeholder are all in
// the first HTML. LiveOrder starts from that snapshot and then follows /api/orders/:id/events.
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/orders" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        &larr; My Orders
      </Link>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '1.25rem 0 1.25rem' }}>Tracking {order.id}</h1>

      <LiveOrder initialOrder={toTrackedOrder(order)} />
    </div>
  );
}
