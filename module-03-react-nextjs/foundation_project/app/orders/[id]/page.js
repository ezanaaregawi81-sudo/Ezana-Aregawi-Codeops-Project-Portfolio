import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cancelOrder } from '@/app/actions';
import { getOrder, ORDER_STEPS } from '@/lib/orders';
import { formatETB } from '@/lib/pricing';
import { getSession } from '@/lib/session';
import OrderStatus from './OrderStatus';

export const metadata = { title: 'Your order' };

// Dynamic: reads the session cookie to check the order belongs to this visitor.
// Someone else's order id gets the same 404 as a made-up one, so ids can't be probed.
export default async function OrderPage({ params }) {
  const { id } = await params;
  const [session, order] = await Promise.all([getSession(), getOrder(id)]);

  if (!order || !session || order.ownerId !== session.id) notFound();

  const { customer } = order;

  return (
    <div className="page">
      <section className="confirmation-card" aria-labelledby="order-heading">
        <span className="confirmation-icon" aria-hidden="true">
          {order.status === 'cancelled' ? '🛑' : '✅'}
        </span>
        <h1 id="order-heading">Thank you, {customer.name}!</h1>
        <p className="success-msg">
          Order {order.id} {order.status === 'cancelled' ? 'was cancelled.' : 'has been placed successfully.'}
        </p>
        <p>
          We&apos;ll deliver to <strong>{customer.area}</strong> and reach you at <strong>{customer.phone}</strong>. Pay via{' '}
          <strong>{customer.payment}</strong>
          {order.payment.status === 'paid' ? ' — payment received.' : '.'}
        </p>

        {/* key: remount when the server status changes (after cancel / refresh) */}
        <OrderStatus key={order.status} orderId={order.id} initialStatus={order.status} steps={ORDER_STEPS.map(({ status, label }) => ({ status, label }))} />

        <ul className="summary-items">
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.qty} × {item.name}
              </span>
              <span>{formatETB(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatETB(order.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>{formatETB(order.deliveryFee)}</span>
        </div>
        <div className="summary-row summary-row--total">
          <span>{order.payment.status === 'paid' ? 'Total Paid' : 'Total'}</span>
          <span>{formatETB(order.total)}</span>
        </div>

        <div className="order-actions">
          <Link href="/menu" className="btn">
            Back to Menu
          </Link>
          {order.cancellable && (
            // A plain server-action form: works with JavaScript off. cancelOrder
            // re-checks the session and ownership itself.
            <form action={cancelOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <button type="submit" className="btn btn--danger" style={{ marginTop: '1.5rem' }}>
                Cancel order
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
