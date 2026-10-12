import 'server-only';
import { getAllDishes } from './dishes';
import { computeTotals } from './pricing';

// Two weeks of believable, finished orders so the reports page has something to show before
// real orders build up. A fixed seed means the same history every time.
const NAMES = ['Abebe Bikila', 'Tirunesh Dibaba', 'Hana Tesfaye', 'Dawit Bekele', 'Meron Alemu', 'Yonas Girma', 'Liya Kebede', 'Samuel Haile'];
const AREAS = ['Bole', 'Kazanchis', 'Megenagna', 'Piassa'];
const PAYMENTS = ['telebirr', 'cbe', 'cash'];

function seeded(seed) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

export function buildSampleOrders(days = 14, now = new Date()) {
  const random = seeded(41);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const dishes = getAllDishes();
  // Addis Ababa is UTC+3 all year; shifting by 3 hours makes the UTC fields read as Addis days.
  const addisNow = new Date(now.getTime() + 3 * 3_600_000);
  const orders = [];

  for (let daysAgo = days - 1; daysAgo >= 0; daysAgo--) {
    const day = new Date(addisNow.getTime() - daysAgo * 86_400_000);
    // Fridays and the weekend are busier.
    const busy = [0, 5, 6].includes(day.getUTCDay());
    const count = (busy ? 7 : 3) + Math.floor(random() * (busy ? 6 : 5));

    for (let n = 0; n < count; n++) {
      const localHour = 11 + Math.floor(random() * 10); // 11:00–20:59 Addis Ababa time
      const placedAt = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), localHour - 3, Math.floor(random() * 60)));
      if (placedAt > now) continue;

      const items = Array.from({ length: 1 + Math.floor(random() * 3) }, () => {
        const dish = pick(dishes);
        return { id: dish.id, name: dish.name, price: dish.price, qty: 1 + Math.floor(random() * 2) };
      });

      orders.push({
        id: `AE-S${placedAt.getTime().toString(36).toUpperCase()}${n}`,
        ownerId: 'sample',
        customer: { name: pick(NAMES), phone: '0911000000', area: pick(AREAS), notes: '' },
        paymentMethod: pick(PAYMENTS),
        items,
        ...computeTotals(items),
        status: random() < 0.07 ? 'cancelled' : 'delivered',
        placedAt: placedAt.toISOString(),
      });
    }
  }
  return orders;
}
