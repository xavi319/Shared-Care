import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth, isFirebaseConfigured } from "../../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
  }, []);

  async function login(userId, password) {
    if (!isFirebaseConfigured || !auth) {
      return {
        success: false,
        message: "Firebase is not configured yet. Add your Firebase values to .env.local and restart the dev server."
      };
    }

    const normalizedUserId = userId.trim().toLowerCase();

    try {
      await signInWithEmailAndPassword(auth, normalizedUserId, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getAuthErrorMessage(error)
      };
    }
  }

  async function logout() {
    if (auth) {
      await signOut(auth);
    }
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isFirebaseConfigured,
      isLoading,
      login,
      logout
    }),
    [currentUser, isLoading]
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

function getAuthErrorMessage(error) {
  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid ID or password";
    case "auth/too-many-requests":
      return "Too many login attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Could not reach Firebase. Check your connection and try again.";
    default:
      return "Unable to sign in. Please try again.";
  }
}
