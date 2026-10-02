'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from './Providers';

const LINKS = [
  { href: '/menu', label: 'Menu', match: (path) => path === '/menu' || path.startsWith('/menu/') },
  { href: '/wishlist', label: 'Wishlist', match: (path) => path === '/wishlist' },
  { href: '/cart', label: 'Cart', match: (path) => path === '/cart' || path === '/checkout' },
];

// Client because it needs the current path (active link) and the cart/wishlist
// counts from Providers. The rest of the header stays server-rendered.
export default function NavLinks() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useShop();
  const counts = { '/wishlist': wishlist.length, '/cart': cartCount };

  return (
    <nav className="nav" aria-label="Main">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        const count = counts[link.href] ?? 0;
        return (
          <Link key={link.href} href={link.href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}>
            {link.label}
            {count > 0 && (
              <span className={`badge${link.href === '/cart' ? ' badge--accent' : ''}`}>
                {count}
                <span className="visually-hidden"> {count === 1 ? 'item' : 'items'}</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
