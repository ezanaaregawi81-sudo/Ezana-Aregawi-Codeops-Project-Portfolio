import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getSessionSecret } from './secrets';

// There is no login yet (week 9 adds real auth). A visitor's session is a random id in
// an httpOnly cookie, signed with SESSION_SECRET so it cannot be edited to become
// someone else. Orders are owned by the session that placed them.
const COOKIE_NAME = 'ae_session';

function sign(id) {
  return createHmac('sha256', getSessionSecret()).update(id).digest('base64url');
}

function verify(value) {
  const [id, signature] = String(value ?? '').split('.');
  if (!id || !signature) return null;
  const expected = Buffer.from(sign(id));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  return id;
}

export async function getSession() {
  const cookieStore = await cookies();
  const id = verify(cookieStore.get(COOKIE_NAME)?.value);
  return id ? { id } : null;
}

// Only callable where cookies can be written: a server action or a route handler.
export async function getOrCreateSession() {
  const existing = await getSession();
  if (existing) return existing;

  const id = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${id}.${sign(id)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return { id };
}
