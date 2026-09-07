import React, { useReducer } from 'react';

/**
 * EXERCISE 4 COMPARISON & EXPLANATION:
 * 
 * VERSION 1 (Previous useState implementation):
 * --------------------------------------------
 * const [name, setName] = useState('');
 * const [phone, setPhone] = useState('');
 * const [area, setArea] = useState('Ayat');
 * 
 * Or object state:
 * const [form, setForm] = useState({ name: '', phone: '', area: 'Ayat' });
 * 
 * Issues with separate useState calls / object useState for complex form state:
 * 1. Scatter: Form update logic is scattered across multiple state setters or manual spread operators (`...form`).
 * 2. Risk of stale state: Spreading previous state manually (`setForm({...form, [name]: value})`) can lead to race conditions if updates happen rapidly.
 * 3. Validation coupling: Resetting or resetting validation state across 3 fields requires multiple state calls.
 * 
 * VERSION 2 (Current useReducer implementation):
 * ----------------------------------------------
 * With `useReducer`, all state transitions for related inputs are centralized in a single pure function (`formReducer`).
 * Benefits:
 * 1. Single source of truth for input state mutations.
 * 2. Easier testing: `formReducer` can be unit tested without mounting React components.
 * 3. Clear action intentions (e.g. 'UPDATE_FIELD', 'RESET_FORM') rather than imperatively setting raw values.
 */

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
  // Converted 3 related useState calls (name, phone, area) to useReducer
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
      <h2>Delivery Details (Managed via useReducer)</h2>
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