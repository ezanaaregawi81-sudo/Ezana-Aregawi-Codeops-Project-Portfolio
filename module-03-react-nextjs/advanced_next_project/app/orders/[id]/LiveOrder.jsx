'use client';

import { ORDER_POLL_MS, useTrackedOrder } from '@/lib/data-hooks';
import { STEPS } from './steps';

// No useEffect or useState: the order, the error and the polling all live in SWR.
export default function LiveOrder({ orderId, initialOrder }) {
  const { data: order, error, isValidating } = useTrackedOrder(orderId, initialOrder);
  const currentIndex = STEPS.findIndex((step) => step.id === order.status);
  const settled = order.status === 'delivered' || order.status === 'cancelled';

  return (
    <div className="card" style={{ padding: '1.75rem' }}>
      {order.status === 'cancelled' ? (
        <p className="state-text" style={{ color: 'var(--accent-red)', fontWeight: '700', margin: 0 }}>
          This order was cancelled.
        </p>
      ) : (
        <ol className="track-steps">
          {STEPS.map((step, index) => (
            <li
              key={step.id}
              className={`track-step${index < currentIndex ? ' is-done' : ''}${index === currentIndex ? ' is-current' : ''}`}
              aria-current={index === currentIndex ? 'step' : undefined}
            >
              <span aria-hidden="true">{step.icon}</span>
              {step.label}
            </li>
          ))}
        </ol>
      )}

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem' }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{item.price * item.qty} ETB</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', marginTop: '0.75rem' }}>
          <span>Total (delivery &amp; VAT included)</span>
          <span style={{ color: 'var(--accent-gold)' }}>{order.total} ETB</span>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
        Delivering to {order.customer.address} ·{' '}
        {settled ? 'final status, no longer checking' : isValidating ? 'checking for updates…' : `checks every ${ORDER_POLL_MS / 1000}s`}
      </p>
      {error && (
        <p role="alert" className="form-error">
          Couldn&apos;t refresh: {error.message}
        </p>
      )}
    </div>
  );
}
