import { getDishes } from '@/lib/dishes';
import CartView from './CartView';

export const metadata = { title: 'Your Cart' };

// The page itself is a static server component: it reads the public menu once and
// hands it to CartView. The cart's contents are rendered on the client because they
// are private to this browser tab.
export default async function CartPage() {
  const dishes = await getDishes();
  const catalog = Object.fromEntries(
    dishes.map((dish) => [dish.id, { name: dish.name, price: dish.price, emoji: dish.emoji, color: dish.color }]),
  );

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>
      <CartView catalog={catalog} />
    </div>
  );
}
