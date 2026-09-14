import { SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "discount-desc", label: "Discount % High to Low" },
];

export default function SortToolbar({ sortBy, onSortChange, resultCount, onOpenFilters }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 lg:hidden"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{resultCount}</span> products found
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-500">
        Sort by
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-violet-400"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
