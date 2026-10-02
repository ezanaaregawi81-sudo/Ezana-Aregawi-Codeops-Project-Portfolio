import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDish, getDishes, getRelatedDishes } from '@/lib/dishes';
import { formatETB } from '@/lib/pricing';
import DishList from '@/components/DishList';
import AddToCartButton from '@/components/AddToCartButton';
import WishlistButton from '@/components/WishlistButton';

// Every dish id is known at build time, so each dish page is prerendered.
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({ id: dish.id }));
}

// The set of dishes is fixed at build time, so any other id is answered with a real
// HTTP 404 before rendering starts. (Rendering /menu/not-a-dish on demand would begin
// streaming inside app/menu/loading.js's Suspense boundary, and notFound() thrown
// mid-stream can only add a noindex tag to a response that already said 200.)
export const dynamicParams = false;

// Same staleness budget as /menu, so a dish page never disagrees with the menu's
// price for more than an hour.
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return { title: 'Dish not found' };
  return { title: dish.name, description: dish.description };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  // Guard for a dish removed from the data source after the build: renders
  // app/not-found.js instead of crashing.
  if (!dish) notFound();

  const related = await getRelatedDishes(dish);
  const spice = dish.spicy > 0 ? '🌶️'.repeat(dish.spicy) : 'None';

  return (
    <>
      <Link href="/menu" className="link-back">
        ← Back to menu
      </Link>

      <article className="dish-detail">
        <div className="dish-detail__media" style={{ background: dish.color }}>
          <span className="dish-detail__emoji" role="img" aria-label={dish.name}>
            {dish.emoji}
          </span>
        </div>

        <div className="dish-detail__info">
          <p className="pill">{dish.category}</p>
          <h1>{dish.name}</h1>
          <p className="rating">
            <span aria-hidden="true">⭐ </span>
            <span className="visually-hidden">Rated </span>
            {dish.rating} • {dish.prepTime} min prep
          </p>
          <p className="dish-detail__desc">{dish.description}</p>
          {dish.tags.length > 0 && (
            <ul className="tag-row" aria-label="Dietary tags" style={{ listStyle: 'none', padding: 0 }}>
              {dish.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <p className="spicy-row">
            Spice level: <span aria-label={`${dish.spicy} of 3`}>{spice}</span>
          </p>
          <p className="price price--lg">{formatETB(dish.price)}</p>
          <div className="dish-detail__actions">
            <AddToCartButton dishId={dish.id} dishName={dish.name} price={dish.price} withQuantity />
            <WishlistButton dishId={dish.id} dishName={dish.name} variant="full" />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="section-title">
            You might also like
          </h2>
          <DishList dishes={related} />
        </section>
      )}
    </>
  );
}
