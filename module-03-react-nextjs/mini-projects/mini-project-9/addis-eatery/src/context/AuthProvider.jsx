import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";

const STORAGE_KEY = "addis-eatery-signed-in";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkSession = window.setTimeout(() => {
      setIsSignedIn(localStorage.getItem(STORAGE_KEY) === "true");
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(checkSession);
  }, []);

  const value = useMemo(
    () => ({
      loading,
      isSignedIn,
      signIn: () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setIsSignedIn(true);
      },
      signOut: () => {
        localStorage.removeItem(STORAGE_KEY);
        setIsSignedIn(false);
      },
    }),
    [loading, isSignedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
