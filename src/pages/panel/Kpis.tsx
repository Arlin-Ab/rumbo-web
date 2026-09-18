import { AlertCircle, CalendarClock, Handshake, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api, ApiError, KpisData } from "../../api/client";

const RUTA_COLORS = ["#1e40af", "#b91c1c", "#2563eb"];

function formatMetric(value: number | null, suffix = ""): string {
  return value === null ? "Sin datos" : `${value}${suffix}`;
}

export default function Kpis() {
  const [data, setData] = useState<KpisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .kpis()
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Error al cargar los KPIs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <KpisSkeleton />;

  if (error) {
    return (
      <div className="form-alert" role="alert" style={{ maxWidth: 480 }}>
        <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: "0 0 8px" }}>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={load}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { resumen } = data;

  return (
    <div>
      <h1>Panel de KPIs institucional</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>
        Datos en tiempo real de la plataforma. Algunas métricas muestran "Sin datos" hasta que haya
        suficiente historial acumulado (ej. retención a 30 días).
      </p>

      <div className="grid-metrics" style={{ marginBottom: 32 }}>
        <MetricCard icon={Users} label="Usuarios activos" value={resumen.usuarios_activos.toString()} />
        <MetricCard
          icon={TrendingUp}
          label="Retención 30 días"
          value={formatMetric(resumen.retencion_30_dias_pct, "%")}
          tone="accent"
        />
        <MetricCard
          icon={TrendingDown}
          label="Tasa de abandono"
          value={formatMetric(resumen.tasa_abandono_pct, "%")}
          tone="destructive"
        />
        <MetricCard
          icon={CalendarClock}
          label="Días a 1ra entrevista"
          value={formatMetric(resumen.tiempo_promedio_primera_entrevista_dias)}
        />
        <MetricCard
          icon={Handshake}
          label="Días a 1ra práctica freelance"
          value={formatMetric(resumen.tiempo_promedio_primera_practica_freelance_dias)}
        />
      </div>

      <div className="grid-charts">
        <div className="card">
          <h3>Bienestar antes / después</h3>
          <p className="text-muted text-sm">Escala auto-reportada de 1 (bajo) a 5 (alto), por mes.</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.bienestar_antes_despues}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis domain={[0, 5]} stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="antes" name="Antes" stroke="#94a3b8" strokeWidth={2} />
              <Line type="monotone" dataKey="despues" name="Después" stroke="#059669" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Usuarios activos por mes</h3>
          <p className="text-muted text-sm">Cantidad de jóvenes activos en la plataforma.</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.usuarios_activos_por_mes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="activos" name="Activos" fill="#1e40af" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Usuarios por ruta</h3>
          <p className="text-muted text-sm">Tradicional, freelance, o ambas.</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.usuarios_por_ruta}
                dataKey="usuarios"
                nameKey="ruta"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.usuarios_por_ruta.map((entry, index) => (
                  <Cell key={entry.ruta} fill={RUTA_COLORS[index % RUTA_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone?: "primary" | "accent" | "destructive";
}) {
  const toneColor =
    tone === "accent" ? "var(--color-success)" : tone === "destructive" ? "var(--color-destructive)" : "var(--color-primary)";

  return (
    <div className="card">
      <span className="icon-badge" style={{ color: toneColor, marginBottom: 12 }}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <p className="text-muted text-sm" style={{ margin: 0 }}>
        {label}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-foreground)" }}>
        {value}
      </p>
    </div>
  );
}

function KpisSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: 32, width: 260, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 16, width: 360, marginBottom: 32 }} />
      <div className="grid-metrics" style={{ marginBottom: 32 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="skeleton" style={{ height: 36, width: 36, borderRadius: 8, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 24, width: "40%" }} />
          </div>
        ))}
      </div>
      <div className="grid-charts">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="skeleton" style={{ height: 16, width: "50%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 260, width: "100%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
