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
  if (response.status === 204) {
    return undefined as T;
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
}

export interface KpisData {
  resumen: {
    usuarios_activos: number;
    retencion_30_dias_pct: number | null;
    tasa_abandono_pct: number | null;
    tiempo_promedio_primera_entrevista_dias: number | null;
    tiempo_promedio_primera_practica_freelance_dias: number | null;
  };
  bienestar_antes_despues: { mes: string; antes: number; despues: number }[];
  usuarios_por_ruta: { ruta: string; usuarios: number }[];
  usuarios_activos_por_mes: { mes: string; activos: number }[];
}

export type TipoEmpleo = "pasantia" | "medio_tiempo" | "tiempo_completo" | "freelance" | "temporal";
export type Modalidad = "presencial" | "remoto" | "hibrido";

export interface VacanteIn {
  titulo: string;
  area: string;
  pais: string;
  descripcion: string;
  tipo_empleo: TipoEmpleo;
  modalidad: Modalidad;
  ciudad?: string;
  salario?: string;
}

export interface VacanteOut {
  id: string;
  titulo: string;
  area: string;
  pais: string;
  descripcion: string | null;
  tipo_empleo: string | null;
  modalidad: string | null;
  ciudad: string | null;
  salario: string | null;
  fecha_publicacion: string;
  activa: boolean;
  total_postulaciones: number;
}

export interface VacanteUpdate {
  titulo?: string;
  area?: string;
  pais?: string;
  descripcion?: string;
  tipo_empleo?: TipoEmpleo;
  modalidad?: Modalidad;
  ciudad?: string;
  salario?: string;
  activa?: boolean;
}

export interface ExperienciaOut {
  id: string;
  puesto: string;
  empresa: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  referencia: string | null;
}

export interface PostulanteOut {
  postulacion_id: string;
  joven_id: string;
  nombre: string;
  email: string;
  fecha_postulacion: string;
  sector_interes: string | null;
  nivel_experiencia: string | null;
  ruta_preferida: string | null;
  ciudad: string | null;
  experiencia: ExperienciaOut[];
}

export interface DemandaMes {
  mes: number;
  area: string;
  pais: string;
  total_postulaciones: number;
}

export interface PrediccionDemanda {
  area: string;
  pais: string;
  prediccion_por_mes: { mes: number; postulaciones_esperadas: number }[];
  mes_recomendado: number;
  mensaje: string;
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
  misVacantes: () => request<VacanteOut[]>("/vacantes/mias"),
  crearVacante: (payload: VacanteIn) =>
    request<VacanteOut>("/vacantes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  editarVacante: (id: string, payload: VacanteUpdate) =>
    request<VacanteOut>(`/vacantes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  eliminarVacante: (id: string) => request<void>(`/vacantes/${id}`, { method: "DELETE" }),
  postulantesVacante: (id: string) => request<PostulanteOut[]>(`/vacantes/${id}/postulantes`),
  demandaHistorica: (area: string, pais: string) =>
    request<DemandaMes[]>(`/institucion/demanda-historica?area=${encodeURIComponent(area)}&pais=${encodeURIComponent(pais)}`),
  prediccionDemanda: (area: string, pais: string) =>
    request<PrediccionDemanda>(`/institucion/prediccion-demanda?area=${encodeURIComponent(area)}&pais=${encodeURIComponent(pais)}`),
  consultarAsistente: (pregunta: string) =>
    request<{ respuesta: string }>("/institucion/asistente", {
      method: "POST",
      body: JSON.stringify({ pregunta }),
    }),
};
