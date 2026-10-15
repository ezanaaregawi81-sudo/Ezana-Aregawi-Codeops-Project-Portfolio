import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { toTrackedOrder } from '@/lib/courier';
import { getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/session';
import LiveOrder from './LiveOrder';

export const metadata = { title: 'Track Order - Addis Eats' };

// Rendered on the server so the current step, the courier and the delivery details are already
// in the HTML. LiveOrder starts from that and follows /api/orders/:id/events from there.
export default async function TrackOrderPage({ params }) {
  const { id } = await params;

  // Checked while rendering, not only in proxy.js. Someone else's order gets the same 404
  // as one that doesn't exist, so order ids can't be probed.
  const session = await getSession();
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(`/orders/${id}`)}`);

  const order = getOrderById(id);
  if (!order || order.ownerId !== session.id) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <Link href="/orders" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        &larr; My Orders
      </Link>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '1rem 0 0.25rem' }}>Tracking {order.id}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Updates arrive by themselves while this page is open. No need to refresh.
      </p>

      <LiveOrder initialOrder={toTrackedOrder(order)} />
    </div>
  );
}
