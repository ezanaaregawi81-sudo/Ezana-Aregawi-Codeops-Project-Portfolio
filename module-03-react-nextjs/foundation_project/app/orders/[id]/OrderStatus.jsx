'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TERMINAL = new Set(['delivered', 'cancelled']);
const POLL_MS = 5000;

// Client because it polls: a repeated, browser-triggered read, which is exactly what
// the GET /api/orders/[id] route handler exists for. When the status changes it asks
// the server page to re-render (router.refresh) so the cancel button stays accurate.
export default function OrderStatus({ orderId, initialStatus, steps }) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (TERMINAL.has(status)) return;
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' });
        if (!response.ok) return;
        const order = await response.json();
        if (order.status !== status) {
          setStatus(order.status);
          router.refresh();
        }
      } catch {
        // Offline for a moment: try again on the next tick.
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [orderId, status, router]);

  if (status === 'cancelled') {
    return (
      <div className="order-status order-status--cancelled" role="status">
        <strong>This order was cancelled.</strong>
      </div>
    );
  }

  const reached = steps.findIndex((step) => step.status === status);

  return (
    <div className="order-status">
      <p style={{ margin: 0 }} role="status">
        Status: <strong>{steps[reached]?.label ?? status}</strong>
      </p>
      <ol className="order-status__steps">
        {steps.map((step, index) => (
          <li key={step.status} data-done={index <= reached}>
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
