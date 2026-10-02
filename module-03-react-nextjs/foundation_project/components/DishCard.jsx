import Link from 'next/link';
import { formatETB } from '@/lib/pricing';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';

// Server component: markup only. The two buttons are the client leaves; everything
// else on the card (name, price, links) is plain HTML that ships no JavaScript.
// `ranks` (optional) are this dish's positions under each sort order; the menu's
// DishFilter switches between them with CSS `order`, so sorting never re-renders cards.
export default function DishCard({ dish, ranks, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const style = ranks
    ? {
        '--rank-price-asc': ranks.priceAsc,
        '--rank-price-desc': ranks.priceDesc,
        '--rank-rating': ranks.rating,
      }
    : undefined;

  return (
    <article className="dish-card" id={`dish-${dish.id}`} data-category={dish.category} style={style}>
      <div className="dish-card__media" style={{ background: dish.color }}>
        <Link href={`/menu/${dish.id}`} tabIndex={-1} aria-hidden="true" className="dish-card__media-link">
          <span className="dish-card__emoji">{dish.emoji}</span>
        </Link>
        <WishlistButton dishId={dish.id} dishName={dish.name} />
      </div>
      <div className="dish-card__body">
        <Link href={`/menu/${dish.id}`} className="dish-card__title">
          <Heading>{dish.name}</Heading>
        </Link>
        <p className="dish-card__meta">
          <span className="pill">{dish.category}</span>
          <span className="rating">
            <span aria-hidden="true">⭐ </span>
            <span className="visually-hidden">Rated </span>
            {dish.rating}
          </span>
        </p>
        <div className="dish-card__footer">
          <span className="price">{formatETB(dish.price)}</span>
          <AddToCartButton dishId={dish.id} dishName={dish.name} price={dish.price} />
        </div>
      </div>
    </article>
  );
}
