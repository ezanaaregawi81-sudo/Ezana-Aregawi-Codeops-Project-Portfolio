import { getDishes } from '@/lib/dishes';
import DishList from '@/components/DishList';
import WishlistGrid from './WishlistGrid';

export const metadata = { title: 'Your Wishlist' };

// Static page: the server renders every dish card once; WishlistGrid (client) shows
// only the ones saved in this browser.
export default async function WishlistPage() {
  const dishes = await getDishes();

  return (
    <div className="page">
      <h1 className="page-title">Your Wishlist</h1>
      <WishlistGrid ids={dishes.map((dish) => dish.id)}>
        <DishList dishes={dishes} headingLevel={2} />
      </WishlistGrid>
    </div>
  );
}
