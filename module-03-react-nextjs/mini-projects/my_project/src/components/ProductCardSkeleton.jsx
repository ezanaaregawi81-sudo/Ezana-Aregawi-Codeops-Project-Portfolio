export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-200" />
      <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-9 w-full animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}
