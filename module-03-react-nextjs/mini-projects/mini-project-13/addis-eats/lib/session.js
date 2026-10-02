import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'ae_session';

// SESSION_SECRET lives in .env.local and is read only here, on the server.
// It has no NEXT_PUBLIC_ prefix and this module imports 'server-only', so it can't
// end up in the browser bundle.
function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set in .env.local (at least 32 characters).');
  }
  return secret;
}

function sign(id) {
  return createHmac('sha256', getSecret()).update(id).digest('base64url');
}

// The cookie is "<id>.<signature>", so a visitor can't edit it to become someone else.
function verify(value) {
  const [id, signature] = (value ?? '').split('.');
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

// Only call from a server action or route handler: those are the places cookies can be set.
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
    maxAge: 60 * 60 * 24 * 7,
  });
  return { id };
}
