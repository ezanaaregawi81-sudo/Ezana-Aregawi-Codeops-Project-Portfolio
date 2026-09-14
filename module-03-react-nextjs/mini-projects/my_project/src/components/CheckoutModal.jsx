import { useMemo, useState } from "react";
import { Check, CreditCard, MapPin, PartyPopper, Wand2, X } from "lucide-react";
import { useUiStore } from "../store/useUiStore";
import { useCartStore } from "../store/useCartStore";
import { discountedPrice, estimateDeliveryDate, formatPrice, generateOrderId } from "../lib/format";

const TAX_RATE = 0.08;
const STEPS = ["Shipping", "Payment", "Confirmation"];

const MOCK_SHIPPING = {
  fullName: "Jordan Alemu",
  address: "123 Bole Road",
  city: "Addis Ababa",
  postalCode: "1000",
};

const MOCK_PAYMENT = {
  cardNumber: "4242 4242 4242 4242",
  expiry: "12/28",
  cvc: "123",
};

export default function CheckoutModal() {
  const isOpen = useUiStore((s) => s.isCheckoutOpen);
  const closeCheckout = useUiStore((s) => s.closeCheckout);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  const totals = useMemo(() => {
    const discountedTotal = items.reduce(
      (sum, i) => sum + discountedPrice(i.price, i.discountPercentage) * i.quantity,
      0
    );
    const tax = discountedTotal * TAX_RATE;
    return { discountedTotal, tax, grandTotal: discountedTotal + tax };
  }, [items]);

  if (!isOpen) return null;

  function resetAndClose() {
    setStep(0);
    setShipping({ fullName: "", address: "", city: "", postalCode: "" });
    setPayment({ cardNumber: "", expiry: "", cvc: "" });
    setErrors({});
    setOrder(null);
    closeCheckout();
  }

  function validateShipping() {
    const next = {};
    if (!shipping.fullName.trim()) next.fullName = "Full name is required";
    if (!shipping.address.trim()) next.address = "Address is required";
    if (!shipping.city.trim()) next.city = "City is required";
    if (!/^\d{4,10}$/.test(shipping.postalCode.trim()))
      next.postalCode = "Enter a valid postal code";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validatePayment() {
    const next = {};
    if (!/^[\d\s]{13,19}$/.test(payment.cardNumber.trim()))
      next.cardNumber = "Enter a valid card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry.trim()))
      next.expiry = "Format: MM/YY";
    if (!/^\d{3,4}$/.test(payment.cvc.trim())) next.cvc = "Enter a valid CVC";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (step === 0 && validateShipping()) setStep(1);
    else if (step === 1 && validatePayment()) {
      setOrder({
        id: generateOrderId(),
        delivery: estimateDeliveryDate(5),
        items: [...items],
        total: totals.grandTotal,
      });
      clearCart();
      setStep(2);
    }
  }

  function handleFinish() {
    resetAndClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={step === 2 ? undefined : resetAndClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Checkout</h2>
          {step !== 2 && (
            <button
              onClick={resetAndClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {step !== 2 && (
          <div className="flex items-center gap-2 px-6 pt-4">
            {STEPS.map((label, idx) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    idx < step
                      ? "bg-emerald-500 text-white"
                      : idx === step
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {idx < step ? <Check size={13} /> : idx + 1}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    idx <= step ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
                {idx < STEPS.length - 1 && <div className="h-px flex-1 bg-slate-100" />}
              </div>
            ))}
          </div>
        )}

        <div className="overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin size={16} />
                Shipping Details
              </div>
              <Field
                label="Full Name"
                value={shipping.fullName}
                error={errors.fullName}
                onChange={(v) => setShipping((s) => ({ ...s, fullName: v }))}
              />
              <Field
                label="Address"
                value={shipping.address}
                error={errors.address}
                onChange={(v) => setShipping((s) => ({ ...s, address: v }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="City"
                  value={shipping.city}
                  error={errors.city}
                  onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
                />
                <Field
                  label="Postal Code"
                  value={shipping.postalCode}
                  error={errors.postalCode}
                  onChange={(v) => setShipping((s) => ({ ...s, postalCode: v }))}
                />
              </div>
              <button
                onClick={() => setShipping(MOCK_SHIPPING)}
                className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                <Wand2 size={13} />
                Autofill with sample address
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CreditCard size={16} />
                Payment Details
              </div>
              <Field
                label="Card Number"
                value={payment.cardNumber}
                error={errors.cardNumber}
                placeholder="4242 4242 4242 4242"
                onChange={(v) => setPayment((s) => ({ ...s, cardNumber: v }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Expiry (MM/YY)"
                  value={payment.expiry}
                  error={errors.expiry}
                  placeholder="12/28"
                  onChange={(v) => setPayment((s) => ({ ...s, expiry: v }))}
                />
                <Field
                  label="CVC"
                  value={payment.cvc}
                  error={errors.cvc}
                  placeholder="123"
                  onChange={(v) => setPayment((s) => ({ ...s, cvc: v }))}
                />
              </div>
              <button
                onClick={() => setPayment(MOCK_PAYMENT)}
                className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                <Wand2 size={13} />
                Autofill with mock card
              </button>

              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.discountedTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && order && (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <PartyPopper size={28} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Order Confirmed!</h3>
              <p className="mt-1 text-sm text-slate-500">
                Order ID <span className="font-semibold text-slate-700">{order.id}</span>
              </p>
              <p className="text-sm text-slate-500">
                Estimated delivery: <span className="font-semibold text-slate-700">{order.delivery}</span>
              </p>

              <ul className="mt-5 w-full space-y-2 rounded-xl border border-slate-100 p-3 text-left">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="line-clamp-1 text-slate-600">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(discountedPrice(item.price, item.discountPercentage) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex w-full justify-between text-base font-bold text-slate-900">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          {step < 2 ? (
            <div className="flex gap-3">
              {step === 1 && (
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-violet-600"
              >
                {step === 0 ? "Continue to Payment" : "Place Order"}
              </button>
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-violet-600"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, error, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-rose-300 focus:ring-rose-100"
            : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
        }`}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
