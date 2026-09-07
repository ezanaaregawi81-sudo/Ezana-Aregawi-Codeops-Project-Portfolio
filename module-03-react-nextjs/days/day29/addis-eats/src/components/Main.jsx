import React, { useState, useEffect, useRef, useCallback, Profiler } from "react";
import Dish from "./Dish";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";
import useFetch from "../hooks/useFetch";
import { useCart } from "../context/CartContext";

function Main() {
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // Exercise 2: Using useFetch custom hook (Component 1)
  const { data, loading, error } = useFetch("menu.json");

  // Exercise 5: Reading Cart Context (reducer state & derived values)
  const { items: cartItems, addToCart, removeFromCart, total, totalCount } = useCart();

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.title = `Addis Eats — ${totalCount} items in cart`;
  }, [totalCount]);

  /**
   * EXERCISE 7: Memoize callbacks with useCallback.
   * Passing these memoized callbacks ensures React.memo(Dish) is NOT bypassed on re-renders of Main.
   */
  const handleAddToCart = useCallback((dishItem) => {
    addToCart(dishItem);
  }, [addToCart]);

  const handleRemoveFromCart = useCallback((dishId) => {
    removeFromCart(dishId);
  }, [removeFromCart]);

  /**
   * EXERCISE 7: Profiler onRender Callback Function
   * Logs render timing metrics to the browser console for performance comparison.
   */
  const onRenderDishList = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime // when React committed this update
  ) => {
    console.log(
      `[React Profiler] ID: ${id} | Phase: ${phase} | Actual Duration: ${actualDuration.toFixed(2)}ms | Base Duration: ${baseDuration.toFixed(2)}ms`
    );
  };

  // Filter menu items by selected category and search input
  const allItems = data?.items || [];
  const filteredMenu = allItems.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      <div style={{
        padding: "1rem",
        backgroundColor: "rgba(0,0,0,0.03)",
        borderRadius: "8px",
        marginBottom: "1.5rem"
      }}>
        <h2>Order Summary (CartContext + cartReducer)</h2>
        <h3>Order Total: <strong>{total} ETB</strong></h3>
        <h3>Total Orders: <strong>{totalCount} Items</strong></h3>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search menu items..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "100%", maxWidth: "300px", fontSize: "1rem" }}
        />
      </div>

      <CategoryBar selected={category} onSelect={setCategory} />

      <h2>Category: {category}</h2>

      {/* EXERCISE 7: Profiling the Menu Rendering with React.Profiler */}
      <Profiler id="DishList" onRender={onRenderDishList}>
        <div className="card-container" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
          margin: "1rem 0"
        }}>
          {loading && <p>Loading menu...</p>}
          {error && (
            <p style={{ color: "red" }}>
              <strong>Error loading menu: {error.message}</strong>
            </p>
          )}

          {!loading && !error && filteredMenu.length === 0 && (
            <p>No menu items found.</p>
          )}

          {!loading && !error && filteredMenu.map((item) => {
            const cartItem = cartItems.find((ci) => ci.id === item.id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;

            return (
              <Dish 
                key={item.id} 
                {...item}
                quantityInCart={quantityInCart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
            );
          })}
        </div>
      </Profiler>

      <div className="form" style={{ marginTop: "2rem" }}>
        <OrderForm />
      </div>
    </main>
  );
}

export default Main;