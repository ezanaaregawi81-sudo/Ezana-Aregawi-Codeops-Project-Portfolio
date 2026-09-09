import { Link } from "react-router-dom";
import { useCartCount, useCartTotal } from "../store/useCart";

export default function CartBadge() {
  const count = useCartCount();
  const total = useCartTotal();

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
