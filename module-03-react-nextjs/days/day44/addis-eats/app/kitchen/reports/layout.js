import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

// Why the access check is here and not only in page.js: this route has a loading.js, so Next
// streams the loading skeleton straight away with a 200. A redirect() or notFound() inside the
// page would then happen mid-stream, not as a real 307/404, and a customer would briefly see
// "Loading reports". The layout renders before the loading boundary, so it runs first.
export default async function ReportsLayout({ children }) {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/kitchen/reports');
  if (session.role !== 'staff') notFound();
  return children;
}
