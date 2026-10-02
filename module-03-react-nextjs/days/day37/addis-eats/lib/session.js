import 'server-only';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

// There is no login yet: a visitor's session is just a random id in the "ae_session"
// cookie, created when they place their first order. Orders are owned by that id.
const COOKIE_NAME = 'ae_session';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function getSession() {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  return id && UUID_PATTERN.test(id) ? { id } : null;
}

// Only call from a server action or route handler: those are the places cookies can be set.
export async function getOrCreateSession() {
  const existing = await getSession();
  if (existing) return existing;

  const id = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, id, { httpOnly: true, sameSite: 'lax', path: '/' });
  return { id };
}
