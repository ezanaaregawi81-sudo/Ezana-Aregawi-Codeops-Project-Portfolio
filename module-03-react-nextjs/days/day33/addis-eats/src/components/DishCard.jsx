import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCartStore } from '../store/cartStore';

function DishCard({ item, onAddToCart, onQuickView }) {
  console.log(`[DishCard render] ${item.name}`);

  const [crash, setCrash] = useState(false);
  const quantity = useCartStore(
    (state) => state.items.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0,
  );

  if (crash) {
    throw new Error(`Deliberate crash while rendering "${item.name}"`);
  }

  return (
    <article className="dish-card">
      <h3>{item.name}</h3>
      <p>{item.category}</p>
      <p>{String(item.price)} ETB</p>
      {item.isSpicy && <p className="spicy-tag">Spicy</p>}
      <div className="dish-actions">
        <button type="button" onClick={() => onAddToCart(item)}>Add to cart</button>
        <button type="button" className="secondary-btn" onClick={() => onQuickView(item)}>
          Quick view
        </button>
        <Link to={`/menu/${item.id}`} className="secondary-link">View details</Link>
      </div>
      <p className="cart-quantity">In cart: {quantity}</p>
      <button type="button" className="secondary-btn" onClick={() => setCrash(true)}>
        💥 Break this dish
      </button>
    </article>
  );
}

DishCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.number,
    isSpicy: PropTypes.bool,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onQuickView: PropTypes.func.isRequired,
};

export default memo(DishCard);
