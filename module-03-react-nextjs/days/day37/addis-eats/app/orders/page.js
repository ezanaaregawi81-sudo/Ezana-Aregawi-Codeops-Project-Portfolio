import Link from 'next/link';
import { getPublicOrders } from '@/lib/orders';
import CancelOrderButton from './CancelOrderButton';

// A static, cached page: it reads no cookies or headers, so Next serves the same
// prerendered HTML to everyone until placeOrder / cancelOrder call revalidatePath('/orders').
export const metadata = { title: 'Order Board - Addis Eats' };

export default function OrdersPage() {
  const orders = getPublicOrders();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Kitchen Order Board</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Every order the kitchen is working on. You can only cancel orders placed from this browser.
      </p>

      {orders.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">🧾</div>
          <h3 className="state-title">No orders yet</h3>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.id}</h3>
                  <span className={`badge ${order.status === 'cancelled' ? 'badge-red' : 'badge-green'}`}>{order.status}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  For {order.firstName} · {order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{order.total} ETB</div>
                {order.status === 'placed' && <CancelOrderButton orderId={order.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
