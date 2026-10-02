import DishCard from './DishCard';

// Server component: renders dish cards from data it is handed. Used by the landing
// page, the menu, the dish page's "You might also like" and the wishlist.
export default function DishList({ dishes, withRanks = false, headingLevel }) {
  const ranks = withRanks ? sortRanks(dishes) : null;

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} ranks={ranks?.get(dish.id)} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

// Position of every dish under each sort order, computed once on the server.
function sortRanks(dishes) {
  const order = (compare) => new Map([...dishes].sort(compare).map((dish, index) => [dish.id, index]));
  const priceAsc = order((a, b) => a.price - b.price);
  const priceDesc = order((a, b) => b.price - a.price);
  const rating = order((a, b) => b.rating - a.rating);

  return new Map(
    dishes.map((dish) => [
      dish.id,
      { priceAsc: priceAsc.get(dish.id), priceDesc: priceDesc.get(dish.id), rating: rating.get(dish.id) },
    ]),
  );
}
