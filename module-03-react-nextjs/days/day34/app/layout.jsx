import { Geist, Geist_Mono } from 'next/font/google';
import SiteHeader from '../components/SiteHeader';
import { BasketProvider } from '../lib/basket-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Sheba Kitchen',
  description: 'Next.js App Router routing exercise',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <BasketProvider>
          <SiteHeader />
          <main>{children}</main>
        </BasketProvider>
      </body>
    </html>
  );
}
