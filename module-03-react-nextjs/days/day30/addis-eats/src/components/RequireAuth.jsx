import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RequireAuth() {
  const location = useLocation();
  const isSignedIn = localStorage.getItem('addis-eats-user') === 'signed-in';

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
