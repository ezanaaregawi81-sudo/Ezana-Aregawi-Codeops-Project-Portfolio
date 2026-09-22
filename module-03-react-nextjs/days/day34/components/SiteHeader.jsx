'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useBasket } from '../lib/basket-context';

const NAV_ITEMS = [
  { href: '/home', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/cart', label: 'Cart' },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { lineCount } = useBasket();

  return (
    <header className="sk-header">
      <div className="sk-header-inner">
        <div className="sk-header-row">
          <Link href="/home" className="sk-brand">
            <span className="sk-brand-badge" aria-hidden="true">
              S
            </span>
            Sheba Kitchen
          </Link>

          <div className="sk-header-actions">
            <button type="button" className="sk-btn sk-btn--solid" onClick={() => router.push('/checkout')}>
              Checkout
            </button>
          </div>
        </div>

        <nav className="sk-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === '/menu' && pathname.startsWith('/menu'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sk-nav-link${isActive ? ' sk-nav-link--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {item.href === '/cart' && lineCount > 0 && <span className="sk-nav-count">{lineCount}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
