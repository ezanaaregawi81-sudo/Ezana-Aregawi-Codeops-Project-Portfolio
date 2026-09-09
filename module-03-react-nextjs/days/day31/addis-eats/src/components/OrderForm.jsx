import React, { useReducer } from 'react';


const initialFormState = {
  name: '',
  phone: '',
  area: 'Ayat',
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
}

function OrderForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_FIELD',
      field: name,
      value: value,
    });
  }

  const isValidPhone = /^\d{10}$/.test(state.phone);
  const isSubmitDisabled = !state.name || !isValidPhone;

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Delivery on the way for ${state.name} to ${state.area}! (Phone: ${state.phone})`);
    dispatch({ type: 'RESET_FORM' });
  }

  return (
    <div>
      <h2>Delivery Details</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="order-name">Full-name: </label>
        <input
          id="order-name"
          name="name"
          type="text"
          value={state.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <br />
        <label htmlFor="order-phone">Phone: </label>
        <input
          id="order-phone"
          name="phone"
          type="text"
          value={state.phone}
          onChange={handleChange}
          placeholder="10-digit Phone Number"
          required
        />
        {state.phone && !isValidPhone && (
          <small style={{ color: 'red', display: 'block' }}>Phone must be 10 digits</small>
        )}
        <br />
        <label htmlFor="order-area">Delivery Area: </label>
        <select
          id="order-area"
          name="area"
          value={state.area}
          onChange={handleChange}
        >
          <option value="Ayat">Ayat</option>
          <option value="Summit">Summit</option>
          <option value="Gerji">Gerji</option>
          <option value="Bole">Bole</option>
        </select>
        <br />
        <button type="submit" disabled={isSubmitDisabled}>
          Submit Order
        </button>
      </form>
    </div>
  );
}

export default OrderForm;