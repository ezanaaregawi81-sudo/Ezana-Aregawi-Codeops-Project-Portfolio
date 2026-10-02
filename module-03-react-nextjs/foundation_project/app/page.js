import Link from 'next/link';
import { getSpecials } from '@/lib/dishes';
import DishList from '@/components/DishList';

// Static: the same landing page for every visitor, built once. It reads the specials
// straight from the data layer — no request data, so nothing makes it dynamic.
export default async function HomePage() {
  const specials = await getSpecials();

  return (
    <div className="page">
      <section className="hero">
        <h1>Taste of Addis, delivered.</h1>
        <p>Authentic Ethiopian dishes made fresh in Bole — from slow-simmered doro wat to a fresh jebena of buna.</p>
        <div className="hero__actions">
          <Link href="/menu" className="btn">
            Browse the Menu
          </Link>
          <Link href="/cart" className="btn btn--outline">
            View Cart
          </Link>
        </div>
      </section>

      <section aria-labelledby="specials-heading">
        <div className="section-head">
          <h2 id="specials-heading" className="section-title">
            Today&apos;s specials
          </h2>
          <Link href="/menu" className="link-back" style={{ margin: 0 }}>
            See the full menu →
          </Link>
        </div>
        <DishList dishes={specials} />
      </section>

      <section className="feature-row" aria-label="Why Addis Eats">
        <div className="feature">
          <span className="feature__icon" aria-hidden="true">
            🧑‍🍳
          </span>
          <h3>Made fresh daily</h3>
          <p>Stews simmered for hours and injera baked every morning in our Bole kitchen.</p>
        </div>
        <div className="feature">
          <span className="feature__icon" aria-hidden="true">
            📲
          </span>
          <h3>Pay with TeleBirr</h3>
          <p>TeleBirr, CBE Birr or cash on delivery — whichever suits you.</p>
        </div>
        <div className="feature">
          <span className="feature__icon" aria-hidden="true">
            🛵
          </span>
          <h3>Across Addis</h3>
          <p>Bole, Kazanchis, Megenagna, Piassa, CMC and Sarbet, for a flat 60 ETB.</p>
        </div>
      </section>
    </div>
  );
}
