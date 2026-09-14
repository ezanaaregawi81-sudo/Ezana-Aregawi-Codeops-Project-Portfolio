import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RequireAuth() {
  const location = useLocation();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
