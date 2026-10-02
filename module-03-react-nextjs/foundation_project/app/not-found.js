import Link from 'next/link';

export const metadata = { title: 'Not found' };

// Rendered for any unknown URL and whenever a page calls notFound() — for example
// /menu/not-a-dish. Responds with HTTP 404 inside the normal header and footer.
export default function NotFound() {
  return (
    <div className="page">
      <section className="state-card" aria-labelledby="not-found-heading">
        <span className="state-card__icon" aria-hidden="true">
          🍽️
        </span>
        <h1 id="not-found-heading">We couldn&apos;t find that</h1>
        <p>That dish or page isn&apos;t on our menu. It may have been removed, or the link is mistyped.</p>
        <div className="state-card__actions">
          <Link href="/menu" className="btn">
            Browse the Menu
          </Link>
          <Link href="/" className="btn btn--outline">
            Go home
          </Link>
        </div>
      </section>
    </div>
  );
}
