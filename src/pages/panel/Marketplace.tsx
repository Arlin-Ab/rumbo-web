import { Info, Tag, Wallet } from "lucide-react";

const PROYECTOS_MOCK = [
  { titulo: "Diseño de flyer para evento local", presupuesto: "$50 - $80", categoria: "Diseño gráfico" },
  { titulo: "Landing page simple para emprendimiento", presupuesto: "$150 - $250", categoria: "Desarrollo web" },
  { titulo: "Redacción de 5 posts para redes sociales", presupuesto: "$30 - $60", categoria: "Marketing" },
];

export default function Marketplace() {
  return (
    <div>
      <h1>Marketplace de proyectos freelance</h1>
      <div className="form-alert" style={{ marginBottom: 24, maxWidth: 640 }}>
        <Info size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>Vista mock, sin transacciones reales — se presenta como visión de Fase 2/3 del producto.</span>
      </div>

      <div className="grid-cards">
        {PROYECTOS_MOCK.map((p) => (
          <div className="card" key={p.titulo}>
            <h3 style={{ margin: "0 0 12px" }}>{p.titulo}</h3>
            <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 6px" }}>
              <Tag size={14} aria-hidden="true" /> {p.categoria}
            </p>
            <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 16px" }}>
              <Wallet size={14} aria-hidden="true" /> {p.presupuesto}
            </p>
            <button className="btn btn-secondary btn-sm" disabled>
              Postularme (próximamente)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
