import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function DishPage() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const loadDish = async () => {
      try {
        const response = await fetch('/menu.json');

        if (!response.ok) {
          throw new Error('Failed to load dish');
        }

        const data = await response.json();
        const foundDish = data.items.find((item) => item.id === Number(id));

        if (!foundDish) {
          throw new Error('Dish not found');
        }

        setDish(foundDish);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      }
    };

    loadDish();
  }, [id]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!dish) {
    return <p>Loading dish...</p>;
  }

  return (
    <section className="dish-detail">
      <h2>{dish.name}</h2>
      <p>Category: {dish.category}</p>
      <p>Price: {String(dish.price)} ETB</p>
      {dish.isSpicy && <p className="spicy-tag">Spicy</p>}
      <button type="button" onClick={() => addToCart(dish)}>Add to cart</button>
      <Link to="/menu" className="secondary-link">Back to menu</Link>
    </section>
  );
}

export default DishPage;
