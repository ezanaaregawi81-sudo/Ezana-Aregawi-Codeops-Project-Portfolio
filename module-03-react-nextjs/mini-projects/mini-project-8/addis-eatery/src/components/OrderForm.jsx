import Field from "./Field";

export default function OrderForm({ form, onChange, onBlur, onSubmit, isValid, errors, touched }) {
  return (
    <form className="order-form" onSubmit={onSubmit} noValidate>
      <h3>Delivery Details</h3>

      <Field
        label="Full Name"
        name="name"
        value={form.name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Your name"
        error={touched.name ? errors.name : ""}
        autoComplete="name"
      />

      <Field
        label="Telebirr Number"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="09xxxxxxxx"
        error={touched.phone ? errors.phone : ""}
        autoComplete="tel"
      />

      <Field
        label="Area / Location"
        name="area"
        value={form.area}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="e.g. Bole, Piassa..."
        error={touched.area ? errors.area : ""}
        autoComplete="street-address"
      />

      <button type="submit" disabled={!isValid}>
        Place Order
      </button>
    </form>
  );
}
