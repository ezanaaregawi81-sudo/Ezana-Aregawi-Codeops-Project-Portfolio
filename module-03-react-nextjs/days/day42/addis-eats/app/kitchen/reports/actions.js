'use server';

import { revalidatePath } from 'next/cache';
import { addHistoricOrders, getAllOrders } from '@/lib/orders';
import { buildSampleOrders } from '@/lib/sample-orders';
import { getSession } from '@/lib/session';

// "Load sample orders" on the empty reports page. A server action is a public POST endpoint,
// so the staff check happens here as well, not only on the page that shows the button.
export async function loadSampleOrders() {
  const session = await getSession();
  if (session?.role !== 'staff') return;

  // Load once: a second batch would double every day's figures.
  if (getAllOrders().some((order) => order.ownerId === 'sample')) return;

  addHistoricOrders(buildSampleOrders());
  revalidatePath('/kitchen/reports');
}
