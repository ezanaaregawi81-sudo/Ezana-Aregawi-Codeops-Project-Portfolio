import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import CheckoutModal from "./components/CheckoutModal";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { useProducts } from "./hooks/useProducts";

export default function App() {
  const { products, categories, isLoading, error } = useProducts();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header categories={categories} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <CatalogPage
                products={products}
                categories={categories}
                isLoading={isLoading}
                error={error}
              />
            }
          />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        AuraMarket — demo storefront powered by DummyJSON.
      </footer>

      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
    </div>
  );
}
