// Mismo vocabulario fijo que usa el backend (app/services/ai_service.py AREAS_CONOCIDAS
// y app/seed.py PAISES), para que los filtros de area/pais siempre tengan match real.
export const AREAS = ["Administracion", "Diseno grafico", "Marketing digital", "Desarrollo web", "Atencion al cliente"];

export const PAISES = ["Bolivia", "Peru", "Argentina", "Chile", "Colombia"];

export const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Mismo vocabulario que TipoEmpleo/Modalidad en app/schemas.py del backend.
export const TIPOS_EMPLEO = [
  { value: "pasantia", label: "Pasantía" },
  { value: "medio_tiempo", label: "Medio tiempo" },
  { value: "tiempo_completo", label: "Tiempo completo" },
  { value: "freelance", label: "Freelance / por proyecto" },
  { value: "temporal", label: "Temporal" },
] as const;

export const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
] as const;

export function labelTipoEmpleo(value: string | null): string {
  return TIPOS_EMPLEO.find((t) => t.value === value)?.label ?? "No especificado";
}

export function labelModalidad(value: string | null): string {
  return MODALIDADES.find((m) => m.value === value)?.label ?? "No especificada";
}
