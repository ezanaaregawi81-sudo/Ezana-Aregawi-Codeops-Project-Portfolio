import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrdersByOwner } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import { etb, relative, when } from '@/lib/format';
import CancelOrderButton from './CancelOrderButton';

export const metadata = {
  title: 'My orders',
  description: 'Your Addis Eats order history: what you ordered, what it cost and where each order is now.',
  robots: NO_INDEX,
};

// Private and per-account, so it reads the session cookie and renders on every request.
export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/orders');

  // Scoped to session.id from the verified cookie. There is no id in the URL or a form to
  // change, so there is no way to ask this page for another account's orders.
  const orders = getOrdersByOwner(session.id);
  const now = Date.now();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>My Orders</h1>
      <div className="orders-intro">
        <p style={{ color: 'var(--text-secondary)' }}>
          Signed in as {session.name}. Orders can be cancelled until the kitchen starts on them.
        </p>
        {orders.length > 0 && (
          // A plain link: the route replies with Content-Disposition: attachment, so the browser
          // saves the file. It holds this account's orders and nobody else's.
          <a href="/orders/history.csv" className="btn btn-secondary export-csv" download id="orders-history-csv">
            ⬇️ Download history (CSV)
          </a>
        )}
      </div>

      {orders.length === 0 ? (
        // A brand-new customer lands here: tell them what this page will show, not just that it's empty.
        <div className="state-container">
          <div className="state-icon">🧾</div>
          <h2 className="state-title">No orders yet</h2>
          <p className="state-text">
            Your orders will appear here with their live status, from the kitchen to your door. Until the kitchen starts
            cooking, you can still cancel.
          </p>
          <Link href="/menu" className="btn btn-primary" id="orders-empty-menu-link">
            Browse the Menu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    <Link href={`/orders/${order.id}`} title="Track this order">{order.id}</Link>
                  </h3>
                  <span className={`badge ${order.status === 'cancelled' ? 'badge-red' : order.status === 'delivered' ? 'badge-green' : 'badge-gold'}`}>{order.status}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Ordered <time dateTime={order.placedAt}>{when(order.placedAt)}</time>, {relative(order.placedAt, now)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{etb(order.total)}</div>
                {order.status === 'placed' && <CancelOrderButton orderId={order.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
