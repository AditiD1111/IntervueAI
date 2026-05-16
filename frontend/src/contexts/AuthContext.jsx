import { createContext, useContext, useState } from "react";
import { apiRequest } from "../lib/api";

const AUTH_STORAGE_KEY = "intervueai.auth";
const AuthContext = createContext(null);

const readStoredAuth = () => {
  if (typeof window === "undefined") {
    return { token: "", user: null };
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return { token: "", user: null };
    }

    const parsedValue = JSON.parse(storedValue);

    return {
      token: parsedValue?.token || "",
      user: parsedValue?.user || null,
    };
  } catch {
    return { token: "", user: null };
  }
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(readStoredAuth);

  const persistAuth = (nextAuthState) => {
    setAuthState(nextAuthState);

    if (typeof window === "undefined") {
      return;
    }

    if (!nextAuthState?.token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthState));
  };

  const setSession = ({ token, user }) => {
    persistAuth({
      token,
      user,
    });
  };

  const logout = () => {
    persistAuth({
      token: "",
      user: null,
    });
  };

  const refreshUser = async () => {
    if (!authState.token) {
      return null;
    }

    try {
      const response = await apiRequest("/api/auth/me", {
        token: authState.token,
      });

      setSession({
        token: authState.token,
        user: response.user,
      });

      return response.user;
    } catch {
      logout();
      return null;
    }
  };

  const value = {
    token: authState.token,
    user: authState.user,
    isAuthenticated: Boolean(authState.token && authState.user),
    setSession,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
