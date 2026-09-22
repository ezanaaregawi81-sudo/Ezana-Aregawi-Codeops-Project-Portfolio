import Link from 'next/link';
import MenuSidebar from './MenuSidebar';

export const metadata = {
  title: 'Menu - Habesha Table',
  description: 'Explore traditional Ethiopian dishes with fast streaming and dynamic layout strategies.',
};

export default function MenuLayout({ children }) {
  return (
    <div className="ht-rail">
      {/* Main Content Area (rendered first; sidebar rail sits to the right) */}
      <main className="ht-rail-main">
        {children}
      </main>

      {/* Instantly rendered persistent sidebar rail */}
      <aside className="ht-rail-aside">
        <div>
          <h3 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--ht-ink)' }}>
             Habesha Menu Shell
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--ht-ink-soft)' }}>
            Instant layout rail surviving client navigation.
          </p>
        </div>

        <nav>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ht-ink-faint)', marginBottom: '0.5rem' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>
              <Link href="/menu" className="ht-nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                📖 All Menu Items
              </Link>
            </li>
            <li>
              <Link href="/menu/doro-wat" className="ht-nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                🍗 Doro Wat
              </Link>
            </li>
            <li>
              <Link href="/menu/kitfo" className="ht-nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                🥩 Special Kitfo
              </Link>
            </li>
            <li>
              <Link href="/menu/beyaynetu" className="ht-nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                🥗 Yetsom Beyaynetu
              </Link>
            </li>
          </ul>
        </nav>

        {/* State Persistence Verification Widget */}
        <MenuSidebar />
      </aside>
    </div>
  );
}
