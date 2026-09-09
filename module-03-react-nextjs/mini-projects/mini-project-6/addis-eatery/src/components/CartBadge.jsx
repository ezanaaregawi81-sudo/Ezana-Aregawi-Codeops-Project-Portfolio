import { Link } from "react-router-dom";
import { useCart } from "./cartContext";

export default function CartBadge() {
  const { items, total } = useCart();
  const count = items.length;

  return (
    <Link to="/cart" style={{ textDecoration: "none" }}>
      <div className="cart-badge">
        <span className="badge-icon">🛒</span>
        <span className="badge-count">{count} {count === 1 ? "item" : "items"}</span>
        <span className="badge-total">{total.toFixed(2)} ETB</span>
      </div>
    </Link>
  );
}
