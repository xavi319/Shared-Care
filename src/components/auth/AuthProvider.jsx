import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "sharedcare-auth-session";
const VALID_ID = "sarah@sharedcare.com";
const VALID_PASSWORD = "Sarah123";

const AuthContext = createContext(null);

function getStoredAuthState() {
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredAuthState());

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  function login(userId, password) {
    const normalizedUserId = userId.trim().toLowerCase();

    if (normalizedUserId === VALID_ID && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid ID or password"
    };
  }

  function logout() {
    setIsAuthenticated(false);
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
