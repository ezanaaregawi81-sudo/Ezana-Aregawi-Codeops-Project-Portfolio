import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/session';

// Next 16 renamed middleware.js to proxy.js; it behaves the same and runs on the Node runtime.
//
// Layer 1 of 3: bounce signed-out visitors before a private page even renders, remembering
// where they were going in `next`. It only proves "this request carried a valid cookie" for
// the paths in the matcher. Roles and ownership are checked by the page and the action.
export function proxy(request) {
  if (verifySession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const signInUrl = new URL('/sign-in', request.url);
  signInUrl.searchParams.set('next', pathname + search);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  // Only these two sections. /kitchen is left out on purpose: it checks the session and the
  // role itself on the server, so it doesn't depend on this file at all.
  matcher: ['/checkout/:path*', '/orders/:path*'],
};
