const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("rumbo_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Error ${response.status}`);
  }
  return response.json();
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  kpis: () => request<unknown>("/institucion/kpis"),
};
