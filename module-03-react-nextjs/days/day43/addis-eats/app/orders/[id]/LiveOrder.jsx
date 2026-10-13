'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { etb, relative, when } from '@/lib/format';

// Leaflet needs `window`, so the map is browser-only: ssr: false. Until its code arrives, a
// placeholder of exactly the map's size holds the space, so the page doesn't shift.
const CourierMap = dynamic(() => import('./CourierMap'), {
  ssr: false,
  loading: () => (
    <div className="courier-map courier-map-waiting" aria-hidden="true">
      <span>🗺️ Loading the map…</span>
    </div>
  ),
});

const STEPS = [
  { id: 'placed', label: 'Order placed', icon: '🧾' },
  { id: 'in-kitchen', label: 'In the kitchen', icon: '🔥' },
  { id: 'on-the-way', label: 'On the way', icon: '🛵' },
  { id: 'delivered', label: 'Delivered', icon: '✅' },
];
const ENDED = ['delivered', 'cancelled'];

// The connection badge, in words first. The colour only backs them up.
const LINK_STATES = {
  opening: { label: 'Connecting…', tone: 'idle' },
  open: { label: 'Live', tone: 'good' },
  retrying: { label: 'Reconnecting…', tone: 'warn' },
  lost: { label: 'Offline: reload to try again', tone: 'bad' },
  ended: { label: 'Tracking ended', tone: 'idle' },
};

export default function LiveOrder({ initialOrder }) {
  // Seeded with the server's snapshot: right on first paint, before the stream has said anything.
  const [order, setOrder] = useState(initialOrder);
  const [link, setLink] = useState(ENDED.includes(initialOrder.status) ? 'ended' : 'opening');

  useEffect(() => {
    // Already delivered or cancelled: there is nothing to listen for, so no stream is opened.
    if (ENDED.includes(initialOrder.status)) return undefined;

    const events = new EventSource(`/api/orders/${initialOrder.id}/events`);
    const apply = (e) => setOrder(JSON.parse(e.data));

    events.addEventListener('open', () => setLink('open'));
    events.addEventListener('step', apply);
    events.addEventListener('move', apply);
    // The order is finished. Close deliberately: if we waited for the server's close instead,
    // EventSource would count it as a dropped line and reconnect every 4 seconds for ever.
    events.addEventListener('end', () => {
      events.close();
      setLink('ended');
    });
    events.addEventListener('error', () => {
      // CONNECTING: the browser is already retrying. CLOSED: it gave up (a 401 or 404).
      setLink(events.readyState === EventSource.CLOSED ? 'lost' : 'retrying');
    });

    // Leaving the page closes the stream, and the server's abort handler stops its timers.
    return () => events.close();
  }, [initialOrder.id, initialOrder.status]);

  const currentIndex = STEPS.findIndex((step) => step.id === order.status);
  const { courier } = order;
  const badge = LINK_STATES[link];

  return (
    <div className="card" style={{ padding: '1.75rem' }}>
      <div className="live-header">
        <p className={`live-badge live-badge-${badge.tone}`} role="status">
          <span className="live-light" aria-hidden="true" />
          {badge.label}
        </p>
        <p className="live-updated">Updated {when(order.serverTime, 'time')}</p>
      </div>

      {order.status === 'cancelled' ? (
        <p className="state-text" style={{ color: 'var(--accent-red)', fontWeight: '700', margin: 0 }}>
          This order was cancelled.
        </p>
      ) : (
        <>
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

          <section className="courier" aria-labelledby="courier-title">
            <h2 id="courier-title" className="courier-title">Your courier</h2>
            <CourierMap rider={courier.rider} drop={courier.drop} />
            {/* The map, in words. It's in the server HTML, so it's there without JavaScript,
                without map tiles, and for screen readers. */}
            <ul className="courier-facts">
              <li>
                <strong>🛵 Courier:</strong> {courier.where}
                {courier.kmLeft > 0 && ` (about ${courier.kmLeft} km to go)`}
              </li>
              <li>
                <strong>📍 Drop-off:</strong> {courier.drop.name}
              </li>
              <li>
                <strong>⏱️ Expected:</strong>{' '}
                {courier.etaAt
                  ? `${when(courier.etaAt, 'time')}, ${relative(courier.etaAt, order.serverTime)}`
                  : 'Delivered. Enjoy your meal!'}
              </li>
            </ul>
          </section>
        </>
      )}

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem' }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{etb(item.price * item.qty)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', marginTop: '0.75rem' }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent-gold)' }}>{etb(order.total)}</span>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
        Ordered {when(order.placedAt)} ({relative(order.placedAt, order.serverTime)})
      </p>
    </div>
  );
}
