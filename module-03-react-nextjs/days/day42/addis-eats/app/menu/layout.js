import Link from 'next/link';
import SidebarWidget from './SidebarWidget';

export const metadata = {
  title: 'Menu - Addis Eats',
  description: 'Explore traditional Ethiopian dishes.',
};

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout-container">
      <aside className="menu-sidebar">
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            Addis Menu Shell
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Browse the menu and keep your favorites close.
          </p>
        </div>

        <nav>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>
              <Link href="/menu" className="nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                📖 All Menu Items
              </Link>
            </li>
            <li>
              <Link href="/menu/doro-wat" className="nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                🍗 Doro Wat
              </Link>
            </li>
            <li>
              <Link href="/menu/kitfo" className="nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                🥩 Special Kitfo
              </Link>
            </li>
            <li>
              <Link href="/menu/beyaynetu" className="nav-link" style={{ padding: '0.4rem 0.6rem' }}>
                🥗 Yetsom Beyaynetu
              </Link>
            </li>
          </ul>
        </nav>

        <SidebarWidget />
      </aside>

      <main className="menu-main-content">
        {children}
      </main>
    </div>
  );
}
