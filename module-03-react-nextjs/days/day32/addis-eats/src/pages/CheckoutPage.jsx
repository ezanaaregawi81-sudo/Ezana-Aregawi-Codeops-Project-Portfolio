import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';

const initialFormState = {
  name: '',
  phone: '',
  area: 'Bole',
  notes: '',
};

const areaOptions = ['Bole', 'Kazanchis', 'Megenagna', 'Piassa'];

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone is required.';
  } else if (!/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = 'Phone must be 10 digits.';
  }

  if (!form.area || !areaOptions.includes(form.area)) {
    errors.area = 'Please select a delivery area.';
  }

  return errors;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const errors = validate(form);
  const isFormValid = Object.keys(errors).length === 0;

  const handleFinish = () => {
    clearCart();
    localStorage.removeItem('addis-eats-user');
    navigate('/');
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError('');
    }
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setTouched({ name: true, phone: true, area: true });
      setSubmitError('Please correct the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    window.setTimeout(() => {
      setIsSubmitting(false);
      setTouched({ name: true, phone: true, area: true });
      setSubmitError('TeleBirr payment failed. Please check the phone and try again.');
    }, 700);
  }

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

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="checkout-name">Full name</label>
        <input
          id="checkout-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your name"
          aria-invalid={Boolean(touched.name && errors.name)}
          aria-describedby={touched.name && errors.name ? 'checkout-name-error' : undefined}
        />
        {touched.name && errors.name && (
          <small id="checkout-name-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {errors.name}
          </small>
        )}

        <label htmlFor="checkout-phone">TeleBirr phone</label>
        <input
          id="checkout-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10-digit phone number"
          aria-invalid={Boolean(touched.phone && errors.phone)}
          aria-describedby={touched.phone && errors.phone ? 'checkout-phone-error' : undefined}
        />
        {touched.phone && errors.phone && (
          <small id="checkout-phone-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {errors.phone}
          </small>
        )}

        <label htmlFor="checkout-area">Delivery area</label>
        <select
          id="checkout-area"
          name="area"
          value={form.area}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(touched.area && errors.area)}
          aria-describedby={touched.area && errors.area ? 'checkout-area-error' : undefined}
        >
          {areaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched.area && errors.area && (
          <small id="checkout-area-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {errors.area}
          </small>
        )}

        <label htmlFor="checkout-notes">Notes</label>
        <textarea
          id="checkout-notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Optional delivery notes"
          rows="3"
        />

        {submitError && (
          <p role="alert" style={{ color: 'red', marginBottom: '0.75rem' }}>
            {submitError}
          </p>
        )}

        <button type="submit" disabled={!isFormValid || isSubmitting || items.length === 0}>
          {isSubmitting ? 'Submitting...' : `Submit Order - ${total} ETB`}
        </button>
      </form>

      <button type="button" onClick={handleFinish} disabled={items.length === 0}>Finish order</button>
    </section>
  );
}

export default CheckoutPage;
