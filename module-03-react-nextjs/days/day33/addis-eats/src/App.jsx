import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import RouteSkeleton from './components/RouteSkeleton';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DishPage from './pages/DishPage';
import SignInPage from './pages/SignInPage';
import NotFound from './components/NotFound';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ReceiptPage = lazy(() => import('./pages/ReceiptPage'));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="menu/:id" element={<DishPage />} />
                <Route path="signin" element={<SignInPage />} />
                <Route element={<RequireAuth />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="receipt" element={<ReceiptPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
