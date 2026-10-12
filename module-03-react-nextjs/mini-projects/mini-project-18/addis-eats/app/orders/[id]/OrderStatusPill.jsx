'use client';

import { useTrackedOrder } from '@/lib/data-hooks';
import { stepLabel } from './steps';

// Uses the same key as LiveOrder. SWR keeps one cache entry for it and dedupes the
// requests, so two components on the page still means one network call per poll.
export default function OrderStatusPill({ orderId, initialOrder }) {
  const { data: order } = useTrackedOrder(orderId, initialOrder);
  const tone = order.status === 'cancelled' ? 'badge-red' : order.status === 'delivered' ? 'badge-green' : 'badge-gold';

  return <span className={`badge ${tone}`}>{stepLabel(order.status)}</span>;
}
