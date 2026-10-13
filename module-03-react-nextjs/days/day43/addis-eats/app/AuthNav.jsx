'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { signOut } from './sign-in/actions';

// The header's account links. Signing in and out both end in a redirect, so the session is
// re-fetched on every navigation.
export default function AuthNav() {
  const pathname = usePathname();
  const { data, mutate } = useSWR('/api/session');
  const user = data?.user;

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  if (!user) {
    return (
      <>
        <li>
          <Link href="/orders" className="nav-link" id="nav-orders-link">
            Orders
          </Link>
        </li>
        <li>
          <Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} className="nav-link" id="nav-sign-in-link">
            Sign In
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href="/orders" className="nav-link" id="nav-orders-link">
          My Orders
        </Link>
      </li>
      {/* Convenience only. /kitchen checks the role on the server, so a customer who types the URL gets a 404. */}
      {user.role === 'staff' && (
        <li>
          <Link href="/kitchen" className="nav-link" id="nav-kitchen-link">
            Kitchen
          </Link>
        </li>
      )}
      <li>
        <form action={signOut}>
          <button
            type="submit"
            className="nav-link"
            id="nav-sign-out-button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', font: 'inherit' }}
          >
            Sign Out ({user.name.split(' ')[0]})
          </button>
        </form>
      </li>
    </>
  );
}
