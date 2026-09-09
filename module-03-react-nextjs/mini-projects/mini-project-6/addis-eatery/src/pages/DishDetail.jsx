import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../components/cartContext";
import { useFetch } from "../hook/useFetch";

export default function DishDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch("/menu.json");
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const dish = data?.items?.find((item) => String(item.id) === id);

  if (loading) return <p className="loading-state">Loading dish...</p>;
  if (error) return <p className="error-state">{error}</p>;

  if (!dish) {
    return (
      <section className="page menu">
        <p className="empty-state">
          That dish was not found. <Link to="/menu">Back to menu.</Link>
        </p>
      </section>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: "add", dish });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="page menu">
      <Link to="/menu" className="back-link">← Back to menu</Link>
      <article className="dish-detail" style={{ marginTop: "1rem" }}>
        <p className="eyebrow">{dish.category}</p>
        <h2>{dish.name}</h2>
        <p>{dish.description}</p>
        <strong>{(dish.price || 0).toFixed(2)} ETB</strong>
        <button onClick={handleAddToCart} style={{ marginTop: "1rem" }}>
          {added ? "Added to cart!" : "Add to cart"}
        </button>
      </article>
    </section>
  );
}