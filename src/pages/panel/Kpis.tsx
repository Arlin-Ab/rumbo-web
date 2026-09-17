import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../../api/client";

interface KpisData {
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

export default function Kpis() {
  const [data, setData] = useState<KpisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .kpis()
      .then((res) => setData(res as KpisData))
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar KPIs"));
  }, []);

  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
  if (!data) return <p>Cargando KPIs...</p>;

  const { resumen } = data;

  return (
    <div>
      <h1>Panel de KPIs institucional</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <MetricCard label="Usuarios activos" value={resumen.usuarios_activos.toString()} />
        <MetricCard label="Retención 30 días" value={`${resumen.retencion_30_dias_pct}%`} />
        <MetricCard label="Tasa de abandono" value={`${resumen.tasa_abandono_pct}%`} />
        <MetricCard label="Días a 1ra entrevista" value={resumen.tiempo_promedio_primera_entrevista_dias.toString()} />
        <MetricCard label="Días a 1er cliente" value={resumen.tiempo_promedio_primer_cliente_dias.toString()} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        <div className="card">
          <h3>Bienestar antes / después</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.bienestar_antes_despues}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="antes" stroke="#94a3b8" />
              <Line type="monotone" dataKey="despues" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Usuarios activos por mes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.usuarios_activos_por_mes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activos" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Usuarios por ruta</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.usuarios_por_ruta}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ruta" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usuarios" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 700 }}>{value}</p>
    </div>
  );
}
