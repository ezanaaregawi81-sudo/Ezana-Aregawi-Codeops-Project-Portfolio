import { useState, useMemo, useCallback } from "react";
import CategoryBar from "./CatagoryBar";
import Dish from "./Dish";
import OrderForm from "./OrderForm";
import { useCart } from "./CartProvider";
import { useFetch } from "../hook/useFetch";

const CATEGORIES = ["All", "Appetizer", "Main", "Breakfast", "Drinks"];

function isValidTelebirr(phone) {
  return /^09\d{8}$/.test(phone.trim());
}

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
  });

  const fetchUrl = selectedCategory === "All" ? "menu.json" : `menu.json?category=${selectedCategory}`;
  const { data, loading, error } = useFetch(fetchUrl);

  const { items, dispatch, total } = useCart();

  const filteredDishes = useMemo(() => {
    const rawDishes = data?.items || [];
    if (selectedCategory === "All") return rawDishes;
    return rawDishes.filter((d) => d.category === selectedCategory);
  }, [data, selectedCategory]);

  const handleAdd = useCallback(
    (dish) => {
      dispatch({ type: "add", dish });
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id) => {
      dispatch({ type: "remove", id });
    },
    [dispatch]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const phoneIsValid = isValidTelebirr(form.phone);
  const isFormValid = phoneIsValid && form.name.trim() !== "" && form.area.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    alert(
      `Order placed!\nTotal: ${total.toFixed(2)} ETB\nName: ${form.name}\nPhone: ${form.phone}\nArea: ${form.area}`
    );

    dispatch({ type: "clear" });
    setForm({ name: "", phone: "", area: "" });
  };

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

          {items.length > 0 && (
            <div className="checkout-panel">
              <h3>Checkout Panel ({items.length} {items.length === 1 ? "item" : "items"})</h3>
              <ul className="checkout-items">
                {items.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="checkout-item">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-price">{item.price.toFixed(2)} ETB</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="checkout-total">
                <span>Total:</span>
                <strong>{total.toFixed(2)} ETB</strong>
              </div>
            </div>
          )}

          <OrderForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            isValid={isFormValid}
          />
        </>
      )}
    </div>
  );
}
