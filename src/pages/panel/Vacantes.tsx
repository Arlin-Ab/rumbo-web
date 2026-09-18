import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  FileText,
  Globe2,
  Info,
  Laptop,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { api, ApiError, Modalidad, PostulanteOut, TipoEmpleo, VacanteOut } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { AREAS, labelModalidad, labelTipoEmpleo, MODALIDADES, PAISES, TIPOS_EMPLEO } from "../../constants";

export default function Vacantes() {
  const { role } = useAuth();

  if (role !== "empresa" && role !== "institucion") {
    return (
      <div>
        <h1>Vacantes</h1>
        <div className="form-alert" role="alert" style={{ maxWidth: 480 }}>
          <Info size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>La gestión de vacantes está disponible solo para cuentas de empresa o institución.</span>
        </div>
      </div>
    );
  }

  return <VacantesPublicador />;
}

function VacantesPublicador() {
  const [vacantes, setVacantes] = useState<VacanteOut[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [pais, setPais] = useState(PAISES[0]);
  const [descripcion, setDescripcion] = useState("");
  const [tipoEmpleo, setTipoEmpleo] = useState<TipoEmpleo>(TIPOS_EMPLEO[0].value);
  const [modalidad, setModalidad] = useState<Modalidad>(MODALIDADES[0].value);
  const [ciudad, setCiudad] = useState("");
  const [salario, setSalario] = useState("");
  const [creando, setCreando] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [confirmandoEliminarId, setConfirmandoEliminarId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [postulantesAbiertoId, setPostulantesAbiertoId] = useState<string | null>(null);
  const [postulantes, setPostulantes] = useState<Record<string, PostulanteOut[]>>({});
  const [postulantesLoading, setPostulantesLoading] = useState<string | null>(null);
  const [postulantesError, setPostulantesError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .misVacantes()
      .then(setVacantes)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Error al cargar las vacantes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreando(true);
    try {
      await api.crearVacante({
        titulo,
        area,
        pais,
        descripcion,
        tipo_empleo: tipoEmpleo,
        modalidad,
        ciudad: ciudad || undefined,
        salario: salario || undefined,
      });
      setTitulo("");
      setDescripcion("");
      setCiudad("");
      setSalario("");
      load();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "No se pudo crear la vacante");
    } finally {
      setCreando(false);
    }
  }

  function handleVacanteActualizada(actualizada: VacanteOut) {
    setVacantes((prev) => (prev ? prev.map((v) => (v.id === actualizada.id ? actualizada : v)) : prev));
    setEditingId(null);
  }

  async function handleEliminar(id: string) {
    setDeleteError(null);
    setEliminandoId(id);
    try {
      await api.eliminarVacante(id);
      setVacantes((prev) => (prev ? prev.filter((v) => v.id !== id) : prev));
      setConfirmandoEliminarId(null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo eliminar la vacante");
    } finally {
      setEliminandoId(null);
    }
  }

  async function togglePostulantes(id: string) {
    if (postulantesAbiertoId === id) {
      setPostulantesAbiertoId(null);
      return;
    }
    setPostulantesAbiertoId(id);
    if (postulantes[id]) return;

    setPostulantesLoading(id);
    setPostulantesError(null);
    try {
      const data = await api.postulantesVacante(id);
      setPostulantes((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      setPostulantesError(err instanceof ApiError ? err.message : "No se pudieron cargar los postulantes");
    } finally {
      setPostulantesLoading(null);
    }
  }

  return (
    <div>
      <h1>Vacantes</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Publicá vacantes y seguí la cantidad de postulantes en tiempo real.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }} noValidate>
        {createError && (
          <div className="form-alert" role="alert">
            <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{createError}</span>
          </div>
        )}

        <div className="field">
          <label className="label" htmlFor="vacante-titulo">
            Título
          </label>
          <input
            id="vacante-titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input"
            placeholder="Desarrollador/a junior"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <div className="field">
            <label className="label" htmlFor="vacante-area">
              Área
            </label>
            <select id="vacante-area" className="select" value={area} onChange={(e) => setArea(e.target.value)}>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="vacante-pais">
              País
            </label>
            <select id="vacante-pais" className="select" value={pais} onChange={(e) => setPais(e.target.value)}>
              {PAISES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="vacante-ciudad">
              Ciudad <span className="text-muted text-sm">(opcional)</span>
            </label>
            <input
              id="vacante-ciudad"
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="input"
              placeholder="Santa Cruz de la Sierra"
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <div className="field">
            <label className="label" htmlFor="vacante-tipo-empleo">
              Tipo de empleo
            </label>
            <select
              id="vacante-tipo-empleo"
              className="select"
              value={tipoEmpleo}
              onChange={(e) => setTipoEmpleo(e.target.value as TipoEmpleo)}
            >
              {TIPOS_EMPLEO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="vacante-modalidad">
              Modalidad
            </label>
            <select
              id="vacante-modalidad"
              className="select"
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value as Modalidad)}
            >
              {MODALIDADES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="vacante-salario">
              Salario <span className="text-muted text-sm">(opcional)</span>
            </label>
            <input
              id="vacante-salario"
              type="text"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              className="input"
              placeholder="Bs 2500 - 3500 o A convenir"
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="vacante-descripcion">
            Descripción
          </label>
          <textarea
            id="vacante-descripcion"
            required
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input"
            placeholder="Responsabilidades, requisitos y beneficios del puesto..."
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={creando} style={{ alignSelf: "flex-start" }}>
          <Plus size={18} aria-hidden="true" />
          {creando ? "Publicando..." : "Publicar vacante"}
        </button>
      </form>

      {loading && <VacantesSkeleton />}

      {!loading && error && (
        <div className="form-alert" role="alert" style={{ maxWidth: 480 }}>
          <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: "0 0 8px" }}>{error}</p>
            <button className="btn btn-secondary btn-sm" onClick={load}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && !error && vacantes && vacantes.length === 0 && (
        <p className="text-muted">Todavía no publicaste ninguna vacante.</p>
      )}

      {!loading && !error && vacantes && vacantes.length > 0 && (
        <div className="grid-cards">
          {vacantes.map((v) =>
            editingId === v.id ? (
              <EditarVacanteForm
                key={v.id}
                vacante={v}
                onCancel={() => setEditingId(null)}
                onGuardada={handleVacanteActualizada}
              />
            ) : (
              <div className="card" key={v.id}>
                <div className="card-title" style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="icon-badge">
                      <Briefcase size={18} aria-hidden="true" />
                    </span>
                    <h3 style={{ margin: 0 }}>{v.titulo}</h3>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingId(v.id)}
                      aria-label={`Editar ${v.titulo}`}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setDeleteError(null);
                        setConfirmandoEliminarId(v.id);
                      }}
                      aria-label={`Eliminar ${v.titulo}`}
                    >
                      <Trash2 size={16} aria-hidden="true" style={{ color: "var(--color-destructive)" }} />
                    </button>
                  </div>
                </div>

                {confirmandoEliminarId === v.id && (
                  <div className="form-alert" role="alertdialog" style={{ marginBottom: 12 }}>
                    <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ margin: "0 0 8px" }}>
                        ¿Eliminar "{v.titulo}"? Esta acción no se puede deshacer
                        {v.total_postulaciones > 0
                          ? ` y se perderán las ${v.total_postulaciones} postulaciones asociadas.`
                          : "."}
                      </p>
                      {deleteError && (
                        <p style={{ margin: "0 0 8px", color: "var(--color-destructive)" }}>{deleteError}</p>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEliminar(v.id)}
                          disabled={eliminandoId === v.id}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          {eliminandoId === v.id ? "Eliminando..." : "Sí, eliminar"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setConfirmandoEliminarId(null)}
                          disabled={eliminandoId === v.id}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0 4px" }}>
                  <Globe2 size={14} aria-hidden="true" /> {v.pais}
                  {v.ciudad && (
                    <>
                      <MapPin size={14} aria-hidden="true" style={{ marginLeft: 8 }} /> {v.ciudad}
                    </>
                  )}
                </p>
                <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px" }}>
                  <Clock size={14} aria-hidden="true" /> {labelTipoEmpleo(v.tipo_empleo)}
                  <Laptop size={14} aria-hidden="true" style={{ marginLeft: 8 }} /> {labelModalidad(v.modalidad)}
                </p>
                {v.salario && (
                  <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px" }}>
                    <DollarSign size={14} aria-hidden="true" /> {v.salario}
                  </p>
                )}
                <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px" }}>
                  <Users size={14} aria-hidden="true" /> {v.total_postulaciones} postulante
                  {v.total_postulaciones === 1 ? "" : "s"}
                </p>
                <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 12px" }}>
                  <CalendarDays size={14} aria-hidden="true" />{" "}
                  {new Date(v.fecha_publicacion).toLocaleDateString("es-BO", { year: "numeric", month: "short", day: "numeric" })}
                </p>
                {v.descripcion && (
                  <p
                    className="text-sm"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 6,
                      margin: "0 0 12px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <FileText size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} /> {v.descripcion}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span className="badge">{v.area}</span>
                  {!v.activa && <span className="badge badge-muted">Inactiva</span>}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 16, alignSelf: "flex-start" }}
                  onClick={() => togglePostulantes(v.id)}
                >
                  {postulantesAbiertoId === v.id ? (
                    <ChevronUp size={16} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={16} aria-hidden="true" />
                  )}
                  Ver postulantes
                </button>

                {postulantesAbiertoId === v.id && (
                  <div style={{ marginTop: 12 }}>
                    {postulantesLoading === v.id && <p className="text-muted text-sm">Cargando postulantes...</p>}
                    {postulantesLoading !== v.id && postulantesError && (
                      <p className="text-muted text-sm" style={{ color: "var(--color-destructive)" }}>
                        {postulantesError}
                      </p>
                    )}
                    {postulantesLoading !== v.id && !postulantesError && postulantes[v.id]?.length === 0 && (
                      <p className="text-muted text-sm">Todavía no hay postulantes para esta vacante.</p>
                    )}
                    {postulantesLoading !== v.id && !postulantesError && postulantes[v.id] && postulantes[v.id].length > 0 && (
                      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {postulantes[v.id].map((p) => (
                          <li
                            key={p.postulacion_id}
                            style={{ borderTop: "1px solid var(--color-border)", paddingTop: 10 }}
                          >
                            <p style={{ margin: 0, fontWeight: 600 }}>{p.nombre}</p>
                            <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "2px 0" }}>
                              <Mail size={13} aria-hidden="true" /> {p.email}
                            </p>
                            <p className="text-muted text-sm" style={{ margin: "2px 0" }}>
                              {[p.sector_interes, p.nivel_experiencia, p.ciudad].filter(Boolean).join(" · ") || "Sin perfil completado"}
                            </p>
                            <p className="text-muted text-sm" style={{ margin: "2px 0" }}>
                              Postuló el{" "}
                              {new Date(p.fecha_postulacion).toLocaleDateString("es-BO", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {p.experiencia.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <p
                                  className="text-sm"
                                  style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px", fontWeight: 600 }}
                                >
                                  <Briefcase size={13} aria-hidden="true" /> Experiencia laboral
                                </p>
                                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                                  {p.experiencia.map((e) => (
                                    <li key={e.id} style={{ paddingLeft: 19 }}>
                                      <p className="text-sm" style={{ margin: 0 }}>
                                        <strong>{e.puesto}</strong> — {e.empresa}
                                      </p>
                                      <p className="text-muted text-sm" style={{ margin: 0 }}>
                                        {formatearFechaExperiencia(e.fecha_inicio)} –{" "}
                                        {e.fecha_fin ? formatearFechaExperiencia(e.fecha_fin) : "actualidad"}
                                        {e.referencia ? ` · Referencia: ${e.referencia}` : ""}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function EditarVacanteForm({
  vacante,
  onCancel,
  onGuardada,
}: {
  vacante: VacanteOut;
  onCancel: () => void;
  onGuardada: (v: VacanteOut) => void;
}) {
  const [titulo, setTitulo] = useState(vacante.titulo);
  const [area, setArea] = useState(vacante.area);
  const [pais, setPais] = useState(vacante.pais);
  const [descripcion, setDescripcion] = useState(vacante.descripcion ?? "");
  const [tipoEmpleo, setTipoEmpleo] = useState<TipoEmpleo>((vacante.tipo_empleo as TipoEmpleo) ?? TIPOS_EMPLEO[0].value);
  const [modalidad, setModalidad] = useState<Modalidad>((vacante.modalidad as Modalidad) ?? MODALIDADES[0].value);
  const [ciudad, setCiudad] = useState(vacante.ciudad ?? "");
  const [salario, setSalario] = useState(vacante.salario ?? "");
  const [activa, setActiva] = useState(vacante.activa);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const actualizada = await api.editarVacante(vacante.id, {
        titulo,
        area,
        pais,
        descripcion,
        tipo_empleo: tipoEmpleo,
        modalidad,
        ciudad: ciudad || undefined,
        salario: salario || undefined,
        activa,
      });
      onGuardada(actualizada);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la vacante");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }} noValidate>
      {error && (
        <div className="form-alert" role="alert">
          <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <div className="field">
        <label className="label" htmlFor={`edit-titulo-${vacante.id}`}>
          Título
        </label>
        <input
          id={`edit-titulo-${vacante.id}`}
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <div className="field">
          <label className="label" htmlFor={`edit-area-${vacante.id}`}>
            Área
          </label>
          <select
            id={`edit-area-${vacante.id}`}
            className="select"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor={`edit-pais-${vacante.id}`}>
            País
          </label>
          <select
            id={`edit-pais-${vacante.id}`}
            className="select"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          >
            {PAISES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor={`edit-ciudad-${vacante.id}`}>
            Ciudad
          </label>
          <input
            id={`edit-ciudad-${vacante.id}`}
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <div className="field">
          <label className="label" htmlFor={`edit-tipo-empleo-${vacante.id}`}>
            Tipo de empleo
          </label>
          <select
            id={`edit-tipo-empleo-${vacante.id}`}
            className="select"
            value={tipoEmpleo}
            onChange={(e) => setTipoEmpleo(e.target.value as TipoEmpleo)}
          >
            {TIPOS_EMPLEO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor={`edit-modalidad-${vacante.id}`}>
            Modalidad
          </label>
          <select
            id={`edit-modalidad-${vacante.id}`}
            className="select"
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value as Modalidad)}
          >
            {MODALIDADES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor={`edit-salario-${vacante.id}`}>
            Salario
          </label>
          <input
            id={`edit-salario-${vacante.id}`}
            type="text"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor={`edit-descripcion-${vacante.id}`}>
          Descripción
        </label>
        <textarea
          id={`edit-descripcion-${vacante.id}`}
          required
          rows={4}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="input"
        />
      </div>

      <label className="text-sm" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
        Vacante activa (visible para postulantes)
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary btn-sm" type="submit" disabled={guardando}>
          <Save size={16} aria-hidden="true" />
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
        <button className="btn btn-ghost btn-sm" type="button" onClick={onCancel} disabled={guardando}>
          <X size={16} aria-hidden="true" />
          Cancelar
        </button>
      </div>
    </form>
  );
}

function formatearFechaExperiencia(iso: string): string {
  const [year, month] = iso.split("-");
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${MESES[Number(month) - 1]} ${year}`;
}

function VacantesSkeleton() {
  return (
    <div className="grid-cards">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="card" key={i}>
          <div className="skeleton" style={{ height: 20, width: "70%", marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 12, width: "50%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: "40%" }} />
        </div>
      ))}
    </div>
  );
}
