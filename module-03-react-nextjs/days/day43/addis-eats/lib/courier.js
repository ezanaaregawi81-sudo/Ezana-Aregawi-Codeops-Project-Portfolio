import 'server-only';
import { STEP_ENDS_AT, toCustomerOrder } from './orders';

// Where the courier is. There's no rider app sending GPS yet, so the position follows the
// order's own timer:
//   placed, in-kitchen   at the kitchen
//   on-the-way           moving along a straight line towards the customer's area
//   delivered            at the customer's area
// Areas are pinned to rough neighbourhood centres, not to anyone's real address.
export const KITCHEN = { lat: 9.0106, lng: 38.7451, name: 'Addis Eats kitchen, Mexico Square' };

const AREA_CENTRES = {
  Bole: { lat: 8.9967, lng: 38.7897 },
  Kazanchis: { lat: 9.0189, lng: 38.7671 },
  Megenagna: { lat: 9.0203, lng: 38.8005 },
  Piassa: { lat: 9.0337, lng: 38.7505 },
};

const toRad = (deg) => (deg * Math.PI) / 180;

// Great-circle distance in km. The road is longer, which is why the page says "about".
function km(from, to) {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

export function courierFor(order, now = Date.now()) {
  const area = order.customer.area;
  const drop = { ...(AREA_CENTRES[area] ?? AREA_CENTRES.Bole), name: `${area}, your delivery area` };
  const ageSeconds = (now - Date.parse(order.placedAt)) / 1000;
  const leaves = STEP_ENDS_AT['in-kitchen'];
  const arrives = STEP_ENDS_AT['on-the-way'];

  let share = 0; // how much of the trip is done, 0 to 1
  if (order.status === 'delivered') share = 1;
  if (order.status === 'on-the-way') share = Math.min(1, Math.max(0, (ageSeconds - leaves) / (arrives - leaves)));

  const rider = {
    lat: KITCHEN.lat + (drop.lat - KITCHEN.lat) * share,
    lng: KITCHEN.lng + (drop.lng - KITCHEN.lng) * share,
  };

  let where = `Riding towards ${area}`;
  if (order.status === 'cancelled') where = 'Not assigned: the order was cancelled';
  else if (share === 0) where = 'At the kitchen in Mexico Square, waiting for your food';
  else if (share === 1) where = `Arrived in ${area}`;

  return {
    rider,
    drop,
    where,
    kmLeft: Math.round(km(rider, drop) * 10) / 10,
    etaAt:
      order.status === 'delivered' || order.status === 'cancelled'
        ? null
        : new Date(Date.parse(order.placedAt) + arrives * 1000).toISOString(),
  };
}

// Everything the tracker page needs in one object: the order, its courier, and the server's clock
// (`serverTime`), so "4 minutes ago" is worked out from the same instant on both sides.
export function toTrackedOrder(order, now = Date.now()) {
  return { ...toCustomerOrder(order), courier: courierFor(order, now), serverTime: new Date(now).toISOString() };
}
