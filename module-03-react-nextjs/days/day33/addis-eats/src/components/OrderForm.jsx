import React, { useRef, useState, useEffect } from 'react';
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

function OrderForm() {
  const [form, setForm] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const total = useCartStore((state) => state.getTotal());
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const areaInputRef = useRef(null);
  const errors = validate(form);

  const firstErrorField = Object.keys(errors)[0];
  const isFormValid = Object.keys(errors).length === 0;

  useEffect(() => {
    if (!submitError || !firstErrorField) {
      return;
    }

    if (firstErrorField === 'name' && nameInputRef.current) {
      nameInputRef.current.focus();
    }

    if (firstErrorField === 'phone' && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }

    if (firstErrorField === 'area' && areaInputRef.current) {
      areaInputRef.current.focus();
    }
  }, [submitError, firstErrorField]);

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
      setTouched({
        name: true,
        phone: true,
        area: true,
      });
      setSubmitError('Please correct the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    window.setTimeout(() => {
      setIsSubmitting(false);
      setTouched({
        name: true,
        phone: true,
        area: true,
      });
      setSubmitError('TeleBirr payment failed. Please check the phone number and try again.');
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    }, 700);
  }

  return (
    <div>
      <h2>Delivery Details</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="order-name">Full name</label>
        <input
          ref={nameInputRef}
          id="order-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your name"
          aria-invalid={Boolean(touched.name && errors.name)}
          aria-describedby={touched.name && errors.name ? 'order-name-error' : undefined}
        />
        {touched.name && errors.name && (
          <small id="order-name-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {errors.name}
          </small>
        )}

        <label htmlFor="order-phone">TeleBirr phone</label>
        <input
          ref={phoneInputRef}
          id="order-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10-digit phone number"
          aria-invalid={Boolean(touched.phone && errors.phone)}
          aria-describedby={touched.phone && errors.phone ? 'order-phone-error' : undefined}
        />
        {touched.phone && errors.phone && (
          <small id="order-phone-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {errors.phone}
          </small>
        )}

        <label htmlFor="order-area">Delivery area</label>
        <select
          ref={areaInputRef}
          id="order-area"
          name="area"
          value={form.area}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(touched.area && errors.area)}
          aria-describedby={touched.area && errors.area ? 'order-area-error' : undefined}
        >
          {areaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched.area && errors.area && (
          <small id="order-area-error" role="alert" style={{ color: 'red', display: 'block' }}>
            {errors.area}
          </small>
        )}

        <label htmlFor="order-notes">Notes</label>
        <textarea
          id="order-notes"
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

        <button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Submitting...' : `Submit Order - ${total} ETB`}
        </button>
      </form>
    </div>
  );
}

export default OrderForm;