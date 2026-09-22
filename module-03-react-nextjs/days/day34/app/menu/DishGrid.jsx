import Link from 'next/link';

const CATEGORY_ICON = {
  Main: '🍛',
  Vegetarian: '🥗',
  Side: '🫓',
};

export default function DishGrid({ dishes }) {
  return (
    <div className="sk-menu-list">
      {dishes.map((dish) => (
        <Link key={dish.id} href={`/menu/${dish.id}`} className="sk-menu-row">
          <span className="sk-menu-row-icon" aria-hidden="true">
            {CATEGORY_ICON[dish.category] ?? '🍽️'}
          </span>
          <div className="sk-menu-row-body">
            <div className="sk-menu-row-name">{dish.name}</div>
            <span className="sk-menu-row-tag">{dish.category}</span>
          </div>
          <span className="sk-menu-row-price">${dish.price}</span>
        </Link>
      ))}
    </div>
  );
}
