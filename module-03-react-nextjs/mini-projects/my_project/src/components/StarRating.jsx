import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 14, showValue = true }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <Star
              key={i}
              size={size}
              className={
                filled || half
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-slate-500">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
