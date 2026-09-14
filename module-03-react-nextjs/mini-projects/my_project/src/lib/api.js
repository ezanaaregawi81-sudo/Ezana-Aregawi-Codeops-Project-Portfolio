const BASE = "https://dummyjson.com";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function fetchProducts(limit = 100) {
  return get(`${BASE}/products?limit=${limit}`);
}

export function searchProducts(query) {
  return get(`${BASE}/products/search?q=${encodeURIComponent(query)}`);
}

export function fetchProductsByCategory(category) {
  return get(`${BASE}/products/category/${encodeURIComponent(category)}`);
}

export function fetchCategories() {
  return get(`${BASE}/products/categories`);
}

export function fetchProductById(id) {
  return get(`${BASE}/products/${id}`);
}
