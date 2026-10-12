'use server';

import { revalidatePath } from 'next/cache';
import { addHistoricOrders, getAllOrders } from '@/lib/orders';
import { buildSampleOrders } from '@/lib/sample-orders';
import { getSession } from '@/lib/session';

// "Load sample orders" on the empty dashboard. Server actions are public POST endpoints, so the
// staff check is repeated here, not left to the page that shows the button.
export async function loadSampleOrders() {
  const session = await getSession();
  if (session?.role !== 'staff') return;
  // Once only: a second batch would double every figure.
  if (getAllOrders().some((order) => order.ownerId === 'sample')) return;
  addHistoricOrders(buildSampleOrders());
  revalidatePath('/kitchen/dashboard');
}
