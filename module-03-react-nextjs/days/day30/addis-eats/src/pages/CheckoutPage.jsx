import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CheckoutPage() {
  const navigate = useNavigate();
  const { total, items, clearCart } = useCart();

  const handleFinish = () => {
    clearCart();
    localStorage.removeItem('addis-eats-user');
    navigate('/');
  };

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {items.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity} — {Number(item.price) * item.quantity} ETB
              </li>
            ))}
          </ul>
          <p>Total: {total} ETB</p>
        </>
      )}
      <button type="button" onClick={handleFinish} disabled={items.length === 0}>Finish order</button>
    </section>
  );
}

export default CheckoutPage;
