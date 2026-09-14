import { RotateCcw } from "lucide-react";
import StarRating from "./StarRating";

export default function FilterSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  priceBounds,
  priceRange,
  onPriceChange,
  minRating,
  onMinRatingChange,
  onReset,
}) {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Filters
        </h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Category
        </h3>
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const value = typeof cat === "string" ? cat : cat.slug;
            const label = typeof cat === "string" ? cat : cat.name;
            return (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 text-sm capitalize text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(value)}
                  onChange={() => onToggleCategory(value)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Price Range
        </h3>
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="mt-2 w-full accent-violet-600"
        />
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={priceRange[0]}
          onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
          className="mt-1 w-full accent-slate-400"
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Minimum Rating
        </h3>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1, 0].map((r) => (
            <button
              key={r}
              onClick={() => onMinRatingChange(r)}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                minRating === r
                  ? "bg-violet-50 ring-1 ring-violet-200"
                  : "hover:bg-slate-50"
              }`}
            >
              {r === 0 ? (
                <span className="text-slate-500">Any rating</span>
              ) : (
                <>
                  <StarRating rating={r} showValue={false} />
                  <span className="text-slate-500">& up</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
