import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useMemo } from "react";
import { useCartStore } from "../store/useCartStore";
import { useUiStore } from "../store/useUiStore";
import { discountedPrice, formatPrice } from "../lib/format";
import EmptyState from "./EmptyState";

const TAX_RATE = 0.08;

export default function CartDrawer() {
  const isOpen = useUiStore((s) => s.isCartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const openCheckout = useUiStore((s) => s.openCheckout);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const totals = useMemo(() => {
    const originalTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountedTotal = items.reduce(
      (sum, i) => sum + discountedPrice(i.price, i.discountPercentage) * i.quantity,
      0
    );
    const savings = originalTotal - discountedTotal;
    const tax = discountedTotal * TAX_RATE;
    const grandTotal = discountedTotal + tax;
    return { originalTotal, discountedTotal, savings, tax, grandTotal };
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={closeCart} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ShoppingBag size={18} />
            Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse the catalog and add products you love."
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-16 w-16 shrink-0 rounded-lg border border-slate-100 object-cover"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.brand}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-slate-500 hover:text-slate-800"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-slate-500 hover:text-slate-800"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(
                          discountedPrice(item.price, item.discountPercentage) * item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="h-fit text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Original total</span>
                <span>{formatPrice(totals.originalTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Savings</span>
                <span>-{formatPrice(totals.savings)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8%)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                <span>Grand total</span>
                <span>{formatPrice(totals.grandTotal)}</span>
              </div>
            </div>
            <button
              onClick={openCheckout}
              className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
