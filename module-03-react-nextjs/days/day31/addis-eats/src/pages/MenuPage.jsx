import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch('/menu.json');

        if (!response.ok) {
          throw new Error('Failed to load menu');
        }

        const data = await response.json();
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      return matchesCategory;
    });
  }, [category, items]);

  const categories = ['All', 'Main-dish', 'Side-dish', 'Beverage'];

  const handleCategoryChange = (nextCategory) => {
    setSearchParams(nextCategory === 'All' ? {} : { category: nextCategory });
  };

  return (
    <section>
      <div className="category-bar">
        {categories.map((option) => (
          <button
            key={option}
            type="button"
            className={category === option ? 'category-button selected' : 'category-button'}
            onClick={() => handleCategoryChange(option)}
          >
            {option === 'All' ? 'All Items' : option}
          </button>
        ))}
      </div>

      {loading && <p>Loading menu...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="card-container">
          {filteredItems.map((item) => {
            const quantity = cartItems.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0;

            return (
              <article key={item.id} className="dish-card">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <p>{String(item.price)} ETB</p>
                {item.isSpicy && <p className="spicy-tag">Spicy</p>}
                <div className="dish-actions">
                  <button type="button" onClick={() => addToCart(item)}>Add to cart</button>
                  <Link to={`/menu/${item.id}`} className="secondary-link">View details</Link>
                </div>
                <p className="cart-quantity">In cart: {quantity}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MenuPage;
