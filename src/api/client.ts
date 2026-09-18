const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("rumbo_token");
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
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

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.", 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = Array.isArray(body.detail)
      ? body.detail.map((d: { msg?: string }) => d.msg).join(", ")
      : body.detail;
    throw new ApiError(detail || `Error ${response.status}`, response.status);
  }
  return response.json();
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export interface UserOut {
  id: string;
  nombre: string;
  email: string;
  role: string;
  fecha_registro: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  role: "institucion" | "empresa";
  codigo_institucional: string;
}

export interface KpisData {
  resumen: {
    usuarios_activos: number;
    retencion_30_dias_pct: number;
    tasa_abandono_pct: number;
    tiempo_promedio_primera_entrevista_dias: number;
    tiempo_promedio_primer_cliente_dias: number;
  };
  bienestar_antes_despues: { mes: string; antes: number; despues: number }[];
  usuarios_por_ruta: { ruta: string; usuarios: number }[];
  usuarios_activos_por_mes: { mes: string; activos: number }[];
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: RegisterPayload) =>
    request<UserOut>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request<UserOut>("/auth/me"),
  kpis: () => request<KpisData>("/institucion/kpis"),
};
