import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return localStorage.getItem('addis-eats-user') === 'signed-in';
  });

  const signIn = () => {
    setIsSignedIn(true);
  };

  const signOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem('addis-eats-user');
  };

  const value = useMemo(() => ({
    isSignedIn,
    signIn,
    signOut,
  }), [isSignedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
