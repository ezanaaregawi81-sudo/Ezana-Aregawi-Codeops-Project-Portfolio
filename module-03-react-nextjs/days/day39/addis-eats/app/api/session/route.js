import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// Tells the header who is signed in, so the root layout doesn't have to read cookies (which
// would make every page, including the static home page, render per request).
// Display only: everything that matters calls getSession() on the server itself.
export async function GET() {
  const session = await getSession();
  return Response.json({ user: session && { name: session.name, role: session.role } });
}
