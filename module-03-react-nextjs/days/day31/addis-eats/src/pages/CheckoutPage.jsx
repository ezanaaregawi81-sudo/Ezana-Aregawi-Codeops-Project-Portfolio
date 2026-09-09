import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
  );
  const clearCart = useCartStore((state) => state.clearCart);

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
