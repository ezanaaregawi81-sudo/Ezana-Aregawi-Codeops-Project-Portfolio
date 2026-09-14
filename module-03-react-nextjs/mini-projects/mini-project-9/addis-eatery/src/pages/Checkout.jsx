import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartTotal, useClearCart } from "../store/useCart";
import OrderForm from "../components/OrderForm";
import { validateForm } from "../validate";

const initialForm = { name: "", phone: "", area: "" };

export default function Checkout() {
  const total = useCartTotal();
  const clearCart = useClearCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({ name: false, phone: false, area: false });
  const [errors, setErrors] = useState({ name: "", phone: "", area: "" });

  useEffect(() => {
    setErrors(validateForm(form));
  }, [form]);

  const isFormValid = !errors.name && !errors.phone && !errors.area && form.name.trim() && form.phone.trim() && form.area.trim();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({ ...current, [name]: validateForm(form)[name] }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (total === 0) {
      return;
    }
    if (!isFormValid) {
      setTouched({ name: true, phone: true, area: true });
      setErrors(validateForm(form));
      return;
    }
    clearCart();
    setForm(initialForm);
    setTouched({ name: false, phone: false, area: false });
    setErrors({ name: "", phone: "", area: "" });
    navigate("/receipt", { state: { total, name: form.name } });
  };

  return (
    <section className="page menu">
      <div className="menu-header">
        <h2>Checkout</h2>
        <strong>{total.toFixed(2)} ETB</strong>
      </div>
      {total === 0 ? (
        <p className="empty-state">Your cart is empty. <Link to="/menu">Explore the menu.</Link></p>
      ) : (
        <OrderForm
          form={form}
          onChange={onChange}
          onBlur={onBlur}
          onSubmit={onSubmit}
          isValid={isFormValid}
          errors={errors}
          touched={touched}
        />
      )}
    </section>
  );
}