import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findDish } from '../../../lib/dishes';
import AddToBasketButton from './AddToBasketButton';

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = findDish(id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="sk-shell" style={{ maxWidth: '640px' }}>
      <Link href="/menu" className="sk-btn sk-btn--plain" style={{ marginBottom: '1.5rem', paddingLeft: 0 }}>
        ← Back to menu
      </Link>

      <span className="sk-kicker">{dish.category}</span>
      <h1 className="sk-title">{dish.name}</h1>

      <div className="sk-fact-list">
        <div className="sk-fact-row">
          <span className="sk-fact-label">Dish id</span>
          <span>{id}</span>
        </div>
        <div className="sk-fact-row">
          <span className="sk-fact-label">Category</span>
          <span>{dish.category}</span>
        </div>
        <div className="sk-fact-row">
          <span className="sk-fact-label">Price</span>
          <span>${dish.price}</span>
        </div>
      </div>

      <AddToBasketButton dish={dish} />
    </div>
  );
}
