import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Cart from "./pages/Cart";
import DishDetail from "./pages/DishDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import NotFound from "./pages/NotFound";
import {
  RouteErrorBoundary,
  RouteLoadingFallback,
  RouteErrorFallback,
} from "./components/RouteErrorBoundary";
import "./App.css";

const Checkout = lazy(() => import("./pages/Checkout"));
const Receipt = lazy(() => import("./pages/Receipt"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="menu"
                element={
                  <RouteErrorBoundary
                    title="Menu unavailable"
                    message="The menu failed to load, but the rest of the app is still available."
                    fallback={
                      <RouteErrorFallback
                        title="Menu unavailable"
                        message="The menu failed to load, but the rest of the app is still available."
                      />
                    }
                  >
                    <Menu />
                  </RouteErrorBoundary>
                }
              />
              <Route path="menu/:id" element={<DishDetail />} />
              <Route
                path="cart"
                element={
                  <RouteErrorBoundary
                    title="Cart unavailable"
                    message="The cart failed to load, but the menu and checkout are still available."
                  >
                    <Cart />
                  </RouteErrorBoundary>
                }
              />
              <Route path="login" element={<Login />} />
              <Route
                path="checkout"
                element={
                  <RequireAuth>
                    <Suspense fallback={<RouteLoadingFallback label="Loading checkout..." />}>
                      <RouteErrorBoundary
                        title="Checkout failed to load"
                        message="Something went wrong while loading checkout."
                      >
                        <Checkout />
                      </RouteErrorBoundary>
                    </Suspense>
                  </RequireAuth>
                }
              />
              <Route
                path="receipt"
                element={
                  <Suspense fallback={<RouteLoadingFallback label="Loading receipt..." />}>
                    <RouteErrorBoundary
                      title="Receipt failed to load"
                      message="The receipt could not be displayed right now."
                    >
                      <Receipt />
                    </RouteErrorBoundary>
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
