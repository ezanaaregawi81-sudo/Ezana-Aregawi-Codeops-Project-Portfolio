import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { useUiStore } from "../store/useUiStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { discountedPrice, formatPrice } from "../lib/format";
import EmptyState from "./EmptyState";

export default function WishlistDrawer() {
  const isOpen = useUiStore((s) => s.isWishlistOpen);
  const closeWishlist = useUiStore((s) => s.closeWishlist);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  if (!isOpen) return null;

  function moveToCart(item) {
    addItem(item, 1);
    remove(item.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={closeWishlist} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Heart size={18} />
            Wishlist ({items.length})
          </h2>
          <button
            onClick={closeWishlist}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Tap the heart icon on any product to save it here."
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
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatPrice(discountedPrice(item.price, item.discountPercentage))}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => moveToCart(item)}
                        className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-600"
                      >
                        <ShoppingCart size={12} />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:border-rose-300 hover:text-rose-500"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
