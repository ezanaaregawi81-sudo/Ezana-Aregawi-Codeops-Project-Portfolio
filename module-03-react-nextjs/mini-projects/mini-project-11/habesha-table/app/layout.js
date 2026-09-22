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
            <div className="ht-header-top">
              <Link href="/" className="ht-brand" id="nav-brand-link">
                <span className="ht-brand-badge">H</span>
                <span>Habesha<span className="ht-brand-highlight"> Table</span></span>
              </Link>

              <Link href="/cart" className="ht-nav-link ht-nav-link--cart" id="nav-cart-link">
                🛒 Cart
              </Link>
            </div>

            <nav className="ht-header-nav">
              <ul className="ht-nav-links">
                <li>
                  <Link href="/" className="ht-nav-link" id="nav-home-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="ht-nav-link" id="nav-menu-link">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="ht-nav-link" id="nav-checkout-link">
                    Checkout
                  </Link>
                </li>
              </ul>
            </nav>
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
