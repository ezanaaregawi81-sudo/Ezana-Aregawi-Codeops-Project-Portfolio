import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

// The one session helper. proxy.js, every private page, every server action and every route
// handler reads the session through this file, so there is exactly one definition of
// "signed in" and one place that knows the cookie format.

export const SESSION_COOKIE = 'ae_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds: a working day, then sign in again

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

// A signed cookie stays valid until it expires, even after sign-out, if someone kept a copy.
// So each session gets an id (sid), and signing out puts it here. Kept on globalThis like the
// order store, so proxy.js and the pages share it. In-memory, so a restart forgets it.
const revoked = globalThis.__addisEatsRevokedSessions ?? (globalThis.__addisEatsRevokedSessions = new Set());

function sign(payload) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

// The cookie is "<payload>.<signature>". The payload (user id, name, role, sid, expiry) is readable
// by whoever holds the cookie, but changing any of it breaks the signature.
function encode(user) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const claims = { id: user.id, name: user.name, role: user.role, sid: randomUUID(), exp };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

// Returns { id, name, role, sid } for a valid, unexpired, not-signed-out cookie, otherwise null.
// Exported for proxy.js, which gets the cookie from the request instead of cookies().
export function verifySession(value) {
  const [payload, signature, extra] = String(value ?? '').split('.');
  if (!payload || !signature || extra !== undefined) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const { id, name, role, sid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof exp !== 'number' || exp * 1000 < Date.now()) return null;
    if (revoked.has(sid)) return null;
    return { id, name, role, sid };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

// Only call from a server action or route handler: those are the places cookies can be set.
export async function createSession(user) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encode(user), {
    httpOnly: true, // page scripts can't read it, so an XSS bug can't steal the session
    secure: true, // only sent over HTTPS (browsers treat http://localhost as secure, so dev works)
    sameSite: 'lax', // not sent on cross-site POSTs, which blocks CSRF against the server actions
    path: '/',
    maxAge: MAX_AGE, // the browser drops it when the signed expiry passes too
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (session) revoked.add(session.sid);
  cookieStore.delete(SESSION_COOKIE);
}
