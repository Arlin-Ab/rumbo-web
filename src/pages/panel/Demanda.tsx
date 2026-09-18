import { AlertCircle, Info, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { api, ApiError, DemandaMes, PrediccionDemanda } from "../../api/client";
import { AREAS, MESES_ES, PAISES } from "../../constants";

export default function Demanda() {
  const [area, setArea] = useState(AREAS[0]);
  const [pais, setPais] = useState(PAISES[0]);

  const [historico, setHistorico] = useState<DemandaMes[] | null>(null);
  const [prediccion, setPrediccion] = useState<PrediccionDemanda | null>(null);
  const [sinDatosPrediccion, setSinDatosPrediccion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((areaActual: string, paisActual: string) => {
    setLoading(true);
    setError(null);
    setSinDatosPrediccion(false);
    setPrediccion(null);

    Promise.all([
      api.demandaHistorica(areaActual, paisActual),
      api.prediccionDemanda(areaActual, paisActual).catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setSinDatosPrediccion(true);
          return null;
        }
        throw err;
      }),
    ])
      .then(([demanda, pred]) => {
        setHistorico(demanda);
        setPrediccion(pred);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Error al cargar la demanda"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(area, pais);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleVerPrediccion() {
    load(area, pais);
  }

  const historicoPorMes = MESES_ES.map((mes, idx) => {
    const fila = historico?.find((h) => h.mes === idx + 1);
    return { mes, total_postulaciones: fila?.total_postulaciones ?? 0 };
  });

  const prediccionPorMes = prediccion
    ? MESES_ES.map((mes, idx) => {
        const fila = prediccion.prediccion_por_mes.find((p) => p.mes === idx + 1);
        return {
          mes,
          numero: idx + 1,
          postulaciones_esperadas: fila?.postulaciones_esperadas ?? 0,
        };
      })
    : [];

  return (
    <div>
      <h1>Demanda y predicción con IA</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Historial real de postulaciones y una predicción por regresión lineal del mejor mes para publicar
        una vacante, según área y país.
      </p>

      <div className="card" style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
        <div className="field" style={{ minWidth: 200 }}>
          <label className="label" htmlFor="demanda-area">
            Área
          </label>
          <select id="demanda-area" className="select" value={area} onChange={(e) => setArea(e.target.value)}>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ minWidth: 200 }}>
          <label className="label" htmlFor="demanda-pais">
            País
          </label>
          <select id="demanda-pais" className="select" value={pais} onChange={(e) => setPais(e.target.value)}>
            {PAISES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" type="button" onClick={handleVerPrediccion} disabled={loading}>
          {loading ? "Cargando..." : "Ver predicción"}
        </button>
      </div>

      {loading && <DemandaSkeleton />}

      {!loading && error && (
        <div className="form-alert" role="alert" style={{ maxWidth: 480 }}>
          <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: "0 0 8px" }}>{error}</p>
            <button className="btn btn-secondary btn-sm" onClick={handleVerPrediccion}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid-charts">
          <div className="card">
            <h3>Historial de postulaciones</h3>
            <p className="text-muted text-sm">Cantidad real de postulaciones por mes, para {area} en {pais}.</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={historicoPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total_postulaciones" name="Postulaciones" fill="#1e40af" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Predicción por mes</h3>
            <p className="text-muted text-sm">Postulaciones esperadas según regresión lineal sobre el histórico.</p>
            {sinDatosPrediccion ? (
              <div className="form-alert" role="status" style={{ marginTop: 12 }}>
                <Info size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Todavía no hay suficiente historial para predecir esta combinación de área y país.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={prediccionPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" stroke="#64748b" />
                  <YAxis stroke="#64748b" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="postulaciones_esperadas" name="Esperadas" radius={[6, 6, 0, 0]}>
                    {prediccionPorMes.map((entry) => (
                      <Cell
                        key={entry.numero}
                        fill={entry.numero === prediccion?.mes_recomendado ? "#b91c1c" : "#1e40af"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {!loading && !error && prediccion && !sinDatosPrediccion && (
        <div className="card" style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span className="icon-badge" style={{ color: "var(--color-success)" }}>
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 600 }}>Recomendación</p>
            <p className="text-muted" style={{ margin: 0 }}>
              {prediccion.mensaje}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DemandaSkeleton() {
  return (
    <div className="grid-charts">
      {Array.from({ length: 2 }).map((_, i) => (
        <div className="card" key={i}>
          <div className="skeleton" style={{ height: 16, width: "50%", marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 260, width: "100%" }} />
        </div>
      ))}
    </div>
  );
}
