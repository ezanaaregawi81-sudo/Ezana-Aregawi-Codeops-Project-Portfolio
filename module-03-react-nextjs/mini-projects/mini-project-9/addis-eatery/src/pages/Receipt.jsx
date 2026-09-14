import { Link, useLocation } from "react-router-dom";
import { useCartTotal } from "../store/useCart";

export default function Receipt() {
  const { state } = useLocation();
  const cartTotal = useCartTotal();
  const total = state?.total ?? cartTotal;

  return (
    <section className="page menu">
      <div className="menu-header">
        <h2>Receipt</h2>
        <strong>{total.toFixed(2)} ETB</strong>
      </div>

      <div className="checkout-panel">
        <h3>Order confirmed</h3>
        <p>Thanks for ordering from Addis Eatery.</p>
        <p>Payment: Cash on delivery</p>
        <p className="checkout-total">
          <span>Total</span>
          <strong>{total.toFixed(2)} ETB</strong>
        </p>
        <Link className="primary-link" to="/menu">
          Back to menu
        </Link>
      </div>
    </section>
  );
}
