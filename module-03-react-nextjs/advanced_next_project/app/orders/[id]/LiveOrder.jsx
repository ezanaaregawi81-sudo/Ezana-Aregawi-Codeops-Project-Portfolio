'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { etb, relative, when } from '@/lib/format';
import { STEPS, stepLabel } from './steps';

// Leaflet needs `window`, so the map is browser-only: ssr: false. Until its code arrives, a
// placeholder with the map's own explicit height holds the space, so nothing on the page moves.
const CourierMap = dynamic(() => import('./CourierMap'), {
  ssr: false,
  loading: () => (
    <div className="courier-map courier-map-waiting" aria-hidden="true">
      <span>🗺️ Loading the map…</span>
    </div>
  ),
});

const ENDED = ['delivered', 'cancelled'];

// The connection badge. Words first; the light only backs them up.
const LINK_STATES = {
  opening: { label: 'Connecting…', tone: 'idle' },
  open: { label: 'Live', tone: 'good' },
  retrying: { label: 'Reconnecting…', tone: 'warn' },
  lost: { label: 'Offline: reload to try again', tone: 'bad' },
  ended: { label: 'Tracking ended', tone: 'idle' },
};

const pillTone = (status) => (status === 'cancelled' ? 'badge-red' : status === 'delivered' ? 'badge-green' : 'badge-gold');

export default function LiveOrder({ initialOrder }) {
  // Seeded with the server's snapshot: right on first paint, before the stream has said anything.
  const [order, setOrder] = useState(initialOrder);
  const [link, setLink] = useState(ENDED.includes(initialOrder.status) ? 'ended' : 'opening');

  useEffect(() => {
    // Already delivered or cancelled: nothing left to listen for, so no stream is opened.
    if (ENDED.includes(initialOrder.status)) return undefined;

    const events = new EventSource(`/api/orders/${encodeURIComponent(initialOrder.id)}/events`);
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
        <span className={`badge ${pillTone(order.status)}`}>{stepLabel(order.status)}</span>
        <p className={`live-badge live-badge-${badge.tone}`} role="status">
          <span className="live-light" aria-hidden="true" />
          {badge.label}
        </p>
      </div>

      {order.status !== 'cancelled' && (
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

      <section className="courier" aria-labelledby="courier-title">
        {/* The map, in words, beside it (above it on a phone). It's in the server HTML, so it's
            there without JavaScript, without map tiles, and for screen readers; the sentence is
            a live region, so each change is read out. */}
        <div className="courier-facts">
          <h2 id="courier-title" className="courier-title">Where&rsquo;s my food?</h2>
          <p className="courier-where" aria-live="polite">
            {courier.where}
          </p>
          <ul>
            <li>
              <strong>📍 Drop-off:</strong> {courier.drop.name}
            </li>
            {courier.etaAt && (
              <li>
                <strong>⏱️ Expected:</strong> <time dateTime={courier.etaAt}>{when(courier.etaAt, 'time')}</time>,{' '}
                {relative(courier.etaAt, order.serverTime)}
              </li>
            )}
            <li>
              <strong>🧾 Ordered:</strong> <time dateTime={order.placedAt}>{when(order.placedAt)}</time> (
              {relative(order.placedAt, order.serverTime)})
            </li>
            <li>
              <strong>🔄 Updated:</strong> <time dateTime={order.serverTime}>{when(order.serverTime, 'time')}</time>
            </li>
          </ul>
        </div>
        {order.status !== 'cancelled' && <CourierMap rider={courier.rider} drop={courier.drop} />}
      </section>

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
          <span>Total (delivery &amp; VAT included)</span>
          <span style={{ color: 'var(--accent-gold)' }}>{etb(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
