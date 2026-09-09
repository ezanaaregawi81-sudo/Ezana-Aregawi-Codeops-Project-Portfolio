import { useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CategoryBar from "./CatagoryBar";
import Dish from "./Dish";
import { useCart } from "./cartContext";
import { useFetch } from "../hook/useFetch";

const CATEGORIES = ["All", "Appetizer", "Main", "Breakfast", "Drinks", "Vegan"];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const setSelectedCategory = (category) => {
    setSearchParams(category.toLowerCase() === "all" ? {} : { category });
  };

  const fetchUrl = "/menu.json";
  const { data, loading, error } = useFetch(fetchUrl);

  const { items, dispatch, total } = useCart();

  const filteredDishes = useMemo(() => {
    const rawDishes = data?.items || [];
    if (!selectedCategory || selectedCategory.toLowerCase() === "all") return rawDishes;
    return rawDishes.filter(
      (d) => d.category && d.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [data, selectedCategory]);

  const handleAdd = useCallback(
    (dish) => {
      dispatch({ type: "add", dish });
    },
    [dispatch]
  );

  return (
    <div className="menu">
      <header className="menu-header">
        <h2>Addis Eats</h2>
        <p className="order-total">
          Order Total: <strong>{total.toFixed(2)} ETB</strong>
        </p>
      </header>

      <CategoryBar
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {loading && <p className="loading-state">Loading the menu...</p>}
      {error && (
        <div className="error-state">
          <h3>Error loading menu</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <Dish dishes={filteredDishes} onAdd={handleAdd} />

          {items.length > 0 && <p className="menu-checkout-link">Your order is ready in the <Link to="/cart">cart</Link>.</p>}
        </>
      )}
    </div>
  );
}
