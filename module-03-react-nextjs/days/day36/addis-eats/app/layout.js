import Link from 'next/link';
import Providers from './Providers';
import CartNavLink from './CartNavLink';
import './globals.css';

export const metadata = {
  title: 'Addis Eats - Authentic Ethiopian Culinary Experience',
  description: 'Order rich, authentic Ethiopian dishes delivered fresh to your door with Next.js App Router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            <header className="site-header">
              <div className="header-top">
                <Link href="/" className="brand-logo" id="nav-brand-link">
                  <span className="logo-icon">🇪🇹</span>
                  <span>Addis<span className="highlight">Eats</span></span>
                </Link>

                <CartNavLink />
              </div>

              <nav className="header-nav">
                <ul className="nav-links">
                  <li>
                    <Link href="/" className="nav-link" id="nav-home-link">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu" className="nav-link" id="nav-menu-link">
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link href="/checkout" className="nav-link" id="nav-checkout-link">
                      Checkout
                    </Link>
                  </li>
                </ul>
              </nav>
            </header>

            <main className="main-content">{children}</main>

            <footer className="site-footer">
              <p>© {new Date().getFullYear()} Addis Eats. Built with Next.js App Router (File-system Routing & Colocated Components).</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
