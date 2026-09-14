import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import FilterSidebar from "../components/FilterSidebar";
import SortToolbar from "../components/SortToolbar";
import EmptyState from "../components/EmptyState";
import { discountedPrice } from "../lib/format";

export default function CatalogPage({ products, categories, isLoading, error }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const urlCategory = searchParams.get("category") ?? "";

  const priceBounds = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map((p) => Math.round(discountedPrice(p.price, p.discountPercentage)));
    return [0, Math.max(...prices, 100)];
  }, [products]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(priceBounds);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setPriceRange(priceBounds);
  }, [priceBounds]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
  }, [urlCategory]);

  function toggleCategory(value) {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function resetFilters() {
    setSelectedCategories([]);
    setPriceRange(priceBounds);
    setMinRating(0);
  }

  const filteredProducts = useMemo(() => {
    let result = products;

    if (query) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter((p) => {
      const price = discountedPrice(p.price, p.discountPercentage);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    const sorted = [...result];
    switch (sortBy) {
      case "price-asc":
        sorted.sort(
          (a, b) =>
            discountedPrice(a.price, a.discountPercentage) -
            discountedPrice(b.price, b.discountPercentage)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) =>
            discountedPrice(b.price, b.discountPercentage) -
            discountedPrice(a.price, a.discountPercentage)
        );
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "discount-desc":
        sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        break;
    }

    return sorted;
  }, [products, query, selectedCategories, priceRange, minRating, sortBy]);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={PackageSearch}
          title="Something went wrong"
          description={error}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {query && (
        <p className="mb-4 text-sm text-slate-500">
          Search results for <span className="font-semibold text-slate-800">"{query}"</span>
        </p>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden lg:block">
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            priceBounds={priceBounds}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            onReset={resetFilters}
          />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative ml-auto h-full w-80 max-w-[85vw] overflow-y-auto bg-slate-50 p-4 animate-slide-in-right">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mb-3 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <X size={16} />
              </button>
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                priceBounds={priceBounds}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                onReset={resetFilters}
              />
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-4">
            <SortToolbar
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filteredProducts.length}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products match your search/filter parameters"
              description="Try adjusting or resetting your filters to see more results."
            />
          ) : (
            <div className="grid animate-fade-in grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
