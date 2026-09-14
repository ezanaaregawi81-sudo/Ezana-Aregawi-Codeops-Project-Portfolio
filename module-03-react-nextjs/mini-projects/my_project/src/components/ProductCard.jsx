import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { discountedPrice, formatPrice } from "../lib/format";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const isWished = useWishlistStore((s) => s.isWished(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"
      >
        <Heart
          size={16}
          className={isWished ? "fill-rose-500 text-rose-500" : "text-slate-400"}
        />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Out of stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 flex-1">
        <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-500">
          {product.brand || product.category}
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-slate-800 hover:text-violet-600">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1.5">
          <StarRating rating={product.rating} />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-slate-900">
            {formatPrice(finalPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <p
          className={`mt-1 text-xs font-medium ${
            outOfStock
              ? "text-rose-500"
              : product.stock < 10
              ? "text-amber-500"
              : "text-emerald-600"
          }`}
        >
          {outOfStock
            ? "Out of stock"
            : product.stock < 10
            ? `Only ${product.stock} left`
            : "In stock"}
        </p>
      </div>

      <button
        onClick={() => addItem(product, 1)}
        disabled={outOfStock}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <ShoppingCart size={15} />
        Add to Cart
      </button>
    </div>
  );
}
