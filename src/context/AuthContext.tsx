import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { api, UserOut } from "../api/client";

interface AuthState {
  token: string | null;
  role: string | null;
  user: UserOut | null;
  loadingUser: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("rumbo_token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("rumbo_role"));
  const [user, setUser] = useState<UserOut | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    setLoadingUser(true);
    api
      .me()
      .then(setUser)
      .catch(() => {
        // Token invalido o vencido: se limpia la sesion.
        logout();
      })
      .finally(() => setLoadingUser(false));
  }, [token]);

  function login(newToken: string, newRole: string) {
    localStorage.setItem("rumbo_token", newToken);
    localStorage.setItem("rumbo_role", newRole);
    setToken(newToken);
    setRole(newRole);
  }

  function logout() {
    localStorage.removeItem("rumbo_token");
    localStorage.removeItem("rumbo_role");
    setToken(null);
    setRole(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, role, user, loadingUser, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
