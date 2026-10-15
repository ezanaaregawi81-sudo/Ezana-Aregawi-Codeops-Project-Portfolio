import 'server-only';
import { getAllDishes } from './dishes';
import { NEIGHBOURHOODS } from './order-schema';
import { computeTotals } from './pricing';

// Fourteen days of believable, finished orders, so the dashboard has something to chart before
// real orders build up (they live in memory, so a fresh server has none). Seeded: the same history
// every time. Bole and Kazanchis get more orders than the rest, as a real delivery app would.
const NAMES = ['Selam Tadesse', 'Bereket Alemayehu', 'Hiwot Girma', 'Nahom Tesfaye', 'Mekdes Haile', 'Robel Kassa', 'Saba Mulugeta', 'Elias Worku'];
const AREA_WEIGHTS = { Bole: 5, Kazanchis: 3, Megenagna: 2, Piassa: 2, Sarbet: 1, CMC: 1 };
const PAYMENTS = ['telebirr', 'cbe', 'cash'];

function seeded(seed) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

export function buildSampleOrders(days = 14, now = new Date()) {
  const random = seeded(81);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const weighted = NEIGHBOURHOODS.flatMap((area) => Array(AREA_WEIGHTS[area] ?? 1).fill(area));
  const dishes = getAllDishes();
  // Addis Ababa is UTC+3 all year; shifting by 3 hours makes the UTC fields read as Addis days.
  const addisNow = new Date(now.getTime() + 3 * 3_600_000);
  const orders = [];

  for (let ago = days - 1; ago >= 0; ago--) {
    const day = new Date(addisNow.getTime() - ago * 86_400_000);
    const busy = [0, 5, 6].includes(day.getUTCDay()); // Friday to Sunday
    const count = (busy ? 7 : 3) + Math.floor(random() * (busy ? 6 : 5));

    for (let n = 0; n < count; n++) {
      const localHour = 11 + Math.floor(random() * 10);
      const placedAt = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), localHour - 3, Math.floor(random() * 60)));
      if (placedAt > now) continue;

      const items = Array.from({ length: 1 + Math.floor(random() * 3) }, () => {
        const dish = pick(dishes);
        return { id: dish.id, name: dish.name, price: dish.price, qty: 1 + Math.floor(random() * 2) };
      });
      const area = pick(weighted);
      orders.push({
        id: `AE-S${placedAt.getTime().toString(36).toUpperCase()}${n}`,
        ownerId: 'sample',
        customer: { name: pick(NAMES), phone: '0911000000', area, address: `${area}, sample address` },
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
