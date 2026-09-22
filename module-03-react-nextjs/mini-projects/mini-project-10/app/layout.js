import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Habesha Table - Authentic Ethiopian Culinary Experience',
  description: 'Order rich, authentic Ethiopian dishes delivered fresh to your door with Next.js App Router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="ht-shell">
          <header className="ht-header">
            <div className="ht-header__row">
              <Link href="/" className="ht-brand" id="nav-brand-link">
                <span className="ht-brand__badge">H</span>
                <span>
                  Habesha <span className="ht-brand__accent">Table</span>
                </span>
                <span className="ht-header__flag">🇪🇹</span>
              </Link>

              <Link href="/cart" className="ht-nav__link ht-nav__link--cart" id="nav-cart-link">
                🛒 Cart
              </Link>
            </div>

            <div className="ht-header__row ht-header__row--nav">
              <nav>
                <ul className="ht-nav">
                  <li>
                    <Link href="/" className="ht-nav__link" id="nav-home-link">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu" className="ht-nav__link" id="nav-menu-link">
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link href="/checkout" className="ht-nav__link" id="nav-checkout-link">
                      Checkout
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="ht-main">{children}</main>

          <footer className="ht-footer">
            <p>© {new Date().getFullYear()} Habesha Table. Built with Next.js App Router (File-system Routing & Colocated Components).</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
