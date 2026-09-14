import { Heart, Search, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useUiStore } from "../store/useUiStore";
import { useDebounce } from "../hooks/useDebounce";

export default function Header({ categories = [] }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 350);

  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useUiStore((s) => s.openCart);
  const openWishlist = useUiStore((s) => s.openWishlist);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedQuery === current) return;

    navigate("/");
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function handleCategoryChange(e) {
    const value = e.target.value;
    navigate("/");
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    setSearchParams(params, { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-sm">
            <Sparkles size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight">AuraMarket</span>
        </Link>

        <div className="order-3 flex w-full items-center gap-2 sm:order-2 sm:w-auto sm:flex-1">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <select
            defaultValue={searchParams.get("category") ?? ""}
            onChange={handleCategoryChange}
            className="hidden max-w-[10rem] shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm capitalize text-slate-600 outline-none focus:border-violet-400 sm:block"
          >
            <option value="">All categories</option>
            {categories.map((cat) => {
              const value = typeof cat === "string" ? cat : cat.slug;
              const label = typeof cat === "string" ? cat : cat.name;
              return (
                <option key={value} value={value} className="capitalize">
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3">
          <button
            onClick={openWishlist}
            aria-label="Open wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
