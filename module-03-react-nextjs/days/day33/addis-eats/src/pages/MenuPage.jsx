import { useEffect, useMemo, useState, Profiler } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import ErrorBoundary from '../components/ErrorBoundary';
import DishCard from '../components/DishCard';
import DishModal from '../components/DishModal';

function onRenderDishGrid(id, phase, actualDuration) {
  console.log(`[Profiler] ${id} (${phase}) took ${actualDuration.toFixed(2)}ms`);
}

function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewDish, setQuickViewDish] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

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
        <ErrorBoundary fallback={<p className="error-text">This dish grid crashed. The header and cart above are unaffected.</p>}>
          <Profiler id="DishGrid" onRender={onRenderDishGrid}>
            <div className="card-container">
              {filteredItems.map((item) => (
                <DishCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  onQuickView={setQuickViewDish}
                />
              ))}
            </div>
          </Profiler>
        </ErrorBoundary>
      )}

      {quickViewDish && (
        <DishModal
          dish={quickViewDish}
          onClose={() => setQuickViewDish(null)}
          onAddToCart={addToCart}
        />
      )}
    </section>
  );
}

export default MenuPage;
