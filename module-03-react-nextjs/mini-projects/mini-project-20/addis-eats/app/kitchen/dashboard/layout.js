import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

// The access check is here, above loading.js, on purpose. With a loading boundary Next streams the
// skeleton at once with a 200, so a redirect() or notFound() in page.js would happen mid-stream
// instead of as a real 307 / 404 (and a customer would glimpse the skeleton). A layout finishes
// before the loading boundary, so these answers are real status codes.
export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/kitchen/dashboard');
  if (session.role !== 'staff') notFound();
  return children;
}
