import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../lib/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts(100),
          fetchCategories(),
        ]);
        if (cancelled) return;
        setProducts(productsRes.products ?? []);
        setCategories(categoriesRes ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load products");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, categories, isLoading, error };
}
