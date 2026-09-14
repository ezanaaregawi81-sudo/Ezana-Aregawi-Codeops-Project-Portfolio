import { Link, useLocation } from 'react-router-dom';

function ReceiptPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <section className="empty-state">
        <h2>No recent order</h2>
        <p>Place an order from the menu to see a receipt here.</p>
        <Link to="/menu" className="primary-link">Back to menu</Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h2>Thank you for your order!</h2>
      <ul className="checkout-list">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — {Number(item.price) * item.quantity} ETB
          </li>
        ))}
      </ul>
      <p>Total paid: {order.total} ETB</p>
      <Link to="/menu" className="primary-link">Back to menu</Link>
    </section>
  );
}

export default ReceiptPage;
