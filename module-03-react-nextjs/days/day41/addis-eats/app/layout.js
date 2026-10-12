import { Fraunces } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import Providers from './Providers';
import AuthNav from './AuthNav';
import CartNavLink from './CartNavLink';
import './globals.css';

// The heading font. next/font downloads it at build time, serves it from our own origin
// (no request to fonts.googleapis.com), preloads it, and sizes the Georgia fallback to match
// Fraunces' metrics. The preload is kept on purpose: with `preload: false` the font arrived
// after first paint and the swap shifted the headings (CLS 0.015). See PERFORMANCE.md.
const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700', '800'],
});

// Site-wide defaults. metadataBase makes every relative URL in metadata absolute, which link
// previews need. Pages give only their own name; the template adds " · Addis Eats".
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Addis Eats · Authentic Ethiopian food, delivered',
    template: '%s · Addis Eats',
  },
  description:
    'Slow-simmered doro wat, special kitfo, tibs and fasting platters on fresh teff injera, cooked to order and delivered across Addis Ababa.',
  applicationName: SITE_NAME,
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fraunces.variable}>
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
                  <AuthNav />
                </ul>
              </nav>
            </header>

            <main className="main-content">{children}</main>

            <footer className="site-footer">
              <p>© {new Date().getFullYear()} Addis Eats. Built with Next.js App Router (File-system Routing & Colocated Components).</p>
            </footer>
          </div>
        </Providers>
        {/* Third-party confetti for "Add to Cart". Nothing on first paint needs it, so it loads once
            the browser is idle instead of blocking the page from <head>. */}
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
