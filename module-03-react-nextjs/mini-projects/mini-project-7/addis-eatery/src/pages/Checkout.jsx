import { useState } from "react";
import { useCartTotal, useClearCart } from "../store/useCart";
import OrderForm from "../components/OrderForm";

function isValidTelebirr(phone) { return /^09\d{8}$/.test(phone.trim()); }

export default function Checkout() {
  const total = useCartTotal();
  const clearCart = useClearCart();
  const [form, setForm] = useState({ name: "", phone: "", area: "" });
  const phoneIsValid = isValidTelebirr(form.phone);
  const isFormValid = phoneIsValid && form.name.trim() && form.area.trim();
  const onChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) return;
    alert(`Order placed!\nTotal: ${total.toFixed(2)} ETB\nName: ${form.name}`);
    clearCart();
    setForm({ name: "", phone: "", area: "" });
  };

  return <section className="page menu"><div className="menu-header"><h2>Checkout</h2><strong>{total.toFixed(2)} ETB</strong></div><OrderForm form={form} onChange={onChange} onSubmit={onSubmit} isValid={isFormValid} /></section>;
}