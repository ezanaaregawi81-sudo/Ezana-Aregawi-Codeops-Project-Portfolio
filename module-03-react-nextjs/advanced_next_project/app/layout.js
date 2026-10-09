import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import Providers from './Providers';
import AuthNav from './AuthNav';
import CartNavLink from './CartNavLink';
import './globals.css';

// Both fonts used to come from a Google Fonts @import at the top of globals.css: a
// render-blocking stylesheet on another origin, which then fetched the font files from a third.
// next/font downloads them at build time, serves them from our own origin, and gives each a
// fallback sized to its metrics so the swap doesn't move text. Both are variable fonts, so one
// file per family covers every weight the site uses.
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
// Without the optical-size (opsz) axis: the preloaded Fraunces file drops from 66 KB to 37 KB,
// which took /menu from Lighthouse 86 to 90 (see PERF.md). Headings lose a little optical tuning.
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'] });

// Site-wide defaults. metadataBase makes every relative URL in metadata (canonical links,
// og:image) absolute, which link previews and crawlers need; pages fill in the title template
// with just their own name.
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
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
        {/* Third-party confetti for "Add to Cart". Nothing on first paint needs it, so it loads
            when the browser is idle instead of blocking the page from <head>. If the CDN is slow
            or down, the page still paints; the button calls window.confetti?.() in case. */}
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
