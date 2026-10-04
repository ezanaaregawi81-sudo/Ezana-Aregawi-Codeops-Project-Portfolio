import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderById, toCustomerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';
import LiveOrder from './LiveOrder';

export const metadata = { title: 'Track Order - Addis Eats' };

// Rendered on the server so the current status is already in the HTML.
// LiveOrder receives it as fallbackData and polls from there.
export default async function TrackOrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  const order = getOrderById(id);

  if (!session || !order || order.ownerId !== session.id) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <Link href="/orders" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        &larr; Order Board
      </Link>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '1rem 0 0.25rem' }}>Tracking {order.id}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        This page checks for updates every few seconds. No need to refresh.
      </p>

      <LiveOrder orderId={order.id} initialOrder={toCustomerOrder(order)} />
    </div>
  );
}
