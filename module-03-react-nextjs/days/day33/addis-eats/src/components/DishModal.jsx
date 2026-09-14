import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

function DishModal({ dish, onClose, onAddToCart }) {
  const closeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 id="dish-modal-title">{dish.name}</h2>
        <p className="modal-description">
          Category: {dish.category}
          {dish.isSpicy && ' · 🌶️ Spicy'}
        </p>
        <div className="modal-row">
          <strong>{dish.price} ETB</strong>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              onAddToCart(dish);
              onClose();
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

DishModal.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.number,
    isSpicy: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default DishModal;
