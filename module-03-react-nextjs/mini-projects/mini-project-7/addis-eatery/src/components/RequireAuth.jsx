import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const { loading, isSignedIn } = useAuth();

  if (loading) return <p className="loading-state">Checking your sign-in...</p>;

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}