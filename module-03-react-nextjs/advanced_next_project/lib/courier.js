import 'server-only';
import { STEP_ENDS_AT, toCustomerOrder } from './orders';

// Where the courier is. No rider app sends GPS yet, so the position follows the order's own
// timer:
//   placed, in-kitchen   at the kitchen
//   on-the-way           moving along a straight line towards the customer's neighbourhood
//   delivered            in the neighbourhood
// Neighbourhoods are pinned to rough centre points, never to the address the customer typed.
export const KITCHEN = { lat: 9.0106, lng: 38.7451, name: 'Addis Eats kitchen, Mexico Square' };

const CENTRES = {
  Bole: { lat: 8.9967, lng: 38.7897 },
  Kazanchis: { lat: 9.0189, lng: 38.7671 },
  Piassa: { lat: 9.0337, lng: 38.7505 },
  Megenagna: { lat: 9.0203, lng: 38.8005 },
  Sarbet: { lat: 8.9958, lng: 38.734 },
  CMC: { lat: 9.0196, lng: 38.846 },
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
  const { area, address } = order.customer;
  const drop = { ...(CENTRES[area] ?? CENTRES.Bole), name: `${address}, ${area}` };
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
  const kmLeft = Math.round(km(rider, drop) * 10) / 10;

  // One plain sentence that answers "where is my order?" without the map.
  let where;
  if (order.status === 'cancelled') where = 'This order was cancelled, so no courier is on the way.';
  else if (share === 1) where = `Your food has arrived in ${area}. Enjoy your meal!`;
  else if (share === 0) where = `Your food is at the ${KITCHEN.name}, about ${kmLeft} km from you. A courier sets off once it's ready.`;
  else where = `Your courier is riding towards ${area} and is about ${kmLeft} km away.`;

  return {
    rider,
    drop,
    where,
    kmLeft,
    etaAt: order.status === 'delivered' || order.status === 'cancelled' ? null : new Date(Date.parse(order.placedAt) + arrives * 1000).toISOString(),
  };
}

// Everything the tracker page needs in one object: the order, its courier, and the server's clock
// (`serverTime`), so "4 minutes ago" is worked out from the same instant on both sides.
export function toTrackedOrder(order, now = Date.now()) {
  return { ...toCustomerOrder(order), courier: courierFor(order, now), serverTime: new Date(now).toISOString() };
}
