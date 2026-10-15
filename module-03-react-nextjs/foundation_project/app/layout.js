import Link from 'next/link';
import Providers from '@/components/Providers';
import NavLinks from '@/components/NavLinks';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata = {
  // Every absolute URL (link cards, canonicals, sitemap) is built from this (lib/site.js).
  metadataBase: new URL(SITE_URL),
  title: { default: 'Addis Eats', template: '%s · Addis Eats' },
  description: 'Authentic Ethiopian dishes made fresh in Bole, Addis Ababa — order online and pay with TeleBirr.',
  icons: { icon: '/favicon.svg' },
  // The card image itself is app/opengraph-image.js.
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_ET' },
  twitter: { card: 'summary_large_image' },
};

// Root layout: a server component. It reads no cookies or headers — doing so here
// would make every route in the app dynamic. Providers (client) receives the whole
// server-rendered tree as `children`.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <header className="site-header">
              <div className="site-header__inner">
                <Link href="/" className="brand">
                  <span className="brand__mark" aria-hidden="true">
                    🍽️
                  </span>
                  <span>Addis Eats</span>
                </Link>
                <NavLinks />
              </div>
            </header>
            <main id="main">{children}</main>
            <footer className="site-footer">
              <p>Bole, Addis Ababa • Powered by TeleBirr</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
