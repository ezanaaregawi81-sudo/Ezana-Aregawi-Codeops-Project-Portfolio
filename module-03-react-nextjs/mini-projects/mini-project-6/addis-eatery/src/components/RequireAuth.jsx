import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [auth, setAuth] = useState({ loading: true, isSignedIn: false });

  useEffect(() => {
    const checkSession = window.setTimeout(() => {
      setAuth({ loading: false, isSignedIn: localStorage.getItem("addis-eatery-signed-in") === "true" });
    }, 0);
    return () => window.clearTimeout(checkSession);
  }, []);

  if (auth.loading) return <p className="loading-state">Checking your sign-in...</p>;

  if (!auth.isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}