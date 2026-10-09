import { notFound, redirect } from 'next/navigation';
import { getAllOrders, toCustomerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';

export const metadata = { title: 'Kitchen - Addis Eats' };

// Staff only: it shows every customer's name, phone and area. It isn't in the proxy.js matcher,
// so both checks happen here, on the server, before any order is read. Hiding the "Kitchen"
// nav link from customers is cosmetic, because typing /kitchen skips the markup entirely.
export default async function KitchenPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/kitchen');
  // A customer gets the same 404 as a page that doesn't exist, so the route isn't advertised.
  if (session.role !== 'staff') notFound();

  const orders = getAllOrders().map(toCustomerOrder);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Kitchen Order Board</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Every order, newest first. Signed in as {session.name} (staff).
      </p>

      {orders.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">🍳</div>
          <h3 className="state-title">No orders yet</h3>
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
                  {order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {order.customer.name} · {order.customer.phone} · {order.customer.area}
                  {order.customer.notes && ` · "${order.customer.notes}"`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{order.total} ETB</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {new Date(order.placedAt).toLocaleTimeString()} · {order.paymentMethod}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
