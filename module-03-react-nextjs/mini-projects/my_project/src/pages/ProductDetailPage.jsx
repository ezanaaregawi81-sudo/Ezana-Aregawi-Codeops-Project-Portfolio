import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import StarRating from "../components/StarRating";
import { fetchProductById } from "../lib/api";
import { discountedPrice, formatPrice } from "../lib/format";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useUiStore } from "../store/useUiStore";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const isWished = useWishlistStore((s) => s.isWished(Number(id)));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const openCart = useUiStore((s) => s.openCart);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setActiveImage(0);
    setQuantity(1);
    fetchProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load product");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid animate-pulse grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-slate-200" />
          <div className="space-y-3">
            <div className="h-6 w-1/3 rounded bg-slate-200" />
            <div className="h-8 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-200" />
            <div className="h-24 w-full rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-slate-500">{error ?? "Product not found."}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to shop
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    addItem(product, quantity);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    openCart();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === idx ? "border-violet-500" : "border-slate-200"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-500">
            {product.category}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{product.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Brand: <span className="font-medium text-slate-700">{product.brand ?? "—"}</span>
            {" · "}SKU: <span className="font-medium text-slate-700">{product.sku ?? "N/A"}</span>
          </p>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-slate-400">·</span>
            <span
              className={`text-sm font-medium ${
                outOfStock ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {outOfStock ? "Out of stock" : `${product.stock} in stock`}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(finalPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <Minus size={15} />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 1, q + 1))
                }
                className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500"
            >
              <Heart size={17} className={isWished ? "fill-rose-500 text-rose-500" : ""} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <Truck size={16} className="mt-0.5 shrink-0 text-slate-400" />
              {product.shippingInformation ?? "Ships within 3-5 business days"}
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <RotateCcw size={16} className="mt-0.5 shrink-0 text-slate-400" />
              {product.returnPolicy ?? "30 days return policy"}
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
              {product.warrantyInformation ?? "1 year warranty"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
