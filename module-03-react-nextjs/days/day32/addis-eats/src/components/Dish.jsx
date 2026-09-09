import React from 'react';
import Card from './Card';
import PropTypes from 'prop-types';

function Dish({ id, name, price, category, isSpicy, currency = "ETB", quantityInCart = 0, onAddToCart, onRemoveFromCart }) {
  console.log(`[Dish Rendered] - ${name}`);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price, category, isSpicy });
    }
  };

  const handleRemove = () => {
    if (onRemoveFromCart) {
      onRemoveFromCart(id);
    }
  };

  return (
    <div className="dish">
      <Card>
        <h3>{name}</h3>
        <p><small>Category: {category}</small></p>
        <p><strong>{price} {currency}</strong></p>
        {isSpicy && <p style={{ color: '#e53e3e', fontWeight: 'bold' }}>🌶️ Spicy</p>}
        
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={handleAdd} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            Add to Cart
          </button>
          
          {quantityInCart > 0 && (
            <button 
              onClick={handleRemove} 
              style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', backgroundColor: '#e2e8f0' }}
            >
              -
            </button>
          )}

          <span style={{ marginLeft: 'auto' }}>
            In Cart: <strong>{quantityInCart}</strong>
          </span>
        </div>
      </Card>
    </div>
  );
}

Dish.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  isSpicy: PropTypes.bool,
  currency: PropTypes.string,
  quantityInCart: PropTypes.number,
  onAddToCart: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func,
};


export default React.memo(Dish);
