export default function OrderForm({ form, onChange, onSubmit, isValid }) {
  return (
    <form className="order-form" onSubmit={onSubmit}>
      <h3>Delivery Details</h3>

      <label>
        Full Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Your name"
          required
        />
      </label>

      <label>
        Telebirr Number
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="09xxxxxxxx"
          required
        />
        {form.phone && !isValid && (
          <span className="error">Enter a valid Telebirr number (09xxxxxxxx)</span>
        )}
      </label>

      <label>
        Area / Location
        <input
          type="text"
          name="area"
          value={form.area}
          onChange={onChange}
          placeholder="e.g. Bole, Piassa..."
          required
        />
      </label>

      <button type="submit" disabled={!isValid}>
        Place Order
      </button>
    </form>
  );
}