import { createContext, ReactNode, useContext, useState } from "react";

interface AuthState {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("rumbo_token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("rumbo_role"));

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
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
