import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function DishModal({ dish, onAdd, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    const closeButton = modalRef.current?.querySelector(".modal-close");
    closeButton?.focus();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (!dish) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close dish details"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow">{dish.category}</p>
        <h2 id="dish-modal-title">{dish.name}</h2>
        <p className="modal-description">{dish.description}</p>

        <div className="modal-row">
          <strong>{(dish.price || 0).toFixed(2)} ETB</strong>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              onAdd(dish);
              onClose();
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
